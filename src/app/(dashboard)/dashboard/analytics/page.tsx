"use client";

import { useState } from "react";
import { useMyRadio, useAnalytics } from "@/hooks/use-radio-data";
import {
  BarChart3,
  TrendingUp,
  Headphones,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
} from "lucide-react";

export default function AnalyticsPage() {
  const { radio } = useMyRadio();
  const [period, setPeriod] = useState(7);
  const { stats, loading } = useAnalytics(radio?.id || null, period);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Statistiques d&apos;écoute et d&apos;audience</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setPeriod(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${period === d ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {d} jours
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Headphones className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-500">Total auditeurs</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalListeners}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-gray-500">Aujourd&apos;hui</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.todayListeners}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-500">Durée moyenne</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.avgDuration} min</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-gray-500">Pays</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.uniqueCountries}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Auditeurs par jour</h3>
          {stats.dailyData.length > 0 ? (
            <div className="space-y-2">
              {stats.dailyData.map((day) => {
                const maxListeners = Math.max(...stats.dailyData.map((d) => d.listeners), 1);
                const width = (day.listeners / maxListeners) * 100;
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20">
                      {new Date(day.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${width}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{day.listeners}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune donnée pour cette période</p>
            </div>
          )}
        </div>

        {/* Top Countries */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top pays</h3>
          {stats.topCountries.length > 0 ? (
            <div className="space-y-3">
              {stats.topCountries.map((country, idx) => {
                const maxCount = stats.topCountries[0]?.count || 1;
                const width = (country.count / maxCount) * 100;
                return (
                  <div key={country.country} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-4">{idx + 1}</span>
                    <span className="text-sm text-gray-900 w-24 truncate">{country.country}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${width}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{country.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Aucune donnée géographique</p>
          )}
        </div>

        {/* Top Devices */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Appareils</h3>
          {stats.topDevices.length > 0 ? (
            <div className="space-y-3">
              {stats.topDevices.map((device) => {
                const maxCount = stats.topDevices[0]?.count || 1;
                const width = (device.count / maxCount) * 100;
                return (
                  <div key={device.device} className="flex items-center gap-3">
                    {device.device.toLowerCase().includes("mobile") ? (
                      <Smartphone className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Monitor className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-900 w-24 truncate">{device.device}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${width}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{device.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Aucune donnée d&apos;appareil</p>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Résumé</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Période analysée</span>
              <span className="text-sm font-medium text-gray-900">{period} jours</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Total écoutes</span>
              <span className="text-sm font-medium text-gray-900">{stats.totalListeners}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Durée totale</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((stats.totalListeners * stats.avgDuration) / 60)}h
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Dernière mise à jour</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
