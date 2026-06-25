import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { Formules } from "@/components/sections/formules";
import { ProofBloc } from "@/components/sections/proof-bloc";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { serviceLd, breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Tarifs — 49€ puis 9,99€/mois, sans engagement",
  description:
    "Trois formules simples et claires pour ton site web pro : à partir de 49€ à l'installation puis 9,99€/mois, sans engagement. Tu commences où tu veux, tu changes quand tu veux.",
  path: "/tarifs",
  keywords: [
    "tarif site web artisan",
    "prix création site internet",
    "site web pas cher sans engagement",
  ],
});

export default function TarifsPage() {
  const breadcrumb = breadcrumbLd([
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Tarifs", url: `${SITE_URL}/tarifs` },
  ]);

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={serviceLd()} />
      <JsonLd data={breadcrumb} />
      <Header />

      <main className="relative flex-1 pt-16 lg:pt-18">
        <Formules headingAs="h1" />
        <ProofBloc reassurances={["En ligne en 48h", "Sans engagement", "Modifications illimitées"]} />
        <CtaBand
          title="Une question avant de te lancer ?"
          subtitle="Appelle-nous ou écris sur WhatsApp, on répond vite et clairement."
        />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
