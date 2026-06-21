import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Ville } from "@/data/types";
import { cn } from "@/lib/utils";

// Carte d'une ville/zone (grille /zones). Server Component, micro-interaction CSS.
export function VilleCard({
  ville,
  href,
  className,
}: {
  ville: Ville;
  /** lien — par défaut /zones/<slug> */
  href?: string;
  className?: string;
}) {
  const target = href ?? `/zones/${ville.slug}`;

  return (
    <Link
      href={target}
      aria-label={`Sites web ${ville.prep} (${ville.dept})`}
      className={cn(
        "group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-line bg-ink-soft px-5 py-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/12 text-ember-deep transition-transform duration-300 group-hover:scale-110">
          <MapPin size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold text-cream">
            {ville.name}
          </h3>
          <p className="truncate text-xs text-cream-faint">
            {ville.dept} · {ville.deptCode}
          </p>
        </div>
      </div>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-cream-muted transition-all duration-300 group-hover:border-ember/40 group-hover:bg-ember/10 group-hover:text-ember-deep">
        <ArrowUpRight size={15} />
      </span>
    </Link>
  );
}
