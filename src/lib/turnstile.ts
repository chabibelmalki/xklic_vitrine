// Vérification serveur du jeton Cloudflare Turnstile (anti-robot).
//
// Repli gracieux : si `TURNSTILE_SECRET_KEY` n'est pas configuré (dev, ou
// Turnstile pas encore activé), on laisse passer pour ne pas casser le
// parcours. En prod, dès que la clé secrète est présente, un jeton valide
// devient obligatoire.

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string | undefined | null,
  ip: string | null,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true; // Turnstile non activé → on laisse passer (dev).
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch(SITEVERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

// Première IP de `x-forwarded-for` (transmise à Cloudflare pour le contrôle).
export function clientIp(req: Request): string | null {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}
