import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/site/logo";
import { LeadForm } from "@/components/form/lead-form";
import { FloatingActions } from "@/components/site/floating-actions";
import {
  FORMULE_SLUGS,
  BOUTIQUE_TIERS,
  type FormuleSlug,
  type BoutiqueTier,
} from "@/lib/lead-schema";
import { countryNameFromCode } from "@/data/countries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demarrer.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/demarrer" },
  };
}

export default async function DemarrerPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: "demarrer" });
  const sp = await searchParams;
  const initialFormule = FORMULE_SLUGS.includes(sp.formule as FormuleSlug)
    ? (sp.formule as FormuleSlug)
    : undefined;
  // ?boutique=<tier|none> depuis les cartes tarifs. "none" / absent / invalide
  // → pas de boutique présélectionnée.
  const initialBoutique = BOUTIQUE_TIERS.includes(sp.boutique as BoutiqueTier)
    ? (sp.boutique as BoutiqueTier)
    : undefined;

  // Pré-remplit le pays depuis la géo IP (en-tête posé par l'edge Vercel). Absent
  // en local / hors liste → undefined, le formulaire retombe sur « France ».
  const h = await headers();
  const initialCountry = countryNameFromCode(h.get("x-vercel-ip-country"));

  return (
    <div className="grain relative flex min-h-full flex-col">
      {/* Warm glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px] glow-ember"
        aria-hidden
      />

      <header className="relative z-10">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:h-18">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-cream-muted transition-colors hover:text-cream"
          >
            <ArrowLeft size={16} />
            {tNav("back")}
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-5 py-12 sm:py-16 lg:py-20">
        <LeadForm
          initialFormule={initialFormule}
          initialBoutique={initialBoutique}
          initialCountry={initialCountry}
        />
      </main>

      <FloatingActions />
    </div>
  );
}
