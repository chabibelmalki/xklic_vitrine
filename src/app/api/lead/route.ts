import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  // Valide côté serveur (ne fait jamais confiance au client).
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const lead = {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
    source: "brio-vitrine",
  };

  const webhook = process.env.N8N_WEBHOOK_URL;

  // Pas de webhook configuré : on log et on renvoie un succès (ne plante pas).
  if (!webhook) {
    console.info(
      "[lead] N8N_WEBHOOK_URL absent — lead reçu mais non transmis :",
      JSON.stringify(lead),
    );
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (!res.ok) {
      console.error("[lead] Webhook a répondu", res.status);
      // On renvoie quand même un succès au visiteur : le lead est récupérable
      // côté logs / n8n retentera. Ne pas casser l'expérience.
      return NextResponse.json({ ok: true, forwarded: false });
    }
    return NextResponse.json({ ok: true, forwarded: true });
  } catch (err) {
    console.error("[lead] Échec d'envoi au webhook :", err);
    return NextResponse.json({ ok: true, forwarded: false });
  }
}
