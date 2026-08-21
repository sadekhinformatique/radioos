import React from "react";
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailDivider,
  InfoBox,
} from "../components";

export interface PaymentReceiptProps {
  userName: string;
  radioName: string;
  invoiceId: string;
  invoiceDate: string;
  planName: string;
  amount: number;
  currency: string;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentReference: string;
  nextBillingDate?: string;
}

export function PaymentReceipt({
  userName,
  radioName,
  invoiceId,
  invoiceDate,
  planName,
  amount,
  currency,
  tax,
  total,
  paymentMethod,
  paymentReference,
  nextBillingDate,
}: PaymentReceiptProps) {
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

  return (
    <EmailLayout
      previewText={`Votre paiement de ${fmt(total)} ${currency} a été reçu. Facture ${invoiceId}.`}
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
                    💰
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
                    Paiement reçu
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
                    Votre paiement pour <strong>{radioName}</strong> a été traité avec succès.
                  </p>
                </td>
              </tr>

              {/* Receipt Card */}
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
                    {/* Invoice Header */}
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "20px 24px",
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
                                    }}
                                  >
                                    Facture
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      color: colors.gray900,
                                      fontFamily: "monospace",
                                      marginTop: "2px",
                                    }}
                                  >
                                    {invoiceId}
                                  </div>
                                </td>
                                <td align="right">
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: colors.gray500,
                                    }}
                                  >
                                    Date
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      color: colors.gray700,
                                      marginTop: "2px",
                                    }}
                                  >
                                    {invoiceDate}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      {/* Line Items */}
                      <tr>
                        <td style={{ padding: "20px 24px" }}>
                          <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "14px",
                                    color: colors.gray600,
                                    paddingBottom: "12px",
                                  }}
                                >
                                  {planName}
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    fontSize: "14px",
                                    color: colors.gray900,
                                    paddingBottom: "12px",
                                  }}
                                >
                                  {fmt(amount)} {currency}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "14px",
                                    color: colors.gray600,
                                    paddingBottom: "12px",
                                  }}
                                >
                                  TVA (0%)
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    fontSize: "14px",
                                    color: colors.gray900,
                                    paddingBottom: "12px",
                                  }}
                                >
                                  {fmt(tax)} {currency}
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {/* Total */}
                          <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    borderTop: `2px solid ${colors.gray300}`,
                                    paddingTop: "12px",
                                  }}
                                >
                                  <strong
                                    style={{
                                      fontSize: "16px",
                                      color: colors.gray900,
                                    }}
                                  >
                                    Total payé
                                  </strong>
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    borderTop: `2px solid ${colors.gray300}`,
                                    paddingTop: "12px",
                                  }}
                                >
                                  <strong
                                    style={{
                                      fontSize: "20px",
                                      color: colors.primary,
                                    }}
                                  >
                                    {fmt(total)} {currency}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      {/* Payment Info */}
                      <tr>
                        <td
                          style={{
                            padding: "16px 24px",
                            borderTop: `1px solid ${colors.gray200}`,
                            backgroundColor: colors.white,
                            borderRadius: "0 0 12px 12px",
                          }}
                        >
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
                                  Moyen de paiement
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    fontSize: "13px",
                                    color: colors.gray700,
                                    paddingBottom: "8px",
                                  }}
                                >
                                  {paymentMethod}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "13px",
                                    color: colors.gray500,
                                  }}
                                >
                                  Référence
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    fontSize: "13px",
                                    color: colors.gray700,
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {paymentReference}
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

              {/* Next Billing */}
              {nextBillingDate && (
                <tr>
                  <td style={{ padding: "24px 0 0" }}>
                    <InfoBox>
                      <strong>Prochaine facturation :</strong> {nextBillingDate}. Le renouvellement
                      est automatique. Vous pouvez modifier votre abonnement à tout moment depuis{" "}
                      <a href="#" style={{ color: colors.primary, textDecoration: "none" }}>
                        votre espace facturation
                      </a>
                      .
                    </InfoBox>
                  </td>
                </tr>
              )}

              {/* Download Invoice */}
              <tr>
                <td align="center" style={{ padding: "24px 0" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      color: colors.gray500,
                    }}
                  >
                    Téléchargez votre facture en PDF depuis{" "}
                    <a href="#" style={{ color: colors.primary, textDecoration: "none" }}>
                      votre historique de paiements
                    </a>
                    .
                  </p>
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
  gray300: "#D1D5DB",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray900: "#111827",
  white: "#FFFFFF",
};
