import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";

// Valeurs fixes des piliers (non traduites) ; le libellé vient des messages.
const PILLARS = [
  { value: "48h", key: "speed" },
  { value: "Sans", key: "commitment" },
  { value: "100%", key: "mobile" },
  { value: "🇫🇷", key: "madeIn" },
] as const;

const TRADE_KEYS = [
  "menage", "plomberie", "electricite", "mecanique", "serrurerie",
  "jardinage", "coiffure", "maconnerie", "peinture", "chauffagiste",
] as const;

export function Trust() {
  const t = useTranslations("trust");
  const trades = TRADE_KEYS.map((k) => t(`trades.${k}`));
  // On duplique la liste pour un défilement continu sans couture.
  const loop = [...trades, ...trades];

  return (
    <section
      aria-label={t("aria")}
      className="relative border-y border-line bg-card/60 py-10"
    >
      <Container>
        {/* Piliers de confiance — filets verticaux, rythme éditorial */}
        <ul className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-line">
          {PILLARS.map((p) => (
            <li key={p.key} className="px-4 text-center sm:px-6">
              <div className="font-display text-3xl font-semibold text-cream sm:text-4xl">
                {p.value}
              </div>
              <div className="mx-auto mt-1.5 max-w-[11rem] text-xs leading-snug text-cream-muted sm:text-sm">
                {t(`pillars.${p.key}`)}
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
              className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm text-cream-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
              {trade}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-7 text-center text-xs text-cream-faint">
        {t("notListed")}
      </p>
    </section>
  );
}
