"use client";

import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { DETAIL_FIELDS, rememberPlace } from "@/lib/places";
import { LONDON_BOUNDS, LONDON_CENTER } from "@/lib/london";
import { useAppState } from "./AppState";
import { CloseIcon, LogoMark, PinIcon, SearchIcon } from "./icons";

type Suggestion = {
  key: string;
  main: string;
  secondary: string;
  prediction: google.maps.places.PlacePrediction;
};

export function SearchBar() {
  const places = useMapsLibrary("places");
  const { selectPlace, showToast } = useAppState();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  // Google bills autocomplete per "session" (typing → picking one result), so we reuse one token.
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const input = query.trim();
    if (!places || input.length < 2) {
      setSuggestions([]);
      return;
    }
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      sessionToken.current ??= new places.AutocompleteSessionToken();
      try {
        const { suggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionToken.current,
          locationBias: LONDON_BOUNDS,
          origin: LONDON_CENTER,
          includedRegionCodes: ["gb"],
          language: "en-GB",
        });
        if (id !== requestId.current) return; // a newer search has started
        setSuggestions(
          suggestions.flatMap((s) => {
            const p = s.placePrediction;
            if (!p) return [];
            return [
              {
                key: p.placeId,
                main: p.mainText?.text ?? p.text.text,
                secondary: p.secondaryText?.text ?? "",
                prediction: p,
              },
            ];
          }),
        );
      } catch (err) {
        console.warn("Autocomplete failed", err);
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [query, places]);

  const choose = async (s: Suggestion) => {
    inputRef.current?.blur();
    setFocused(false);
    setQuery(s.main);
    setSuggestions([]);
    try {
      // Fetching details from the prediction closes the billing session.
      const place = s.prediction.toPlace();
      await place.fetchFields({ fields: DETAIL_FIELDS });
      rememberPlace(place, DETAIL_FIELDS);
      selectPlace(place.id);
    } catch (err) {
      console.warn("Could not open place", err);
      showToast("Couldn’t load that place – try again");
    } finally {
      sessionToken.current = null;
    }
  };

  const clear = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const showList = focused && suggestions.length > 0;

  return (
    <>
      {showList && (
        <div className="absolute inset-0 z-10 bg-ink/10" onPointerDown={() => inputRef.current?.blur()} />
      )}
      <div className="absolute inset-x-0 top-0 z-20 px-3 pt-safe pl-safe pr-safe">
        <div className="mx-auto mt-3 max-w-xl">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (suggestions[0]) void choose(suggestions[0]);
            }}
            className="flex h-13 items-center gap-2 rounded-full bg-paper pr-2 pl-2 shadow-float"
          >
            <LogoMark className="size-9 shrink-0" />
            <SearchIcon className="ml-1 size-[18px] shrink-0 text-ink-faint" />
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Search cafés, bars, shops…"
              aria-label="Search for a place"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              className="h-full min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={clear}
                aria-label="Clear search"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-soft active:bg-cream"
              >
                <CloseIcon className="size-[18px]" />
              </button>
            )}
          </form>

          {showList && (
            <ul className="mt-2 max-h-[55dvh] overflow-y-auto overscroll-contain rounded-3xl bg-paper py-2 shadow-float">
              {suggestions.map((s) => (
                <li key={s.key}>
                  <button
                    type="button"
                    // onPointerDown fires before the input loses focus, so the tap always lands.
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => void choose(s)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-cream"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blush text-thread">
                      <PinIcon className="size-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{s.main}</span>
                      {s.secondary && <span className="block truncate text-sm text-ink-soft">{s.secondary}</span>}
                    </span>
                  </button>
                </li>
              ))}
              <li className="px-4 pt-2 pb-1 text-right text-[11px] text-ink-faint">Powered by Google</li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
