import { LogoMark } from "./icons";

/** Friendly screen shown when the Google Maps API key is missing or rejected. */
export function SetupNeeded({ reason }: { reason: "missing" | "rejected" }) {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-cream px-6 pt-safe pb-safe">
      <div className="mx-auto max-w-md py-12">
        <LogoMark className="size-14" />
        <h1 className="mt-6 font-display text-3xl font-semibold">
          {reason === "missing" ? "Almost there…" : "Google said no to our key"}
        </h1>
        {reason === "missing" ? (
          <p className="mt-3 text-ink-soft">
            RdThrd needs a Google Maps API key to show the map. Add one called{" "}
            <code className="rounded bg-blush px-1.5 py-0.5 text-sm text-thread-dark">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>{" "}
            and then redeploy.
          </p>
        ) : (
          <p className="mt-3 text-ink-soft">
            The Google Maps API key was rejected. Usually this means one of these:
          </p>
        )}
        <ul className="mt-5 space-y-3 text-sm text-ink-soft">
          {reason === "rejected" && (
            <>
              <li>• Billing isn’t switched on for your Google Cloud project.</li>
              <li>• “Maps JavaScript API” or “Places API (New)” isn’t enabled.</li>
              <li>• The key’s website restrictions don’t include this web address.</li>
            </>
          )}
          <li>• The README file in the project has step-by-step instructions.</li>
        </ul>
      </div>
    </div>
  );
}
