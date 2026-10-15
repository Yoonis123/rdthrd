"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { savedPlacesStore } from "./store";
import type { SavePlaceInput, SavedPlace } from "./types";

// A tiny shared cache so every component sees the same list and re-renders together.
type Snapshot = { ready: boolean; places: SavedPlace[] };
let snapshot: Snapshot = { ready: false, places: [] };
const listeners = new Set<() => void>();
let loading: Promise<void> | null = null;

function emit() {
  listeners.forEach((l) => l());
}

async function refresh() {
  const places = await savedPlacesStore.list();
  snapshot = { ready: true, places };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const SERVER_SNAPSHOT: Snapshot = { ready: false, places: [] };

export function useSavedPlaces() {
  const { ready, places } = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => SERVER_SNAPSHOT,
  );

  useEffect(() => {
    if (!snapshot.ready && !loading) loading = refresh().finally(() => (loading = null));
    return savedPlacesStore.subscribe(() => void refresh());
  }, []);

  const savePlace = useCallback(async (input: SavePlaceInput) => {
    const saved = await savedPlacesStore.save(input);
    await refresh();
    return saved;
  }, []);

  const removePlace = useCallback(async (placeId: string) => {
    await savedPlacesStore.remove(placeId);
    await refresh();
  }, []);

  const getSaved = useCallback(
    (placeId: string | null | undefined) => places.find((p) => p.placeId === placeId),
    [places],
  );

  return { ready, places, savePlace, removePlace, getSaved };
}
