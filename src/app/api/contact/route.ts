import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { sendMail, buildEmail } from "@/lib/email";

export const runtime = "nodejs";

// Réception du formulaire de contact public. Validation server-side, honeypot
// anti-bot, puis envoi e-mail via Resend (même principe que le webhook et le
// moteur). Repli gracieux en dev : si Resend n'est pas configuré, on log et on
// renvoie OK pour ne pas casser le parcours.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Formulaire invalide.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const data = parsed.data;

  // Honeypot rempli → bot : on ignore silencieusement (succès simulé).
  if (data.company && data.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { html, text } = buildEmail({
    title: "Nouveau message du formulaire de contact",
    rows: [
      ["Nom", data.name],
      ["E-mail", data.email],
      ["Téléphone", data.phone],
    ],
    message: data.message,
    footer: "Réponds directement à cet e-mail pour recontacter la personne.",
  });

  const sent = await sendMail({
    subject: `✉️ Contact — ${data.name}`,
    html,
    text,
    replyTo: data.email,
  });

  // En dev (pas de RESEND_API_KEY) sendMail renvoie false mais a loggé le
  // message : on considère le parcours OK. En prod, un échec réel reste OK côté
  // visiteur (le message est loggé) — on évite de bloquer l'UX sur Resend.
  if (!sent) {
    console.info("[contact] message non envoyé par e-mail (voir log ci-dessus).");
  }
  return NextResponse.json({ ok: true });
}
