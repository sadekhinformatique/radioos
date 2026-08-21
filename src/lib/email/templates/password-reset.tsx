import React from "react";
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  EmailDivider,
  InfoBox,
} from "../components";

export interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
  expiresAt: Date;
  ipAddress?: string;
  deviceInfo?: string;
}

export function PasswordResetEmail({
  userName,
  resetUrl,
  expiresAt,
  ipAddress,
  deviceInfo,
}: PasswordResetEmailProps) {
  const formattedExpiry = new Date(expiresAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <EmailLayout
      previewText="Vous avez demandé la réinitialisation de votre mot de passe RadioOS."
    >
      <EmailHeader />

      {/* Body */}
      <tr>
        <td style={{ backgroundColor: colors.white, padding: "40px" }}>
          <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
            <tbody>
              {/* Security Icon */}
              <tr>
                <td align="center" style={{ paddingBottom: "24px" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      backgroundColor: "#FEF3C7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px",
                    }}
                  >
                    🔒
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
                    Réinitialisation du mot de passe
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
                    Vous avez demandé à réinitialiser votre mot de passe.
                  </p>
                </td>
              </tr>

              {/* CTA Button */}
              <tr>
                <td align="center" style={{ padding: "8px 0 24px" }}>
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
                            href={resetUrl}
                            style={{
                              display: "inline-block",
                              padding: "14px 40px",
                              fontSize: "16px",
                              fontWeight: "600",
                              color: colors.white,
                              textDecoration: "none",
                              borderRadius: "8px",
                            }}
                          >
                            Réinitialiser mon mot de passe
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Expiry Warning */}
              <tr>
                <td align="center">
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "14px",
                      color: colors.gray500,
                      textAlign: "center",
                    }}
                  >
                    ⏰ Ce lien expire le{" "}
                    <strong style={{ color: colors.gray700 }}>{formattedExpiry}</strong>
                  </p>
                </td>
              </tr>

              <EmailDivider />

              {/* Security Info */}
              <tr>
                <td>
                  <h2
                    style={{
                      margin: "0 0 16px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: colors.gray900,
                    }}
                  >
                    🛡️ Informations de sécurité
                  </h2>
                </td>
              </tr>

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
                      borderRadius: "8px",
                      padding: "16px",
                    }}
                  >
                    <tbody>
                      {ipAddress && (
                        <tr>
                          <td
                            style={{
                              padding: "6px 0",
                              fontSize: "13px",
                              color: colors.gray500,
                              width: "120px",
                            }}
                          >
                            Adresse IP
                          </td>
                          <td
                            style={{
                              padding: "6px 0",
                              fontSize: "13px",
                              color: colors.gray700,
                              fontFamily: "monospace",
                            }}
                          >
                            {ipAddress}
                          </td>
                        </tr>
                      )}
                      {deviceInfo && (
                        <tr>
                          <td
                            style={{
                              padding: "6px 0",
                              fontSize: "13px",
                              color: colors.gray500,
                            }}
                          >
                            Appareil
                          </td>
                          <td
                            style={{
                              padding: "6px 0",
                              fontSize: "13px",
                              color: colors.gray700,
                            }}
                          >
                            {deviceInfo}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td
                          style={{
                            padding: "6px 0",
                            fontSize: "13px",
                            color: colors.gray500,
                          }}
                        >
                          Demande à
                        </td>
                        <td
                          style={{
                            padding: "6px 0",
                            fontSize: "13px",
                            color: colors.gray700,
                          }}
                        >
                          {userName}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <EmailDivider />

              {/* Warning */}
              <tr>
                <td>
                  <InfoBox color="#DC2626">
                    <strong>Vous n&apos;avez pas demandé cette réinitialisation ?</strong>
                    <br />
                    Si vous n&apos;avez pas fait cette demande, ignorez cet email. Votre mot de passe
                    actuel reste inchangé. Si vous pensez que votre compte est compromis,{" "}
                    <a href="#" style={{ color: colors.primary, textDecoration: "none" }}>
                      contactez immédiatement le support
                    </a>
                    .
                  </InfoBox>
                </td>
              </tr>

              {/* Alternative Link */}
              <tr>
                <td style={{ padding: "24px 0 0" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: colors.gray500,
                      lineHeight: "1.6",
                    }}
                  >
                    Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "12px",
                      color: colors.primary,
                      wordBreak: "break-all",
                      fontFamily: "monospace",
                    }}
                  >
                    {resetUrl}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>

      <EmailFooter />
    </EmailLayout>
  );
}

const colors = {
  primary: "#2563EB",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray900: "#111827",
  white: "#FFFFFF",
};
