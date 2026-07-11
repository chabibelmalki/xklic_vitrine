import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { Faq } from "@/components/sections/faq";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { faqLd, breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Questions fréquentes",
  description:
    "Délais, engagement, paiement, modifications, nom de domaine… Toutes les réponses sur la création de ton site web pro avec Xklic, sans détour.",
  path: "/faq",
  keywords: [
    "questions site web artisan",
    "faq création site internet",
    "site web sans engagement",
  ],
});

export default function FaqPage() {
  const breadcrumb = breadcrumbLd([
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Questions", url: `${SITE_URL}/faq` },
  ]);

  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={faqLd()} />
      <JsonLd data={breadcrumb} />
      <Header />

      <main className="relative flex-1 pt-16 lg:pt-18">
        <Faq headingAs="h1" />
        <CtaBand
          title="Tout est clair ? On y va."
          subtitle="Ton site pro, en ligne en 48h. Sans engagement."
        />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
