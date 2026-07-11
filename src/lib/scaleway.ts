import "server-only";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ─────────────────────────────────────────────────────────────────────────
// Stockage objet Scaleway (S3-compatible) — aligné sur le back-office
// (internal/media) et l'engine (scripts/lib/scaleway.mjs) : MÊME bucket
// `xklic-media`, MÊMES credentials. Les uploads du tunnel vivent sous le
// préfixe « leads/ » (à côté de « sites/ » et « products/ »).
//
// L'URL publique d'un objet = MEDIA_BASE_URL + "/" + clé.
//
// Env (à reporter dans Vercel — mêmes valeurs que le back-office) :
//   S3_ENDPOINT (défaut https://s3.fr-par.scw.cloud), S3_REGION (défaut fr-par),
//   S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY, MEDIA_BASE_URL.
// ─────────────────────────────────────────────────────────────────────────

const ENDPOINT = (process.env.S3_ENDPOINT || "https://s3.fr-par.scw.cloud").trim();
const REGION = (process.env.S3_REGION || "fr-par").trim();
const BUCKET = (process.env.S3_BUCKET || "").trim();
const ACCESS_KEY = (process.env.S3_ACCESS_KEY || "").trim();
const SECRET_KEY = (process.env.S3_SECRET_KEY || "").trim();
const BASE_URL = (process.env.MEDIA_BASE_URL || "").trim().replace(/\/+$/, "");

/** Toutes les variables requises sont présentes. */
export function scalewayConfigured(): boolean {
  return Boolean(BUCKET && ACCESS_KEY && SECRET_KEY && BASE_URL);
}

let cached: S3Client | null = null;
function client(): S3Client {
  if (!scalewayConfigured()) {
    throw new Error(
      "Scaleway non configuré (S3_BUCKET / S3_ACCESS_KEY / S3_SECRET_KEY / MEDIA_BASE_URL).",
    );
  }
  if (!cached) {
    cached = new S3Client({
      region: REGION,
      endpoint: ENDPOINT,
      credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
      forcePathStyle: false, // virtual-hosted : <bucket>.s3.<region>.scw.cloud
    });
  }
  return cached;
}

const clean = (key: string) => key.replace(/^\/+/, "");

/** URL publique d'une clé (MEDIA_BASE_URL/<clé>). */
export function publicUrl(key: string): string {
  if (!key) return "";
  if (/^https?:\/\//.test(key)) return key; // déjà absolue (compat)
  return `${BASE_URL}/${clean(key)}`;
}

export type PresignedPut = {
  uploadUrl: string; // URL PUT signée (valable 10 min)
  publicUrl: string; // URL de lecture publique une fois l'objet posé
  // En-têtes que le navigateur DOIT renvoyer sur le PUT (signés dans l'URL).
  headers: Record<string, string>;
};

/**
 * URL PUT présignée pour un upload navigateur-direct, objet public-read.
 * On signe `Content-Type` + `x-amz-acl` : le navigateur doit renvoyer EXACTEMENT
 * ces en-têtes (fournis dans `headers`). Miroir du PutObject public-read côté
 * back-office/engine, mais côté client (on évite la limite de body serverless).
 */
export async function presignPut(key: string, contentType: string): Promise<PresignedPut> {
  const k = clean(key);
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: k,
    ContentType: contentType,
    ACL: "public-read",
  });
  const uploadUrl = await getSignedUrl(client(), cmd, { expiresIn: 600 });
  return {
    uploadUrl,
    publicUrl: publicUrl(k),
    headers: { "Content-Type": contentType, "x-amz-acl": "public-read" },
  };
}

/** Écrit un objet côté serveur (JSON de commande) — privé (pas d'ACL public). */
export async function putObject(key: string, body: string, contentType: string): Promise<string> {
  const k = clean(key);
  await client().send(
    new PutObjectCommand({ Bucket: BUCKET, Key: k, Body: body, ContentType: contentType }),
  );
  return k;
}

/** Lit un objet texte côté serveur (JSON de commande). null si absent/erreur. */
export async function getObjectText(key: string): Promise<string | null> {
  try {
    const res = await client().send(
      new GetObjectCommand({ Bucket: BUCKET, Key: clean(key) }),
    );
    return (await res.Body?.transformToString()) ?? null;
  } catch (err) {
    console.error("[scaleway] getObjectText échoué :", err);
    return null;
  }
}
