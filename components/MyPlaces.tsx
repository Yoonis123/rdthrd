"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSavedPlaces, type SavedPlace } from "@/lib/saved-places";
import { usePlaceDetails } from "@/lib/use-place-details";
import { LIST_FIELDS } from "@/lib/places";
import { VIBE_TAGS, type VibeTag } from "@/lib/tags";
import { useAppState } from "./AppState";
import { PageHeader } from "./PageHeader";
import { TagChip } from "./TagChip";
import { ChevronRightIcon, HeartPinIcon, PencilIcon, TrashIcon } from "./icons";

export function MyPlaces() {
  const { ready, places } = useSavedPlaces();
  const [filter, setFilter] = useState<VibeTag | null>(null);

  const counts = useMemo(() => {
    const c = new Map<VibeTag, number>();
    places.forEach((p) => p.tags.forEach((t) => c.set(t, (c.get(t) ?? 0) + 1)));
    return c;
  }, [places]);

  const usedTags = VIBE_TAGS.filter((t) => counts.has(t.id));
  const activeFilter = filter && counts.has(filter) ? filter : null;
  const visible = (activeFilter ? places.filter((p) => p.tags.includes(activeFilter)) : places)
    .slice()
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));

  return (
    <div className="pb-8">
      <PageHeader
        title="My places"
        subtitle={
          ready && places.length > 0
            ? `${places.length} ${places.length === 1 ? "spot" : "spots"} you love`
            : "Your little black book of London"
        }
      />

      {ready && places.length === 0 && <EmptyState />}

      {usedTags.length > 0 && (
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5 pb-1">
          <button
            type="button"
            onClick={() => setFilter(null)}
            aria-pressed={!activeFilter}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold ${
              !activeFilter ? "border-ink bg-ink text-cream" : "border-line bg-paper"
            }`}
          >
            All <span className={!activeFilter ? "text-cream/70" : "text-ink-faint"}>{places.length}</span>
          </button>
          {usedTags.map((t) => (
            <TagChip
              key={t.id}
              tag={t.id}
              count={counts.get(t.id)}
              active={activeFilter === t.id}
              onClick={() => setFilter(activeFilter === t.id ? null : t.id)}
            />
          ))}
        </div>
      )}

      {visible.length > 0 && (
        <>
          <ul className="mt-4 space-y-3 px-5">
            {visible.map((p) => (
              <PlaceCard key={p.placeId} saved={p} />
            ))}
          </ul>
          <p className="mt-6 text-center text-[11px] text-ink-faint">Place info from Google Maps</p>
        </>
      )}
    </div>
  );
}

function PlaceCard({ saved }: { saved: SavedPlace }) {
  const router = useRouter();
  const { selectPlace, openEditor, showToast } = useAppState();
  const { removePlace } = useSavedPlaces();
  const { details, error } = usePlaceDetails(saved.placeId, LIST_FIELDS);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const name = details?.name ?? (error ? "Place unavailable" : undefined);
  const showOnMap = () => {
    selectPlace(saved.placeId);
    router.push("/");
  };

  const onRemove = async () => {
    if (!confirmRemove) {
      setConfirmRemove(true);
      setTimeout(() => setConfirmRemove(false), 3000);
      return;
    }
    await removePlace(saved.placeId);
    showToast("Removed from your places");
  };

  return (
    <li className="overflow-hidden rounded-3xl border border-line bg-paper">
      <button type="button" onClick={showOnMap} className="flex w-full items-center gap-3.5 p-4 text-left active:bg-cream">
        <Avatar name={name} />
        <span className="min-w-0 flex-1">
          {name ? (
            <span className="block truncate font-display text-lg leading-snug font-semibold">{name}</span>
          ) : (
            <span className="block h-5 w-2/3 animate-pulse rounded-full bg-line" />
          )}
          <span className="mt-0.5 block truncate text-sm text-ink-soft">
            {[details?.type, shortAddress(details?.address)].filter(Boolean).join(" · ") || " "}
          </span>
        </span>
        <ChevronRightIcon className="size-5 shrink-0 text-ink-faint" />
      </button>

      {(saved.tags.length > 0 || saved.note) && (
        <div className="space-y-2 px-4 pb-1">
          {saved.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {saved.tags.map((t) => (
                <TagChip key={t} tag={t} size="sm" />
              ))}
            </div>
          )}
          {saved.note && <p className="text-sm text-ink-soft italic">“{saved.note}”</p>}
        </div>
      )}

      <div className="flex items-center justify-between px-4 pt-2 pb-3">
        <span className="text-xs text-ink-faint">Saved {formatDate(saved.savedAt)}</span>
        <span className="flex gap-1">
          <button
            type="button"
            onClick={() => openEditor(saved.placeId)}
            className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink-soft active:bg-cream"
          >
            <PencilIcon className="size-4" /> Edit
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={confirmRemove ? "Confirm remove" : "Remove"}
            className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors ${
              confirmRemove ? "bg-thread-dark text-white" : "text-ink-soft active:bg-cream"
            }`}
          >
            <TrashIcon className="size-4" />
            {confirmRemove ? "Remove?" : ""}
          </button>
        </span>
      </div>
    </li>
  );
}

const AVATAR_COLOURS = ["#F6D3C5", "#F3E1B8", "#D6E6D3", "#D8DDF0", "#EBD4E6", "#F0D9C8"];

function Avatar({ name }: { name?: string }) {
  const initial = name?.trim()[0]?.toUpperCase() ?? "";
  const hash = [...(name ?? "")].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const colour = AVATAR_COLOURS[hash % AVATAR_COLOURS.length];
  return (
    <span
      className="flex size-12 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-semibold text-ink"
      style={{ background: colour }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="mx-5 mt-8 rounded-3xl border border-dashed border-line bg-paper px-6 py-10 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-blush text-thread">
        <HeartPinIcon className="size-8" />
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold">Nothing saved yet</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Find a café, bar or shop you love on the map and tap <strong>Save</strong>. It’ll show up here.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex h-11 items-center rounded-full bg-thread px-5 font-semibold text-white shadow-float"
      >
        Explore the map
      </Link>
    </div>
  );
}

function shortAddress(address?: string) {
  // "12 Foo St, London E1 6AA, UK" → "12 Foo St"
  return address?.split(",")[0];
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: sameYear ? undefined : "numeric" });
}
