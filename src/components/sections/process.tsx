import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { steps } from "@/lib/content";

export function Process() {
  return (
    <Section id="process" className="border-t border-line">
      <Reveal>
        <SectionHeading
          eyebrow="Comment ça marche"
          title="Quatre étapes. Et vous recevez vos premières demandes."
          description="Pas de jargon, pas de réunions interminables. Vous nous donnez l'essentiel, on fait le reste."
        />
      </Reveal>

      <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <RevealItem
            key={step.n}
            className="group relative flex flex-col gap-4 bg-ink-soft p-7 transition-colors duration-300 hover:bg-ink-panel"
          >
            <span className="font-display text-5xl font-light text-cream/10 transition-colors duration-300 group-hover:text-ember/40">
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
