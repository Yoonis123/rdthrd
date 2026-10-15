"use client";

import { useEffect, useRef } from "react";
import { AdvancedMarker, Map, useMap, type MapMouseEvent } from "@vis.gl/react-google-maps";
import { useSavedPlaces, type SavedPlace } from "@/lib/saved-places";
import { usePlaceDetails } from "@/lib/use-place-details";
import { useUserLocation } from "@/lib/use-user-location";
import { DETAIL_FIELDS, PIN_FIELDS } from "@/lib/places";
import { LONDON_CENTER, isInLondon } from "@/lib/london";
import { useAppState } from "./AppState";
import { SearchBar } from "./SearchBar";
import { PreviewPin, SavedPin, UserDot } from "./Pins";
import { LocateIcon } from "./icons";

const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

export function MapView() {
  const map = useMap();
  const { selectedPlaceId, selectPlace, showToast } = useAppState();
  const { places, getSaved } = useSavedPlaces();
  const { position, status, retry } = useUserLocation();
  const { details: selected } = usePlaceDetails(selectedPlaceId, DETAIL_FIELDS);

  // When a place is selected, glide the map to it (nudged up so the sheet doesn't cover it).
  useEffect(() => {
    if (!map || !selected?.location) return;
    const zoom = Math.max(map.getZoom() ?? 0, 15);
    if (zoom !== map.getZoom()) map.setZoom(zoom);
    map.panTo(offsetCenter(map, selected.location, zoom, window.innerHeight * 0.18));
  }, [map, selected?.id, selected?.location]);

  // The first time we learn where the user is, centre on them if they're in London.
  const centredOnUser = useRef(false);
  useEffect(() => {
    if (!map || !position || centredOnUser.current) return;
    centredOnUser.current = true;
    if (isInLondon(position)) map.panTo(position);
  }, [map, position]);

  const onMapClick = (e: MapMouseEvent) => {
    if (e.detail.placeId) {
      e.stop(); // stop Google's own little info pop-up
      selectPlace(e.detail.placeId);
    } else {
      selectPlace(null);
    }
  };

  const onLocate = () => {
    if (position && map) {
      map.panTo(position);
      if ((map.getZoom() ?? 0) < 15) map.setZoom(15);
      return;
    }
    if (status === "denied") {
      showToast("Location is off for this app – turn it on in iPhone Settings");
      return;
    }
    retry();
    showToast("Finding you…");
  };

  const selectedIsSaved = Boolean(getSaved(selectedPlaceId));

  return (
    <div className="absolute inset-0">
      <Map
        mapId={MAP_ID}
        defaultCenter={LONDON_CENTER}
        defaultZoom={13}
        minZoom={9}
        disableDefaultUI
        clickableIcons
        gestureHandling="greedy"
        colorScheme="LIGHT"
        reuseMaps
        onClick={onMapClick}
        className="h-full w-full"
      >
        {places.map((p) => (
          <SavedPlaceMarker
            key={p.placeId}
            saved={p}
            selected={p.placeId === selectedPlaceId}
            onSelect={() => selectPlace(p.placeId)}
          />
        ))}

        {selected?.location && !selectedIsSaved && (
          <AdvancedMarker position={selected.location} zIndex={1000}>
            <PreviewPin />
          </AdvancedMarker>
        )}

        {position && (
          <AdvancedMarker position={position} zIndex={500} anchorLeft="-50%" anchorTop="-50%">
            <UserDot />
          </AdvancedMarker>
        )}
      </Map>

      <SearchBar />

      <button
        type="button"
        onClick={onLocate}
        aria-label="Show my location"
        className="absolute right-4 bottom-5 flex size-12 items-center justify-center rounded-full bg-paper text-ink shadow-float active:scale-95"
      >
        <LocateIcon className={`size-5 ${status === "on" ? "text-[#3b82c4]" : ""}`} />
      </button>
    </div>
  );
}

function SavedPlaceMarker({
  saved,
  selected,
  onSelect,
}: {
  saved: SavedPlace;
  selected: boolean;
  onSelect: () => void;
}) {
  // Google's terms mean we can't store coordinates, so we look them up live (cheapest field tier).
  const { details } = usePlaceDetails(saved.placeId, PIN_FIELDS);
  if (!details?.location) return null;
  return (
    <AdvancedMarker
      position={details.location}
      zIndex={selected ? 999 : 100}
      onClick={onSelect}
      title={details.name}
    >
      <SavedPin tag={saved.tags[0]} selected={selected} />
    </AdvancedMarker>
  );
}

/** A map centre that puts `target` `offsetPx` pixels above the middle of the screen. */
function offsetCenter(
  map: google.maps.Map,
  target: google.maps.LatLngLiteral,
  zoom: number,
  offsetPx: number,
): google.maps.LatLngLiteral {
  const projection = map.getProjection();
  if (!projection) return target;
  const point = projection.fromLatLngToPoint(target);
  if (!point) return target;
  const shifted = new google.maps.Point(point.x, point.y + offsetPx / 2 ** zoom);
  return projection.fromPointToLatLng(shifted)?.toJSON() ?? target;
}
