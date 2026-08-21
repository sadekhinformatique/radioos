import React from "react";
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  EmailDivider,
  InfoBox,
} from "../components";

export interface SubscriptionRenewalProps {
  userName: string;
  radioName: string;
  planName: string;
  planPrice: number;
  currency: string;
  renewalDate: string;
  daysUntilRenewal: number;
  billingUrl: string;
  paymentMethod: string;
  cardLast4?: string;
}

export function SubscriptionRenewal({
  userName,
  radioName,
  planName,
  planPrice,
  currency,
  renewalDate,
  daysUntilRenewal,
  billingUrl,
  paymentMethod,
  cardLast4,
}: SubscriptionRenewalProps) {
  const formattedPrice = new Intl.NumberFormat("fr-FR").format(planPrice);
  const isUrgent = daysUntilRenewal <= 3;

  return (
    <EmailLayout
      previewText={`Rappel : votre abonnement ${planName} sera renouvelé dans ${daysUntilRenewal} jour(s).`}
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
                      backgroundColor: isUrgent ? "#FEE2E2" : "#FEF3C7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px",
                    }}
                  >
                    {isUrgent ? "⚠️" : "🔔"}
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
                    Renouvellement imminent
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
                    Votre abonnement <strong>{planName}</strong> pour{" "}
                    <strong>{radioName}</strong> sera renouvelé automatiquement dans{" "}
                    <strong style={{ color: isUrgent ? "#DC2626" : colors.gray900 }}>
                      {daysUntilRenewal} jour(s)
                    </strong>
                    .
                  </p>
                </td>
              </tr>

              {/* Renewal Summary */}
              <tr>
                <td>
                  <table
                    role="presentation"
                    cellPadding={0}
                    cellSpacing={0}
                    border={0}
                    width="100%"
                    style={{
                      backgroundColor: colors.gray50,
                      borderRadius: "12px",
                      border: `1px solid ${colors.gray200}`,
                      padding: "24px",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "0 0 16px",
                            fontSize: "14px",
                            color: colors.gray600,
                          }}
                        >
                          <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
                            <tbody>
                              <tr>
                                <td style={{ paddingBottom: "12px" }}>
                                  <span style={{ color: colors.gray500 }}>Plan : </span>
                                  <strong style={{ color: colors.gray900 }}>{planName}</strong>
                                </td>
                                <td align="right" style={{ paddingBottom: "12px" }}>
                                  <span style={{ color: colors.gray500 }}>Montant : </span>
                                  <strong style={{ color: colors.gray900 }}>
                                    {formattedPrice} {currency}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingBottom: "12px" }}>
                                  <span style={{ color: colors.gray500 }}>Date de renouvellement : </span>
                                  <strong style={{ color: colors.gray900 }}>{renewalDate}</strong>
                                </td>
                                <td align="right" style={{ paddingBottom: "12px" }}>
                                  <span style={{ color: colors.gray500 }}>Paiement : </span>
                                  <strong style={{ color: colors.gray900 }}>
                                    {paymentMethod}
                                    {cardLast4 ? ` •••• ${cardLast4}` : ""}
                                  </strong>
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
                            Gérer mon abonnement →
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <EmailDivider />

              {/* Info */}
              <tr>
                <td>
                  <InfoBox color={isUrgent ? "#DC2626" : "#D97706"}>
                    <strong>Comment ça marche ?</strong>
                    <br />
                    Le renouvellement est automatique. Assurez-vous que votre moyen de paiement est
                    à jour pour éviter une interruption de service. Vous pouvez modifier ou annuler
                    votre abonnement à tout moment depuis{" "}
                    <a href="#" style={{ color: colors.primary, textDecoration: "none" }}>
                      votre espace facturation
                    </a>
                    .
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
