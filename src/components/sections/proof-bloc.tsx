import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { trustPillars } from "@/lib/content";
import { cn } from "@/lib/utils";

export type ProofPoint = {
  /** valeur forte (ex. « 48h », « Sans », « 100% ») */
  value: string;
  /** libellé explicatif */
  label: string;
};

// Bloc de réassurance / preuve sociale. Présentationnel, réutilisable sur les
// pages locales. Par défaut : les piliers de confiance globaux du site.
export function ProofBloc({
  points = trustPillars,
  /** points secondaires affichés sous forme de liste cochée (optionnel) */
  reassurances,
  className,
  containerClassName,
}: {
  points?: ProofPoint[];
  reassurances?: string[];
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      className={cn("relative border-y border-line py-12 sm:py-16", className)}
    >
      <div className="glow-ember pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden />
      <Container className={cn("relative", containerClassName)}>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line lg:grid-cols-4">
          {points.map((p) => (
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
