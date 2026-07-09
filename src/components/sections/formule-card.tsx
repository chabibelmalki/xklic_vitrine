"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  type Formule,
  BOUTIQUE_MONTHLY_CENTS,
  BOUTIQUE_LABELS,
  euros,
} from "@/lib/content";
import { BOUTIQUE_TIERS, type BoutiqueTier } from "@/lib/lead-schema";
import { cn } from "@/lib/utils";

const selectClass =
  "w-full rounded-xl border border-line bg-ink px-4 py-2.5 text-sm text-cream transition-colors focus:border-line-strong focus:outline-none focus:ring-0";

// Carte formule (client) : select boutique → recalcul LIVE du prix mensuel
// (socle + palier, source content.ts = Stripe), accordéon détails sous le CTA
// (variant "full") ou lien vers /tarifs (variant "home"). Le CTA emmène
// formule + boutique dans le tunnel via ?formule=&boutique=.
export function FormuleCard({
  formule: f,
  variant = "full",
}: {
  formule: Formule;
  variant?: "full" | "home";
}) {
  const [tier, setTier] = useState<"" | BoutiqueTier>("");
  const [open, setOpen] = useState(false);

  const monthlyCents = f.monthlyCents + (tier ? BOUTIQUE_MONTHLY_CENTS[tier] : 0);
  const boutiqueParam = tier || "none";

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col rounded-[var(--radius-card)] border bg-ink-soft p-7 sm:p-8",
        f.featured
          ? "border-ember/30 shadow-float ring-1 ring-ember/15 lg:-translate-y-3"
          : "border-line shadow-card",
      )}
    >
      {f.featured ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-ember-deep via-ember to-amber px-4 py-1 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(229,67,31,0.7)]">
          Recommandé
        </span>
      ) : null}

      {/* Titre — min-h fixe (2 lignes) : « On s'occupe de votre Google » passe sur
          2 lignes, on réserve la même hauteur partout pour ne rien décaler. */}
      <h3 className="font-display min-h-[3.5rem] text-xl font-semibold leading-tight text-cream sm:min-h-[4rem] sm:text-2xl">
        {f.name}
      </h3>

      {/* Phrase — min-h fixe → le prix tombe à la même hauteur sur les 3 cartes */}
      <p className="mt-2 min-h-[3.5rem] text-[0.95rem] italic leading-relaxed text-cream-muted">
        {f.phrase}
      </p>

      {/* Prix : gros mensuel (recalculé live) + /mois petit ; installation en note */}
      <div className="mt-5">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "font-display text-5xl font-semibold leading-none sm:text-6xl",
              f.featured ? "text-ember-deep" : "text-cream",
            )}
          >
            {euros(monthlyCents)}
          </span>
          <span className="text-sm font-medium text-cream-muted">
            /mois · TTC
          </span>
        </div>
        {/* min-h fixe même si la note varie */}
        <p className="mt-2.5 min-h-[1.75rem] text-sm text-cream-faint">
          + {euros(f.setupCents)} à l&apos;installation{" "}
          <span className="text-cream-faint/80">(une seule fois)</span>
        </p>
      </div>

      <div className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-ember/10 px-3 py-1.5 text-xs font-medium text-ember-deep">
        <ShieldCheck size={14} />
        Sans engagement · annulable quand vous voulez
      </div>

      {/* Select boutique — recalcule le prix mensuel ci-dessus en direct */}
      <div className="mt-5">
        <label
          htmlFor={`boutique-${f.slug}`}
          className="mb-1.5 block text-xs font-medium text-cream-muted"
        >
          Ajouter une boutique en ligne ?
        </label>
        <select
          id={`boutique-${f.slug}`}
          value={tier}
          onChange={(e) => setTier(e.target.value as "" | BoutiqueTier)}
          className={selectClass}
        >
          <option value="">Pas de boutique</option>
          {BOUTIQUE_TIERS.map((t) => (
            <option key={t} value={t}>
              {BOUTIQUE_LABELS[t]} — +{euros(BOUTIQUE_MONTHLY_CENTS[t])}/mois
            </option>
          ))}
        </select>
      </div>

      {/* CTA — emmène formule + boutique dans le tunnel. mt-6 : reste aligné avec
          les autres cartes (l'accordéon est SOUS lui, ne le pousse jamais). */}
      <ButtonLink
        href={`/demarrer?formule=${f.slug}&boutique=${boutiqueParam}`}
        size="lg"
        variant={f.featured ? "primary" : "secondary"}
        className="mt-6 w-full"
      >
        {f.cta}
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </ButtonLink>

      {/* Détails : accordéon (tarifs) ou lien (accueil), TOUJOURS sous le CTA →
          l'ouverture allonge la carte par le bas sans toucher les 2 autres. */}
      {variant === "full" ? (
        <div className="mt-5 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex w-full items-center justify-between text-sm font-medium text-cream transition-colors hover:text-ember-soft"
          >
            {open ? "Masquer les détails" : "Voir les détails"}
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-300",
                open && "rotate-180",
              )}
            />
          </button>
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-300 ease-out",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <div className="pt-4">
                {f.inherits ? (
                  <p className="mb-3 text-sm font-semibold text-cream">
                    {f.inherits}
                  </p>
                ) : null}
                <ul className="flex flex-col gap-3">
                  {f.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-relaxed text-cream"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15">
                        <Check size={12} className="text-ember-deep" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {f.priceNote ? (
                  <p className="mt-4 rounded-xl border border-ember/20 bg-ember/[0.06] px-3.5 py-2.5 text-xs font-medium leading-relaxed text-cream">
                    {f.priceNote}
                  </p>
                ) : null}
                {f.featured ? (
                  <div className="mt-5">
                    <p className="mb-2.5 text-xs font-medium text-cream-faint">
                      Ce que vos clients verront en cherchant votre métier :
                    </p>
                    <GoogleMock />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Link
          href="/tarifs"
          className="group mt-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-ember-deep transition-colors hover:text-ember"
        >
          Voir le détail de cette formule
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}

// Mini « capture d'écran » qui imite un résultat Google en haut de page.
// Nom et chiffres 100% FICTIFS — sert juste à montrer à l'artisan ce qu'il aura.
function GoogleMock() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(27,22,17,0.08),0_16px_36px_-22px_rgba(27,22,17,0.35)] ring-1 ring-black/5">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f4ea] px-2.5 py-1 text-xs font-semibold text-[#137333]">
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#34a853] text-white">
          <Check size={9} strokeWidth={3.5} />
        </span>
        Garanti par Google
      </div>
      <div className="mt-2.5 text-[15px] font-semibold text-[#202124]">
        Plomberie Dupont
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="text-[13px] font-medium text-[#202124]">4,9</span>
        <span className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className="text-[#fbbc04]"
              fill="#fbbc04"
              strokeWidth={0}
            />
          ))}
        </span>
        <span className="text-[13px] text-[#5f6368]">(87 avis)</span>
      </div>
      <div className="mt-1 text-[13px] text-[#5f6368]">
        Paris · Ouvert · Disponible maintenant
      </div>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#34a853] px-3.5 py-1.5 text-[13px] font-semibold text-white"
      >
        <Phone size={13} fill="currentColor" strokeWidth={0} />
        Appeler
      </button>
    </div>
  );
}
