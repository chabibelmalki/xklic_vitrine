import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export type LinkItem = { href: string; label: string };
export type LinkGroup = { title: string; links: LinkItem[] };

// Bloc « maillage interne » : listes de liens connexes (métiers / villes /
// paires). Purement présentationnel — on lui passe des groupes prêts à l'emploi.
export function InternalLinks({
  eyebrow,
  heading,
  groups,
  className,
  containerClassName,
}: {
  eyebrow?: string;
  /** titre de section optionnel */
  heading?: string;
  groups: LinkGroup[];
  className?: string;
  containerClassName?: string;
}) {
  const filled = groups.filter((g) => g.links.length > 0);
  if (filled.length === 0) return null;

  return (
    <section
      className={cn("relative border-t border-line py-16 sm:py-20", className)}
    >
      <Container className={containerClassName}>
        {eyebrow || heading ? (
          <div className="mb-10 flex flex-col gap-3">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {heading ? (
              <h2 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                {heading}
              </h2>
            ) : null}
          </div>
        ) : null}

        <div
          className={cn(
            "grid gap-8 sm:gap-10",
            filled.length > 1 && "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {filled.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-cream-faint">
                {group.title}
              </h3>
              <ul className="flex flex-col">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group flex items-center justify-between gap-3 border-b border-line py-2.5 text-sm text-cream-muted transition-colors hover:text-cream"
                    >
                      <span>{l.label}</span>
                      <ArrowUpRight
                        size={14}
                        className="shrink-0 text-cream-faint opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ember-deep group-hover:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
