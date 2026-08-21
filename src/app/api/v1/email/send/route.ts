import { NextRequest } from "next/server";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api/response";
import { requireAdmin } from "@/lib/api/auth";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

const sendEmailSchema = z.discriminatedUnion("template", [
  z.object({
    template: z.literal("welcome"),
    to: z.string().email(),
    data: z.object({
      userName: z.string(),
      radioName: z.string().optional(),
      loginUrl: z.string().url(),
      dashboardUrl: z.string().url(),
    }),
  }),
  z.object({
    template: z.literal("passwordReset"),
    to: z.string().email(),
    data: z.object({
      userName: z.string(),
      resetUrl: z.string().url(),
      expiresAt: z.string(),
      ipAddress: z.string().optional(),
      deviceInfo: z.string().optional(),
    }),
  }),
  z.object({
    template: z.literal("subscriptionWelcome"),
    to: z.string().email(),
    data: z.object({
      userName: z.string(),
      radioName: z.string(),
      planName: z.string(),
      planPrice: z.number(),
      currency: z.string(),
      billingCycle: z.enum(["monthly", "annual"]),
      nextBillingDate: z.string(),
      dashboardUrl: z.string().url(),
      paymentMethod: z.string(),
      features: z.array(z.string()),
    }),
  }),
  z.object({
    template: z.literal("paymentReceipt"),
    to: z.string().email(),
    data: z.object({
      userName: z.string(),
      radioName: z.string(),
      invoiceId: z.string(),
      invoiceDate: z.string(),
      planName: z.string(),
      amount: z.number(),
      currency: z.string(),
      tax: z.number(),
      total: z.number(),
      paymentMethod: z.string(),
      paymentReference: z.string(),
      nextBillingDate: z.string().optional(),
    }),
  }),
]);

function generateEmailHtml(template: string, data: Record<string, unknown>): string {
  // Inline HTML generation — avoids react-dom/server import issue with Turbopack
  const baseStyles = `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; }
      .header { background-color: #2563EB; border-radius: 12px 12px 0 0; padding: 32px 40px; text-align: center; }
      .header h1 { color: #fff; font-size: 24px; margin: 0; }
      .body { background-color: #fff; padding: 40px; }
      .footer { background-color: #F9FAFB; border-radius: 0 0 12px 12px; padding: 32px 40px; text-align: center; border-top: 1px solid #E5E7EB; }
      .btn { display: inline-block; padding: 14px 32px; background-color: #2563EB; color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; }
      .btn-danger { background-color: #DC2626; }
      .divider { border-top: 1px solid #E5E7EB; margin: 24px 0; }
      .info-box { padding: 16px 20px; background-color: #EFF6FF; border-left: 4px solid #2563EB; border-radius: 0 8px 8px 0; font-size: 14px; color: #374151; line-height: 1.6; }
      .info-warning { background-color: #FEF3C7; border-left-color: #D97706; }
      .info-danger { background-color: #FEE2E2; border-left-color: #DC2626; }
      table { border-collapse: collapse; }
      td, th { padding: 8px 0; }
      .text-muted { color: #6B7280; font-size: 13px; }
      .text-center { text-align: center; }
    </style>`;

  const header = `
    <div class="container">
      <div class="header">
        <h1>🎙️ RadioOS</h1>
      </div>
      <div class="body">`;

  const footer = `
      </div>
      <div class="footer">
        <p style="margin:0 0 8px;font-size:14px;color:#6B7280;">RadioOS — Le système d'exploitation numérique des radios</p>
        <p style="margin:0;font-size:12px;color:#6B7280;">© 2026 RadioOS. Tous droits réservés.</p>
      </div>
    </div>`;

  let content = "";

  switch (template) {
    case "welcome": {
      const d = data as { userName: string; radioName?: string; dashboardUrl: string };
      content = `
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">Bienvenue, ${d.userName} ! 🎙️</h1>
        <p style="margin:0 0 24px;font-size:16px;color:#4B5563;line-height:1.6;">
          Votre compte RadioOS est maintenant actif.
          ${d.radioName ? ` Votre radio "${d.radioName}" est prête à être configurée.` : ""}
        </p>
        <div class="text-center" style="padding:8px 0 32px;">
          <a href="${d.dashboardUrl}" class="btn">Accéder à mon dashboard →</a>
        </div>
        <div class="divider"></div>
        <h2 style="font-size:18px;font-weight:600;color:#111827;">Prochaines étapes</h2>
        <table width="100%"><tr><td style="padding:12px 0;font-size:14px;color:#374151;">
          <strong>1. Configurez votre profil radio</strong> — Logo, description, liens sociaux<br>
          <strong>2. Connectez votre flux audio</strong> — Icecast, Shoutcast, HLS<br>
          <strong>3. Invitez votre équipe</strong> — Présentateurs, producteurs, admins
        </td></tr></table>
        <div class="info-box">
          <strong>Besoin d'aide ?</strong> Répondez à cet email ou contactez notre support.
        </div>`;
      break;
    }
    case "passwordReset": {
      const d = data as { userName: string; resetUrl: string; expiresAt: string; ipAddress?: string };
      content = `
        <div class="text-center" style="padding-bottom:24px;font-size:48px;">🔒</div>
        <h1 class="text-center" style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">Réinitialisation du mot de passe</h1>
        <p class="text-center" style="margin:0 0 24px;font-size:16px;color:#4B5563;line-height:1.6;">
          Bonjour ${d.userName},<br>Vous avez demandé à réinitialiser votre mot de passe.
        </p>
        <div class="text-center" style="padding:8px 0 24px;">
          <a href="${d.resetUrl}" class="btn">Réinitialiser mon mot de passe</a>
        </div>
        <p class="text-center text-muted">⏰ Ce lien expire le ${new Date(d.expiresAt).toLocaleDateString("fr-FR")}</p>
        <div class="divider"></div>
        ${d.ipAddress ? `<p class="text-muted">Adresse IP : ${d.ipAddress}</p>` : ""}
        <div class="info-box info-danger">
          <strong>Vous n'avez pas demandé cette réinitialisation ?</strong> Ignorez cet email. Votre mot de passe reste inchangé.
        </div>`;
      break;
    }
    case "subscriptionWelcome": {
      const d = data as { userName: string; radioName: string; planName: string; planPrice: number; currency: string; nextBillingDate: string; paymentMethod: string; features: string[] };
      content = `
        <div class="text-center" style="padding-bottom:24px;font-size:48px;">✅</div>
        <h1 class="text-center" style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">Abonnement confirmé !</h1>
        <p class="text-center" style="margin:0 0 24px;font-size:16px;color:#4B5563;line-height:1.6;">
          Bonjour ${d.userName},<br>Votre abonnement <strong>${d.planName}</strong> pour <strong>${d.radioName}</strong> est actif.
        </p>
        <div style="background-color:#F9FAFB;border-radius:12px;border:1px solid #E5E7EB;padding:24px;margin-bottom:24px;">
          <table width="100%"><tr>
            <td><span class="text-muted" style="text-transform:uppercase;letter-spacing:0.5px;">Plan</span><br><strong style="color:#2563EB;font-size:20px;">${d.planName}</strong></td>
            <td align="right"><span class="text-muted" style="text-transform:uppercase;letter-spacing:0.5px;">Montant</span><br><strong style="font-size:20px;">${new Intl.NumberFormat("fr-FR").format(d.planPrice)} ${d.currency}</strong></td>
          </tr></table>
          <div class="divider"></div>
          <table width="100%"><tr><td class="text-muted">Prochaine facturation</td><td align="right" style="color:#374151;font-weight:500;">${d.nextBillingDate}</td></tr>
          <tr><td class="text-muted">Paiement</td><td align="right" style="color:#374151;font-weight:500;">${d.paymentMethod}</td></tr></table>
        </div>
        <div class="text-center" style="padding:8px 0 24px;">
          <a href="#" class="btn">Accéder à mon dashboard →</a>
        </div>
        <div class="divider"></div>
        <h2 style="font-size:18px;font-weight:600;color:#111827;">🎉 Fonctionnalités incluses</h2>
        <table width="100%">${d.features.map((f) => `<tr><td style="padding:6px 0;font-size:14px;color:#374151;">✓ ${f}</td></tr>`).join("")}</table>`;
      break;
    }
    case "paymentReceipt": {
      const d = data as { userName: string; radioName: string; invoiceId: string; invoiceDate: string; planName: string; amount: number; currency: string; tax: number; total: number; paymentMethod: string; paymentReference: string };
      const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
      content = `
        <div class="text-center" style="padding-bottom:24px;font-size:48px;">💰</div>
        <h1 class="text-center" style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">Paiement reçu</h1>
        <p class="text-center" style="margin:0 0 24px;font-size:16px;color:#4B5563;line-height:1.6;">
          Bonjour ${d.userName},<br>Votre paiement pour <strong>${d.radioName}</strong> a été traité avec succès.
        </p>
        <div style="background-color:#F9FAFB;border-radius:12px;border:1px solid #E5E7EB;padding:24px;margin-bottom:24px;">
          <table width="100%"><tr>
            <td><span class="text-muted">Facture</span><br><strong style="font-family:monospace;">${d.invoiceId}</strong></td>
            <td align="right"><span class="text-muted">Date</span><br>${d.invoiceDate}</td>
          </tr></table>
          <div class="divider"></div>
          <table width="100%">
            <tr><td style="color:#4B5563;">${d.planName}</td><td align="right">${fmt(d.amount)} ${d.currency}</td></tr>
            <tr><td style="color:#4B5563;">TVA (0%)</td><td align="right">${fmt(d.tax)} ${d.currency}</td></tr>
          </table>
          <div style="border-top:2px solid #D1D5DB;margin-top:12px;padding-top:12px;">
            <table width="100%"><tr>
              <td><strong style="font-size:16px;">Total payé</strong></td>
              <td align="right"><strong style="font-size:20px;color:#2563EB;">${fmt(d.total)} ${d.currency}</strong></td>
            </tr></table>
          </div>
          <div class="divider"></div>
          <table width="100%">
            <tr><td class="text-muted">Paiement</td><td align="right" style="color:#374151;">${d.paymentMethod}</td></tr>
            <tr><td class="text-muted">Référence</td><td align="right" style="color:#374151;font-family:monospace;">${d.paymentReference}</td></tr>
          </table>
        </div>
        <div class="info-box">
          <strong>Prochaine facturation :</strong> Consultez votre historique de paiements pour télécharger la facture PDF.
        </div>`;
      break;
    }
    default:
      content = `<p>Template non reconnu</p>`;
  }

  return `<!DOCTYPE html><html><head>${baseStyles}</head><body>${header}${content}${footer}</body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return apiUnauthorized("Seuls les administrateurs peuvent envoyer des emails");
    }

    const body = await request.json();
    const validation = sendEmailSchema.safeParse(body);

    if (!validation.success) {
      return apiError("Données invalides", 400);
    }

    const { template, to, data } = validation.data;

    const subjects: Record<string, string> = {
      welcome: `Bienvenue sur RadioOS ! 🎙️`,
      passwordReset: "Réinitialisation de votre mot de passe RadioOS",
      subscriptionWelcome: `Votre abonnement ${(data as Record<string, unknown>).planName || ""} est actif`,
      paymentReceipt: `Paiement reçu — ${(data as Record<string, unknown>).invoiceId || ""}`,
    };

    const html = generateEmailHtml(template, data as Record<string, unknown>);
    const subject = subjects[template] || "RadioOS";

    const result = await sendEmail({ to, subject, html });

    if (!result.success) {
      return apiError("Erreur lors de l'envoi de l'email", 500, result.error);
    }

    return apiSuccess({
      message: "Email envoyé avec succès",
      to,
      subject,
      template,
    });
  } catch {
    return apiError("Erreur serveur", 500);
  }
}
