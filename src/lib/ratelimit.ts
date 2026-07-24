import "server-only";

// Rate-limit minimaliste en mémoire, par IP : fenêtre glissante. Best-effort en
// serverless (chaque instance a sa propre mémoire), mais suffit à casser les
// boucles simples (génération d'URLs présignées à la chaîne, flood d'un
// formulaire). Miroir de l'approche du back-office (httpapi/ratelimit.go).

const hits = new Map<string, number[]>();
let lastGC = Date.now();

/** true si l'appel passe pour cette clé, dans la limite `limit` / `windowMs`. */
export function rateAllow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const cutoff = now - windowMs;

  if (now - lastGC > windowMs) {
    for (const [k, ts] of hits) {
      if (!ts.length || ts[ts.length - 1] < cutoff) hits.delete(k);
    }
    lastGC = now;
  }

  const ts = (hits.get(key) ?? []).filter((t) => t >= cutoff);
  if (ts.length >= limit) {
    hits.set(key, ts);
    return false;
  }
  ts.push(now);
  hits.set(key, ts);
  return true;
}

/** IP du client derrière Vercel (en-têtes posés par la plateforme, non forgeables). */
export function clientIP(req: Request): string {
  return (
    req.headers.get("x-real-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown"
  );
}
