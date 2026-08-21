import React from "react";
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  EmailDivider,
  InfoBox,
} from "../components";

export interface SubscriptionExpiredProps {
  userName: string;
  radioName: string;
  planName: string;
  expiredDate: string;
  reason: "payment_failed" | "cancelled" | "expired";
  billingUrl: string;
  gracePeriodDays?: number;
}

export function SubscriptionExpired({
  userName,
  radioName,
  planName,
  expiredDate,
  reason,
  billingUrl,
  gracePeriodDays,
}: SubscriptionExpiredProps) {
  const titles: Record<string, string> = {
    payment_failed: "Échec de paiement",
    cancelled: "Abonnement annulé",
    expired: "Abonnement expiré",
  };

  const messages: Record<string, string> = {
    payment_failed: `Le paiement pour votre abonnement ${planName} a échoué. Veuillez mettre à jour votre moyen de paiement pour éviter une interruption de service.`,
    cancelled: `Votre abonnement ${planName} a été annulé. Votre radio restera accessible jusqu'à la fin de la période de facturation.`,
    expired: `Votre abonnement ${planName} pour ${radioName} a expiré. Certaines fonctionnalités ont été désactivées.`,
  };

  return (
    <EmailLayout
      previewText={`${titles[reason]} — ${radioName} : action requise`}
    >
      <EmailHeader />

      <tr>
        <td style={{ backgroundColor: colors.white, padding: "40px" }}>
          <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
            <tbody>
              {/* Warning Icon */}
              <tr>
                <td align="center" style={{ paddingBottom: "24px" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      backgroundColor: "#FEE2E2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px",
                    }}
                  >
                    {reason === "payment_failed" ? "💳" : reason === "cancelled" ? "🚫" : "⏰"}
                  </div>
                </td>
              </tr>

              {/* Title */}
              <tr>
                <td align="center">
                  <h1
                    style={{
                      margin: "0 0 8px",
                      fontSize: "24px",
                      fontWeight: "700",
                      color: colors.gray900,
                      textAlign: "center",
                    }}
                  >
                    {titles[reason]}
                  </h1>
                  <p
                    style={{
                      margin: "0 0 24px",
                      fontSize: "16px",
                      color: colors.gray600,
                      lineHeight: "1.6",
                      textAlign: "center",
                    }}
                  >
                    Bonjour {userName},
                    <br />
                    {messages[reason]}
                  </p>
                </td>
              </tr>

              {/* Info Card */}
              <tr>
                <td>
                  <table
                    role="presentation"
                    cellPadding={0}
                    cellSpacing={0}
                    border={0}
                    width="100%"
                    style={{
                      backgroundColor: "#FEF2F2",
                      borderRadius: "12px",
                      border: "1px solid #FECACA",
                      padding: "20px 24px",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "13px",
                                    color: colors.gray500,
                                    paddingBottom: "8px",
                                  }}
                                >
                                  Radio
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    fontSize: "14px",
                                    color: colors.gray900,
                                    fontWeight: "500",
                                    paddingBottom: "8px",
                                  }}
                                >
                                  {radioName}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "13px",
                                    color: colors.gray500,
                                    paddingBottom: "8px",
                                  }}
                                >
                                  Plan
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    fontSize: "14px",
                                    color: colors.gray900,
                                    fontWeight: "500",
                                    paddingBottom: "8px",
                                  }}
                                >
                                  {planName}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "13px",
                                    color: colors.gray500,
                                  }}
                                >
                                  Date
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    fontSize: "14px",
                                    color: colors.gray900,
                                    fontWeight: "500",
                                  }}
                                >
                                  {expiredDate}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Grace Period Notice */}
              {gracePeriodDays && gracePeriodDays > 0 && (
                <tr>
                  <td style={{ padding: "24px 0 0" }}>
                    <InfoBox color="#D97706">
                      <strong>Période de grâce :</strong> Vos données sont conservées pendant{" "}
                      {gracePeriodDays} jours. Réactivez votre abonnement avant cette date pour
                      conserver tous vos podcasts, messages et statistiques.
                    </InfoBox>
                  </td>
                </tr>
              )}

              {/* CTA */}
              <tr>
                <td align="center" style={{ padding: "32px 0" }}>
                  <table role="presentation" cellPadding={0} cellSpacing={0} border={0}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            borderRadius: "8px",
                            backgroundColor: colors.primary,
                          }}
                        >
                          <a
                            href={billingUrl}
                            style={{
                              display: "inline-block",
                              padding: "14px 32px",
                              fontSize: "16px",
                              fontWeight: "600",
                              color: colors.white,
                              textDecoration: "none",
                              borderRadius: "8px",
                            }}
                          >
                            {reason === "payment_failed"
                              ? "Mettre à jour mon paiement →"
                              : "Réactiver mon abonnement →"}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <EmailDivider />

              {/* What's affected */}
              <tr>
                <td>
                  <h2
                    style={{
                      margin: "0 0 12px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: colors.gray900,
                    }}
                  >
                    Fonctionnalités affectées
                  </h2>
                  <p
                    style={{
                      margin: "0 0 12px",
                      fontSize: "14px",
                      color: colors.gray600,
                      lineHeight: "1.6",
                    }}
                  >
                    Avec le plan Starter (gratuit), vous conservez :
                  </p>
                  <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
                    <tbody>
                      {[
                        { text: "1 radio", available: true },
                        { text: "Streaming basique", available: true },
                        { text: "100 auditeurs max", available: true },
                        { text: "5 podcasts / mois", available: true },
                        { text: "Analytics avancés", available: false },
                        { text: "Publicités", available: false },
                        { text: "Podcasts illimités", available: false },
                      ].map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              padding: "6px 0",
                              fontSize: "14px",
                              color: item.available ? colors.gray700 : colors.gray500,
                            }}
                          >
                            <span
                              style={{
                                color: item.available ? "#059669" : "#DC2626",
                                marginRight: "8px",
                              }}
                            >
                              {item.available ? "✓" : "✗"}
                            </span>
                            {item.text}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Support */}
              <tr>
                <td style={{ padding: "24px 0 0" }}>
                  <InfoBox>
                    <strong>Besoin d&apos;aide ?</strong> Si vous rencontrez des difficultés avec
                    le paiement, contactez notre{" "}
                    <a href="#" style={{ color: colors.primary, textDecoration: "none" }}>
                      support
                    </a>{" "}
                    — nous sommes là pour vous aider.
                  </InfoBox>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>

      <EmailFooter radioName={radioName} />
    </EmailLayout>
  );
}

const colors = {
  primary: "#2563EB",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray900: "#111827",
  white: "#FFFFFF",
};
