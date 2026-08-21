"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Radio,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wifi,
  WifiOff,
  BarChart3,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Server,
  Globe,
  Headphones,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 2400000 },
  { month: "Fév", revenue: 2800000 },
  { month: "Mar", revenue: 3200000 },
  { month: "Avr", revenue: 2900000 },
  { month: "Mai", revenue: 3500000 },
  { month: "Jun", revenue: 3800000 },
  { month: "Jul", revenue: 4100000 },
  { month: "Aoû", revenue: 4500000 },
];

const radiosByDay = [
  { day: "Lun", active: 45, inactive: 5 },
  { day: "Mar", active: 48, inactive: 4 },
  { day: "Mer", active: 42, inactive: 8 },
  { day: "Jeu", active: 50, inactive: 3 },
  { day: "Ven", active: 52, inactive: 2 },
  { day: "Sam", active: 47, inactive: 6 },
  { day: "Dim", active: 44, inactive: 7 },
];

const recentActivity = [
  {
    id: "1",
    type: "radio_created",
    message: "Radio Woelab a été créée",
    time: "Il y a 12 min",
    icon: Radio,
    color: "text-green-500",
  },
  {
    id: "2",
    type: "user_registered",
    message: "Nouvel utilisateur: kofi@woelab.tg",
    time: "Il y a 25 min",
    icon: Users,
    color: "text-blue-500",
  },
  {
    id: "3",
    type: "payment_received",
    message: "Paiement reçu: 150,000 FCFA de Radio Salam",
    time: "Il y a 1h",
    icon: DollarSign,
    color: "text-green-500",
  },
  {
    id: "4",
    type: "stream_offline",
    message: "Radio Horizon: stream hors ligne depuis 30min",
    time: "Il y a 1h",
    icon: WifiOff,
    color: "text-red-500",
  },
  {
    id: "5",
    type: "subscription_upgraded",
    message: "Radio OSFm passe au plan Professional",
    time: "Il y a 2h",
    icon: TrendingUp,
    color: "text-purple-500",
  },
  {
    id: "6",
    type: "incident_resolved",
    message: "Incident #1247 résolu: latency élevée",
    time: "Il y a 3h",
    icon: CheckCircle2,
    color: "text-green-500",
  },
];

const platformHealth = [
  { name: "API", status: "healthy", latency: "45ms", uptime: "99.99%" },
  { name: "Base de données", status: "healthy", latency: "12ms", uptime: "99.98%" },
  { name: "Stockage", status: "healthy", latency: "23ms", uptime: "99.97%" },
  { name: "CDN", status: "healthy", latency: "8ms", uptime: "99.99%" },
  { name: "Streaming", status: "degraded", latency: "156ms", uptime: "99.85%" },
  { name: "Email", status: "healthy", latency: "234ms", uptime: "99.95%" },
];

const alerts = [
  {
    id: "1",
    severity: "warning",
    message: "Radio Horizon: stream interrompu depuis 30 minutes",
    action: "Voir",
  },
  {
    id: "2",
    severity: "info",
    message: "Pic de trafic sur l'API: 2,500 req/min",
    action: "Monitorer",
  },
  {
    id: "3",
    severity: "critical",
    message: "Espace stockage à 85% - planifier un nettoyage",
    action: "Gérer",
  },
];

function formatCFA(amount: number): string {
  return (
    new Intl.NumberFormat("fr-SN", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(amount) + " FCFA"
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Super Admin
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Vue d&apos;ensemble de la plateforme RadioOS
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                alert.severity === "critical"
                  ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  : alert.severity === "warning"
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                  : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle
                  className={`w-5 h-5 ${
                    alert.severity === "critical"
                      ? "text-red-500"
                      : alert.severity === "warning"
                      ? "text-yellow-500"
                      : "text-blue-500"
                  }`}
                />
                <span className="text-sm text-gray-900 dark:text-white">
                  {alert.message}
                </span>
              </div>
              <Button variant="ghost" size="sm">
                {alert.action}
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  54
                </div>
                <div className="text-sm text-gray-500 mt-1">Radios</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +3 ce mois
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Radio className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  12,847
                </div>
                <div className="text-sm text-gray-500 mt-1">Utilisateurs</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +234 ce mois
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  4.5M
                </div>
                <div className="text-sm text-gray-500 mt-1">Revenus (FCFA)</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +9.8%
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  8,234
                </div>
                <div className="text-sm text-gray-500 mt-1">Auditeurs</div>
                <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  -2.1%
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Headphones className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Revenus mensuels</CardTitle>
              <Badge variant="outline">+15.2% vs mois dernier</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCFA(Number(value)), "Revenus"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Radios Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Radios actives (7j)</CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Actives
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  Inactives
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={radiosByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="active" fill="#22c55e" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="inactive" fill="#d1d5db" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Health */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="w-5 h-5" />
                Santé de la plateforme
              </CardTitle>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {platformHealth.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        service.status === "healthy"
                          ? "bg-green-500"
                          : service.status === "degraded"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">{service.latency}</span>
                    <span className="text-gray-500">{service.uptime}</span>
                    <Badge
                      variant={
                        service.status === "healthy"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        service.status === "healthy"
                          ? "bg-green-100 text-green-700"
                          : service.status === "degraded"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {service.status === "healthy"
                        ? "OK"
                        : service.status === "degraded"
                        ? "Dégradé"
                        : "Erreur"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Activité récente</CardTitle>
              <Button variant="ghost" size="sm">
                Tout voir
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3"
                  >
                    <div className={`mt-0.5 ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">47</div>
              <div className="text-sm text-gray-500 mt-1">Flux en ligne</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">7</div>
              <div className="text-sm text-gray-500 mt-1">Flux hors ligne</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">12</div>
              <div className="text-sm text-gray-500 mt-1">Incidents ouverts</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">98.5%</div>
              <div className="text-sm text-gray-500 mt-1">Uptime moyen</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
