"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  ArrowUpRight,
  Radio,
  Server,
  Wifi,
  Database,
  Globe,
} from "lucide-react";

const incidents = [
  {
    id: "INC-1247",
    title: "Radio Horizon: Stream interrompu",
    severity: "critical",
    status: "open",
    createdAt: "2025-08-21T08:30:00",
    updatedAt: "2025-08-21T10:00:00",
    duration: "1h 30min",
    affected: "Radio Horizon",
    component: "stream",
    description: "Le flux principal Icecast est tombé à 08:30 UTC. Logs montrant une erreur de connexion réseau. Le backup n'a pas démarré automatiquement.",
    timeline: [
      { time: "08:30", event: "Incident détecté: stream offline" },
      { time: "08:35", event: "Alerte envoyée à l'admin Radio Horizon" },
      { time: "09:00", event: "Vérification du serveur de streaming" },
      { time: "09:30", event: "Diagnostic: problème réseau identifié" },
      { time: "10:00", event: "En cours de résolution..." },
    ],
  },
  {
    id: "INC-1246",
    title: "Latence élevée sur Radio Nostalgie",
    severity: "warning" as const,
    status: "investigating" as const,
    createdAt: "2025-08-21T07:15:00",
    updatedAt: "2025-08-21T09:00:00",
    duration: "2h 45min",
    affected: "Radio Nostalgie",
    component: "network",
    description: "Latence supérieure à 200ms sur le flux audio. Impact possible sur la qualité d'écoute pour les auditeurs éloignés.",
    timeline: [
      { time: "07:15", event: "Alerte latence > 200ms" },
      { time: "07:30", event: "Investigation en cours" },
      { time: "08:00", event: "Possible cause: congestion réseau régionale" },
      { time: "09:00", event: "Contact avec le fournisseur réseau" },
    ],
  },
  {
    id: "INC-1245",
    title: "API: Pic de trafic",
    severity: "info" as const,
    status: "resolved" as const,
    createdAt: "2025-08-20T14:00:00",
    updatedAt: "2025-08-20T14:45:00",
    duration: "45min",
    affected: "Plateforme",
    component: "api",
    description: "Pic de 2,500 requêtes/minute sur l'API. Scalabilité automatique activée avec succès.",
    timeline: [
      { time: "14:00", event: "Détection pic de trafic" },
      { time: "14:05", event: "Scalabilité automatique activée" },
      { time: "14:30", event: "Trafic stabilisé" },
      { time: "14:45", event: "Incident résolu" },
    ],
  },
  {
    id: "INC-1244",
    title: "Stockage: Espace critique",
    severity: "warning" as const,
    status: "monitoring" as const,
    createdAt: "2025-08-19T10:00:00",
    updatedAt: "2025-08-21T08:00:00",
    duration: "1j 22h",
    affected: "Stockage",
    component: "storage",
    description: "Espace de stockage à 85%. Les anciens podcasts représentent 60% de l'utilisation.",
    timeline: [
      { time: "19/10:00", event: "Seuil de 80% atteint" },
      { time: "19/14:00", event: "Notification envoyée aux admins" },
      { time: "20/09:00", event: "Espace à 85%" },
      { time: "21/08:00", event: "Plan de nettoyage en cours de préparation" },
    ],
  },
  {
    id: "INC-1243",
    title: "Auth: Erreur temporaire OAuth",
    severity: "info" as const,
    status: "resolved" as const,
    createdAt: "2025-08-18T16:00:00",
    updatedAt: "2025-08-18T16:30:00",
    duration: "30min",
    affected: "Authentification",
    component: "auth",
    description: "Erreurs temporaires sur le provider OAuth Google. Impact sur les connexions via Google.",
    timeline: [
      { time: "16:00", event: "Erreurs OAuth Google détectées" },
      { time: "16:10", event: "Vérification côté Google" },
      { time: "16:20", event: "Google résout le problème" },
      { time: "16:30", event: "Service restauré" },
    ],
  },
];

const severityConfig: Record<string, { label: string; color: string; variant: "danger" | "warning" | "default" }> = {
  critical: { label: "Critique", color: "bg-red-500", variant: "danger" },
  warning: { label: "Avertissement", color: "bg-yellow-500", variant: "warning" },
  info: { label: "Info", color: "bg-blue-500", variant: "default" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: "Ouvert", color: "bg-red-500" },
  investigating: { label: "En cours", color: "bg-yellow-500" },
  monitoring: { label: "Surveillance", color: "bg-blue-500" },
  resolved: { label: "Résolu", color: "bg-green-500" },
};

const componentConfig: Record<string, { icon: React.ElementType; label: string }> = {
  stream: { icon: Wifi, label: "Streaming" },
  network: { icon: Globe, label: "Réseau" },
  api: { icon: Server, label: "API" },
  storage: { icon: Database, label: "Stockage" },
  auth: { icon: AlertTriangle, label: "Auth" },
};

export default function AdminIncidentsPage() {
  const openIncidents = incidents.filter((i) => i.status !== "resolved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Incidents
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {openIncidents} incident{openIncidents !== 1 ? "s" : ""} ouvert{openIncidents !== 1 ? "s" : ""}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel incident
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{incidents.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">
                {incidents.filter((i) => i.severity === "critical" && i.status !== "resolved").length}
              </div>
              <div className="text-sm text-gray-500">Critiques</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">
                {incidents.filter((i) => i.status === "investigating").length}
              </div>
              <div className="text-sm text-gray-500">En cours</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {incidents.filter((i) => i.status === "resolved").length}
              </div>
              <div className="text-sm text-gray-500">Résolus</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.map((incident) => {
          const severity = severityConfig[incident.severity];
          const status = statusConfig[incident.status];
          const component = componentConfig[incident.component];
          const ComponentIcon = component.icon;

          return (
            <Card key={incident.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={severity.variant}>{severity.label}</Badge>
                      <Badge variant="outline">
                        <div className={`w-2 h-2 rounded-full ${status.color} mr-1`} />
                        {status.label}
                      </Badge>
                      <span className="text-xs text-gray-400">{incident.id}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {incident.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {incident.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <ComponentIcon className="w-3 h-3" />
                        {component.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Radio className="w-3 h-3" />
                        {incident.affected}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {incident.duration}
                      </span>
                      <span>
                        Créé le {new Date(incident.createdAt).toLocaleDateString("fr-FR")} à{" "}
                        {new Date(incident.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="lg:w-64 flex-shrink-0">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Chronologie</h4>
                    <div className="space-y-3">
                      {incident.timeline.map((event, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs text-gray-400">{event.time}</div>
                            <div className="text-xs text-gray-700 dark:text-gray-300">
                              {event.event}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
