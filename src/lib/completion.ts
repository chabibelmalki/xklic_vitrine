import type { DossierByRef } from "./backoffice";
import { impliesServices } from "./lead-schema";
import type { CompletionInitial } from "@/components/form/completion-form";

// Construit les valeurs de préremplissage + les drapeaux d'affichage de la page
// de complétion à partir d'un dossier. Partagé par le rendu server de /merci
// (chemin rapide, dossier déjà payé) et l'endpoint de poll /api/completion-status.
// Server-only de fait : jamais importé par un composant client (les types le sont,
// mais ils sont effacés à la compilation).

const fileName = (url: string): string => {
  try {
    return decodeURIComponent(url.split("/").pop()?.split("?")[0] ?? "image");
  } catch {
    return "image";
  }
};

export interface CompletionPrefill {
  initial: CompletionInitial;
  showDescription: boolean;
  hasSiret: boolean;
  companyName: string;
}

export function buildCompletionPrefill(dossier: DossierByRef): CompletionPrefill {
  return {
    initial: {
      description: dossier.prestations,
      logo: dossier.logoUrls.map((url) => ({ name: fileName(url), url })),
      photos: dossier.photoUrls.map((url) => ({ name: fileName(url), url })),
      colorPreference: dossier.couleurs,
      ambiance: dossier.ambiance,
      socials: dossier.socials,
      languages: dossier.langues,
      noWhatsapp: !dossier.whatsapp,
      siret: dossier.siret,
    },
    showDescription: impliesServices(dossier.typeActivite),
    hasSiret: dossier.siret.trim() !== "",
    companyName: dossier.entreprise,
  };
}
