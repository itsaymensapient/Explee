export function PageIntro({
  summary,
  steps,
}: {
  summary: string;
  steps: string[];
}) {
  return (
    <section className="rounded-lg border border-gold/25 bg-card/50 px-5 py-5">
      <p className="max-w-3xl text-sm leading-relaxed text-foreground/90">
        {summary}
      </p>
      <ol className="mt-4 grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step}
            className="flex gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-3"
          >
            <span className="font-mono text-xs text-gold tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm leading-snug text-muted-foreground">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
