import React from "react";

// ============================================
// Email Design System — RadioOS
// ============================================

const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  secondary: "#7C3AED",
  success: "#059669",
  warning: "#D97706",
  danger: "#DC2626",
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

// ============================================
// Base Layout Wrapper
// ============================================
export function EmailLayout({
  children,
  previewText,
}: {
  children: React.ReactNode;
  previewText?: string;
}) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>RadioOS</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: colors.gray100,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {previewText && (
          <div
            style={{
              display: "none",
              maxHeight: 0,
              overflow: "hidden",
              fontSize: "1px",
              lineHeight: "1px",
              color: "transparent",
            }}
          >
            {previewText}
          </div>
        )}
        <table
          role="presentation"
          cellPadding={0}
          cellSpacing={0}
          border={0}
          width="100%"
          style={{ backgroundColor: colors.gray100 }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "40px 20px" }}>
                <table
                  role="presentation"
                  cellPadding={0}
                  cellSpacing={0}
                  border={0}
                  width="600"
                  style={{ maxWidth: "600px", width: "100%" }}
                >
                  {children}
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

// ============================================
// Header Component
// ============================================
export function EmailHeader() {
  return (
    <tr>
      <td
        style={{
          backgroundColor: colors.primary,
          borderRadius: "12px 12px 0 0",
          padding: "32px 40px",
          textAlign: "center",
        }}
      >
        <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
          <tbody>
            <tr>
              <td align="center">
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      color: colors.white,
                      fontWeight: "bold",
                    }}
                  >
                    R
                  </div>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: colors.white,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    RadioOS
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

// ============================================
// Footer Component
// ============================================
export function EmailFooter({ radioName }: { radioName?: string }) {
  return (
    <tr>
      <td
        style={{
          backgroundColor: colors.gray50,
          borderRadius: "0 0 12px 12px",
          padding: "32px 40px",
          borderTop: `1px solid ${colors.gray200}`,
        }}
      >
        <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
          <tbody>
            <tr>
              <td align="center">
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "14px",
                    color: colors.gray500,
                  }}
                >
                  {radioName || "RadioOS"} — Le système d&apos;exploitation numérique des radios
                </p>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: "13px",
                    color: colors.gray500,
                  }}
                >
                  <a href="#" style={{ color: colors.primary, textDecoration: "none" }}>
                    Paramètres de notification
                  </a>{" "}
                  &nbsp;·&nbsp;{" "}
                  <a href="#" style={{ color: colors.primary, textDecoration: "none" }}>
                    Aide
                  </a>{" "}
                  &nbsp;·&nbsp;{" "}
                  <a href="#" style={{ color: colors.primary, textDecoration: "none" }}>
                    Se désabonner
                  </a>
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: colors.gray500,
                  }}
                >
                  © 2026 RadioOS. Tous droits réservés.
                  <br />
                  Dakar, Sénégal
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

// ============================================
// Button Component
// ============================================
export function EmailButton({
  href,
  children,
  color = colors.primary,
}: {
  href: string;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <tr>
      <td align="center" style={{ padding: "24px 0" }}>
        <table role="presentation" cellPadding={0} cellSpacing={0} border={0}>
          <tbody>
            <tr>
              <td
                style={{
                  borderRadius: "8px",
                  backgroundColor: color,
                  textAlign: "center",
                }}
              >
                <a
                  href={href}
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
                  {children}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

// ============================================
// Divider
// ============================================
export function EmailDivider() {
  return (
    <tr>
      <td style={{ padding: "24px 0" }}>
        <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
          <tbody>
            <tr>
              <td
                style={{
                  borderTop: `1px solid ${colors.gray200}`,
                  fontSize: "1px",
                  lineHeight: "1px",
                }}
              >
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

// ============================================
// Info Box
// ============================================
export function InfoBox({
  children,
  color = colors.primary,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <tr>
      <td
        style={{
          padding: "16px 20px",
          backgroundColor: `${color}10`,
          borderLeft: `4px solid ${color}`,
          borderRadius: "0 8px 8px 0",
          fontSize: "14px",
          color: colors.gray700,
          lineHeight: "1.6",
        }}
      >
        {children}
      </td>
    </tr>
  );
}

// ============================================
// Feature List
// ============================================
export function FeatureList({ features }: { features: string[] }) {
  return (
    <tr>
      <td style={{ padding: "16px 0" }}>
        <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width="100%">
          <tbody>
            {features.map((feature, index) => (
              <tr key={index}>
                <td
                  style={{
                    padding: "8px 0",
                    fontSize: "14px",
                    color: colors.gray700,
                  }}
                >
                  <span style={{ color: colors.success, marginRight: "8px" }}>✓</span>
                  {feature}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
}
