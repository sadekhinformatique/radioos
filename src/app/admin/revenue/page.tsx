"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Users,
  Radio,
  Calendar,
  ArrowUpRight,
  Download,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 2400000, target: 2500000 },
  { month: "Fév", revenue: 2800000, target: 2600000 },
  { month: "Mar", revenue: 3200000, target: 2800000 },
  { month: "Avr", revenue: 2900000, target: 3000000 },
  { month: "Mai", revenue: 3500000, target: 3200000 },
  { month: "Jun", revenue: 3800000, target: 3400000 },
  { month: "Jul", revenue: 4100000, target: 3600000 },
  { month: "Aoû", revenue: 4500000, target: 3800000 },
];

const planDistribution = [
  { name: "Trial", value: 12, color: "#9ca3af" },
  { name: "Starter", value: 24, color: "#3b82f6" },
  { name: "Professional", value: 15, color: "#8b5cf6" },
  { name: "Enterprise", value: 3, color: "#f59e0b" },
];

const recentPayments = [
  { id: "1", radio: "Radio Salam", plan: "Enterprise", amount: 500000, date: "2025-08-21", status: "completed" },
  { id: "2", radio: "RadioOS FM", plan: "Professional", amount: 150000, date: "2025-08-20", status: "completed" },
  { id: "3", radio: "Woelab Radio", plan: "Professional", amount: 150000, date: "2025-08-19", status: "completed" },
  { id: "4", radio: "Radio Horizon", plan: "Starter", amount: 75000, date: "2025-08-18", status: "pending" },
  { id: "5", radio: "Radio Nostalgie", plan: "Professional", amount: 150000, date: "2025-08-17", status: "completed" },
  { id: "6", radio: "Radio Gospel Plus", plan: "Starter", amount: 75000, date: "2025-08-16", status: "completed" },
];

function formatCFA(amount: number): string {
  return new Intl.NumberFormat("fr-SN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " FCFA";
}

export default function AdminRevenuePage() {
  const totalRevenue = revenueData.reduce((a, r) => a + r.revenue, 0);
  const totalTarget = revenueData.reduce((a, r) => a + r.target, 0);
  const revenueGrowth = ((revenueData[7].revenue - revenueData[6].revenue) / revenueData[6].revenue) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Revenus
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Vue d&apos;ensemble de la facturation de la plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCFA(totalRevenue)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Revenus (8 mois)</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +{revenueGrowth.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCFA(totalTarget)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Objectif</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {((totalRevenue / totalTarget) * 100).toFixed(0)}% atteint
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  54
                </div>
                <div className="text-sm text-gray-500 mt-1">Abonnés</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +3 ce mois
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Radio className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCFA(Math.round(totalRevenue / 54))}
                </div>
                <div className="text-sm text-gray-500 mt-1">Moy. / radio</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +5.2%
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Revenus vs Objectifs</CardTitle>
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
                  <Tooltip formatter={(value) => [formatCFA(Number(value))]} />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="#d1d5db"
                    fill="#d1d5db"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                Revenus réels
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-300 rounded-full" />
                Objectifs
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: plan.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {plan.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {plan.value} radios
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Paiements récents</CardTitle>
            <Button variant="ghost" size="sm">
              Tout voir
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Radio</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Montant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                          {payment.radio.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {payment.radio}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{payment.plan}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {formatCFA(payment.amount)}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{payment.date}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={payment.status === "completed" ? "default" : "secondary"}
                        className={
                          payment.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {payment.status === "completed" ? "Complété" : "En attente"}
                      </Badge>
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
