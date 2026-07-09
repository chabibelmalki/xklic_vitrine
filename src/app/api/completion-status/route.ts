import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { fetchDossierByRef } from "@/lib/backoffice";
import { buildCompletionPrefill } from "@/lib/completion";

export const runtime = "nodejs";

// Statut de complétion pour le poll côté /merci (course webhook/redirection).
// Résout la ref via le session_id, puis renvoie :
//   • { status: "paid", initial, showDescription, hasSiret, companyName } → prêt ;
//   • { status: "pending" } → dossier pas encore payé (webhook en cours) ;
//   • { status: "notfound" | "unavailable" } → on ne pourra pas afficher le form.
// Toujours 200 (sauf session_id absent → 400) : le client boucle sur `status`.
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id")?.trim();
  if (!sessionId) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }
  if (!stripe) {
    return NextResponse.json({ status: "unavailable" });
  }

  let ref: string | undefined;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    ref = session.metadata?.orderId || undefined;
  } catch {
    return NextResponse.json({ status: "notfound" });
  }
  if (!ref) {
    return NextResponse.json({ status: "notfound" });
  }

  const dossier = await fetchDossierByRef(ref);
  if (!dossier) {
    return NextResponse.json({ status: "pending" });
  }
  if (dossier.statutCommande !== "payé") {
    return NextResponse.json({ status: "pending" });
  }

  return NextResponse.json({ status: "paid", ...buildCompletionPrefill(dossier) });
}
