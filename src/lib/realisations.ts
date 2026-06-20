import "server-only";
import { portfolio } from "./content";

// ─────────────────────────────────────────────────────────────────────────
// Réalisations — liste des sites clients EN LIGNE.
//
// SOURCE DE VÉRITÉ : le moteur agence_website, qui expose /api/realisations
// (un client = un dossier de config). On le consomme en fetch ISR : ajouter un
// client côté moteur le fait apparaître ici tout seul, sans redéployer la
// vitrine. AGENCE_ENGINE_URL pilote l'origine (défaut : le sous-domaine dédié).
//
// REPLI GRACIEUX : si le moteur est injoignable (build hors ligne, panne…), on
// retombe sur la liste codée en dur de `content.ts` (toujours de vraies URLs) :
// la page ne casse jamais et reste utile.
// ─────────────────────────────────────────────────────────────────────────

const ENGINE_URL = (
  process.env.AGENCE_ENGINE_URL ?? "https://api.xklic.com"
).replace(/\/+$/, "");

// Teintes de carte (cohérentes avec content.portfolio), attribuées en rotation.
const ACCENTS = [
  "from-rose-500/20 to-amber-500/10",
  "from-sky-500/20 to-slate-500/10",
  "from-emerald-500/20 to-lime-500/10",
  "from-pink-500/20 to-amber-500/10",
  "from-amber-500/20 to-ember/10",
  "from-violet-500/20 to-sky-500/10",
];

export type Realisation = {
  client: string;
  trade: string; // activité
  city: string;
  url: string;
  accent: string;
};

type EngineSite = {
  slug: string;
  nom: string;
  activite: string;
  ville: string;
  url: string;
};

/** Liste depuis content.portfolio — utilisée en repli. */
function fromSeed(): Realisation[] {
  return portfolio
    .filter((w): w is typeof w & { url: string } => Boolean(w.url))
    .map((w, i) => ({
      client: w.client,
      trade: w.trade,
      city: w.city,
      url: w.url,
      accent: w.accent || ACCENTS[i % ACCENTS.length],
    }));
}

export async function getRealisations(): Promise<Realisation[]> {
  try {
    const res = await fetch(`${ENGINE_URL}/api/realisations`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { sites?: EngineSite[] };
    const sites = data.sites ?? [];
    if (!sites.length) throw new Error("liste vide");
    return sites.map((s, i) => ({
      client: s.nom,
      trade: s.activite,
      city: s.ville,
      url: s.url,
      accent: ACCENTS[i % ACCENTS.length],
    }));
  } catch (err) {
    console.warn(
      `[realisations] moteur injoignable (${ENGINE_URL}/api/realisations), repli sur la liste locale :`,
      err instanceof Error ? err.message : err,
    );
    return fromSeed();
  }
}
