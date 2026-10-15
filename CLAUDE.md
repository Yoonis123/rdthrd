# RdThrd – notes for Claude

RdThrd is a social map for discovering places in London. People save places they love (cafés, bars,
restaurants, shops) as pins on a personal map, tag them with vibes, follow friends and get personalised
recommendations. A later version adds opt-in dating matches based on shared taste in places.

**The owner has zero coding experience.** Write all the code yourself, and explain anything they need
to do (accounts, settings, clicking buttons) in plain English, step by step. No jargon without a
one-line explanation.

## Tech (stick to this)

- Next.js (App Router) + TypeScript + Tailwind CSS v4 (theme tokens live in `app/globals.css`).
- Mobile-first iPhone web app, installed to the home screen as a PWA: `app/manifest.ts`,
  icons in `public/icons/` (regenerate PNGs with `node scripts/generate-icons.mjs`),
  `display: standalone`, `viewport-fit=cover`, and safe-area padding via the `pt-safe` / `pb-safe` /
  `pl-safe` / `pr-safe` utilities. Inputs must be ≥16px so iOS doesn't zoom. No service worker yet
  (deliberately – avoids stale-cache bugs; iOS doesn't need one to install).
- Google Maps JavaScript API via `@vis.gl/react-google-maps`; Places API (New) through the JS
  `google.maps.places.Place` / `AutocompleteSuggestion` classes.
- Env vars: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (required), `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`
  (optional, falls back to `DEMO_MAP_ID`; Advanced Markers need a map ID). `NEXT_PUBLIC_` vars are
  baked in at build time, so changing them on Vercel needs a redeploy.

## Google rules (important)

- **Only the Google place ID may be stored permanently.** Saved records contain the place ID plus
  our own data (tags, note, dates) – never names, addresses, coordinates, photos, ratings or hours.
  Those are fetched live and cached in memory only (`lib/places.ts`).
- **Only request fields we display.** Field lists are in `lib/places.ts`: `DETAIL_FIELDS` (sheet),
  `LIST_FIELDS` (My places rows – no photos, to save cost), `PIN_FIELDS` (`location` only).
  Add a field only when the UI shows it.
- Autocomplete uses session tokens; a session ends with `prediction.toPlace().fetchFields()`.
- Show photo author attributions and "Powered by Google" / "Place info from Google Maps" where
  Google data appears off the map.
- The map is mounted once in `AppShell` and hidden on other tabs, because each map load is billed.

## Code map

- `app/(tabs)/layout.tsx` → `components/AppShell.tsx`: API provider, persistent map, tab bar, sheets.
- `components/MapView.tsx` (map, saved pins, user location), `SearchBar.tsx`, `PlaceSheet.tsx`
  (details), `PlaceEditor.tsx` (tags + note), `MyPlaces.tsx`, `BottomSheet.tsx`, `Pins.tsx`.
- `components/AppState.tsx`: selected place, editor, toast.
- `lib/saved-places/`: **the only storage module.** `types.ts` defines `SavedPlacesStore`
  (async `list/save/remove/subscribe`); `local-storage-store.ts` is today's backend; `store.ts`
  picks the backend; `use-saved-places.ts` is the React hook everything uses. To move to Supabase,
  write `supabase-store.ts` implementing the same interface and switch it in `store.ts`.
- `lib/tags.ts`: vibe tags (cosy, date night, cheap eats, laptop-friendly, late night, groups,
  hidden gem, rooftop).

## Design

Original warm, modern look – do not copy any other app's branding. Cream background (`cream`),
ink text (`ink`), "red thread" terracotta accent (`thread`), Fraunces for headings, Plus Jakarta
Sans for text, soft rounded cards and pill buttons. Saved pins are terracotta drops showing the
first vibe emoji; unsaved selected places use a dark ink pin.

## Stages

1. **Map & saving** (done): London map, user location, search with autocomplete, place sheet,
   save with vibe tags + note, custom saved pins, My places list with tag filter/edit/remove,
   tab bar with Friends/Profile placeholders. Data in localStorage.
2. **Accounts & friends (Supabase)**: sign-in, move saved places into Supabase via a new
   `SavedPlacesStore`, import existing localStorage places on first sign-in, follow friends,
   see friends' pins, row-level security on every table.
3. **Recommendations**: suggestions from your tags, friends' saves and similar users' taste.
4. **Dating mode** (opt-in only) with strong safety features: separate explicit opt-in, age
   verification, never show exact locations or live whereabouts, block/report everywhere,
   mutual-match-only messaging, easy pause/delete, moderation tooling.
5. **App Store release** by wrapping the web app with Capacitor.

## Working conventions

- Check `npm run build` (and `npm run typecheck`) passes before committing.
- Keep components small and readable; match the existing style and comment density.
