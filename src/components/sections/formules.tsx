import { Check, Star, Phone, ShieldCheck, ArrowRight, Plus } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { formules, type Formule } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Formules({ headingAs = "h2" }: { headingAs?: "h1" | "h2" } = {}) {
  return (
    <Section id="tarif" className="relative border-t border-line">
      {/* Lueur chaude derrière la grille */}
      <div
        className="glow-ember pointer-events-none absolute inset-x-0 top-0 h-80"
        aria-hidden
      />

      <Reveal>
        <SectionHeading
          as={headingAs}
          align="center"
          eyebrow="Nos formules"
          title="Trois formules, simples et claires."
          description="Vous commencez où vous voulez, vous changez quand vous voulez. Pas de surprise, et toujours sans engagement."
        />
      </Reveal>

      <RevealGroup className="mt-14 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-7">
        {formules.map((f) => (
          <RevealItem key={f.name} className="flex">
            <FormuleCard formule={f} />
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal>
        <p className="mt-8 text-center text-xs text-cream-faint">
          Tous nos prix sont indiqués en euros, TTC.
        </p>
      </Reveal>
    </Section>
  );
}

function FormuleCard({ formule: f }: { formule: Formule }) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col rounded-[var(--radius-card)] border bg-ink-soft p-7 sm:p-8",
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

      {/* Nom + phrase */}
      <h3 className="font-display text-xl font-semibold text-cream sm:text-2xl">
        {f.name}
      </h3>
      <p className="mt-2 text-[0.95rem] italic leading-relaxed text-cream-muted">
        {f.phrase}
      </p>

      {/* Prix — très gros et lisibles, installation vs par mois bien distincts */}
      <div className="mt-6">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <span
            className={cn(
              "font-display text-5xl font-semibold leading-none sm:text-6xl",
              f.featured ? "text-ember-deep" : "text-cream",
            )}
          >
            {f.setup}
          </span>
          <span className="text-sm font-medium leading-tight text-cream-muted">
            TTC à l&apos;installation
            <br />
            <span className="text-cream-faint">(une seule fois)</span>
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm text-cream-muted">puis</span>
          <span className="font-display text-3xl font-semibold leading-none text-cream">
            {f.monthly}
          </span>
          <span className="text-sm font-medium text-cream-muted">TTC par mois</span>
        </div>
        {f.priceNote ? (
          <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-ember/20 bg-ember/[0.06] px-3.5 py-2.5">
            <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ember/15">
              <Plus size={11} className="text-ember-deep" strokeWidth={3} />
            </span>
            <p className="text-xs font-medium leading-relaxed text-cream">
              {f.priceNote}
            </p>
          </div>
        ) : null}
      </div>

      {/* Badge rassurant, sur les 3 cartes */}
      <div className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-ember/10 px-3 py-1.5 text-xs font-medium text-ember-deep">
        <ShieldCheck size={14} />
        Sans engagement · annulable quand vous voulez
      </div>

      {/* Aperçu Google (carte mise en avant uniquement) */}
      {f.featured ? (
        <div className="mt-6">
          <p className="mb-2.5 text-xs font-medium text-cream-faint">
            Ce que vos clients verront en cherchant votre métier :
          </p>
          <GoogleMock />
          <p className="mt-2.5 text-[11px] leading-relaxed text-cream-faint">
            Le badge « Garanti par Google » s&apos;affiche une fois votre dossier
            validé par Google (pièces légales, assurance selon le métier).
          </p>
        </div>
      ) : null}

      {/* Ce qui est inclus */}
      <div className="mt-7">
        {f.inherits ? (
          <p className="mb-3.5 text-sm font-semibold text-cream">
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
      </div>

      <ButtonLink
        href={`/demarrer?formule=${f.slug}`}
        size="lg"
        variant={f.featured ? "primary" : "secondary"}
        className="mt-8 w-full"
      >
        {f.cta}
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </ButtonLink>
    </div>
  );
}

// Mini « capture d'écran » qui imite un résultat Google en haut de page.
// Nom et chiffres 100% FICTIFS — sert juste à montrer à l'artisan ce qu'il aura.
function GoogleMock() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(27,22,17,0.08),0_16px_36px_-22px_rgba(27,22,17,0.35)] ring-1 ring-black/5">
      {/* Badge « Garanti par Google » */}
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f4ea] px-2.5 py-1 text-xs font-semibold text-[#137333]">
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#34a853] text-white">
          <Check size={9} strokeWidth={3.5} />
        </span>
        Garanti par Google
      </div>

      {/* Nom de l'entreprise (fictif) */}
      <div className="mt-2.5 text-[15px] font-semibold text-[#202124]">
        Plomberie Dupont
      </div>

      {/* Note + avis */}
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

      {/* Ligne d'infos */}
      <div className="mt-1 text-[13px] text-[#5f6368]">
        Paris · Ouvert · Disponible maintenant
      </div>

      {/* Bouton appeler */}
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
