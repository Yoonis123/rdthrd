import type { VibeTag } from "../tags";

/**
 * A place the user has saved. This is ALL we store – the Google place ID plus our own data.
 * Never add Google data (name, address, coordinates, photos…) here.
 */
export type SavedPlace = {
  placeId: string;
  tags: VibeTag[];
  note: string;
  savedAt: string; // ISO date
  updatedAt: string; // ISO date
};

export type SavePlaceInput = {
  placeId: string;
  tags: VibeTag[];
  note: string;
};

/**
 * The one interface the rest of the app uses for saving and loading.
 * Today it's backed by localStorage; in stage 2 we write a Supabase version with the same shape.
 */
export interface SavedPlacesStore {
  list(): Promise<SavedPlace[]>;
  save(input: SavePlaceInput): Promise<SavedPlace>;
  remove(placeId: string): Promise<void>;
  /** Called whenever the data changes somewhere else (another tab, another device later). */
  subscribe(onChange: () => void): () => void;
}
