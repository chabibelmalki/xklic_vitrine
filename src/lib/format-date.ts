// Formatage de date FR déterministe pour le blog. On parse une chaîne ISO
// codée en dur (ex. "2026-04-15") — pas de Date.now()/new Date() sur l'horloge
// courante, donc rendu stable au build comme au runtime.
const MONTHS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/** "2026-04-15" → "15 avril 2026". */
export function formatArticleDate(iso: string): string {
  const [year, month, day] = iso.split("-").map((n) => parseInt(n, 10));
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS_FR[month - 1]} ${year}`;
}
