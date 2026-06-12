import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { pricing } from "@/lib/content";
import { Check, ArrowRight } from "lucide-react";

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

      <Reveal delay={0.1} className="mx-auto mt-14 max-w-lg">
        <div className="relative overflow-hidden rounded-3xl border border-ember/25 bg-ink-soft p-px">
          {/* Glow ring */}
          <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-ember/30 to-transparent opacity-60" />
          <div className="relative rounded-[calc(1.5rem-1px)] bg-ink-soft p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-ember/15 blur-3xl" />

            <span className="inline-flex rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-medium text-ember-soft">
              Sans engagement
            </span>

            <div className="mt-6 flex items-end gap-2">
              <span className="font-display text-5xl font-light text-cream sm:text-6xl">
                {pricing.setup}
              </span>
              <span className="mb-2 text-sm text-cream-muted">
                à la création
              </span>
            </div>
            <p className="mt-2 text-cream-muted">
              puis{" "}
              <span className="font-medium text-cream">
                {pricing.monthly}/mois
              </span>{" "}
              — résiliable à tout moment.
            </p>

            <div className="my-7 h-px bg-line" />

            <ul className="flex flex-col gap-3.5">
              {pricing.includes.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-cream"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15">
                    <Check size={12} className="text-ember-soft" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <ButtonLink
              href="/demarrer"
              size="lg"
              className="mt-8 w-full"
            >
              Créer mon site
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </ButtonLink>
            <p className="mt-4 text-center text-xs text-cream-faint">
              Aucun paiement maintenant · On vous recontacte pour finaliser
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
