"use client";

import { useState } from "react";
import { Mail, Eye, Code, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const emailTypes = [
  {
    id: "welcome",
    name: "Bienvenue",
    description: "Email envoyé après l'inscription",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "password-reset",
    name: "Réinitialisation mot de passe",
    description: "Email de réinitialisation avec lien sécurisé",
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "subscription-welcome",
    name: "Abonnement confirmé",
    description: "Confirmation après le premier paiement",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "subscription-renewal",
    name: "Rappel de renouvellement",
    description: "Rappel avant le renouvellement automatique",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "payment-receipt",
    name: "Reçu de paiement",
    description: "Facture après paiement réussi",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "subscription-expired",
    name: "Abonnement expiré",
    description: "Notification d'expiration ou d'échec de paiement",
    color: "bg-red-100 text-red-700",
  },
];

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");
  const [viewMode, setViewMode] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState(false);

  const copyHtml = () => {
    navigator.clipboard.writeText("<!-- Email HTML will be rendered server-side -->");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Prévisualisation des emails
          </h1>
          <p className="text-gray-500 mt-1">
            Aperçu des templates d&apos;emails envoyés automatiquement
          </p>
        </div>
        <Badge className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1">
          6 templates
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Templates</h3>
            <nav className="space-y-1">
              {emailTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedTemplate(type.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors ${
                    selectedTemplate === type.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Badge className={`${type.color} text-xs`}>
                      <Mail className="w-3 h-3" />
                    </Badge>
                    <span className="font-medium text-gray-900">{type.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-6">{type.description}</p>
                </button>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div className="mt-4 bg-blue-50 rounded-xl border border-blue-200 p-4">
            <h4 className="font-medium text-blue-900 mb-2">ℹ️ À propos</h4>
            <ul className="space-y-2 text-xs text-blue-700">
              <li>• Templates React → HTML statique</li>
              <li>• Compatible tous clients email</li>
              <li>• Design responsive (600px)</li>
              <li>• Mode sombre respecté</li>
              <li>• Inline CSS pour compatibilité</li>
            </ul>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  {emailTypes.find((t) => t.id === selectedTemplate)?.name}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === "preview"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  Aperçu
                </button>
                <button
                  onClick={() => setViewMode("html")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === "html"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Code className="w-4 h-4 inline mr-1" />
                  HTML
                </button>
                <button
                  onClick={copyHtml}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 inline mr-1 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 inline mr-1" />
                  )}
                  Copier
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {viewMode === "preview" ? (
                <div
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  style={{ minHeight: "600px" }}
                >
                  {/* Simulated email preview */}
                  <div className="bg-gray-100 p-4 border-b border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">De:</span>
                        <span className="text-sm text-gray-900">RadioOS &lt;noreply@radioos.com&gt;</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">À:</span>
                        <span className="text-sm text-gray-900">utilisateur@example.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">Objet:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedTemplate === "welcome" && "Bienvenue sur RadioOS ! 🎙️"}
                          {selectedTemplate === "password-reset" && "Réinitialisation de votre mot de passe RadioOS"}
                          {selectedTemplate === "subscription-welcome" && "Votre abonnement Professionnel est actif"}
                          {selectedTemplate === "subscription-renewal" && "Rappel : renouvellement Professionnel dans 7 jour(s)"}
                          {selectedTemplate === "payment-receipt" && "Paiement reçu — INV-2026-001"}
                          {selectedTemplate === "subscription-expired" && "Échec de paiement — Radio OSFM"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Email body placeholder */}
                  <div className="p-8 text-center text-gray-400">
                    <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium text-gray-600">
                      Aperçu du template &quot;{emailTypes.find((t) => t.id === selectedTemplate)?.name}&quot;
                    </p>
                    <p className="text-sm mt-2 max-w-md mx-auto">
                      Le rendu HTML complet sera disponible côté serveur.
                      Utilisez l&apos;API <code className="bg-gray-100 px-1 rounded">/api/v1/email/send</code> pour
                      envoyer des emails avec ces templates.
                    </p>
                    <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                      <p className="text-xs font-medium text-gray-600 mb-2">Exemple de données :</p>
                      <pre className="text-xs text-gray-500 font-mono overflow-x-auto">
{`{
  "template": "${selectedTemplate}",
  "to": "user@example.com",
  "data": { ... }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-4 overflow-auto" style={{ minHeight: "600px" }}>
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
{`<!-- Email Template: ${emailTypes.find((t) => t.id === selectedTemplate)?.name} -->
<!-- Render with: renderEmail(React.createElement(${selectedTemplate.replace(/-/g, "")}Email, props)) -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" style="max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="background-color:#2563EB;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <span style="font-size:24px;font-weight:bold;color:#fff;">RadioOS</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#fff;padding:40px;">
              <!-- Template content renders here -->
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#F9FAFB;border-radius:0 0 12px 12px;padding:32px 40px;">
              <p style="font-size:14px;color:#6B7280;text-align:center;">
                © 2026 RadioOS. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
