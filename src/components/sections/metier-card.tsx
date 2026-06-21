import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metier } from "@/data/types";
import { LucideIcon } from "@/components/ui/lucide-icon";
import { cn } from "@/lib/utils";

// Carte d'un métier (grille /metiers). Server Component : micro-interaction
// 100% CSS (group-hover + transform), aucun JS client. LCP/CLS-safe.
export function MetierCard({
  metier,
  href,
  className,
}: {
  metier: Metier;
  /** lien — par défaut /metiers/<slug> */
  href?: string;
  className?: string;
}) {
  const target = href ?? `/metiers/${metier.slug}`;

  return (
    <Link
      href={target}
      aria-label={`${metier.name} — découvrir`}
      className={cn(
        "card-elev group relative flex h-full flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-soft p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-line-strong sm:p-7",
        className,
      )}
    >
      {/* Lueur d'accent au survol, derrière le contenu */}
      <div
        className="glow-ember pointer-events-none absolute inset-x-0 -top-1/2 h-[140%] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ember/12 text-ember-deep transition-transform duration-300 group-hover:scale-110">
          <LucideIcon name={metier.icon} size={22} />
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-cream-muted transition-all duration-300 group-hover:border-ember/40 group-hover:bg-ember/10 group-hover:text-ember-deep">
          <ArrowUpRight size={16} />
        </span>
      </div>

      <div className="relative">
        <h3 className="font-display text-xl font-semibold tracking-tight text-cream">
          {metier.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-cream-muted">
          {metier.hero}
        </p>
      </div>
    </Link>
  );
}
