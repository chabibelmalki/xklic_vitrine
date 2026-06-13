import {
  Search,
  MessageSquare,
  Phone,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { benefits } from "@/lib/content";

const icons: Record<string, LucideIcon> = {
  Search,
  MessageSquare,
  Phone,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  Star,
};

export function Benefits() {
  return (
    <Section id="benefices" className="border-t border-line">
      <Reveal>
        <SectionHeading
          eyebrow="Ce que ça t'apporte"
          title="Un site, mais surtout des clients en plus."
          description="Pas juste une jolie page : un outil qui travaille pour toi, tous les jours, même quand tu es sur un chantier."
        />
      </Reveal>

      <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => {
          const Icon = icons[b.icon] ?? Star;
          return (
            <RevealItem
              key={b.title}
              className="group flex flex-col gap-4 bg-ink-soft p-7 transition-colors duration-300 hover:bg-ink-panel sm:p-8"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember/12 text-ember-deep transition-transform duration-300 group-hover:scale-110">
                <Icon size={20} />
              </span>
              <h3 className="font-display text-lg font-semibold text-cream">
                {b.title}
              </h3>
              <p className="text-sm leading-relaxed text-cream-muted">
                {b.body}
              </p>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
