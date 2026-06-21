import "server-only";

// ─────────────────────────────────────────────────────────────────────────
// Envoi d'e-mails transactionnels via Resend (même principe que le moteur,
// ../agence_website : src/app/api/contact/route.ts).
//
// Deux usages dans ce site :
//   • Notifier contact@xklic.com à chaque paiement confirmé (webhook Stripe).
//   • Livrer les messages du formulaire de contact (/api/contact).
//
// Expéditeur : RESEND_FROM (domaine xklic.com vérifié chez Resend), défaut
// « Xklic <notifications@xklic.com> ». Destinataire par défaut : LEAD_TO,
// défaut contact@xklic.com. Tout est CÔTÉ SERVEUR.
//
// Best-effort : ne jette jamais, renvoie un booléen. Si RESEND_API_KEY est
// absent (dev), on log et on renvoie false sans casser le parcours. Le SDK
// est importé dynamiquement (pas embarqué dans le bundle si jamais appelé).
// ─────────────────────────────────────────────────────────────────────────

const DEFAULT_FROM = "Xklic <notifications@xklic.com>";
const DEFAULT_TO = "contact@xklic.com";

export interface MailInput {
  subject: string;
  html: string;
  text: string;
  to?: string; // défaut : LEAD_TO ou contact@xklic.com
  replyTo?: string;
}

export async function sendMail(mail: MailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim() || DEFAULT_FROM;
  const to = mail.to?.trim() || process.env.LEAD_TO?.trim() || DEFAULT_TO;

  if (!apiKey) {
    console.info(
      `[email] RESEND_API_KEY absent — e-mail non envoyé.\nÀ : ${to}\nObjet : ${mail.subject}\n${mail.text}`,
    );
    return false;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: mail.replyTo || undefined,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) {
      console.error("[email] Resend a renvoyé une erreur :", error.message ?? error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Envoi échoué :", err);
    return false;
  }
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Construit un e-mail (texte + HTML) aux couleurs Xklic à partir d'une liste de
 * lignes « Libellé : valeur ». Les lignes vides/absentes sont ignorées.
 * `message`, optionnel, est rendu dans un bloc à part (multi-lignes préservées).
 */
export function buildEmail(opts: {
  title: string;
  rows: Array<[string, string | null | undefined]>;
  message?: string | null;
  footer?: string;
}): { html: string; text: string } {
  const rows = opts.rows.filter(([, v]) => v != null && String(v).trim() !== "") as Array<
    [string, string]
  >;

  const textLines = rows.map(([k, v]) => `${k} : ${v}`);
  if (opts.message?.trim()) {
    textLines.push("", "Message :", opts.message.trim());
  }
  const text = [opts.title, "", ...textLines, "", opts.footer ?? ""]
    .join("\n")
    .trim();

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6a6055;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(
          k,
        )}</td><td style="padding:6px 0;color:#1b1611;font-size:14px;font-weight:500">${escapeHtml(
          v,
        )}</td></tr>`,
    )
    .join("");

  const messageBlock = opts.message?.trim()
    ? `<div style="margin-top:18px;padding:16px;background:#f3ece1;border-radius:12px">
         <div style="color:#6a6055;font-size:12px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Message</div>
         <div style="color:#1b1611;font-size:14px;line-height:1.6;white-space:pre-line">${escapeHtml(
           opts.message.trim(),
         )}</div>
       </div>`
    : "";

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:8px">
    <div style="background:#faf6f0;border:1px solid rgba(27,22,17,.1);border-radius:20px;padding:28px 24px">
      <div style="font-size:13px;font-weight:700;letter-spacing:.04em;color:#e5431f">XKLIC</div>
      <h1 style="font-size:20px;line-height:1.25;color:#1b1611;margin:8px 0 18px">${escapeHtml(
        opts.title,
      )}</h1>
      <table style="border-collapse:collapse;width:100%">${htmlRows}</table>
      ${messageBlock}
      ${
        opts.footer
          ? `<p style="color:#9c9286;font-size:12px;margin:20px 0 0">${escapeHtml(opts.footer)}</p>`
          : ""
      }
    </div>
  </div>`;

  return { html, text };
}
