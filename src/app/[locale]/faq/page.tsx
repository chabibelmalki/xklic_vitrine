import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { Faq } from "@/components/sections/faq";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { faqLd, breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageMeta.faq" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/faq" },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

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
        <CtaBand variant="faq" />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
