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
import { JsonLd } from "@/components/seo/json-ld";
import { serviceLd, faqLd } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

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
