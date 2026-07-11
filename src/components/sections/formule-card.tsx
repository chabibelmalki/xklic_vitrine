"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
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
  const t = useTranslations("formules");
  const tc = useTranslations("formules.card");
  // Copie propre à la formule, résolue par slug (items.site / items.google / …).
  const name = t(`items.${f.slug}.name`);
  const phrase = t(`items.${f.slug}.phrase`);
  const cta = t(`items.${f.slug}.cta`);
  const features = t.raw(`items.${f.slug}.features`) as string[];
  const inherits = f.inherits ? t(`items.${f.slug}.inherits`) : null;
  const priceNote = f.priceNote ? t(`items.${f.slug}.priceNote`) : null;

  const [tier, setTier] = useState<"" | BoutiqueTier>("");
  const [open, setOpen] = useState(false);

  const monthlyCents = f.monthlyCents + (tier ? BOUTIQUE_MONTHLY_CENTS[tier] : 0);
  const boutiqueParam = tier || "none";

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col rounded-[var(--radius-card)] border bg-card p-7 sm:p-8",
        f.featured
          ? "border-ember/30 shadow-float ring-1 ring-ember/15 lg:-translate-y-3"
          : "border-line shadow-card",
      )}
    >
      {f.featured ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-ember-deep via-ember to-amber px-4 py-1 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(229,67,31,0.7)]">
          {tc("recommended")}
        </span>
      ) : null}

      {/* Titre — min-h fixe (2 lignes) : « On s'occupe de votre Google » passe sur
          2 lignes, on réserve la même hauteur partout pour ne rien décaler. */}
      <h3 className="font-display min-h-[3.5rem] text-xl font-semibold leading-tight text-cream sm:min-h-[4rem] sm:text-2xl">
        {name}
      </h3>

      {/* Phrase — min-h fixe → le prix tombe à la même hauteur sur les 3 cartes */}
      <p className="mt-2 min-h-[3.5rem] text-[0.95rem] italic leading-relaxed text-cream-muted">
        {phrase}
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
            {tc("perMonthSuffix")}
          </span>
        </div>
        {/* min-h fixe même si la note varie */}
        <p className="mt-2.5 min-h-[1.75rem] text-sm text-cream-faint">
          {tc("setupLine", { price: euros(f.setupCents) })}{" "}
          <span className="text-cream-faint/80">{tc("setupOnce")}</span>
        </p>
      </div>

      <div className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-ember/10 px-3 py-1.5 text-xs font-medium text-ember-deep">
        <ShieldCheck size={14} />
        {tc("noEngagement")}
      </div>

      {/* Select boutique — recalcule le prix mensuel ci-dessus en direct */}
      <div className="mt-5">
        <label
          htmlFor={`boutique-${f.slug}`}
          className="mb-1.5 block text-xs font-medium text-cream-muted"
        >
          {tc("addShop")}
        </label>
        <select
          id={`boutique-${f.slug}`}
          value={tier}
          onChange={(e) => setTier(e.target.value as "" | BoutiqueTier)}
          className={selectClass}
        >
          <option value="">{tc("noShop")}</option>
          {BOUTIQUE_TIERS.map((tierKey) => (
            <option key={tierKey} value={tierKey}>
              {tc("shopOption", {
                label: BOUTIQUE_LABELS[tierKey],
                price: euros(BOUTIQUE_MONTHLY_CENTS[tierKey]),
                products: t(`boutiqueProducts.${tierKey}`),
              })}
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
        {cta}
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
            {open ? tc("hideDetails") : tc("showDetails")}
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
                {inherits ? (
                  <p className="mb-3 text-sm font-semibold text-cream">
                    {inherits}
                  </p>
                ) : null}
                <ul className="flex flex-col gap-3">
                  {features.map((feature) => (
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
                {priceNote ? (
                  <p className="mt-4 rounded-xl border border-ember/20 bg-ember/[0.06] px-3.5 py-2.5 text-xs font-medium leading-relaxed text-cream">
                    {priceNote}
                  </p>
                ) : null}
                {f.featured ? (
                  <div className="mt-5">
                    <p className="mb-2.5 text-xs font-medium text-cream-faint">
                      {tc("googleMockIntro")}
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
          {tc("seeFormuleDetail")}
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
  const t = useTranslations("formules.googleMock");
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(27,22,17,0.08),0_16px_36px_-22px_rgba(27,22,17,0.35)] ring-1 ring-black/5">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f4ea] px-2.5 py-1 text-xs font-semibold text-[#137333]">
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#34a853] text-white">
          <Check size={9} strokeWidth={3.5} />
        </span>
        {t("guaranteed")}
      </div>
      <div className="mt-2.5 text-[15px] font-semibold text-[#202124]">
        {t("businessName")}
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
        <span className="text-[13px] text-[#5f6368]">{t("reviews")}</span>
      </div>
      <div className="mt-1 text-[13px] text-[#5f6368]">{t("status")}</div>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#34a853] px-3.5 py-1.5 text-[13px] font-semibold text-white"
      >
        <Phone size={13} fill="currentColor" strokeWidth={0} />
        {t("call")}
      </button>
    </div>
  );
}
