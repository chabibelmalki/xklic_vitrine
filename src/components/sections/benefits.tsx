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
import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

// Icônes dans l'ordre des `benefits.items` du dictionnaire.
const ICONS: LucideIcon[] = [
  Search,
  MessageSquare,
  Phone,
  ShieldCheck,
  Smartphone,
  RefreshCw,
];

type Benefit = { title: string; body: string };

export function Benefits() {
  const t = useTranslations("benefits");
  const items = t.raw("items") as Benefit[];
  return (
    <Section id="benefices" className="border-t border-line">
      <Reveal>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
      </Reveal>

      <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b, i) => {
          const Icon = ICONS[i] ?? Star;
          return (
            <RevealItem
              key={i}
              className="group flex flex-col gap-4 bg-card p-7 transition-colors duration-300 hover:bg-[#fffcf7] sm:p-8"
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
