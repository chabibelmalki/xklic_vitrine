import { z } from "zod";

// Messages de validation du formulaire de contact. Résolus par une fonction
// `m(key)` : côté serveur on passe les libellés FR par défaut, côté client on
// passe les traductions (namespace `contact.form.errors`).
export type ContactMessages = (key: string) => string;

const FR_MESSAGES: Record<string, string> = {
  nameMin: "Indique ton nom.",
  emailRequired: "Ton email est nécessaire.",
  emailInvalid: "Cet email ne semble pas valide.",
  messageShort: "Ton message est un peu court.",
  messageLong: "Ton message est trop long.",
};

// Schéma du formulaire de contact public (/contact → /api/contact).
// `company` est un honeypot anti-bot : invisible, doit rester vide.
export function makeContactSchema(m: ContactMessages = (k) => FR_MESSAGES[k]) {
  return z.object({
    name: z.string().trim().min(2, m("nameMin")),
    email: z
      .string()
      .trim()
      .min(1, m("emailRequired"))
      .email(m("emailInvalid")),
    phone: z.string().trim().max(30).optional(),
    message: z
      .string()
      .trim()
      .min(10, m("messageShort"))
      .max(4000, m("messageLong")),
    // Honeypot — laissé vide par les humains.
    company: z.string().optional(),
    // Jeton Cloudflare Turnstile (anti-robot), vérifié côté serveur.
    turnstileToken: z.string().optional(),
  });
}

// Schéma par défaut (messages FR) — utilisé côté serveur (/api/contact).
export const contactSchema = makeContactSchema();

export type ContactValues = z.infer<typeof contactSchema>;
