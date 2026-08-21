"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Server,
  Globe,
  Radio,
  Users,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
} from "lucide-react";

const streams = [
  { id: "1", name: "RadioOS FM", status: "online" as const, latency: 45, bitrate: 128, listeners: 1284, uptime: "99.98%", lastCheck: "Il y a 15s" },
  { id: "2", name: "Radio Horizon", status: "offline" as const, latency: 0, bitrate: 0, listeners: 0, uptime: "95.2%", lastCheck: "Il y a 2min" },
  { id: "3", name: "Radio Salam", status: "online" as const, latency: 32, bitrate: 128, listeners: 2345, uptime: "99.95%", lastCheck: "Il y a 10s" },
  { id: "4", name: "Woelab Radio", status: "online" as const, latency: 67, bitrate: 64, listeners: 890, uptime: "99.87%", lastCheck: "Il y a 20s" },
  { id: "5", name: "Radio Univers", status: "offline" as const, latency: 0, bitrate: 0, listeners: 0, uptime: "87.3%", lastCheck: "Il y a 5min" },
  { id: "6", name: "Radio Gospel Plus", status: "online" as const, latency: 28, bitrate: 128, listeners: 567, uptime: "99.99%", lastCheck: "Il y a 12s" },
  { id: "7", name: "FM Express", status: "online" as const, latency: 89, bitrate: 64, listeners: 234, uptime: "99.12%", lastCheck: "Il y a 18s" },
  { id: "8", name: "Radio Nostalgie", status: "warning" as const, latency: 234, bitrate: 128, listeners: 1123, uptime: "98.5%", lastCheck: "Il y a 25s" },
];

const incidents = [
  {
    id: "INC-1247",
    title: "Radio Horizon: Stream interrompu",
    severity: "critical" as const,
    status: "open" as const,
    createdAt: "2025-08-21T08:30:00",
    duration: "1h 30min",
    affected: "Radio Horizon",
    description: "Le flux principal est tombé à 08:30. Le flux de secours n'a pas démarré automatiquement.",
  },
  {
    id: "INC-1246",
    title: "Latence élevée sur Radio Nostalgie",
    severity: "warning" as const,
    status: "investigating" as const,
    createdAt: "2025-08-21T07:15:00",
    duration: "2h 45min",
    affected: "Radio Nostalgie",
    description: "Latence supérieure à 200ms sur le flux audio. Impact possible sur la qualité.",
  },
  {
    id: "INC-1245",
    title: "API: Pic de trafic",
    severity: "info" as const,
    status: "resolved" as const,
    createdAt: "2025-08-20T14:00:00",
    duration: "45min",
    affected: "Plateforme",
    description: "Pic de 2,500 requêtes/minute sur l'API. Scalabilité automatique activée.",
  },
  {
    id: "INC-1244",
    title: "Stockage: Espace critique",
    severity: "warning" as const,
    status: "monitoring" as const,
    createdAt: "2025-08-19T10:00:00",
    duration: "1j 19h",
    affected: "Stockage",
    description: "Espace de stockage à 85%. Planifier un nettoyage des anciens podcasts.",
  },
];

const servers = [
  { name: "API Primary", status: "healthy" as const, cpu: 34, memory: 62, disk: 45, requests: "2.4k/min" },
  { name: "API Secondary", status: "healthy" as const, cpu: 28, memory: 58, disk: 42, requests: "1.8k/min" },
  { name: "Database Primary", status: "healthy" as const, cpu: 45, memory: 78, disk: 52, requests: "3.2k/min" },
  { name: "Database Replica", status: "healthy" as const, cpu: 32, memory: 72, disk: 51, requests: "2.1k/min" },
  { name: "Storage Node", status: "healthy" as const, cpu: 18, memory: 45, disk: 85, requests: "456/min" },
  { name: "CDN Edge", status: "healthy" as const, cpu: 22, memory: 38, disk: 12, requests: "15.2k/min" },
];

const severityConfig = {
  critical: { label: "Critique", color: "bg-red-500", variant: "danger" as const },
  warning: { label: "Avertissement", color: "bg-yellow-500", variant: "warning" as const },
  info: { label: "Info", color: "bg-blue-500", variant: "default" as const },
};

const statusConfig = {
  open: { label: "Ouvert", color: "bg-red-500" },
  investigating: { label: "En cours", color: "bg-yellow-500" },
  monitoring: { label: "Surveillance", color: "bg-blue-500" },
  resolved: { label: "Résolu", color: "bg-green-500" },
};

export default function AdminMonitoringPage() {
  const onlineStreams = streams.filter((s) => s.status === "online").length;
  const offlineStreams = streams.filter((s) => s.status === "offline").length;
  const warningStreams = streams.filter((s) => s.status === "warning").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Monitoring
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Surveillance en temps réel de la plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Rapport incident
          </Button>
        </div>
      </div>

      {/* Stream Status Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Wifi className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-3xl font-bold text-green-500">{onlineStreams}</div>
                <div className="text-sm text-gray-500">Flux en ligne</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <WifiOff className="w-8 h-8 text-red-500" />
              <div>
                <div className="text-3xl font-bold text-red-500">{offlineStreams}</div>
                <div className="text-sm text-gray-500">Flux hors ligne</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="text-3xl font-bold text-yellow-500">{warningStreams}</div>
                <div className="text-sm text-gray-500">Alertes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streams List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Radio className="w-5 h-5" />
            État des flux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Radio</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Latence</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Bitrate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Auditeurs</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Uptime</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Dernière vérif.</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {streams.map((stream) => (
                  <tr
                    key={stream.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {stream.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            stream.status === "online"
                              ? "bg-green-500"
                              : stream.status === "offline"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          } ${stream.status === "online" ? "animate-pulse" : ""}`}
                        />
                        <span
                          className={
                            stream.status === "online"
                              ? "text-green-600"
                              : stream.status === "offline"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
                        >
                          {stream.status === "online"
                            ? "En ligne"
                            : stream.status === "offline"
                            ? "Hors ligne"
                            : "Dégradé"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={
                          stream.latency === 0
                            ? "text-gray-400"
                            : stream.latency > 200
                            ? "text-red-600"
                            : stream.latency > 100
                            ? "text-yellow-600"
                            : "text-gray-900 dark:text-white"
                        }
                      >
                        {stream.latency === 0 ? "—" : `${stream.latency}ms`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {stream.bitrate === 0 ? "—" : `${stream.bitrate} kbps`}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {stream.listeners.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {stream.uptime}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {stream.lastCheck}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Activity className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Incidents récents
              </CardTitle>
              <Badge variant="outline">
                {incidents.filter((i) => i.status !== "resolved").length} ouverts
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={severityConfig[incident.severity].variant}>
                          {severityConfig[incident.severity].label}
                        </Badge>
                        <Badge variant="outline">
                          <div className={`w-2 h-2 rounded-full ${statusConfig[incident.status].color} mr-1`} />
                          {statusConfig[incident.status].label}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mt-2">
                        {incident.title}
                      </h4>
                    </div>
                    <span className="text-xs text-gray-400">{incident.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {incident.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {incident.duration}
                    </span>
                    <span>{incident.affected}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Servers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="w-5 h-5" />
              Serveurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servers.map((server) => (
                <div
                  key={server.name}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          server.status === "healthy" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {server.name}
                      </span>
                    </div>
                    <Badge variant="outline">{server.requests}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>CPU</span>
                        <span>{server.cpu}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            server.cpu > 80
                              ? "bg-red-500"
                              : server.cpu > 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${server.cpu}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>RAM</span>
                        <span>{server.memory}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            server.memory > 80
                              ? "bg-red-500"
                              : server.memory > 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${server.memory}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Disque</span>
                        <span>{server.disk}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            server.disk > 80
                              ? "bg-red-500"
                              : server.disk > 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${server.disk}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
