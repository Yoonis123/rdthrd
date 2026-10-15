"use client";

import { useState } from "react";
import { useSavedPlaces, type SavedPlace } from "@/lib/saved-places";
import { usePlaceDetails } from "@/lib/use-place-details";
import { LIST_FIELDS } from "@/lib/places";
import { VIBE_TAGS, type VibeTag } from "@/lib/tags";
import { useAppState } from "./AppState";
import { BottomSheet } from "./BottomSheet";
import { TagChip } from "./TagChip";

const NOTE_LIMIT = 280;

/** Sheet for choosing vibe tags and writing a note when saving (or editing) a place. */
export function PlaceEditor() {
  const { editingPlaceId, closeEditor } = useAppState();
  const { getSaved } = useSavedPlaces();

  return (
    <BottomSheet open={Boolean(editingPlaceId)} onClose={closeEditor} backdrop label="Save place" zIndex={50}>
      {editingPlaceId && (
        // `key` resets the form whenever a different place is opened.
        <EditorForm key={editingPlaceId} placeId={editingPlaceId} existing={getSaved(editingPlaceId)} />
      )}
    </BottomSheet>
  );
}

function EditorForm({ placeId, existing }: { placeId: string; existing?: SavedPlace }) {
  const { closeEditor, showToast } = useAppState();
  const { savePlace, removePlace } = useSavedPlaces();
  const { details } = usePlaceDetails(placeId, LIST_FIELDS);
  const [tags, setTags] = useState<VibeTag[]>(existing?.tags ?? []);
  const [note, setNote] = useState(existing?.note ?? "");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = (tag: VibeTag) =>
    setTags((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]));

  const onSave = async () => {
    setBusy(true);
    try {
      await savePlace({ placeId, tags, note });
      showToast(existing ? "Changes saved" : "Saved to your map ♥");
      closeEditor();
    } finally {
      setBusy(false);
    }
  };

  const onRemove = async () => {
    if (!confirmRemove) {
      setConfirmRemove(true);
      return;
    }
    setBusy(true);
    try {
      await removePlace(placeId);
      showToast("Removed from your places");
      closeEditor();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-thread uppercase">
          {existing ? "Edit your place" : "Save to your map"}
        </p>
        <h2 className="mt-1 font-display text-2xl leading-tight font-semibold">{details?.name ?? "…"}</h2>
      </div>

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold">What’s the vibe?</legend>
        <div className="flex flex-wrap gap-2">
          {VIBE_TAGS.map((t) => (
            <TagChip key={t.id} tag={t.id} active={tags.includes(t.id)} onClick={() => toggle(t.id)} />
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-2 flex items-baseline justify-between text-sm font-semibold">
          Note <span className="text-xs font-normal text-ink-faint">optional</span>
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, NOTE_LIMIT))}
          rows={3}
          placeholder="Order the cardamom bun. Window seat is the best seat."
          className="w-full resize-none rounded-2xl border border-line bg-cream px-4 py-3 outline-none placeholder:text-ink-faint focus:border-thread"
        />
        <span className="mt-1 block text-right text-xs text-ink-faint">
          {note.length}/{NOTE_LIMIT}
        </span>
      </label>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onSave}
          disabled={busy}
          className="h-12 w-full rounded-full bg-thread font-semibold text-white shadow-float active:scale-[0.98] disabled:opacity-60"
        >
          {existing ? "Save changes" : "Save place"}
        </button>
        {existing && (
          <button
            type="button"
            onClick={onRemove}
            disabled={busy}
            className={`h-12 w-full rounded-full font-semibold transition-colors ${
              confirmRemove ? "bg-thread-dark text-white" : "text-thread-dark active:bg-blush"
            }`}
          >
            {confirmRemove ? "Tap again to remove" : "Remove from my places"}
          </button>
        )}
      </div>
    </div>
  );
}
