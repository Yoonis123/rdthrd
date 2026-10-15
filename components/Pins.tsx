import type { VibeTag } from "@/lib/tags";
import { tagInfo } from "@/lib/tags";

/** Pin for a place the user has saved: a warm red drop with the place's first vibe. */
export function SavedPin({ tag, selected }: { tag?: VibeTag; selected?: boolean }) {
  const size = selected ? 46 : 36;
  return (
    <div
      className="relative flex flex-col items-center drop-shadow-[0_3px_4px_rgba(43,31,26,0.35)] transition-transform"
      style={{ width: size, animation: "pop-in 240ms ease-out" }}
    >
      <svg viewBox="0 0 36 44" width={size} height={(size * 44) / 36} aria-hidden="true">
        <path
          d="M18 42.5c-1.2 0-1.9-.9-2.6-1.8C10.3 34.3 2 27.7 2 18 2 9.2 9.2 2 18 2s16 7.2 16 16c0 9.7-8.3 16.3-13.4 22.7-.7.9-1.4 1.8-2.6 1.8Z"
          fill={selected ? "#B5361F" : "#D9482E"}
          stroke="#FFFDF9"
          strokeWidth="2.5"
        />
      </svg>
      <span
        className="absolute flex items-center justify-center rounded-full bg-paper leading-none"
        style={{
          top: size * 0.14,
          width: size * 0.6,
          height: size * 0.6,
          fontSize: size * 0.34,
        }}
      >
        {tag ? tagInfo(tag).emoji : <HeartGlyph />}
      </span>
    </div>
  );
}

function HeartGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-[62%]" aria-hidden="true">
      <path
        d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20Z"
        fill="#D9482E"
      />
    </svg>
  );
}

/** Pin for a place you're looking at but haven't saved. */
export function PreviewPin() {
  return (
    <div
      className="flex flex-col items-center drop-shadow-[0_3px_4px_rgba(43,31,26,0.35)]"
      style={{ animation: "pop-in 240ms ease-out" }}
    >
      <svg viewBox="0 0 36 44" width={40} height={49} aria-hidden="true">
        <path
          d="M18 42.5c-1.2 0-1.9-.9-2.6-1.8C10.3 34.3 2 27.7 2 18 2 9.2 9.2 2 18 2s16 7.2 16 16c0 9.7-8.3 16.3-13.4 22.7-.7.9-1.4 1.8-2.6 1.8Z"
          fill="#2B1F1A"
          stroke="#FFFDF9"
          strokeWidth="2.5"
        />
        <circle cx="18" cy="18" r="6" fill="#FFFDF9" />
      </svg>
    </div>
  );
}

/** The "you are here" dot. */
export function UserDot() {
  return (
    <div className="relative flex size-6 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full bg-[#3b82c4]"
        style={{ animation: "pulse-ring 2s ease-out infinite" }}
      />
      <span className="relative size-4 rounded-full border-[3px] border-white bg-[#3b82c4] shadow" />
    </div>
  );
}
