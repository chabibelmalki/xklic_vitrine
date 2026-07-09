"use client";

import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { LeadValues } from "@/lib/lead-schema";

// Brouillon du tunnel conservé le temps de la session (onglet) : un rechargement
// ou un retour navigateur ne doit plus effacer ce que le visiteur a saisi. On
// utilise sessionStorage (et non localStorage) — c'est un panier en cours, lié à
// l'onglet, et il se nettoie tout seul à la fermeture.
const KEY = "xklic:lead-draft:v1";

type Draft = { step: number; values: Partial<LeadValues> };

// Retire tout ce qui n'est pas sérialisable AVANT d'écrire dans le storage :
// - `file` = File brut, `url` = objectURL d'aperçu (blob:…) : ni l'un ni l'autre
//   ne survit à un rechargement de page. On vide donc les bacs d'images ; le
//   visiteur re-déposera ses fichiers si besoin (le reste — texte, choix — est
//   préservé).
// - `turnstileToken` : jeton anti-robot éphémère, à re-résoudre à chaque fois.
function serialisable(values: LeadValues): Partial<LeadValues> {
  return {
    ...values,
    logo: [],
    photos: [],
    products: (values.products ?? []).map((p) => ({ ...p, photos: [] })),
    turnstileToken: undefined,
  };
}

function save(step: number, values: LeadValues) {
  try {
    const draft: Draft = { step, values: serialisable(values) };
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // storage indisponible (mode privé strict, quota) : on ignore silencieusement.
  }
}

// À appeler quand le brouillon n'a plus lieu d'être (commande envoyée) pour ne
// pas ressusciter d'anciennes données lors d'une prochaine visite du tunnel.
export function clearLeadDraft() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // idem : storage indisponible, rien à nettoyer.
  }
}

// Restaure le brouillon au montage, puis le sauvegarde à chaque changement de
// valeur ou d'étape. `setStep` sert à replacer le visiteur sur la bonne étape.
export function useLeadDraft(
  methods: UseFormReturn<LeadValues>,
  step: number,
  setStep: (n: number) => void,
) {
  const restored = useRef(false);

  // 1. Restauration — une seule fois, au premier rendu client.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Draft;
      if (draft?.values) {
        // On fusionne par-dessus les valeurs par défaut (et surtout par-dessus
        // `initialFormule`/`initialBoutique` déjà appliqués) : le brouillon prime.
        methods.reset(
          { ...methods.getValues(), ...draft.values },
          { keepDefaultValues: true },
        );
      }
      if (typeof draft?.step === "number") setStep(draft.step);
    } catch {
      // JSON corrompu / storage indisponible : on repart d'un formulaire vierge.
    }
  }, [methods, setStep]);

  // 2. Sauvegarde — à chaque changement de champ (watch) et à chaque changement
  //    d'étape (dépendance `step` de l'effet → sauvegarde immédiate au montage
  //    et à chaque transition d'étape).
  useEffect(() => {
    // La restauration (effet 1) tourne avant cet effet au premier rendu, donc
    // `getValues()` renvoie déjà le brouillon restauré : pas d'écrasement.
    save(step, methods.getValues());
    const sub = methods.watch((values) => save(step, values as LeadValues));
    return () => sub.unsubscribe();
  }, [methods, step]);
}
