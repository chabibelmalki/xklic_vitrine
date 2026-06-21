// ─────────────────────────────────────────────────────────────────────────
// CONTRAT DE DONNÉES — SEO programmatique (métiers × villes Île-de-France).
//
// Source de vérité partagée entre :
//   • data/metiers.ts  → export const metiers: Metier[]
//   • data/villes.ts   → export const villes: Ville[]
//   • lib/seo.ts        → JSON-LD LocalBusiness/Service/Breadcrumb (consomme ces types)
//   • lib/metadata.ts   → <head> par page (consomme ces types)
//   • app/metiers/**, app/zones/**  → templates de pages (consomment ces types)
//
// ⚠️ NE PAS renommer les types ni les champs sans coordination : plusieurs
// agents travaillent en parallèle contre ce contrat.
// ─────────────────────────────────────────────────────────────────────────

/** Un métier accompagné (plomberie, ménage, mécanique…). Données ATOMIQUES :
 *  c'est leur combinaison avec une ville qui doit produire un contenu unique. */
export interface Metier {
  /** identifiant d'URL, ex. "plomberie" → /metiers/plomberie */
  slug: string;
  /** libellé affiché, ex. "Plomberie" */
  name: string;
  /** la personne, ex. "plombier" (pour « un plombier à Argenteuil ») */
  noun: string;
  /** pluriel, ex. "plombiers" */
  nounPlural: string;
  /** genre grammatical du `noun` (pour accorder « un/une », « le/la ») */
  gender: "m" | "f";
  /** icône lucide-react (nom du composant), ex. "Wrench" */
  icon: string;
  /** accroche hero courte (≤ 90 caractères), unique au métier */
  hero: string;
  /** intro éditoriale propre au métier (~150 mots, unique, sans nom de ville) */
  intro: string;
  /** prestations concrètes (6–10), servent aussi au maillage et au JSON-LD */
  prestations: string[];
  /** problèmes clients résolus — alimente la variation rédactionnelle par paire */
  painPoints: string[];
  /** situations d'urgence / saisonnalité — matière à varier les paires */
  signals: string[];
  /** FAQ spécifique au métier (3–5), distincte de la FAQ générale du site */
  faq: { q: string; a: string }[];
  /** mots-clés cible (longue traîne) pour les métadonnées */
  keywords: string[];
}

/** Une ville/zone d'Île-de-France. Champs riches → ancrage local crédible. */
export interface Ville {
  /** identifiant d'URL, ex. "argenteuil" → /zones/argenteuil */
  slug: string;
  /** libellé affiché, ex. "Argenteuil" */
  name: string;
  /** préposition correcte : "à Argenteuil", "au Plessis", "aux Lilas" */
  prep: string;
  /** département, ex. "Val-d'Oise" */
  dept: string;
  /** code département, ex. "95" */
  deptCode: string;
  /** codes postaux couverts */
  postalCodes: string[];
  /** population (pour contexte rédactionnel, pas affiché brut) */
  population: number;
  /** intro éditoriale propre à la ville (~150 mots, unique, sans métier) */
  intro: string;
  /** quartiers / repères locaux (3–6) — ancrage géographique réel */
  landmarks: string[];
  /** coordonnées centre-ville pour geo.position / LocalBusiness */
  geo: { lat: number; lng: number };
  /** slugs des villes voisines (3–5) — maillage interne /zones */
  nearby: string[];
}

/** Résultat de la composition métier×ville : contenu UNIQUE par paire.
 *  Implémenté par data/compose.ts (export `composePair(metier, ville)`).
 *  L'unicité vient de la combinaison + de variantes structurelles choisies
 *  de façon déterministe (hash de slug paire), PAS d'un simple remplacement
 *  du nom de ville. Cible : ≥ 300 mots réellement variés par page. */
export interface PairContent {
  title: string;
  description: string;
  /** paragraphes du corps (≥ 4), tissant métier + ville + paire */
  body: string[];
  /** intentions/requêtes locales couvertes */
  intents: string[];
  /** FAQ propre à la paire (optionnel). Présent sur les paires rédigées à la
   *  main → différenciée par ville (ne PAS recycler metier.faq). Absent sur les
   *  paires générées : la page retombe alors sur metier.faq. */
  faq?: { q: string; a: string }[];
}
