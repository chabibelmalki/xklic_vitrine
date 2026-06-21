import { z } from "zod";

// Schéma du formulaire de contact public (/contact → /api/contact).
// `company` est un honeypot anti-bot : invisible, doit rester vide.
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indique ton nom."),
  email: z
    .string()
    .trim()
    .min(1, "Ton email est nécessaire.")
    .email("Cet email ne semble pas valide."),
  phone: z.string().trim().max(30).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Ton message est un peu court.")
    .max(4000, "Ton message est trop long."),
  // Honeypot — laissé vide par les humains.
  company: z.string().optional(),
  // Jeton Cloudflare Turnstile (anti-robot), vérifié côté serveur.
  turnstileToken: z.string().optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;
