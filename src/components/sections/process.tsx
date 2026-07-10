import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { steps } from "@/lib/content";

export function Process() {
  return (
    <Section id="process" className="border-t border-line">
      <Reveal>
        <SectionHeading
          eyebrow="Comment ça marche"
          title="Quatre étapes. Et tu reçois tes premières demandes."
          description="Pas de jargon, pas de réunions interminables. Tu nous donnes l'essentiel, on fait le reste."
        />
      </Reveal>

      <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <RevealItem
            key={step.n}
            className="group relative flex flex-col gap-4 bg-card p-7 transition-colors duration-300 hover:bg-[#fffcf7]"
          >
            <span className="font-display flex h-11 w-11 items-center justify-center rounded-full border border-ember/25 bg-ember/[0.08] text-base font-semibold text-ember-deep transition-all duration-300 group-hover:border-ember/50 group-hover:bg-ember group-hover:text-white">
              {step.n}
            </span>
            <h3 className="text-base font-medium text-cream">{step.title}</h3>
            <p className="text-sm leading-relaxed text-cream-muted">
              {step.body}
            </p>
            <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-ember to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
