import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = {
  /** lien — omis pour le dernier élément (page courante) */
  href?: string;
  label: string;
};

// Fil d'Ariane visuel et accessible. Le JSON-LD BreadcrumbList est géré
// ailleurs (lib/seo.ts) — ici on ne fait QUE l'UI.
export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Fil d'Ariane" className={cn("w-full", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-cream-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="rounded transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-medium text-cream"
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <ChevronRight
                  size={14}
                  className="text-cream-faint"
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
