// The single place the app gets its saved-places storage from.
// Stage 2: swap `localStorageStore` for a Supabase store that implements the same interface.

import { localStorageStore } from "./local-storage-store";
import type { SavedPlacesStore } from "./types";

export const savedPlacesStore: SavedPlacesStore = localStorageStore;
