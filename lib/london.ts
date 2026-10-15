export const LONDON_CENTER: google.maps.LatLngLiteral = { lat: 51.5072, lng: -0.1276 };

// A rectangle roughly covering Greater London.
export const LONDON_BOUNDS: google.maps.LatLngBoundsLiteral = {
  south: 51.28,
  west: -0.51,
  north: 51.69,
  east: 0.33,
};

export function isInLondon({ lat, lng }: google.maps.LatLngLiteral) {
  return (
    lat >= LONDON_BOUNDS.south &&
    lat <= LONDON_BOUNDS.north &&
    lng >= LONDON_BOUNDS.west &&
    lng <= LONDON_BOUNDS.east
  );
}
