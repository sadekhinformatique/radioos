"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Megaphone,
  Plus,
  Search,
  DollarSign,
  Eye,
  TrendingUp,
  Calendar,
  Target,
  Users,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  Edit,
  Trash2,
  ExternalLink,
  Briefcase,
  Radio,
} from "lucide-react";

const advertisers = [
  {
    id: "1",
    name: "Tigo Sénégal",
    industry: "Télécommunications",
    contact: "contact@tigo.sn",
    campaigns: 3,
    totalSpent: 2450000,
    status: "active" as const,
  },
  {
    id: "2",
    name: "Orange Money",
    industry: "Finance mobile",
    contact: "pub@orange.sn",
    campaigns: 2,
    totalSpent: 1800000,
    status: "active" as const,
  },
  {
    id: "3",
    name: "Coca-Cola Sénégal",
    industry: "Boissons",
    contact: "marketing@coca-cola.sn",
    campaigns: 1,
    totalSpent: 750000,
    status: "active" as const,
  },
  {
    id: "4",
    name: "BICEC Bank",
    industry: "Banque",
    contact: "publicite@bicec.sn",
    campaigns: 0,
    totalSpent: 0,
    status: "inactive" as const,
  },
];

const campaigns = [
  {
    id: "1",
    name: "Campagne Promo Tigo - Août 2025",
    advertiser: "Tigo Sénégal",
    budget: 1500000,
    spent: 980000,
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    status: "active" as const,
    impressions: 245000,
    reach: 89000,
    clicks: 12400,
    frequency: "3x/jour",
    targetAudience: "18-35 ans, Dakar",
  },
  {
    id: "2",
    name: "Lancement Orange Money 2.0",
    advertiser: "Orange Money",
    budget: 2000000,
    spent: 1340000,
    startDate: "2025-08-10",
    endDate: "2025-09-10",
    status: "active" as const,
    impressions: 189000,
    reach: 67000,
    clicks: 8900,
    frequency: "5x/jour",
    targetAudience: "Tous ages, National",
  },
  {
    id: "3",
    name: "Coca-Cola Été Festival",
    advertiser: "Coca-Cola Sénégal",
    budget: 750000,
    spent: 750000,
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    status: "completed" as const,
    impressions: 312000,
    reach: 124000,
    clicks: 18900,
    frequency: "4x/jour",
    targetAudience: "15-25 ans, Dakar & Thiès",
  },
  {
    id: "4",
    name: "Tigo Back to School",
    advertiser: "Tigo Sénégal",
    budget: 800000,
    spent: 0,
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    status: "draft" as const,
    impressions: 0,
    reach: 0,
    clicks: 0,
    frequency: "3x/jour",
    targetAudience: "18-25 ans, National",
  },
  {
    id: "5",
    name: "Orange Ramadhan Special",
    advertiser: "Orange Money",
    budget: 1200000,
    spent: 1200000,
    startDate: "2025-03-01",
    endDate: "2025-03-30",
    status: "completed" as const,
    impressions: 456000,
    reach: 178000,
    clicks: 23400,
    frequency: "6x/jour",
    targetAudience: "Tous ages, National",
  },
  {
    id: "6",
    name: "Campagne Suspendue Tigo",
    advertiser: "Tigo Sénégal",
    budget: 500000,
    spent: 120000,
    startDate: "2025-08-05",
    endDate: "2025-08-20",
    status: "paused" as const,
    impressions: 45000,
    reach: 18000,
    clicks: 2100,
    frequency: "2x/jour",
    targetAudience: "25-40 ans, Dakar",
  },
];

const statusConfig = {
  active: { label: "Active", color: "bg-green-500", icon: Play, variant: "default" as const },
  draft: { label: "Brouillon", color: "bg-gray-500", icon: Edit, variant: "secondary" as const },
  paused: { label: "En pause", color: "bg-yellow-500", icon: Pause, variant: "warning" as const },
  completed: { label: "Terminée", color: "bg-blue-500", icon: CheckCircle2, variant: "outline" as const },
  cancelled: { label: "Annulée", color: "bg-red-500", icon: XCircle, variant: "danger" as const },
};

function formatCFA(amount: number): string {
  return new Intl.NumberFormat("fr-SN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " FCFA";
}

export default function AdvertisingPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "advertisers">("campaigns");

  const totalRevenue = campaigns.reduce((a, c) => a + c.spent, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const totalImpressions = campaigns.reduce((a, c) => a + c.impressions, 0);
  const totalReach = campaigns.reduce((a, c) => a + c.reach, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Publicités
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gérez vos campagnes publicitaires et annonceurs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab("advertisers")}>
            <Briefcase className="w-4 h-4 mr-2" />
            Annonceurs
          </Button>
          <Button onClick={() => setActiveTab("campaigns")}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle campagne
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCFA(totalRevenue)}
                </div>
                <div className="text-sm text-gray-500">Revenus</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Megaphone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeCampaigns}
                </div>
                <div className="text-sm text-gray-500">Actives</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(totalImpressions / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-gray-500">Impressions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(totalReach / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-gray-500">Portée</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <Button
          variant={activeTab === "campaigns" ? "default" : "ghost"}
          onClick={() => setActiveTab("campaigns")}
        >
          <Megaphone className="w-4 h-4 mr-2" />
          Campagnes
        </Button>
        <Button
          variant={activeTab === "advertisers" ? "default" : "ghost"}
          onClick={() => setActiveTab("advertisers")}
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Annonceurs
        </Button>
      </div>

      {activeTab === "campaigns" ? (
        <>
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Rechercher une campagne..." className="pl-10" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <Button key={key} variant="outline" size="sm">
                      <div className={`w-2 h-2 rounded-full ${config.color} mr-1`} />
                      {config.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns */}
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const statusInfo = statusConfig[campaign.status];
              const StatusIcon = statusInfo.icon;
              const budgetPercent = (campaign.spent / campaign.budget) * 100;

              return (
                <Card key={campaign.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                            {campaign.name}
                          </h3>
                          <Badge variant={statusInfo.variant}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {campaign.advertiser}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {campaign.startDate} → {campaign.endDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {campaign.targetAudience}
                          </span>
                        </div>

                        {/* Budget Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500">
                              Budget: {formatCFA(campaign.budget)}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {budgetPercent.toFixed(0)}% utilisé
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                budgetPercent >= 90
                                  ? "bg-red-500"
                                  : budgetPercent >= 70
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Dépensé: {formatCFA(campaign.spent)}</span>
                            <span>Reste: {formatCFA(campaign.budget - campaign.spent)}</span>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div>
                            <div className="text-xs text-gray-500">Impressions</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {campaign.impressions.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Portée</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {campaign.reach.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Clics</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {campaign.clicks.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Fréquence</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {campaign.frequency}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 lg:flex-shrink-0">
                        {campaign.status === "active" && (
                          <Button variant="outline" size="sm">
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </Button>
                        )}
                        {campaign.status === "paused" && (
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            <Play className="w-4 h-4 mr-1" />
                            Reprendre
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Stats
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Advertisers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Annonceurs</CardTitle>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Annonceur</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Industrie</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Campagnes</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Dépensé</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advertisers.map((adv) => (
                      <tr
                        key={adv.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {adv.name}
                          </div>
                          <div className="text-xs text-gray-500">{adv.contact}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {adv.industry}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {adv.campaigns}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {formatCFA(adv.totalSpent)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={adv.status === "active" ? "default" : "secondary"}>
                            {adv.status === "active" ? "Actif" : "Inactif"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
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
        </>
      )}
    </div>
  );
}
