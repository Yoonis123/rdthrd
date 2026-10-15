// The vibe tags a user can attach to a saved place.
// To add a new tag, add it to this list – everything else picks it up automatically.

export const VIBE_TAGS = [
  { id: "cosy", label: "Cosy", emoji: "🕯️" },
  { id: "date-night", label: "Date night", emoji: "🍷" },
  { id: "cheap-eats", label: "Cheap eats", emoji: "🥙" },
  { id: "laptop-friendly", label: "Laptop-friendly", emoji: "💻" },
  { id: "late-night", label: "Late night", emoji: "🌙" },
  { id: "groups", label: "Groups", emoji: "👯" },
  { id: "hidden-gem", label: "Hidden gem", emoji: "💎" },
  { id: "rooftop", label: "Rooftop", emoji: "🌇" },
] as const;

export type VibeTag = (typeof VIBE_TAGS)[number]["id"];

const TAG_IDS = new Set<string>(VIBE_TAGS.map((t) => t.id));

export function isVibeTag(value: unknown): value is VibeTag {
  return typeof value === "string" && TAG_IDS.has(value);
}

export function tagInfo(id: VibeTag) {
  return VIBE_TAGS.find((t) => t.id === id)!;
}
