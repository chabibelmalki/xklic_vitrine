import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { Problem } from "@/components/sections/problem";
import { Process } from "@/components/sections/process";
import { Portfolio } from "@/components/sections/portfolio";
import { Benefits } from "@/components/sections/benefits";
import { Formules } from "@/components/sections/formules";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceLd, faqLd } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { defaultLocale } from "@/i18n/config";

// hreflang de la page d'accueil : chaque langue pointe vers sa home
// (fr = racine, les autres préfixées), + x-default sur le français.
export function generateMetadata(): Metadata {
  const languages: Record<string, string> = { "x-default": SITE_URL };
  for (const l of routing.locales) {
    languages[l] = l === defaultLocale ? SITE_URL : `${SITE_URL}/${l}`;
  }
  return { alternates: { canonical: SITE_URL, languages } };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="grain relative flex min-h-full flex-col">
      <JsonLd data={serviceLd()} />
      <JsonLd data={faqLd()} />
      <Header />
      <main className="flex-1">
        <Hero />
        <Trust />
        <Problem />
        <Process />
        <Portfolio />
        <Benefits />
        <Formules variant="home" />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
