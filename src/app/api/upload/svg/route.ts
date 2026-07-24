import { NextResponse } from "next/server";
import { putObject, publicUrl, scalewayConfigured } from "@/lib/scaleway";
import { clientIP, rateAllow } from "@/lib/ratelimit";

export const runtime = "nodejs";

// Upload d'un logo SVG : contrairement aux photos (POST présigné direct vers
// S3), le SVG TRANSITE par le serveur pour être inspecté — un SVG est du XML
// exécutable, pas une image inerte. On refuse tout SVG « actif » (script,
// handler d'événement, HTML embarqué, lien cliquable, entités XXE) avant de
// l'héberger public sur le domaine média. Miroir de media.SafeSVG côté
// back-office : les deux portes appliquent la même règle.
//
// Un logo SVG est petit : cap 2 Mo, loin sous la limite de body serverless.

const MAX_SVG_BYTES = 2 * 1024 * 1024;

// Motifs interdits — même liste que svgForbidden (back-office, media/sniff.go) :
// le DOCTYPE « nu » des exports Illustrator reste accepté, seul le DOCTYPE à
// sous-ensemble interne (entités, XXE) est bloqué.
const FORBIDDEN =
  /<script|<foreignobject|<iframe|<embed|<object|<a[\s>/]|<!doctype[^>]*\[|<!entity|javascript:|data:text\/html|\son[a-z]+\s*=/i;

function isSafeSVG(text: string): boolean {
  if (text.includes("\0")) return false;
  const head = text.slice(0, 4096).replace(/^\uFEFF/, "").toLowerCase();
  if (!head.includes("<svg")) return false;
  return !FORBIDDEN.test(text);
}

export async function POST(req: Request): Promise<NextResponse> {
  if (!scalewayConfigured()) {
    return NextResponse.json({ error: "storage_unconfigured" }, { status: 503 });
  }
  if (!rateAllow(`svg:${clientIP(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_SVG_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }
  const text = await req.text();
  if (!text || text.length > MAX_SVG_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }
  if (!isSafeSVG(text)) {
    return NextResponse.json(
      { error: "svg_not_allowed", message: "SVG refusé (contenu actif détecté) — exportez-le en PNG" },
      { status: 422 },
    );
  }

  const key = `leads/${crypto.randomUUID()}.svg`;
  try {
    await putObject(key, text, "image/svg+xml", { acl: "public-read" });
    return NextResponse.json({ url: publicUrl(key) });
  } catch (err) {
    console.error("[upload/svg] upload échoué :", err);
    return NextResponse.json({ error: "upload_failed" }, { status: 502 });
  }
}
