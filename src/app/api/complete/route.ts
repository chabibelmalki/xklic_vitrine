import { NextResponse } from "next/server";
import { completionSchema } from "@/lib/lead-schema";
import { stripe } from "@/lib/stripe";
import { fetchDossierByRef, enrichOrder } from "@/lib/backoffice";

export const runtime = "nodejs";

// Enrichissement du profil APRÈS paiement (page /merci). Server-to-server :
//   1. valide + whiteliste le payload (Zod retire toute clé inconnue) ;
//   2. résout la ref du dossier via le session_id Stripe (JAMAIS depuis le
//      client — le client n'envoie que sessionId + champs de profil) ;
//   3. DOUBLE VERROU : refuse d'écrire si le dossier n'est pas au statut « payé » ;
//   4. enrichit le dossier par sa ref EXACTE (pas de fusion possible).
//
// Les images sont déjà téléversées vers Vercel Blob côté client (comme le
// tunnel) ; on ne reçoit ici que des URLs publiques.

const urlsOf = (items?: { url?: string }[]): string[] =>
  Array.isArray(items)
    ? items.map((i) => i.url).filter((u): u is string => Boolean(u))
    : [];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = completionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const v = parsed.data;

  if (!stripe) {
    return NextResponse.json({ ok: false, error: "stripe_unavailable" }, { status: 503 });
  }

  // 2. Résout la ref depuis le session_id (source de confiance = Stripe).
  let ref: string | undefined;
  try {
    const session = await stripe.checkout.sessions.retrieve(v.sessionId);
    ref = session.metadata?.orderId || undefined;
  } catch {
    return NextResponse.json({ ok: false, error: "session_not_found" }, { status: 404 });
  }
  if (!ref) {
    return NextResponse.json({ ok: false, error: "order_not_found" }, { status: 404 });
  }

  // 3. Double verrou : le dossier DOIT exister et être « payé ».
  const dossier = await fetchDossierByRef(ref);
  if (!dossier) {
    return NextResponse.json({ ok: false, error: "order_not_found" }, { status: 404 });
  }
  if (dossier.statutCommande !== "payé") {
    return NextResponse.json({ ok: false, error: "not_paid" }, { status: 403 });
  }

  // 4. Whitelist → colonnes snake_case (seuls les champs fournis sont écrits).
  const fields: Record<string, unknown> = {};
  if (v.description !== undefined) fields.prestations = v.description;
  if (v.logo !== undefined) fields.logo_urls = urlsOf(v.logo);
  if (v.photos !== undefined) fields.photo_urls = urlsOf(v.photos);
  if (v.colorPreference !== undefined) fields.couleurs = v.colorPreference;
  if (v.styleVibes !== undefined) fields.styles = v.styleVibes;
  if (v.ambiance !== undefined) fields.ambiance = v.ambiance;
  if (v.languages !== undefined) fields.langues = v.languages;
  if (v.siret !== undefined) fields.siret = v.siret;
  if (v.noWhatsapp !== undefined) fields.whatsapp = !v.noWhatsapp;
  if (v.socials) {
    const s = v.socials;
    if (s.facebook !== undefined) fields.facebook = s.facebook;
    if (s.instagram !== undefined) fields.instagram = s.instagram;
    if (s.tiktok !== undefined) fields.tiktok = s.tiktok;
    if (s.x !== undefined) fields.x = s.x;
    if (s.google !== undefined) fields.google = s.google;
  }

  const ok = await enrichOrder(ref, fields);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "write_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
