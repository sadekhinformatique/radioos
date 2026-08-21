import React from "react";
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  EmailDivider,
  FeatureList,
  InfoBox,
} from "../components";

export interface SubscriptionWelcomeProps {
  userName: string;
  radioName: string;
  planName: string;
  planPrice: number;
  currency: string;
  billingCycle: "monthly" | "annual";
  nextBillingDate: string;
  dashboardUrl: string;
  paymentMethod: string;
  features: string[];
}

export function SubscriptionWelcome({
  userName,
  radioName,
  planName,
  planPrice,
  currency,
  billingCycle,
  nextBillingDate,
  dashboardUrl,
  paymentMethod,
  features,
}: SubscriptionWelcomeProps) {
  const formattedPrice = new Intl.NumberFormat("fr-FR").format(planPrice);

  return (
    <EmailLayout
      previewText={`Votre abonnement ${planName} est maintenant actif pour ${radioName} !`}
    >
      <EmailHeader />

      <tr>
        <td style={{ backgroundColor: colors.white, padding: "40px" }}>
          <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
            <tbody>
              {/* Success Icon */}
              <tr>
                <td align="center" style={{ paddingBottom: "24px" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      backgroundColor: "#D1FAE5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px",
                    }}
                  >
                    ✅
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
                    Abonnement confirmé !
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
                    <strong>{radioName}</strong> est maintenant actif.
                  </p>
                </td>
              </tr>

              {/* Plan Summary Card */}
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
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "24px",
                            borderBottom: `1px solid ${colors.gray200}`,
                          }}
                        >
                          <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
                            <tbody>
                              <tr>
                                <td>
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: colors.gray500,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Plan
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "700",
                                      color: colors.primary,
                                      marginTop: "4px",
                                    }}
                                  >
                                    {planName}
                                  </div>
                                </td>
                                <td align="right">
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: colors.gray500,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Montant
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "700",
                                      color: colors.gray900,
                                      marginTop: "4px",
                                    }}
                                  >
                                    {formattedPrice} {currency}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: colors.gray500,
                                      marginTop: "2px",
                                    }}
                                  >
                                    / {billingCycle === "monthly" ? "mois" : "an"}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "16px 24px" }}>
                          <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "13px",
                                    color: colors.gray500,
                                  }}
                                >
                                  Prochaine facturation
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    fontSize: "13px",
                                    color: colors.gray700,
                                    fontWeight: "500",
                                  }}
                                >
                                  {nextBillingDate}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "13px",
                                    color: colors.gray500,
                                    paddingTop: "8px",
                                  }}
                                >
                                  Moyen de paiement
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    fontSize: "13px",
                                    color: colors.gray700,
                                    fontWeight: "500",
                                    paddingTop: "8px",
                                  }}
                                >
                                  {paymentMethod}
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
                            href={dashboardUrl}
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
                            Accéder à mon dashboard →
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <EmailDivider />

              {/* Included Features */}
              <tr>
                <td>
                  <h2
                    style={{
                      margin: "0 0 12px",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: colors.gray900,
                    }}
                  >
                    🎉 Fonctionnalités incluses dans votre plan
                  </h2>
                </td>
              </tr>

              <FeatureList features={features} />

              {/* Info */}
              <tr>
                <td style={{ padding: "16px 0 0" }}>
                  <InfoBox>
                    <strong>Gérez votre abonnement</strong> à tout moment depuis votre{" "}
                    <a href="#" style={{ color: colors.primary, textDecoration: "none" }}>
                      page de facturation
                    </a>
                    . Vous pouvez upgrader, downgrader ou annuler en un clic.
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
  success: "#059669",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray900: "#111827",
  white: "#FFFFFF",
};
