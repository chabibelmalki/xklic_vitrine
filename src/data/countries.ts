// Liste de pays : nom français + code ISO 3166-1 alpha-2.
//   • le `code` sert au pré-remplissage depuis l'en-tête géo IP de Vercel
//     (`x-vercel-ip-country`, en majuscules) ;
//   • le `name` est la valeur RÉELLEMENT stockée dans le lead et affichée dans
//     le <select> (le back-office lit du texte lisible, pas un code).
// Ordre : marchés cibles francophones/limitrophes d'abord, puis le reste par
// ordre alphabétique.
export type Country = { code: string; name: string };

export const COUNTRIES: Country[] = [
  // Marchés prioritaires
  { code: "FR", name: "France" },
  { code: "BE", name: "Belgique" },
  { code: "CH", name: "Suisse" },
  { code: "LU", name: "Luxembourg" },
  { code: "CA", name: "Canada" },
  { code: "MC", name: "Monaco" },
  { code: "MA", name: "Maroc" },
  { code: "DZ", name: "Algérie" },
  { code: "TN", name: "Tunisie" },
  { code: "SN", name: "Sénégal" },
  { code: "CI", name: "Côte d'Ivoire" },

  // Reste du monde (alphabétique)
  { code: "DE", name: "Allemagne" },
  { code: "AD", name: "Andorre" },
  { code: "AO", name: "Angola" },
  { code: "SA", name: "Arabie saoudite" },
  { code: "AR", name: "Argentine" },
  { code: "AU", name: "Australie" },
  { code: "AT", name: "Autriche" },
  { code: "BJ", name: "Bénin" },
  { code: "BR", name: "Brésil" },
  { code: "BG", name: "Bulgarie" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodge" },
  { code: "CM", name: "Cameroun" },
  { code: "CL", name: "Chili" },
  { code: "CN", name: "Chine" },
  { code: "CY", name: "Chypre" },
  { code: "CO", name: "Colombie" },
  { code: "KM", name: "Comores" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo (RDC)" },
  { code: "KR", name: "Corée du Sud" },
  { code: "HR", name: "Croatie" },
  { code: "DK", name: "Danemark" },
  { code: "DJ", name: "Djibouti" },
  { code: "EG", name: "Égypte" },
  { code: "AE", name: "Émirats arabes unis" },
  { code: "ES", name: "Espagne" },
  { code: "EE", name: "Estonie" },
  { code: "US", name: "États-Unis" },
  { code: "FI", name: "Finlande" },
  { code: "GA", name: "Gabon" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Grèce" },
  { code: "GN", name: "Guinée" },
  { code: "GQ", name: "Guinée équatoriale" },
  { code: "HT", name: "Haïti" },
  { code: "HU", name: "Hongrie" },
  { code: "IN", name: "Inde" },
  { code: "ID", name: "Indonésie" },
  { code: "IE", name: "Irlande" },
  { code: "IS", name: "Islande" },
  { code: "IL", name: "Israël" },
  { code: "IT", name: "Italie" },
  { code: "JP", name: "Japon" },
  { code: "JO", name: "Jordanie" },
  { code: "KE", name: "Kenya" },
  { code: "LB", name: "Liban" },
  { code: "LV", name: "Lettonie" },
  { code: "LT", name: "Lituanie" },
  { code: "MG", name: "Madagascar" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malte" },
  { code: "MU", name: "Maurice" },
  { code: "MR", name: "Mauritanie" },
  { code: "MX", name: "Mexique" },
  { code: "MD", name: "Moldavie" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigéria" },
  { code: "NO", name: "Norvège" },
  { code: "NZ", name: "Nouvelle-Zélande" },
  { code: "NL", name: "Pays-Bas" },
  { code: "PL", name: "Pologne" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "CF", name: "République centrafricaine" },
  { code: "CZ", name: "République tchèque" },
  { code: "RO", name: "Roumanie" },
  { code: "GB", name: "Royaume-Uni" },
  { code: "RU", name: "Russie" },
  { code: "RW", name: "Rwanda" },
  { code: "SC", name: "Seychelles" },
  { code: "SG", name: "Singapour" },
  { code: "SK", name: "Slovaquie" },
  { code: "SI", name: "Slovénie" },
  { code: "SE", name: "Suède" },
  { code: "TD", name: "Tchad" },
  { code: "TH", name: "Thaïlande" },
  { code: "TG", name: "Togo" },
  { code: "TR", name: "Turquie" },
  { code: "UA", name: "Ukraine" },
  { code: "VN", name: "Viêt Nam" },
];

// Nom par défaut si l'IP est inconnue / non couverte.
export const DEFAULT_COUNTRY = "France";

// Résout un nom de pays (valeur du formulaire) depuis un code ISO alpha-2
// (ex. en-tête `x-vercel-ip-country`). Insensible à la casse. Renvoie undefined
// si le code est absent ou hors liste — l'appelant décide du repli.
export function countryNameFromCode(code?: string | null): string | undefined {
  if (!code) return undefined;
  const up = code.trim().toUpperCase();
  return COUNTRIES.find((c) => c.code === up)?.name;
}
