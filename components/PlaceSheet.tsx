"use client";

import { useState } from "react";
import { useSavedPlaces } from "@/lib/saved-places";
import { usePlaceDetails } from "@/lib/use-place-details";
import { DETAIL_FIELDS, googleMapsLink, priceLabel, type PlaceDetails } from "@/lib/places";
import { todayIndex } from "@/lib/hours";
import { useAppState } from "./AppState";
import { BottomSheet } from "./BottomSheet";
import { TagChip } from "./TagChip";
import { BookmarkIcon, CheckIcon, ChevronDownIcon, ClockIcon, DirectionsIcon, PencilIcon, PinIcon, StarIcon } from "./icons";

/** The sheet that slides up when you tap a place on the map or in search. */
export function PlaceSheet({ visible }: { visible: boolean }) {
  const { selectedPlaceId, selectPlace } = useAppState();
  const { details, error } = usePlaceDetails(selectedPlaceId, DETAIL_FIELDS);

  return (
    <BottomSheet
      open={visible && Boolean(selectedPlaceId)}
      onClose={() => selectPlace(null)}
      label={details?.name ?? "Place details"}
      aboveTabBar
    >
      {error ? (
        <p className="py-10 text-center text-ink-soft">Sorry, we couldn’t load this place.</p>
      ) : details ? (
        <PlaceContent details={details} />
      ) : (
        <PlaceSkeleton />
      )}
    </BottomSheet>
  );
}

function PlaceContent({ details }: { details: PlaceDetails }) {
  const { openEditor } = useAppState();
  const { getSaved } = useSavedPlaces();
  const saved = getSaved(details.id);
  const price = priceLabel(details.priceLevel);
  const [hoursOpen, setHoursOpen] = useState(false);

  return (
    <div className="space-y-4">
      {details.photoUrl && (
        <figure className="relative -mx-1 overflow-hidden rounded-3xl bg-line">
          <img src={details.photoUrl} alt="" className="aspect-[2/1] w-full object-cover" />
          {details.photoCredit && (
            <figcaption className="absolute right-2 bottom-2 max-w-[70%] truncate rounded-full bg-ink/55 px-2.5 py-1 text-[10px] text-white backdrop-blur">
              Photo:{" "}
              {details.photoCredit.url ? (
                <a href={details.photoCredit.url} target="_blank" rel="noreferrer" className="underline">
                  {details.photoCredit.name}
                </a>
              ) : (
                details.photoCredit.name
              )}
            </figcaption>
          )}
        </figure>
      )}

      <div>
        <h2 className="font-display text-[26px] leading-tight font-semibold">{details.name}</h2>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft">
          {details.type && <span>{details.type}</span>}
          {details.type && price && <span aria-hidden="true">·</span>}
          {price && <span className="font-semibold text-ink">{price}</span>}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {details.rating !== undefined && (
          <span className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1.5 text-sm font-semibold">
            <StarIcon className="size-4 text-honey" />
            {details.rating.toFixed(1)}
            {details.ratingCount !== undefined && (
              <span className="font-normal text-ink-soft">({details.ratingCount.toLocaleString("en-GB")})</span>
            )}
          </span>
        )}
        {details.openNow !== undefined && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
              details.openNow ? "bg-sage-soft text-sage" : "bg-blush text-thread-dark"
            }`}
          >
            <span className={`size-2 rounded-full ${details.openNow ? "bg-sage" : "bg-thread"}`} />
            {details.openNow ? "Open now" : "Closed now"}
          </span>
        )}
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => openEditor(details.id)}
          className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-semibold active:scale-[0.98] ${
            saved ? "border border-thread bg-blush text-thread-dark" : "bg-thread text-white shadow-float"
          }`}
        >
          {saved ? (
            <>
              <CheckIcon className="size-5" /> Saved · Edit
            </>
          ) : (
            <>
              <BookmarkIcon className="size-5" /> Save
            </>
          )}
        </button>
        <a
          href={googleMapsLink(details.id, details.name)}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-paper px-5 font-semibold active:bg-cream"
        >
          <DirectionsIcon className="size-5" /> Go
        </a>
      </div>

      {saved && (saved.tags.length > 0 || saved.note) && (
        <button
          type="button"
          onClick={() => openEditor(details.id)}
          className="block w-full rounded-2xl bg-cream p-3.5 text-left"
        >
          <span className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wide text-ink-faint uppercase">
            Your take <PencilIcon className="size-3.5" />
          </span>
          {saved.tags.length > 0 && (
            <span className="flex flex-wrap gap-1.5">
              {saved.tags.map((t) => (
                <TagChip key={t} tag={t} size="sm" />
              ))}
            </span>
          )}
          {saved.note && <span className="mt-2 block text-sm text-ink-soft italic">“{saved.note}”</span>}
        </button>
      )}

      <ul className="divide-y divide-line rounded-2xl border border-line">
        {details.address && (
          <li className="flex gap-3 p-3.5 text-sm">
            <PinIcon className="mt-0.5 size-[18px] shrink-0 text-ink-faint" />
            <span>{details.address}</span>
          </li>
        )}
        {details.weekdayHours && details.weekdayHours.length > 0 && (
          <li className="text-sm">
            <button
              type="button"
              onClick={() => setHoursOpen((o) => !o)}
              aria-expanded={hoursOpen}
              className="flex w-full items-center gap-3 p-3.5 text-left"
            >
              <ClockIcon className="size-[18px] shrink-0 text-ink-faint" />
              <span className="flex-1">{details.weekdayHours[todayIndex()]}</span>
              <ChevronDownIcon className={`size-4 text-ink-faint transition-transform ${hoursOpen ? "rotate-180" : ""}`} />
            </button>
            {hoursOpen && (
              <ul className="space-y-1 px-3.5 pb-3.5 pl-[46px] text-ink-soft">
                {details.weekdayHours.map((line, i) => (
                  <li key={line} className={i === todayIndex() ? "font-semibold text-ink" : ""}>
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}

function PlaceSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Loading">
      <div className="aspect-[2/1] rounded-3xl bg-line/70" />
      <div className="h-7 w-2/3 rounded-full bg-line/70" />
      <div className="h-4 w-1/3 rounded-full bg-line/70" />
      <div className="h-12 rounded-full bg-line/70" />
    </div>
  );
}
