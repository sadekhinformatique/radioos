"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Radio,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Wifi,
  WifiOff,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Globe,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const radios = [
  {
    id: "1",
    name: "RadioOS FM",
    slug: "radioos-fm",
    owner: "Amadou Diallo",
    country: "Sénégal",
    city: "Dakar",
    status: "active" as const,
    streamStatus: "online" as const,
    plan: "Professional",
    listeners: 1284,
    shows: 8,
    podcasts: 24,
    createdAt: "2024-01-15",
    revenue: 4500000,
  },
  {
    id: "2",
    name: "Radio Horizon",
    slug: "radio-horizon",
    owner: "Fatima Sy",
    country: "Sénégal",
    city: "Thiès",
    status: "active" as const,
    streamStatus: "offline" as const,
    plan: "Starter",
    listeners: 456,
    shows: 5,
    podcasts: 12,
    createdAt: "2024-03-20",
    revenue: 1800000,
  },
  {
    id: "3",
    name: "Radio Salam",
    slug: "radio-salam",
    owner: "Ibrahim Cissé",
    country: "Mali",
    city: "Bamako",
    status: "active" as const,
    streamStatus: "online" as const,
    plan: "Enterprise",
    listeners: 2345,
    shows: 12,
    podcasts: 45,
    createdAt: "2023-11-10",
    revenue: 8900000,
  },
  {
    id: "4",
    name: "Woelab Radio",
    slug: "woelab-radio",
    owner: "Kofi Mensah",
    country: "Togo",
    city: "Lomé",
    status: "active" as const,
    streamStatus: "online" as const,
    plan: "Professional",
    listeners: 890,
    shows: 6,
    podcasts: 18,
    createdAt: "2024-06-05",
    revenue: 3200000,
  },
  {
    id: "5",
    name: "Radio Univers",
    slug: "radio-univers",
    owner: "Marie Koné",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    status: "suspended" as const,
    streamStatus: "offline" as const,
    plan: "Starter",
    listeners: 0,
    shows: 3,
    podcasts: 8,
    createdAt: "2024-02-28",
    revenue: 750000,
  },
  {
    id: "6",
    name: "Radio Gospel Plus",
    slug: "radio-gospel-plus",
    owner: "Pasteur Oumar",
    country: "Sénégal",
    city: "Saint-Louis",
    status: "active" as const,
    streamStatus: "online" as const,
    plan: "Starter",
    listeners: 567,
    shows: 4,
    podcasts: 15,
    createdAt: "2024-08-12",
    revenue: 1200000,
  },
  {
    id: "7",
    name: "FM Express",
    slug: "fm-express",
    owner: "Moussa Diallo",
    country: "Burkina Faso",
    city: "Ouagadougou",
    status: "trial" as const,
    streamStatus: "online" as const,
    plan: "Trial",
    listeners: 234,
    shows: 2,
    podcasts: 5,
    createdAt: "2025-08-01",
    revenue: 0,
  },
  {
    id: "8",
    name: "Radio Nostalgie",
    slug: "radio-nostalgie",
    owner: "Aïcha Traoré",
    country: "Guinée",
    city: "Conakry",
    status: "active" as const,
    streamStatus: "online" as const,
    plan: "Professional",
    listeners: 1123,
    shows: 7,
    podcasts: 22,
    createdAt: "2024-04-18",
    revenue: 3800000,
  },
];

function formatCFA(amount: number): string {
  return new Intl.NumberFormat("fr-SN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " FCFA";
}

export default function AdminRadiosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRadios = radios.filter((radio) => {
    const matchesSearch =
      radio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      radio.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      radio.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || radio.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des radios
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {radios.length} radios enregistrées
          </p>
        </div>
        <Button>
          <Radio className="w-4 h-4 mr-2" />
          Ajouter une radio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {radios.length}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {radios.filter((r) => r.status === "active").length}
              </div>
              <div className="text-sm text-gray-500">Actives</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">
                {radios.filter((r) => r.status === "trial").length}
              </div>
              <div className="text-sm text-gray-500">Essai</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">
                {radios.filter((r) => r.status === "suspended").length}
              </div>
              <div className="text-sm text-gray-500">Suspendues</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher une radio, un pays, un propriétaire..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "active", "trial", "suspended"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status === "all"
                    ? "Toutes"
                    : status === "active"
                    ? "Actives"
                    : status === "trial"
                    ? "Essai"
                    : "Suspendues"}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radios Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Radio
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Propriétaire
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Localisation
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Statut
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Stream
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Auditeurs
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Revenus
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRadios.map((radio) => (
                  <tr
                    key={radio.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {radio.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {radio.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            /radio/{radio.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {radio.owner}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Globe className="w-3 h-3" />
                        {radio.city}, {radio.country}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          radio.status === "active"
                            ? "default"
                            : radio.status === "trial"
                            ? "secondary"
                            : "danger"
                        }
                        className={
                          radio.status === "active"
                            ? "bg-green-100 text-green-700"
                            : radio.status === "trial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {radio.status === "active"
                          ? "Active"
                          : radio.status === "trial"
                          ? "Essai"
                          : "Suspendue"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {radio.streamStatus === "online" ? (
                          <Wifi className="w-4 h-4 text-green-500" />
                        ) : (
                          <WifiOff className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={
                            radio.streamStatus === "online"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {radio.streamStatus === "online" ? "En ligne" : "Hors ligne"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{radio.plan}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {radio.listeners.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {formatCFA(radio.revenue)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
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
    </div>
  );
}
