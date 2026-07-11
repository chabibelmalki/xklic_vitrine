import { NextResponse } from "next/server";
import { presignPut, scalewayConfigured } from "@/lib/scaleway";

export const runtime = "nodejs";

// Délivre une URL PUT présignée pour un upload navigateur-direct vers Scaleway
// (remplace l'ancien token Vercel Blob). Le navigateur envoie { name, type,
// size } ; on valide type + taille, on génère une clé `leads/<uuid>.<ext>` et on
// renvoie l'URL signée + l'URL publique + les en-têtes à renvoyer. Le fichier ne
// transite JAMAIS par cette fonction (on contourne la limite de body serverless).

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
};
const MAX_BYTES = 15 * 1024 * 1024; // 15 Mo / image

export async function POST(req: Request): Promise<NextResponse> {
  if (!scalewayConfigured()) {
    return NextResponse.json({ error: "storage_unconfigured" }, { status: 503 });
  }

  let body: { name?: string; type?: string; size?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const type = (body.type || "").toLowerCase();
  const ext = ALLOWED[type];
  if (!ext) {
    return NextResponse.json({ error: "type_not_allowed" }, { status: 422 });
  }
  if (typeof body.size === "number" && body.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  // Clé non devinable ; suffixe d'extension pour un Content-Type de lecture correct.
  const key = `leads/${crypto.randomUUID()}${ext}`;

  try {
    const signed = await presignPut(key, type);
    return NextResponse.json(signed);
  } catch (err) {
    console.error("[upload/sign] présignature échouée :", err);
    return NextResponse.json({ error: "sign_failed" }, { status: 502 });
  }
}
