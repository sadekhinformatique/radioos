import React from "react";
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  EmailDivider,
  InfoBox,
  FeatureList,
} from "../components";

export interface WelcomeEmailProps {
  userName: string;
  radioName?: string;
  loginUrl: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ userName, radioName, loginUrl, dashboardUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout
      previewText={`Bienvenue sur RadioOS${radioName ? `, ${radioName}` : ""} ! Votre espace radio est prêt.`}
    >
      <EmailHeader />

      {/* Body */}
      <tr>
        <td style={{ backgroundColor: colors.white, padding: "40px" }}>
          <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
            <tbody>
              {/* Greeting */}
              <tr>
                <td>
                  <h1
                    style={{
                      margin: "0 0 8px",
                      fontSize: "24px",
                      fontWeight: "700",
                      color: colors.gray900,
                    }}
                  >
                    Bienvenue, {userName} ! 🎙️
                  </h1>
                  <p
                    style={{
                      margin: "0 0 24px",
                      fontSize: "16px",
                      color: colors.gray600,
                      lineHeight: "1.6",
                    }}
                  >
                    Votre compte RadioOS est maintenant actif.
                    {radioName
                      ? ` Votre radio "${radioName}" est prête à être configurée.`
                      : " Vous pouvez maintenant créer votre radio et commencer à diffuser."}
                  </p>
                </td>
              </tr>

              {/* CTA */}
              <tr>
                <td align="center" style={{ padding: "8px 0 32px" }}>
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

              {/* Next Steps */}
              <tr>
                <td>
                  <h2
                    style={{
                      margin: "0 0 16px",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: colors.gray900,
                    }}
                  >
                    Prochaines étapes
                  </h2>
                  <p
                    style={{
                      margin: "0 0 16px",
                      fontSize: "14px",
                      color: colors.gray600,
                      lineHeight: "1.6",
                    }}
                  >
                    Voici ce que vous pouvez faire pour démarrer :
                  </p>
                </td>
              </tr>

              {/* Step 1 */}
              <tr>
                <td style={{ padding: "12px 0" }}>
                  <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
                    <tbody>
                      <tr>
                        <td width="40" valign="top">
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: colors.primary,
                              color: colors.white,
                              textAlign: "center",
                              lineHeight: "32px",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            1
                          </div>
                        </td>
                        <td valign="top" style={{ paddingLeft: "12px" }}>
                          <strong style={{ fontSize: "14px", color: colors.gray900 }}>
                            Configurez votre profil radio
                          </strong>
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: "13px",
                              color: colors.gray500,
                              lineHeight: "1.5",
                            }}
                          >
                            Ajoutez le logo, la description, les liens sociaux et les informations de contact.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Step 2 */}
              <tr>
                <td style={{ padding: "12px 0" }}>
                  <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
                    <tbody>
                      <tr>
                        <td width="40" valign="top">
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: colors.primary,
                              color: colors.white,
                              textAlign: "center",
                              lineHeight: "32px",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            2
                          </div>
                        </td>
                        <td valign="top" style={{ paddingLeft: "12px" }}>
                          <strong style={{ fontSize: "14px", color: colors.gray900 }}>
                            Connectez votre flux audio
                          </strong>
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: "13px",
                              color: colors.gray500,
                              lineHeight: "1.5",
                            }}
                          >
                            Icecast, Shoutcast, HLS — collez simplement l&apos;URL de votre flux existant.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Step 3 */}
              <tr>
                <td style={{ padding: "12px 0" }}>
                  <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
                    <tbody>
                      <tr>
                        <td width="40" valign="top">
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: colors.primary,
                              color: colors.white,
                              textAlign: "center",
                              lineHeight: "32px",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            3
                          </div>
                        </td>
                        <td valign="top" style={{ paddingLeft: "12px" }}>
                          <strong style={{ fontSize: "14px", color: colors.gray900 }}>
                            Invitez votre équipe
                          </strong>
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: "13px",
                              color: colors.gray500,
                              lineHeight: "1.5",
                            }}
                          >
                            Ajoutez vos présentateurs, producteurs et administrateurs avec des rôles spécifiques.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <EmailDivider />

              {/* What's included */}
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
                    Ce qui est inclus dans votre plan
                  </h2>
                </td>
              </tr>

              <FeatureList
                features={[
                  "Dashboard temps réel avec stats d'écoute",
                  "Streaming avec monitoring automatique",
                  "Podcasts avec transcription IA",
                  "Messages et dédicaces en temps réel",
                  "Page publique professionnelle",
                  "Analytics avancés par pays et appareil",
                ]}
              />

              {/* Info Box */}
              <tr>
                <td style={{ padding: "16px 0 0" }}>
                  <InfoBox>
                    <strong>Besoin d&apos;aide ?</strong> Notre équipe est disponible pour vous
                    accompagner. Répondez à cet email ou contactez-nous via le{" "}
                    <a href="#" style={{ color: colors.primary, textDecoration: "none" }}>
                      support
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

// Colors reference for this file
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
