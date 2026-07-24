import { NextResponse } from "next/server";
import { presignPost, scalewayConfigured } from "@/lib/scaleway";
import { clientIP, rateAllow } from "@/lib/ratelimit";

export const runtime = "nodejs";

// Délivre un POST présigné (policy S3) pour un upload navigateur-direct vers
// Scaleway. Le navigateur envoie { name, type, size } ; on valide le type, on
// génère une clé `leads/<uuid>.<ext>` et on renvoie l'URL + les champs de
// policy. Le fichier ne transite JAMAIS par cette fonction (limite de body
// serverless contournée) — mais la policy borne la taille CÔTÉ S3
// (content-length-range) : la borne n'est plus déclarative.
//
// Les SVG ne passent pas ici : ils transitent par /api/upload/svg, qui lit le
// contenu et refuse les SVG « actifs » (scripts…) avant de les héberger.

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};
const MAX_BYTES = 15 * 1024 * 1024; // 15 Mo / image, garanti par la policy

export async function POST(req: Request): Promise<NextResponse> {
  if (!scalewayConfigured()) {
    return NextResponse.json({ error: "storage_unconfigured" }, { status: 503 });
  }
  // Un humain qui remplit le tunnel signe quelques dizaines d'images au plus.
  if (!rateAllow(`sign:${clientIP(req)}`, 60, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
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
    const signed = await presignPost(key, type, MAX_BYTES);
    return NextResponse.json(signed);
  } catch (err) {
    console.error("[upload/sign] présignature échouée :", err);
    return NextResponse.json({ error: "sign_failed" }, { status: 502 });
  }
}
