import { getTranslations } from "next-intl/server";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { RealisationCard } from "@/components/sections/realisation-card";
import { getRealisations } from "@/lib/realisations";

// Portfolio (accueil) — TEASER des vrais sites clients en prod. Même source que
// la page /realisations : le back-office (getRealisations), en ordre ALÉATOIRE.
// On n'affiche qu'un sous-ensemble (les premiers, déjà mélangés côté SQL) ; les
// cartes portent l'aperçu live et mènent à la fiche détail. Composant SERVEUR
// (async) : il consomme le fetch ISR de getRealisations.
const HOME_COUNT = 6;

export async function Portfolio() {
  const t = await getTranslations("portfolio");
  const items = (await getRealisations()).slice(0, HOME_COUNT);

  return (
    <Section id="realisations" className="border-t border-line">
      <Reveal>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
      </Reveal>

      <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <RevealItem key={item.slug}>
            <RealisationCard
              item={item}
              featured={i === 0}
              href={`/realisations/${item.slug}`}
            />
          </RevealItem>
        ))}
      </RevealGroup>

      <p className="mt-8 text-center text-sm text-cream-faint">
        {t("yoursSoon")}
      </p>
    </Section>
  );
}
