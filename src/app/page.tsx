import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { Problem } from "@/components/sections/problem";
import { Process } from "@/components/sections/process";
import { Portfolio } from "@/components/sections/portfolio";
import { Benefits } from "@/components/sections/benefits";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <div className="grain relative flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Trust />
        <Problem />
        <Process />
        <Portfolio />
        <Benefits />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
