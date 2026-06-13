import { Container } from "@/components/ui/container";
import { trades, trustPillars } from "@/lib/content";

export function Trust() {
  // On duplique la liste pour un défilement continu sans couture.
  const loop = [...trades, ...trades];

  return (
    <section
      aria-label="Secteurs accompagnés et garanties"
      className="relative border-y border-line bg-ink-soft/50 py-10"
    >
      <Container>
        {/* Piliers de confiance */}
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {trustPillars.map((p) => (
            <li key={p.label} className="text-center">
              <div className="font-display text-3xl font-semibold text-cream sm:text-4xl">
                {p.value}
              </div>
              <div className="mt-1 text-xs leading-snug text-cream-muted sm:text-sm">
                {p.label}
              </div>
            </li>
          ))}
        </ul>
      </Container>

      {/* Marquee des secteurs */}
      <div className="relative mt-9 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee flex w-max gap-3">
          {loop.map((trade, i) => (
            <span
              key={`${trade}-${i}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-ink px-4 py-2 text-sm text-cream-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
              {trade}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-7 text-center text-xs text-cream-faint">
        Un métier qui n&apos;est pas dans la liste&nbsp;? On le fait aussi.
      </p>
    </section>
  );
}
