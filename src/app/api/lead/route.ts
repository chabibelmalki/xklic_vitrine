import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { appendOrderRow } from "@/lib/sheets";
import { verifyTurnstile, clientIp } from "@/lib/turnstile";

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

  // Anti-robot Cloudflare Turnstile (no-op si la clé secrète n'est pas définie).
  if (!(await verifyTurnstile(parsed.data.turnstileToken, clientIp(req)))) {
    return NextResponse.json(
      { ok: false, error: "turnstile" },
      { status: 403 },
    );
  }

  // Capture du lead dans Google Sheets (best-effort ; ne casse jamais l'expérience).
  const forwarded = await appendOrderRow({ statut: "lead", lead: parsed.data });
  return NextResponse.json({ ok: true, forwarded });
}
