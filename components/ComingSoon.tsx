import { PageHeader } from "./PageHeader";
import { SparkleIcon } from "./icons";

export function ComingSoon({
  icon,
  title,
  blurb,
  bullets,
}: {
  icon: React.ReactNode;
  title: string;
  blurb: string;
  bullets: string[];
}) {
  return (
    <div className="pb-8">
      <PageHeader title={title} />
      <div className="mx-5 mt-6 rounded-3xl bg-paper p-6 shadow-[0_1px_0_var(--color-line)]">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-blush text-thread">{icon}</span>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-cream">
          <SparkleIcon className="size-3.5" /> Coming soon
        </p>
        <p className="mt-3 text-ink-soft">{blurb}</p>
        <ul className="mt-5 space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-sm font-medium">
              <span className="size-2 rounded-full bg-thread" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
