"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  BarChart3,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  TrendingUp,
  TrendingDown,
  Radio,
  Headphones,
  MapPin,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const audienceByHour = [
  { hour: "06h", listeners: 845 },
  { hour: "07h", listeners: 1523 },
  { hour: "08h", listeners: 2156 },
  { hour: "09h", listeners: 1890 },
  { hour: "10h", listeners: 1654 },
  { hour: "11h", listeners: 1432 },
  { hour: "12h", listeners: 1789 },
  { hour: "13h", listeners: 1567 },
  { hour: "14h", listeners: 1345 },
  { hour: "15h", listeners: 1123 },
  { hour: "16h", listeners: 1234 },
  { hour: "17h", listeners: 1567 },
  { hour: "18h", listeners: 1987 },
  { hour: "19h", listeners: 2234 },
  { hour: "20h", listeners: 2456 },
  { hour: "21h", listeners: 2123 },
  { hour: "22h", listeners: 1678 },
  { hour: "23h", listeners: 987 },
];

const audienceByDay = [
  { day: "Lun", listeners: 12450 },
  { day: "Mar", listeners: 13200 },
  { day: "Mer", listeners: 11890 },
  { day: "Jeu", listeners: 12780 },
  { day: "Ven", listeners: 14560 },
  { day: "Sam", listeners: 15230 },
  { day: "Dim", listeners: 13890 },
];

const countries = [
  { name: "Sénégal", value: 65, color: "#22c55e" },
  { name: "Côte d'Ivoire", value: 12, color: "#3b82f6" },
  { name: "Mali", value: 8, color: "#f97316" },
  { name: "Guinée", value: 6, color: "#8b5cf6" },
  { name: "France", value: 5, color: "#ec4899" },
  { name: "Autres", value: 4, color: "#6b7280" },
];

const devices = [
  { name: "Mobile", value: 72, color: "#22c55e" },
  { name: "Desktop", value: 21, color: "#3b82f6" },
  { name: "Tablette", value: 7, color: "#f97316" },
];

const topShows = [
  { name: "Réveil Matinal", listeners: 4523, duration: "42 min" },
  { name: "Musique Africaine", listeners: 3890, duration: "38 min" },
  { name: "Sport Total", listeners: 2345, duration: "35 min" },
  { name: "Les Info du Jour", listeners: 1987, duration: "28 min" },
  { name: "Espace Culture", listeners: 1234, duration: "31 min" },
];

const topPodcasts = [
  { name: "Interview du Président", listens: 34200, downloads: 12450 },
  { name: "Top 10 Afrobeats", listens: 28700, downloads: 8920 },
  { name: "Analyse Tactical", listens: 42100, downloads: 15680 },
  { name: "Gospel Session Acoustique", listens: 18900, downloads: 5420 },
];

const filters = [
  "Aujourd'hui",
  "7 jours",
  "30 jours",
  "90 jours",
  "Personnalisé",
];

export default function AnalyticsPage() {
  const [activeFilter, setActiveFilter] = useState("7 jours");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Suivez vos auditeurs et vos performances
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Time Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
          >
            <Calendar className="w-4 h-4 mr-1" />
            {filter}
          </Button>
        ))}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Radio className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  1,284
                </div>
                <div className="text-sm text-gray-500">Auditeurs</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.4%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  2,436
                </div>
                <div className="text-sm text-gray-500">Pic du jour</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +31.7%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  34 min
                </div>
                <div className="text-sm text-gray-500">Durée moyenne</div>
                <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  -5.2%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  12
                </div>
                <div className="text-sm text-gray-500">Pays</div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +2
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Audience */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Audience horaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={audienceByHour}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Bar
                    dataKey="listeners"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Audience */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Audience hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={audienceByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="listeners"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: "#22c55e", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic & Device */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Auditeurs par pays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="w-[180px] h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countries}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {countries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {countries.map((country) => (
                  <div
                    key={country.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: country.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {country.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {country.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Appareils
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="w-[180px] h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={devices}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-4">
                {devices.map((device) => (
                  <div key={device.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {device.name === "Mobile" && (
                          <Smartphone className="w-4 h-4 text-gray-500" />
                        )}
                        {device.name === "Desktop" && (
                          <Monitor className="w-4 h-4 text-gray-500" />
                        )}
                        {device.name === "Tablette" && (
                          <Monitor className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {device.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {device.value}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${device.value}%`,
                          backgroundColor: device.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Shows */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Émissions les plus écoutées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topShows.map((show, index) => (
                <div
                  key={show.name}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {show.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {show.listeners.toLocaleString()} auditeurs •{" "}
                      {show.duration} moy.
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${
                          (show.listeners / topShows[0].listeners) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Podcasts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              Podcasts les plus écoutés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPodcasts.map((podcast, index) => (
                <div
                  key={podcast.name}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {podcast.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {podcast.listens.toLocaleString()} écoutes •{" "}
                      {podcast.downloads.toLocaleString()} téléchargements
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${
                          (podcast.listens / topPodcasts[0].listens) * 100
                        }%`,
                      }}
                    />
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
