import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { Realisation } from "@/lib/realisations";
import { cn } from "@/lib/utils";

// Carte d'une réalisation client.
// • Par défaut (sans `href`) : vraie balise <a href> vers le site client live
//   (pas de nofollow) — cliquable ET crawlable par Google.
// • Avec `href` interne (ex. /realisations/<slug>) : la carte renvoie vers la
//   page détail dédiée de la réalisation (qui, elle, porte le lien dofollow
//   sortant vers le site client). Le maillage interne se fait alors via <Link>.
export function RealisationCard({
  item,
  featured,
  href,
}: {
  item: Realisation;
  featured?: boolean;
  /** lien interne optionnel (page détail). Si absent → lien externe vers item.url. */
  href?: string;
}) {
  const meta = [item.trade, item.city].filter(Boolean).join(" · ");
  const cardClass =
    "group relative block overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-soft transition-all duration-500 hover:border-line-strong hover:shadow-card";

  const Inner = (
    <>
      {/* Aperçu — maquette mobile sur fond chaud */}
      <div className="relative h-72 overflow-hidden sm:h-80">
        <div className={cn("absolute inset-0 bg-gradient-to-br", item.accent)} />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(27,22,17,0.06)_1px,transparent_0)] [background-size:22px_22px]" />

        {featured ? (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-ember/30 bg-ink/80 px-3 py-1 text-[11px] font-medium text-ember-deep backdrop-blur">
            En ligne
          </span>
        ) : null}

        {/* Téléphone qui émerge du bas */}
        <div className="absolute inset-x-0 top-8 mx-auto w-[176px] translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
          <div className="rounded-[1.6rem] border border-line-strong bg-cream p-1.5 shadow-float">
            <div className="relative overflow-hidden rounded-[1.25rem] bg-ink">
              {/* Capture mobile auto du site live (microlink, gratuit, sans clé). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.microlink.io/?url=${encodeURIComponent(
                  item.url,
                )}&screenshot=true&embed=screenshot.url&meta=false&viewport.width=414&viewport.height=896`}
                alt={`Aperçu mobile du site de ${item.client}${item.trade ? ` — ${item.trade}` : ""}`}
                loading="lazy"
                className="h-[300px] w-full bg-ink object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Étoiles décoratives, ancrées en bas */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 text-amber opacity-80">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} className="fill-amber" />
          ))}
        </div>
      </div>

      {/* Méta */}
      <div className="flex items-end justify-between gap-4 border-t border-line p-6">
        <div className="min-w-0">
          <h2 className="truncate font-display text-xl font-semibold text-cream">
            {item.client}
          </h2>
          {item.trade ? (
            <p className="mt-1 truncate text-sm text-cream-muted">{item.trade}</p>
          ) : null}
          {item.city ? (
            <p className="mt-0.5 text-xs text-cream-faint">{item.city}</p>
          ) : null}
          <span className="mt-2 inline-block max-w-full truncate text-xs text-cream-faint/70">
            {item.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-cream-muted transition-all duration-300 group-hover:border-ember/40 group-hover:bg-ember/10 group-hover:text-ember-deep">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </>
  );

  // Lien interne (page détail) → <Link>. Sinon lien externe vers le site live.
  if (href) {
    return (
      <Link
        href={href}
        aria-label={`Voir la réalisation : ${item.client}${meta ? ` — ${meta}` : ""}`}
        className={cardClass}
      >
        {Inner}
      </Link>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Voir le site de ${item.client}${meta ? ` — ${meta}` : ""} (nouvel onglet)`}
      className={cardClass}
    >
      {Inner}
    </a>
  );
}
