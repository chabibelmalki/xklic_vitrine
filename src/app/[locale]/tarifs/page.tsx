import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { Formules } from "@/components/sections/formules";
import { ProofBloc } from "@/components/sections/proof-bloc";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceLd, breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageMeta.tarifs" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/tarifs" },
  };
}

export default async function TarifsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

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
        <Formules headingAs="h1" variant="full" />
        <ProofBloc reassuranceKeys={["online", "noCommitment", "unlimited"]} />
        <CtaBand variant="tarifs" />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
