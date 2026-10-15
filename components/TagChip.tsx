import { tagInfo, type VibeTag } from "@/lib/tags";

export function TagChip({
  tag,
  active,
  onClick,
  size = "md",
  count,
}: {
  tag: VibeTag;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
  count?: number;
}) {
  const info = tagInfo(tag);
  const classes = `inline-flex shrink-0 items-center gap-1.5 rounded-full border font-semibold transition-colors ${
    size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-sm"
  } ${active ? "border-thread bg-thread text-white" : "border-line bg-paper text-ink"}`;

  const content = (
    <>
      <span aria-hidden="true">{info.emoji}</span>
      {info.label}
      {count !== undefined && <span className={active ? "text-white/75" : "text-ink-faint"}>{count}</span>}
    </>
  );

  if (!onClick) return <span className={classes}>{content}</span>;
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={`${classes} active:scale-95`}>
      {content}
    </button>
  );
}
