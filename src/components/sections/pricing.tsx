import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { pricing } from "@/lib/content";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";

export function Pricing() {
  return (
    <Section id="tarif" className="border-t border-line">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Tarif"
          title="Un seul forfait. Tout est dedans."
          description="Pas d'options cachées, pas de devis à rallonge. Le prix d'un café par jour pour une vraie présence en ligne."
        />
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-14 max-w-xl">
        <div className="relative">
          {/* Lueur chaude derrière la carte */}
          <div
            className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-ember/10 blur-3xl"
            aria-hidden
          />

          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-ember/25 bg-ink-soft shadow-float">
            {/* Bandeau dégradé en tête */}
            <div className="relative bg-gradient-to-br from-ember-deep via-ember to-amber px-7 py-7 text-white sm:px-10">
              <div
                className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)] [background-size:18px_18px]"
                aria-hidden
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                    Sans engagement
                  </span>
                  <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-2">
                    <div>
                      <div className="flex items-end gap-1.5">
                        <span className="font-display text-5xl font-semibold leading-none sm:text-6xl">
                          {pricing.setup}
                        </span>
                      </div>
                      <span className="mt-1.5 block text-sm text-white/80">
                        à la création
                      </span>
                    </div>
                    <span className="mb-2 text-2xl font-light text-white/50">
                      +
                    </span>
                    <div>
                      <div className="flex items-end gap-1">
                        <span className="font-display text-4xl font-semibold leading-none sm:text-5xl">
                          {pricing.monthly}
                        </span>
                        <span className="mb-1 text-lg font-medium text-white/80">
                          /mois
                        </span>
                      </div>
                      <span className="mt-1.5 block text-sm text-white/80">
                        résiliable à tout moment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Corps : ce qui est inclus */}
            <div className="px-7 py-8 sm:px-10">
              <ul className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
                {pricing.includes.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-cream"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15">
                      <Check size={12} className="text-ember-deep" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <ButtonLink href="/demarrer" size="lg" className="mt-9 w-full">
                Créer mon site
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </ButtonLink>

              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-cream-faint">
                <ShieldCheck size={14} className="text-cream-muted" />
                Aucun paiement maintenant · On te recontacte pour finaliser
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
