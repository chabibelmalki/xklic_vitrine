import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { LeadForm } from "@/components/form/lead-form";
import { FloatingActions } from "@/components/site/floating-actions";
import { FORMULE_SLUGS, type FormuleSlug } from "@/lib/lead-schema";

export const metadata: Metadata = {
  title: "Créer mon site",
  description:
    "Décris ton activité en quelques minutes. On crée ton site pro pour artisan, auto-entrepreneur ou TPE, et il est en ligne en 48h.",
  alternates: { canonical: "/demarrer" },
};

export default async function DemarrerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = (await searchParams).formule;
  const initialFormule = FORMULE_SLUGS.includes(raw as FormuleSlug)
    ? (raw as FormuleSlug)
    : undefined;

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
            Retour
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-5 py-12 sm:py-16 lg:py-20">
        <LeadForm initialFormule={initialFormule} />
      </main>

      <FloatingActions />
    </div>
  );
}
