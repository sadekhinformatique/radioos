"use client";

import { useState } from "react";
import {
  Book,
  Code,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  Globe,
  Zap,
  Radio,
  Mic,
  MessageSquare,
  BarChart3,
  Megaphone,
  Webhook,
  ExternalLink,
  Terminal,
  Key,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const apiSections = [
  {
    id: "auth",
    title: "Authentification",
    icon: Key,
    description: "Inscription, connexion et gestion des sessions",
    baseUrl: "/api/v1/auth",
    endpoints: [
      {
        method: "POST",
        path: "/login",
        description: "Connecter un utilisateur",
        auth: false,
        body: {
          email: "string - Email de l'utilisateur",
          password: "string - Mot de passe (min 6 caractères)",
        },
        response: {
          user: { id: "uuid", email: "string", profile: "object" },
          session: { accessToken: "string", refreshToken: "string", expiresIn: "number" },
        },
      },
      {
        method: "POST",
        path: "/register",
        description: "Créer un nouveau compte",
        auth: false,
        body: {
          email: "string - Email unique",
          password: "string - Mot de passe (min 8 caractères)",
          fullName: "string - Nom complet",
          radioName: "string? - Nom de la radio (optionnel)",
        },
        response: {
          user: { id: "uuid", email: "string" },
          message: "string",
        },
      },
      {
        method: "POST",
        path: "/refresh",
        description: "Rafraîchir le token d'accès",
        auth: false,
        body: {
          refreshToken: "string - Token de rafraîchissement",
        },
        response: {
          session: { accessToken: "string", refreshToken: "string" },
        },
      },
      {
        method: "POST",
        path: "/logout",
        description: "Déconnecter l'utilisateur",
        auth: true,
        response: { message: "string" },
      },
      {
        method: "GET",
        path: "/me",
        description: "Obtenir le profil de l'utilisateur courant",
        auth: true,
        response: {
          user: { id: "uuid", email: "string", fullName: "string", role: "string" },
        },
      },
    ],
  },
  {
    id: "radios",
    title: "Stations Radio",
    icon: Radio,
    description: "Gestion des radios (CRUD)",
    baseUrl: "/api/v1/radios",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Lister toutes les radios actives",
        auth: false,
        params: {
          page: "number - Numéro de page (défaut: 1)",
          limit: "number - Éléments par page (défaut: 20, max: 100)",
          q: "string - Recherche par nom ou slug",
          country: "string - Filtrer par pays",
        },
        response: "Radio[]",
      },
      {
        method: "POST",
        path: "/",
        description: "Créer une nouvelle radio",
        auth: true,
        body: {
          name: "string - Nom de la radio",
          slug: "string - Slug unique (a-z, 0-9, -)",
          description: "string? - Description",
          country: "string? - Pays",
          city: "string? - Ville",
          timezone: "string? - Fuseau horaire",
        },
        response: "Radio",
      },
      {
        method: "GET",
        path: "/[id]",
        description: "Obtenir les détails d'une radio",
        auth: false,
        response: "Radio",
      },
      {
        method: "PUT",
        path: "/[id]",
        description: "Mettre à jour une radio (propriétaire uniquement)",
        auth: true,
        body: "Partial<Radio>",
        response: "Radio",
      },
      {
        method: "DELETE",
        path: "/[id]",
        description: "Supprimer une radio (propriétaire uniquement)",
        auth: true,
        response: { message: "string" },
      },
    ],
  },
  {
    id: "streams",
    title: "Flux Audio",
    icon: Zap,
    description: "Gestion des flux de streaming",
    baseUrl: "/api/v1/streams",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Lister les flux de votre radio",
        auth: true,
        response: "Stream[]",
      },
      {
        method: "POST",
        path: "/",
        description: "Ajouter un nouveau flux",
        auth: true,
        body: {
          streamUrl: "string - URL du flux",
          streamType: "string - icecast|shoutcast|hls|other",
          bitrate: "number - Bitrate en kbps (32-320)",
          codec: "string - mp3|aac|ogg",
          isBackup: "boolean - Flux de secours",
        },
        response: "Stream",
      },
      {
        method: "GET",
        path: "/[id]/status",
        description: "Obtenir le statut en temps réel du flux",
        auth: false,
        response: {
          stream: "Stream",
          radio: "Radio",
          listeners: "number",
          isLive: "boolean",
        },
      },
    ],
  },
  {
    id: "podcasts",
    title: "Podcasts",
    icon: Mic,
    description: "Gestion des podcasts",
    baseUrl: "/api/v1/podcasts",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Lister les podcasts de votre radio",
        auth: true,
        params: {
          page: "number",
          limit: "number",
          category: "string - Filtrer par catégorie",
          q: "string - Recherche",
        },
        response: "Podcast[]",
      },
      {
        method: "POST",
        path: "/",
        description: "Ajouter un nouveau podcast",
        auth: true,
        body: {
          title: "string - Titre",
          description: "string? - Description",
          audioUrl: "string - URL du fichier audio",
          durationSeconds: "number? - Durée en secondes",
          category: "string? - Catégorie",
          tags: "string[]? - Tags",
        },
        response: "Podcast",
      },
      {
        method: "GET",
        path: "/public/[slug]",
        description: "Podcasts publics d'une radio (par slug)",
        auth: false,
        response: { radio: "Radio", podcasts: "Podcast[]" },
      },
    ],
  },
  {
    id: "messages",
    title: "Messages",
    icon: MessageSquare,
    description: "Messagerie des auditeurs",
    baseUrl: "/api/v1/messages",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Lister les messages reçus",
        auth: true,
        params: {
          page: "number",
          limit: "number",
          status: "string - unread|read|archived",
          source: "string - whatsapp|sms|email|app|web",
        },
        response: "Message[]",
      },
      {
        method: "POST",
        path: "/",
        description: "Envoyer un message",
        auth: true,
        body: {
          senderName: "string - Nom de l'expéditeur",
          senderPhone: "string? - Téléphone",
          content: "string - Contenu du message",
          source: "string - Source du message",
        },
        response: "Message",
      },
    ],
  },
  {
    id: "dedications",
    title: "Dédicaces",
    icon: Heart,
    description: "Gestion des dédicaces",
    baseUrl: "/api/v1/dedications",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Lister les dédicaces",
        auth: true,
        params: {
          page: "number",
          limit: "number",
          status: "string - pending|approved|played|rejected",
        },
        response: "Dedication[]",
      },
      {
        method: "POST",
        path: "/",
        description: "Créer une dédicace",
        auth: true,
        body: {
          senderName: "string",
          senderPhone: "string?",
          recipientName: "string - Nom du destinataire",
          songTitle: "string - Titre de la chanson",
          artistName: "string - Nom de l'artiste",
          message: "string? - Message personnel",
        },
        response: "Dedication",
      },
    ],
  },
  {
    id: "polls",
    title: "Sondages",
    icon: BarChart3,
    description: "Sondages et votes en temps réel",
    baseUrl: "/api/v1/polls",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Lister les sondages",
        auth: true,
        params: {
          page: "number",
          limit: "number",
          status: "string - active|completed|draft",
        },
        response: "Poll[]",
      },
      {
        method: "POST",
        path: "/",
        description: "Créer un sondage",
        auth: true,
        body: {
          question: "string - Question du sondage",
          options: "string[] - Options (min 2, max 10)",
          expiresAt: "string? - Date d'expiration (ISO 8601)",
        },
        response: "Poll",
      },
      {
        method: "POST",
        path: "/[id]/vote",
        description: "Voter pour une option",
        auth: false,
        body: {
          optionIndex: "number - Index de l'option (0-based)",
        },
        response: {
          message: "string",
          results: "{ option: string, votes: number, percentage: number }[]",
          totalVotes: "number",
        },
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: BarChart3,
    description: "Statistiques d'écoute et d'audience",
    baseUrl: "/api/v1/analytics",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Obtenir les statistiques",
        auth: true,
        params: {
          period: "string - today|7d|30d|90d|custom",
          startDate: "string? - Date de début (si period=custom)",
          endDate: "string? - Date de fin (si period=custom)",
        },
        response: {
          summary: "{ totalListeners, totalDuration, avgDuration, uniqueCountries }",
          daily: "{ date, listeners, duration }[]",
          byCountry: "{ country, count }[]",
          byDevice: "{ device, count }[]",
        },
      },
      {
        method: "POST",
        path: "/track",
        description: "Enregistrer un événement analytics",
        auth: false,
        body: {
          radioId: "uuid",
          streamId: "uuid?",
          eventType: "string - listen_start|listen_end|podcast_play|...",
          eventData: "object?",
          country: "string?",
          city: "string?",
          device: "string?",
          os: "string?",
          browser: "string?",
        },
        response: { message: "string" },
      },
    ],
  },
  {
    id: "advertising",
    title: "Publicités",
    icon: Megaphone,
    description: "Campagnes publicitaires",
    baseUrl: "/api/v1/advertising",
    endpoints: [
      {
        method: "GET",
        path: "/campaigns",
        description: "Lister les campagnes",
        auth: true,
        params: {
          page: "number",
          limit: "number",
          status: "string - draft|active|paused|completed",
        },
        response: "Campaign[]",
      },
      {
        method: "POST",
        path: "/campaigns",
        description: "Créer une campagne",
        auth: true,
        body: {
          name: "string",
          budget: "number - Budget en FCFA",
          startDate: "string - Date de début",
          endDate: "string - Date de fin",
          audioUrl: "string? - URL de l'audio publicitaire",
          targetCountries: "string[]?",
          impressionsGoal: "number?",
        },
        response: "Campaign",
      },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks",
    icon: Webhook,
    description: "Intégrations tierces en temps réel",
    baseUrl: "/api/v1/webhooks",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "Lister les webhooks configurés",
        auth: true,
        response: {
          webhooks: "Webhook[]",
          availableEvents: "string[]",
        },
      },
      {
        method: "POST",
        path: "/",
        description: "Créer un webhook",
        auth: true,
        body: {
          url: "string - URL de callback",
          events: "string[] - Événements à écouter",
          secret: "string? - Secret pour vérification HMAC",
        },
        response: "Webhook",
      },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-700 border-emerald-200",
  POST: "bg-blue-100 text-blue-700 border-blue-200",
  PUT: "bg-amber-100 text-amber-700 border-amber-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
};

function EndpointCard({ endpoint, baseUrl }: { endpoint: { method: string; path: string; description: string; auth: boolean; body?: Record<string, string> | string; response?: Record<string, unknown> | string; params?: Record<string, string> }; baseUrl: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://your-project.supabase.co${baseUrl}${endpoint.path}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bodyEntries = endpoint.body && typeof endpoint.body === "object"
    ? Object.entries(endpoint.body)
    : null;

  const paramsEntries = endpoint.params ? Object.entries(endpoint.params) : null;

  const responseStr = endpoint.response
    ? (typeof endpoint.response === "object"
        ? JSON.stringify(endpoint.response, null, 2)
        : String(endpoint.response))
    : null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <Badge className={`${methodColors[endpoint.method]} font-mono text-xs`}>
          {endpoint.method}
        </Badge>
        <code className="text-sm text-gray-900 font-mono">{endpoint.path}</code>
        <span className="text-sm text-gray-500 flex-1 text-left">{endpoint.description}</span>
        {endpoint.auth ? (
          <Lock className="w-4 h-4 text-amber-500" />
        ) : (
          <Unlock className="w-4 h-4 text-emerald-500" />
        )}
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">URL complète</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 p-2 bg-white border border-gray-200 rounded text-sm font-mono text-gray-700 overflow-x-auto">
                  {fullUrl}
                </code>
                <button onClick={copyUrl} className="p-2 hover:bg-gray-200 rounded transition-colors">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            </div>

            {paramsEntries && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Paramètres de requête</label>
                <div className="mt-1 space-y-1">
                  {paramsEntries.map(([key, desc]) => (
                    <div key={key} className="flex items-start gap-2 text-sm">
                      <code className="font-mono text-blue-600 bg-blue-50 px-1 rounded">{key}</code>
                      <span className="text-gray-600">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {endpoint.body && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Corps de la requête</label>
                <div className="mt-1 space-y-1">
                  {bodyEntries ? (
                    bodyEntries.map(([key, desc]) => (
                      <div key={key} className="flex items-start gap-2 text-sm">
                        <code className="font-mono text-purple-600 bg-purple-50 px-1 rounded">{key}</code>
                        <span className="text-gray-600">{desc}</span>
                      </div>
                    ))
                  ) : (
                    <code className="text-sm text-gray-700">{String(endpoint.body)}</code>
                  )}
                </div>
              </div>
            )}

            {responseStr && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Réponse</label>
                <pre className="mt-1 p-2 bg-white border border-gray-200 rounded text-sm font-mono text-gray-700 overflow-x-auto">
                  {responseStr}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState("auth");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Book className="w-6 h-6 text-blue-600" />
            Documentation API
          </h1>
          <p className="text-gray-500 mt-1">
            API REST pour intégrer RadioOS avec votre application mobile ou des services tiers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
            <Globe className="w-4 h-4 mr-1" />
            v1.0
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
            <Terminal className="w-4 h-4 mr-1" />
            REST API
          </Badge>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-3">🚀 Démarrage rapide</h2>
        <div className="bg-black/20 rounded-lg p-4 font-mono text-sm">
          <p className="text-blue-200 mb-2"># 1. Connexion</p>
          <p className="text-white">curl -X POST https://your-project.supabase.co/api/v1/auth/login \</p>
          <p className="text-white ml-4">-H &quot;Content-Type: application/json&quot; \</p>
          <p className="text-white ml-4">-d &apos;{`{"email": "user@example.com", "password": "password"}`}&apos;</p>
          <p className="text-blue-200 mt-3 mb-2"># 2. Utiliser le token</p>
          <p className="text-white">curl https://your-project.supabase.co/api/v1/radios \</p>
          <p className="text-white ml-4">-H &quot;Authorization: Bearer YOUR_ACCESS_TOKEN&quot;</p>
        </div>
      </div>

      {/* Base URL Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Globe className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Base URL</div>
            <code className="text-sm text-gray-600 font-mono">
              https://your-project.supabase.co/api/v1
            </code>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Authentification:</span>
            <span className="ml-2 text-gray-900">Bearer Token (JWT)</span>
          </div>
          <div>
            <span className="text-gray-500">Format:</span>
            <span className="ml-2 text-gray-900">JSON</span>
          </div>
          <div>
            <span className="text-gray-500">Rate Limit:</span>
            <span className="ml-2 text-gray-900">100 req/min</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-6">
            <h3 className="font-medium text-gray-900 mb-3">Sections</h3>
            <nav className="space-y-1">
              {apiSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.title}
                  <span className="ml-auto text-xs text-gray-400">{section.endpoints.length}</span>
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Événements Webhook</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div>stream.online</div>
                <div>stream.offline</div>
                <div>message.received</div>
                <div>dedication.created</div>
                <div>poll.voted</div>
                <div>podcast.published</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {apiSections
            .filter((s) => s.id === activeSection)
            .map((section) => (
              <div key={section.id} className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <section.icon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  <p className="text-gray-500">{section.description}</p>
                  <div className="mt-2">
                    <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded font-mono">
                      Base: {section.baseUrl}
                    </code>
                  </div>
                </div>

                <div className="space-y-3">
                  {section.endpoints.map((endpoint, idx) => (
                    <div key={idx} className="bg-white rounded-xl overflow-hidden">
                      <EndpointCard endpoint={endpoint as { method: string; path: string; description: string; auth: boolean; body?: Record<string, string> | string; response?: Record<string, unknown> | string; params?: Record<string, string> }} baseUrl={section.baseUrl} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// Heart icon not in lucide, let's add it as a placeholder
function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
