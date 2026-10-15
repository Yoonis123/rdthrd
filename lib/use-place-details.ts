"use client";

import { useEffect, useState } from "react";
import { useApiIsLoaded } from "@vis.gl/react-google-maps";
import { getPlace, type PlaceDetails } from "./places";

type State = { id: string | null; details?: PlaceDetails; error?: boolean };

/** Loads live Google data for a place (from memory if we already have it). */
export function usePlaceDetails(id: string | null | undefined, fields: string[]) {
  const apiLoaded = useApiIsLoaded();
  const [state, setState] = useState<State>({ id: null });
  const fieldKey = fields.join(",");

  useEffect(() => {
    if (!id || !apiLoaded) return;
    let cancelled = false;
    getPlace(id, fieldKey.split(","))
      .then((details) => !cancelled && setState({ id, details }))
      .catch((err) => {
        console.warn("Could not load place", id, err);
        if (!cancelled) setState({ id, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [id, apiLoaded, fieldKey]);

  // Ignore results that belong to a previously selected place.
  const current: State = state.id === id ? state : { id: id ?? null };
  return {
    details: current.details,
    error: Boolean(current.error),
    loading: Boolean(id) && !current.details && !current.error,
  };
}
