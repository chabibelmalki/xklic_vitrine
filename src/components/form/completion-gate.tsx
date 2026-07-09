"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { CompletionForm, type CompletionInitial } from "./completion-form";

type Prefill = {
  initial: CompletionInitial;
  showDescription: boolean;
  hasSiret: boolean;
  companyName: string;
};

const TIMEOUT_MS = 30_000;
const INTERVAL_MS = 2_500;

// Course webhook/redirection : à l'atterrissage sur /merci, le dossier peut ne
// pas encore être « payé » (webhook en cours). On poll le statut ; dès qu'il
// passe payé (cas nominal, quelques secondes) on affiche le formulaire ; au
// bout de ~30 s on bascule sur le filet email (étape 6).
export function CompletionGate({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<"polling" | "paid" | "timeout">("polling");
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const stopped = useRef(false);

  useEffect(() => {
    stopped.current = false;
    const start = Date.now();
    let timer: ReturnType<typeof setTimeout>;

    async function tick() {
      if (stopped.current) return;
      try {
        const res = await fetch(
          `/api/completion-status?session_id=${encodeURIComponent(sessionId)}`,
          { cache: "no-store" },
        );
        const data = (await res.json()) as { status?: string } & Partial<Prefill>;
        if (stopped.current) return;
        if (data.status === "paid" && data.initial) {
          setPrefill({
            initial: data.initial,
            showDescription: !!data.showDescription,
            hasSiret: !!data.hasSiret,
            companyName: data.companyName ?? "",
          });
          setState("paid");
          stopped.current = true;
          return;
        }
      } catch {
        // erreur réseau ponctuelle : on retente jusqu'au timeout
      }
      if (Date.now() - start >= TIMEOUT_MS) {
        setState("timeout");
        stopped.current = true;
        return;
      }
      timer = setTimeout(tick, INTERVAL_MS);
    }

    tick();
    return () => {
      stopped.current = true;
      clearTimeout(timer);
    };
  }, [sessionId]);

  if (state === "paid" && prefill) {
    return <CompletionForm sessionId={sessionId} {...prefill} />;
  }

  if (state === "timeout") {
    return (
      <div className="rounded-3xl border border-line bg-ink-soft/60 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ember/30 bg-ember/10 text-ember-soft">
          <MailCheck size={24} />
        </span>
        <h2 className="font-display mt-5 text-xl font-semibold text-cream">
          On vous a envoyé un lien
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-cream-muted">
          La confirmation de votre paiement prend un peu plus de temps que prévu.
          Pas d&apos;inquiétude : nous vous avons envoyé un email avec un lien pour
          compléter votre profil quand vous le souhaitez.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-ink-soft/60 p-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ember/30 bg-ember/10 text-ember-soft">
        <Loader2 size={24} className="animate-spin" />
      </span>
      <h2 className="font-display mt-5 text-xl font-semibold text-cream">
        Confirmation de votre paiement en cours…
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-cream-muted">
        Un instant — dès que c&apos;est validé (quelques secondes), vous pourrez
        compléter votre profil ici même.
      </p>
    </div>
  );
}
