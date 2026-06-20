import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { postToN8n } from "@/lib/n8n";

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
    source: "xklic-vitrine",
  };

  // Capture du lead (webhook configurable ; ne casse jamais l'expérience).
  const forwarded = await postToN8n(lead);
  return NextResponse.json({ ok: true, forwarded });
}
