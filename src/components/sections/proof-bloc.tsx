import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export type ProofPoint = {
  /** valeur forte (ex. « 48h », « Sans », « 100% ») */
  value: string;
  /** libellé explicatif */
  label: string;
};

const PILLAR_KEYS = ["speed", "commitment", "mobile", "madeIn"] as const;

// Bloc de réassurance / preuve sociale. Présentationnel, réutilisable sur les
// pages locales. Par défaut : les piliers de confiance globaux du site (traduits).
// `reassuranceKeys` → clés dans le namespace `proof` (liste cochée optionnelle).
export function ProofBloc({
  points,
  reassurances: rawReassurances,
  reassuranceKeys,
  className,
  containerClassName,
}: {
  points?: ProofPoint[];
  /** Chaînes brutes (pages FR-only : métiers, creer-site). */
  reassurances?: string[];
  /** Clés dans le namespace `proof` (pages traduites). */
  reassuranceKeys?: string[];
  className?: string;
  containerClassName?: string;
}) {
  const tt = useTranslations("trust");
  const tp = useTranslations("proof");
  const resolvedPoints: ProofPoint[] =
    points ??
    PILLAR_KEYS.map((k) => ({
      value: tt(`pillarValues.${k}`),
      label: tt(`pillars.${k}`),
    }));
  const reassurances = rawReassurances ?? reassuranceKeys?.map((k) => tp(k));
  return (
    <section
      className={cn("relative border-y border-line py-12 sm:py-16", className)}
    >
      <div className="glow-ember pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden />
      <Container className={cn("relative", containerClassName)}>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line lg:grid-cols-4">
          {resolvedPoints.map((p) => (
            <div
              key={p.label}
              className="flex flex-col items-center gap-1 bg-card px-4 py-7 text-center"
            >
              <dt className="font-display text-3xl font-semibold text-cream sm:text-4xl">
                {p.value}
              </dt>
              <dd className="text-sm leading-snug text-cream-muted">
                {p.label}
              </dd>
            </div>
          ))}
        </dl>

        {reassurances && reassurances.length > 0 ? (
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {reassurances.map((r) => (
              <li
                key={r}
                className="flex items-center gap-2 text-sm text-cream-muted"
              >
                <Check size={15} className="text-ember" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
