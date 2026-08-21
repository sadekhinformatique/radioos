"use client";

import { useMyRadio, useStreams, usePodcasts, useMessages, useDedications, useAnalytics } from "@/hooks/use-radio-data";
import { useRealtimeListeners } from "@/hooks/use-realtime-listeners";
import {
  Radio,
  Headphones,
  Mic,
  MessageSquare,
  Heart,
  TrendingUp,
  Clock,
  Activity,
  BarChart3,
  Podcast,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { radio, loading: radioLoading } = useMyRadio();
  const { data: streams } = useStreams(radio?.id || null);
  const { data: podcasts } = usePodcasts(radio?.id || null);
  const { data: messages } = useMessages(radio?.id || null);
  const { data: dedications } = useDedications(radio?.id || null);
  const { stats: analytics, loading: analyticsLoading } = useAnalytics(radio?.id || null, 7);
  const { count: liveListeners, isConnected } = useRealtimeListeners(radio?.id || null);

  const mainStream = streams?.find((s) => s.status === "online");
  const unreadMessages = messages?.filter((m) => m.status === "unread").length || 0;
  const pendingDedications = dedications?.filter((d) => d.status === "pending").length || 0;

  if (radioLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!radio) {
    return (
      <div className="text-center py-12">
        <Radio className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune radio configurée</h2>
        <p className="text-gray-500">Créez votre radio pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {radio.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Voici un aperçu de votre radio</p>
      </div>

      {/* Live Status Banner */}
      <div className={`rounded-xl p-4 flex items-center justify-between ${mainStream ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-200"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${mainStream ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
          <div>
            <div className="font-medium text-gray-900">
              {mainStream ? "🟢 Stream en ligne" : "🔴 Stream hors ligne"}
            </div>
            <div className="text-sm text-gray-500">
              {mainStream ? `${mainStream.bitrate} kbps • ${mainStream.codec.toUpperCase()}` : "Configurez votre flux audio"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-gray-900">{liveListeners}</span>
            <span className="text-gray-500">en ligne</span>
          </div>
          {isConnected && (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              <Zap className="w-3 h-3 mr-1" />
              Live
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Headphones className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-500">Auditeurs aujourd&apos;hui</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analyticsLoading ? "..." : analytics.todayListeners}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Total 7j : {analytics.totalListeners}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-gray-500">Durée moyenne</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analyticsLoading ? "..." : `${analytics.avgDuration} min`}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {analytics.uniqueCountries} pays
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Podcast className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-500">Podcasts</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {podcasts?.length || 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            publiés
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-gray-500">Messages</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {unreadMessages}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            non lus
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Auditeurs (7 derniers jours)
            </h3>
          </div>
          {analytics.dailyData.length > 0 ? (
            <div className="space-y-2">
              {analytics.dailyData.map((day) => {
                const maxListeners = Math.max(...analytics.dailyData.map(d => d.listeners), 1);
                const width = (day.listeners / maxListeners) * 100;
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16">
                      {new Date(day.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">
                      {day.listeners}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune donnée pour le moment</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="space-y-3">
            {[
              { icon: Radio, label: "Voir le stream", href: "/dashboard/streaming", color: "text-blue-600" },
              { icon: MessageSquare, label: `${unreadMessages} messages non lus`, href: "/dashboard/messages", color: "text-orange-600" },
              { icon: Heart, label: `${pendingDedications} dédicaces en attente`, href: "/dashboard/dedications", color: "text-pink-600" },
              { icon: Podcast, label: "Gérer les podcasts", href: "/dashboard/podcasts", color: "text-purple-600" },
              { icon: TrendingUp, label: "Voir les analytics", href: "/dashboard/analytics", color: "text-emerald-600" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      {messages && messages.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Derniers messages</h3>
            <a href="/dashboard/messages" className="text-sm text-blue-600 hover:underline">
              Voir tout →
            </a>
          </div>
          <div className="space-y-3">
            {messages.slice(0, 5).map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                  {msg.sender_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{msg.sender_name}</span>
                    <Badge className="text-xs bg-gray-100 text-gray-600">{msg.source}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{msg.content}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
