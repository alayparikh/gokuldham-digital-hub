export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-3xl text-maroon sm:text-4xl">{title}</h2>
      <div
        className={
          align === "center"
            ? "mx-auto mt-4 flex items-center justify-center gap-2"
            : "mt-4 flex items-center gap-2"
        }
      >
        <span className="h-px w-12 bg-gold" />
        <span className="text-primary">✦</span>
        <span className="h-px w-12 bg-gold" />
      </div>
      {subtitle ? <p className="mt-4 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="border-b border-border bg-parchment">
      <div className="mx-auto max-w-7xl px-4 py-14 text-center">
        <h1 className="text-4xl text-maroon sm:text-5xl">{title}</h1>
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <span className="h-px w-14 bg-gold" />
          <span className="text-primary">✦</span>
          <span className="h-px w-14 bg-gold" />
        </div>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
