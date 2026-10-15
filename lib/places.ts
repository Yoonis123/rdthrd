// Everything that talks to the Google Places API (New) lives here.
//
// RULES (from Google's terms – see CLAUDE.md):
// - We never store Google data (names, photos, hours, coordinates…) in localStorage or a database.
//   Only the place ID is stored permanently. Everything else is fetched live and kept in memory
//   for the current visit only.
// - We only request the fields we actually show, because Google bills by field tier.

import { isOpenNow } from "./hours";

/** Fields for the place detail sheet. */
export const DETAIL_FIELDS = [
  "id",
  "displayName",
  "primaryTypeDisplayName",
  "photos",
  "rating",
  "userRatingCount",
  "priceLevel",
  "regularOpeningHours",
  "utcOffsetMinutes",
  "formattedAddress",
  "location",
];

/** Fields for a row in the "My places" list (no photos, to keep costs low). */
export const LIST_FIELDS = ["id", "displayName", "primaryTypeDisplayName", "formattedAddress", "location"];

/** Fields for drawing a saved pin on the map (cheapest tier). */
export const PIN_FIELDS = ["id", "location"];

export type PlaceDetails = {
  id: string;
  name?: string;
  type?: string;
  photoUrl?: string;
  photoCredit?: { name: string; url?: string };
  rating?: number;
  ratingCount?: number;
  priceLevel?: string;
  openNow?: boolean;
  weekdayHours?: string[];
  address?: string;
  location?: google.maps.LatLngLiteral;
};

// ---- In-memory cache (cleared whenever the app is closed) ----

const placeObjects = new Map<string, google.maps.places.Place>();
const loadedFields = new Map<string, Set<string>>();
const inFlight = new Map<string, Promise<void>>();

async function placesLibrary() {
  return (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
}

/** Put a Place object we already fetched (e.g. from search) into the cache. */
export function rememberPlace(place: google.maps.places.Place, fields: string[]) {
  placeObjects.set(place.id, place);
  const have = loadedFields.get(place.id) ?? new Set<string>();
  fields.forEach((f) => have.add(f));
  loadedFields.set(place.id, have);
}

/** Fetch (or reuse from memory) the given fields for a place. */
export async function getPlace(id: string, fields: string[]): Promise<PlaceDetails> {
  const { Place } = await placesLibrary();
  let place = placeObjects.get(id);
  if (!place) {
    place = new Place({ id });
    placeObjects.set(id, place);
  }

  // Wait for any request already running for this place, then fetch only what is still missing.
  const running = inFlight.get(id);
  if (running) await running.catch(() => undefined);

  const have = loadedFields.get(id) ?? new Set<string>();
  const missing = fields.filter((f) => !have.has(f));
  if (missing.length > 0) {
    const request = place.fetchFields({ fields: missing }).then(() => {
      missing.forEach((f) => have.add(f));
      loadedFields.set(id, have);
    });
    inFlight.set(id, request);
    try {
      await request;
    } finally {
      inFlight.delete(id);
    }
  }
  return toDetails(place);
}

function toDetails(place: google.maps.places.Place): PlaceDetails {
  const photo = place.photos?.[0];
  const credit = photo?.authorAttributions?.[0];
  return {
    id: place.id,
    name: place.displayName ?? undefined,
    type: place.primaryTypeDisplayName ?? undefined,
    photoUrl: photo ? photo.getURI({ maxWidth: 800, maxHeight: 600 }) : undefined,
    photoCredit: credit ? { name: credit.displayName, url: credit.uri ?? undefined } : undefined,
    rating: place.rating ?? undefined,
    ratingCount: place.userRatingCount ?? undefined,
    priceLevel: place.priceLevel ?? undefined,
    openNow: isOpenNow(place.regularOpeningHours, place.utcOffsetMinutes),
    weekdayHours: place.regularOpeningHours?.weekdayDescriptions,
    address: place.formattedAddress ?? undefined,
    location: place.location?.toJSON(),
  };
}

export function priceLabel(level?: string) {
  switch (level) {
    case "FREE":
      return "Free";
    case "INEXPENSIVE":
      return "£";
    case "MODERATE":
      return "££";
    case "EXPENSIVE":
      return "£££";
    case "VERY_EXPENSIVE":
      return "££££";
    default:
      return undefined;
  }
}

/** A link that opens the place in Google Maps (for directions). */
export function googleMapsLink(id: string, name?: string) {
  const params = new URLSearchParams({ api: "1", query: name ?? "place", query_place_id: id });
  return `https://www.google.com/maps/search/?${params}`;
}
