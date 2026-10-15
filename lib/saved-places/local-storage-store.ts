import { isVibeTag } from "../tags";
import type { SavePlaceInput, SavedPlace, SavedPlacesStore } from "./types";

const STORAGE_KEY = "rdthrd.savedPlaces.v1";

function read(): SavedPlace[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p): p is SavedPlace => typeof p?.placeId === "string")
      .map((p) => ({
        placeId: p.placeId,
        tags: Array.isArray(p.tags) ? p.tags.filter(isVibeTag) : [],
        note: typeof p.note === "string" ? p.note : "",
        savedAt: p.savedAt ?? new Date().toISOString(),
        updatedAt: p.updatedAt ?? p.savedAt ?? new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

function write(places: SavedPlace[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
}

export const localStorageStore: SavedPlacesStore = {
  async list() {
    return read();
  },

  async save({ placeId, tags, note }: SavePlaceInput) {
    const places = read();
    const now = new Date().toISOString();
    const existing = places.find((p) => p.placeId === placeId);
    const saved: SavedPlace = {
      placeId,
      tags,
      note: note.trim(),
      savedAt: existing?.savedAt ?? now,
      updatedAt: now,
    };
    write(existing ? places.map((p) => (p.placeId === placeId ? saved : p)) : [saved, ...places]);
    return saved;
  },

  async remove(placeId: string) {
    write(read().filter((p) => p.placeId !== placeId));
  },

  subscribe(onChange) {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) onChange();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  },
};
