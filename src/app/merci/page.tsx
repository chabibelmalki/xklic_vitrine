import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { FloatingActions } from "@/components/site/floating-actions";
import { brand } from "@/lib/content";
import { stripe } from "@/lib/stripe";
import { fetchDossierByRef } from "@/lib/backoffice";
import { buildCompletionPrefill } from "@/lib/completion";
import { CompletionForm } from "@/components/form/completion-form";
import { CompletionGate } from "@/components/form/completion-gate";

export const metadata: Metadata = {
  title: "Merci",
  description: "Ta commande est confirmée. On prépare ton site.",
  robots: { index: false, follow: false },
};

// success_url de Stripe (`?session_id=…`). Aucune écriture ici : le paiement
// n'est traité que par le webhook. On lit le dossier UNIQUEMENT pour préremplir
// le formulaire de complétion (l'écriture passe par /api/complete). Si le dossier
// n'est pas encore « payé » (course webhook), on délègue au poll côté client.
export const runtime = "nodejs";

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const sessionId = (await searchParams).session_id;

  // Résout le dossier via le session_id (best-effort).
  let dossier = null;
  if (sessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const ref = session.metadata?.orderId;
      if (ref) dossier = await fetchDossierByRef(ref);
    } catch {
      dossier = null;
    }
  }

  // Chemin rapide : dossier déjà payé au moment du rendu → formulaire direct.
  const prefill =
    dossier?.statutCommande === "payé" ? buildCompletionPrefill(dossier) : null;

  return (
    <div className="grain relative flex min-h-full flex-col">
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
            Accueil
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-5 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ember/30 bg-ember/10 text-ember-soft">
              <PartyPopper size={28} />
            </span>
            <h1 className="font-display mt-6 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
              Merci, c&apos;est confirmé&nbsp;!
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-cream-muted">
              Ton paiement est bien pris en compte. Un reçu Stripe arrive par
              email.
            </p>
          </div>

          {prefill ? (
            // Dossier payé : formulaire de complétion directement.
            <CompletionForm sessionId={sessionId!} {...prefill} />
          ) : sessionId ? (
            // Paiement fait mais dossier pas encore « payé » (webhook en cours) :
            // le poll prend le relais et affiche le formulaire dès que prêt.
            <CompletionGate sessionId={sessionId} />
          ) : (
            // Pas de session : remerciement simple.
            <div className="flex flex-col items-center text-center">
              <p className="max-w-md text-base leading-relaxed text-cream-muted">
                Notre équipe prépare ton site et revient vers toi très vite —
                généralement sous 2h — pour te montrer une première version.
              </p>
              <Link
                href="/"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line-strong px-6 text-sm text-cream transition-colors hover:bg-cream/[0.05]"
              >
                <ArrowLeft size={16} />
                Retour à l&apos;accueil
              </Link>
              <p className="mt-8 text-xs text-cream-faint">
                Une question&nbsp;? {brand.email}
              </p>
            </div>
          )}
        </div>
      </main>

      <FloatingActions />
    </div>
  );
}
