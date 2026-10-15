export function PageHeader({ title, subtitle }: { title: string; subtitle?: React.ReactNode }) {
  return (
    <header className="px-5 pt-safe">
      <h1 className="pt-6 font-display text-[34px] leading-tight font-semibold">{title}</h1>
      {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
    </header>
  );
}
