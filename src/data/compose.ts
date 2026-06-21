// ─────────────────────────────────────────────────────────────────────────
// Composition métier × ville → contenu UNIQUE par paire (PairContent).
//
// L'unicité ne vient PAS d'un remplacement du nom de ville : elle vient
//   (a) du tissage réel des données atomiques (painPoints/signals du métier
//       + landmarks/contexte de la ville + angles propres à la paire), et
//   (b) du choix DÉTERMINISTE de variantes structurelles (ordre des
//       paragraphes, tournures, sélection des repères) via un hash du couple
//       `${metier.slug}-${ville.slug}`.
//
// ⚠️ Math.random est BANNI ici (non déterministe + cassé dans l'env). Tout
//    aléa apparent passe par le hash stable ci-dessous.
// ─────────────────────────────────────────────────────────────────────────

import type { Metier, Ville, PairContent } from "./types";
import { metiers } from "./metiers";
import { villes } from "./villes";
import { handwrittenPairs } from "./pairs-handwritten";

// ── Hash de chaîne déterministe (FNV-1a 32 bits) ─────────────────────────
// Stable, sans dépendance, sans Math.random. Sert de graine à tous les choix.
function hashString(input: string): number {
  let h = 0x811c9dc5; // offset basis FNV-1a
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    // multiplication FNV avec wrap 32 bits via Math.imul
    h = Math.imul(h, 0x01000193);
  }
  // ramène à un entier positif 32 bits
  return h >>> 0;
}

// Génère une suite de "tirages" déterministes à partir d'une graine.
// Chaque appel à next() renvoie un entier positif différent mais reproductible.
function makePicker(seed: number) {
  let state = seed === 0 ? 0x9e3779b9 : seed;
  function next(): number {
    // xorshift32 — déterministe, rapide, sans Math.random
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  }
  return {
    // entier dans [0, n)
    int(n: number): number {
      if (n <= 1) return 0;
      return next() % n;
    },
    // un élément du tableau
    pick<T>(arr: T[]): T {
      return arr[this.int(arr.length)];
    },
    // k éléments distincts, en conservant un ordre stable
    sample<T>(arr: T[], k: number): T[] {
      if (k >= arr.length) return [...arr];
      const idx = arr.map((_, i) => i);
      // mélange Fisher-Yates déterministe
      for (let i = idx.length - 1; i > 0; i--) {
        const j = this.int(i + 1);
        const t = idx[i];
        idx[i] = idx[j];
        idx[j] = t;
      }
      return idx
        .slice(0, k)
        .sort((a, b) => a - b)
        .map((i) => arr[i]);
    },
    bool(): boolean {
      return (next() & 1) === 1;
    },
  };
}

// ── Helpers grammaticaux ──────────────────────────────────────────────────
function unMetier(m: Metier): string {
  return m.gender === "f" ? "une " + m.noun : "un " + m.noun;
}
function leMetier(m: Metier): string {
  return m.gender === "f" ? "la " + m.noun : "le " + m.noun;
}
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
// "à Paris" → "de Paris" / "d'Argenteuil" (pour « les habitants de … »)
function depuisVille(v: Ville): string {
  return /^[aeiouhàâäéèêëîïôöûü]/i.test(v.name) ? "d'" + v.name : "de " + v.name;
}

// ── Composition ───────────────────────────────────────────────────────────
export function composePair(metier: Metier, ville: Ville): PairContent {
  // Paires prioritaires rédigées à la main → on sert ce contenu tel quel.
  const handwritten = handwrittenPairs[`${metier.slug}-${ville.slug}`];
  if (handwritten) return handwritten;

  const seed = hashString(`${metier.slug}-${ville.slug}`);
  const r = makePicker(seed);

  const lm = ville.landmarks;
  const pp = metier.painPoints;
  const sg = metier.signals;

  // Sélections déterministes propres à la paire
  const repere1 = r.pick(lm);
  const reperes2 = r.sample(lm, Math.min(2, lm.length));
  const pain = r.sample(pp, Math.min(2, pp.length));
  const signal = r.pick(sg);
  const prest = r.sample(metier.prestations, Math.min(3, metier.prestations.length));

  // ── Variantes de TITRE (4) ──────────────────────────────────────────────
  const titleVariants = [
    `${capitalize(metier.noun)} ${ville.prep} — ${metier.name} de confiance`,
    `${metier.name} ${ville.prep} (${ville.deptCode}) : ${unMetier(metier)} près de chez toi`,
    `Trouver ${unMetier(metier)} ${ville.prep} | ${metier.name} ${ville.dept}`,
    `${metier.name} ${ville.prep} : devis, intervention et site web pro`,
  ];
  const title = titleVariants[r.int(titleVariants.length)];

  // ── Variantes de DESCRIPTION (4) ─────────────────────────────────────────
  const descVariants = [
    `Tu es ${unMetier(metier)} ${ville.prep} ? Xklic te crée un site web pro qui te fait trouver sur Google par les habitants ${depuisVille(ville)} et remplit ton planning. En ligne en 2h, 49€ puis 9,99€/mois, sans engagement.`,
    `Site web pour ${metier.nounPlural} ${ville.prep}${
      ville.dept === ville.name ? "" : " et dans le " + ville.dept
    }. Apparais quand on cherche ${metier.name.toLowerCase()} ${ville.prep}, reçois les demandes directement. Installation 49€, 9,99€/mois.`,
    `${capitalize(metier.name)} ${ville.prep} : un site clair qui rassure tes clients et te place sur les recherches locales. Pensé pour les artisans, en ligne en 2h avec Xklic.`,
    `Développe ton activité de ${metier.name.toLowerCase()} ${ville.prep} avec un site web qui attire les clients du secteur (${reperes2.join(", ")}). Simple, rapide, sans engagement.`,
  ];
  const description = descVariants[r.int(descVariants.length)];

  // ── Briques de paragraphes (on en assemble plusieurs, dans un ordre varié) ─

  // P-A : ancrage local + métier
  const pAVariants = [
    `${capitalize(metier.name)} ${ville.prep}, la demande ne manque pas. Des environs ${
      repere1 ? `du repère « ${repere1} »` : "du centre-ville"
    } aux quartiers résidentiels, les habitants ${depuisVille(ville)} cherchent régulièrement ${unMetier(metier)} sérieux et joignable. ${ville.intro.split(".")[0]}. Dans ce contexte, être visible en ligne au bon moment fait toute la différence.`,
    `${capitalize(ville.name)} (${ville.deptCode}, ${ville.dept}) est un vrai terrain pour ${unMetier(metier)}. Avec ses ${ville.population.toLocaleString("fr-FR")} habitants répartis entre ${reperes2.join(" et ")}, les besoins en ${metier.name.toLowerCase()} sont constants. Encore faut-il que les clients du coin te trouvent avant les autres.`,
    `Quand on a besoin ${unMetier(metier).replace(/^un /, "d'un ").replace(/^une /, "d'une ")} ${ville.prep}, on cherche d'abord sur son téléphone. Que tu interviennes du côté ${
      repere1 ? `de « ${repere1} »` : "du centre"
    } ou dans toute la ville, un site clair te place pile là où les habitants ${depuisVille(ville)} te cherchent.`,
  ];

  // P-B : pain points tissés
  const painPhrase = pain
    .map((p) => p)
    .join(", et ");
  const pBVariants = [
    `Tes futurs clients ${ville.prep} ont des besoins très concrets : ${painPhrase}. C'est exactement ce qu'un site bien fait met en avant, pour transformer une recherche pressée en appel ou en demande de devis.`,
    `Ce que cherchent vraiment les gens ${ville.prep}, c'est résoudre un problème : ${painPhrase}. Ton site doit y répondre en quelques secondes, sinon le client passe au ${metier.noun} suivant.`,
    `Sur le terrain ${ville.prep}, les attentes sont claires : ${painPhrase}. Un site qui parle ce langage-là rassure immédiatement et te démarque de la concurrence locale.`,
  ];

  // P-C : signal / saisonnalité + urgence
  const pCVariants = [
    `Sans oublier les moments forts du métier : ${signal}. Ce sont des pics où les habitants ${depuisVille(ville)} cherchent vite, et où apparaître en haut de Google ${ville.prep} se traduit directement en clients.`,
    `Le métier connaît aussi ses temps forts — ${signal} — et c'est souvent là que tout se joue. Un site optimisé pour les recherches locales ${ville.prep} capte cette demande au bon moment.`,
    `Pense aussi aux périodes clés : ${signal}. Être trouvable ${ville.prep} à ces instants précis, c'est ce qui sépare une bonne saison d'une saison manquée.`,
  ];

  // P-D : prestations + maillage repères
  const pDVariants = [
    `Que tu proposes ${prest.map((p) => p.toLowerCase()).join(", ")} ou d'autres prestations, ton site les met en valeur clairement. Et comme il est pensé pour le local, tu apparais aussi bien pour le quartier ${
      reperes2[0] ?? "central"
    } que pour l'ensemble ${depuisVille(ville)}.`,
    `Tes prestations — ${prest.map((p) => p.toLowerCase()).join(", ")}, entre autres — méritent d'être présentées de façon nette et rassurante. C'est ce que fait ton site Xklic, en t'ancrant sur ${ville.name} et ses environs (${reperes2.join(", ")}).`,
    `De ${prest[0]?.toLowerCase() ?? "tes prestations"} aux autres services que tu rends, tout est mis en avant pour donner envie de te contacter. Ton site cible ${ville.name} et ses repères (${reperes2.join(", ")}) pour un référencement local solide.`,
  ];

  // P-E : promesse Xklic (toujours présent, légère variation)
  const pEVariants = [
    `Avec Xklic, ton site de ${metier.name.toLowerCase()} ${ville.prep} est en ligne en 2h : bouton d'appel, WhatsApp, formulaire de contact et fiche optimisée pour Google. 49€ à l'installation, 9,99€/mois, et c'est sans engagement.`,
    `Xklic s'occupe de tout : on conçoit ton site de ${metier.noun} ${ville.prep}, optimisé mobile et Google local, avec appel direct et WhatsApp. Tu n'as rien à installer. 49€ puis 9,99€/mois, résiliable quand tu veux.`,
    `Le principe Xklic est simple : un site pro de ${metier.name.toLowerCase()} ${ville.prep}, en ligne en 2h, qui te ramène des clients du secteur. Appel en un tap, WhatsApp, formulaire. 49€ à la création, 9,99€/mois, sans engagement.`,
  ];

  // P-F : confiance & preuve locale (avis, proximité, réactivité)
  const pFVariants = [
    `Un point compte plus que tout dans ce métier : la confiance. Les habitants ${depuisVille(ville)} veulent ${unMetier(metier)} du coin, joignable et bien noté, pas un numéro anonyme. Ton site rassemble tes avis, ta zone d'intervention et tes coordonnées au même endroit, pour lever les doutes avant même le premier appel. C'est souvent ce qui fait choisir un artisan plutôt qu'un autre, à prestation égale.`,
    `${capitalize(ville.name)} reste une ville où le bouche-à-oreille pèse lourd, mais il se prolonge désormais en ligne : avant de t'appeler, on vérifie que tu existes, que tu es bien noté et que tu interviens dans le secteur (${reperes2.join(", ")}). Un site soigné transforme cette vérification en réservation, au lieu de laisser filer le client vers un concurrent mieux référencé.`,
    `La proximité est un argument décisif ${ville.prep} : un client préfère ${unMetier(metier)} qui connaît la ville, ses ${reperes2[0] ? "quartiers comme " + reperes2[0].toLowerCase() : "rues"} et ses contraintes, à un prestataire venu de loin. Ton site met cet ancrage local en avant, avec avis clients, zone couverte et réactivité affichée — autant de signaux qui rassurent et déclenchent l'appel.`,
  ];

  // P-G : site vs dépendre uniquement du bouche-à-oreille
  const pGVariants = [
    `Trop ${metier.nounPlural} ${ville.prep} dépendent encore uniquement du bouche-à-oreille. Le problème : dès que les recommandations ralentissent, le planning se vide. Un site change la donne en te rendant visible 24h/24 auprès de tous ceux qui cherchent ${metier.name.toLowerCase()} ${ville.prep}, même ceux qui ne te connaissent pas encore.`,
    `Aujourd'hui, ne pas avoir de site ${ville.prep}, c'est être invisible pour la majorité des clients : ils cherchent sur Google et choisissent ce qu'ils trouvent. Un site pro te fait exister à ce moment précis, capter une demande que ton voisin laisse passer faute d'être en ligne.`,
    `Le téléphone qui sonne grâce à un client satisfait, c'est précieux — mais ça ne suffit plus ${ville.prep}. Les nouveaux clients, eux, te cherchent sur internet. Sans site, tu passes à côté de toute cette demande quotidienne ; avec un site Xklic, tu la captes au quotidien.`,
  ];

  const pA = pAVariants[r.int(pAVariants.length)];
  const pB = pBVariants[r.int(pBVariants.length)];
  const pC = pCVariants[r.int(pCVariants.length)];
  const pD = pDVariants[r.int(pDVariants.length)];
  const pE = pEVariants[r.int(pEVariants.length)];
  const pF = pFVariants[r.int(pFVariants.length)];
  const pG = pGVariants[r.int(pGVariants.length)];

  // ── Ordre structurel variable (plusieurs gabarits) ───────────────────────
  // pA (ancrage) ouvre toujours, pE (CTA) ferme toujours ; le milieu varie.
  // Le milieu pioche 4 bricks parmi {B,C,D,F,G} et les ordonne de façon variée,
  // ce qui multiplie encore les structures possibles tout en garantissant ≥300 mots.
  const middle = [pB, pC, pD, pF, pG];
  // permutation déterministe du milieu (Fisher-Yates piloté par le hash)
  for (let i = middle.length - 1; i > 0; i--) {
    const j = r.int(i + 1);
    const t = middle[i];
    middle[i] = middle[j];
    middle[j] = t;
  }

  const body = [pA, ...middle, pE];

  // ── Intentions de recherche couvertes (longue traîne locale) ─────────────
  const intentTemplates = [
    `${metier.noun} ${ville.name.toLowerCase()}`,
    `${metier.name.toLowerCase()} ${ville.prep}`,
    `${metier.noun} ${ville.deptCode}`,
    `${metier.name.toLowerCase()} pas cher ${ville.prep}`,
    `meilleur ${metier.noun} ${ville.name.toLowerCase()}`,
    `${metier.noun} proche ${reperes2[0]?.toLowerCase() ?? ville.name.toLowerCase()}`,
  ];
  // on garde un sous-ensemble varié mais on garantit les 2 intentions cœur
  const core = [intentTemplates[0], intentTemplates[1]];
  const extra = r.sample(intentTemplates.slice(2), 3);
  const intents = Array.from(new Set([...core, ...extra]));

  return { title, description, body, intents };
}

// ── Lookup helpers ─────────────────────────────────────────────────────────
export function getMetier(slug: string): Metier | undefined {
  return metiers.find((m) => m.slug === slug);
}

export function getVille(slug: string): Ville | undefined {
  return villes.find((v) => v.slug === slug);
}

export function metierSlugs(): string[] {
  return metiers.map((m) => m.slug);
}

export function villeSlugs(): string[] {
  return villes.map((v) => v.slug);
}

// ── Paires rédigées à la main (indexables) vs générées (noindex) ───────────
// Une paire est « rédigée main » si elle a une entrée dans handwrittenPairs.
// Sert à : (1) indexer uniquement ces paires, (2) ne mettre qu'elles au sitemap.
export function isHandwrittenPair(metierSlug: string, villeSlug: string): boolean {
  return Boolean(handwrittenPairs[`${metierSlug}-${villeSlug}`]);
}

// Les paires indexables, sous forme { metier, ville }, dérivées des clés.
export function handwrittenPairList(): { metier: string; ville: string }[] {
  return Object.keys(handwrittenPairs).map((key) => {
    // clé = `${metierSlug}-${villeSlug}` ; le villeSlug est un slug simple
    // (pas de tiret interne pour nos villes ? si, ex. "saint-denis").
    // On résout en cherchant le métier connu qui préfixe la clé.
    const metier = metiers.find((m) => key.startsWith(`${m.slug}-`));
    const ville = metier ? key.slice(metier.slug.length + 1) : "";
    return { metier: metier ? metier.slug : "", ville };
  });
}

// Pratique pour le pré-rendu : toutes les paires (slug, slug).
export function allPairs(): { metier: string; ville: string }[] {
  const out: { metier: string; ville: string }[] = [];
  for (const m of metiers) {
    for (const v of villes) {
      out.push({ metier: m.slug, ville: v.slug });
    }
  }
  return out;
}
