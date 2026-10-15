"use client";

import { useSavedPlaces } from "@/lib/saved-places";
import { VIBE_TAGS } from "@/lib/tags";
import { ComingSoon } from "./ComingSoon";
import { ProfileIcon } from "./icons";
import { TagChip } from "./TagChip";

export function ProfilePreview() {
  const { places } = useSavedPlaces();
  const topTags = VIBE_TAGS.map((t) => ({ ...t, n: places.filter((p) => p.tags.includes(t.id)).length }))
    .filter((t) => t.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3);

  return (
    <>
      <ComingSoon
        icon={<ProfileIcon className="size-8" />}
        title="Profile"
        blurb="Your taste, at a glance – and the place to sign in so your map follows you to any device."
        bullets={["Sign in & back up your places", "Your vibe profile", "Privacy & safety settings"]}
      />
      {places.length > 0 && (
        <section className="mx-5 -mt-3 mb-8 rounded-3xl border border-line p-5">
          <h2 className="text-xs font-semibold tracking-wide text-ink-faint uppercase">Your taste so far</h2>
          <p className="mt-2 font-display text-3xl font-semibold">
            {places.length} <span className="text-lg font-normal text-ink-soft">saved</span>
          </p>
          {topTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {topTags.map((t) => (
                <TagChip key={t.id} tag={t.id} size="sm" count={t.n} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
