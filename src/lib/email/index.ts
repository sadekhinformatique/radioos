// Email utilities — types, sender, and template registry
// The actual render functions live in ./render.ts (server-only)

export type { WelcomeEmailProps } from "./templates/welcome";
export type { PasswordResetEmailProps } from "./templates/password-reset";
export type { SubscriptionWelcomeProps } from "./templates/subscription-welcome";
export type { SubscriptionRenewalProps } from "./templates/subscription-renewal";
export type { PaymentReceiptProps } from "./templates/payment-receipt";
export type { SubscriptionExpiredProps } from "./templates/subscription-expired";

// ============================================
// Email Sender
// ============================================

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  // Dev mode — log instead of sending
  console.log("📧 Email (dev mode):", {
    to: options.to,
    subject: options.subject,
    htmlLength: options.html.length,
  });

  return { success: true };
}
