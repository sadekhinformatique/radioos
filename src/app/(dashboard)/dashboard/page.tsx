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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!radio) {
    return (
      <div className="text-center py-12">
        <Radio className="w-16 h-16 mx-auto text-text-tertiary mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">Aucune radio configurée</h2>
        <p className="text-text-secondary">Créez votre radio pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Bonjour, {radio.name} 👋
        </h1>
        <p className="text-text-secondary mt-1">Voici un aperçu de votre radio</p>
      </div>

      {/* Live Status Banner */}
      <div className={`rounded-xl p-4 flex items-center justify-between ${mainStream ? "bg-success-light border border-success/20" : "bg-background border border-border"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${mainStream ? "bg-success animate-pulse" : "bg-text-tertiary"}`} />
          <div>
            <div className="font-medium text-text-primary">
              {mainStream ? "🟢 Stream en ligne" : "🔴 Stream hors ligne"}
            </div>
            <div className="text-sm text-text-secondary">
              {mainStream ? `${mainStream.bitrate} kbps • ${mainStream.codec.toUpperCase()}` : "Configurez votre flux audio"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-secondary" />
            <span className="font-semibold text-text-primary">{liveListeners}</span>
            <span className="text-text-secondary">en ligne</span>
          </div>
          {isConnected && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success-text">
              <Zap className="w-3 h-3" />
              Live
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Headphones className="w-4 h-4 text-secondary" />
            <span className="text-sm text-text-secondary">Aujourd&apos;hui</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {analyticsLoading ? "..." : analytics.todayListeners}
          </div>
          <div className="text-xs text-text-tertiary mt-1">
            Total 7j : {analytics.totalListeners}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-success" />
            <span className="text-sm text-text-secondary">Durée moyenne</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {analyticsLoading ? "..." : `${analytics.avgDuration} min`}
          </div>
          <div className="text-xs text-text-tertiary mt-1">
            {analytics.uniqueCountries} pays
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Podcast className="w-4 h-4 text-data-4" />
            <span className="text-sm text-text-secondary">Podcasts</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {podcasts?.length || 0}
          </div>
          <div className="text-xs text-text-tertiary mt-1">
            publiés
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-sm text-text-secondary">Messages</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {unreadMessages}
          </div>
          <div className="text-xs text-text-tertiary mt-1">
            non lus
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-secondary" />
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
                    <span className="text-xs text-text-secondary w-16">
                      {new Date(day.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })}
                    </span>
                    <div className="flex-1 bg-border rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-text-primary w-8 text-right">
                      {day.listeners}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-text-tertiary">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune donnée pour le moment</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="font-semibold text-text-primary mb-4">Actions rapides</h3>
          <div className="space-y-3">
            {[
              { icon: Radio, label: "Voir le stream", href: "/dashboard/streaming", color: "text-secondary" },
              { icon: MessageSquare, label: `${unreadMessages} messages non lus`, href: "/dashboard/messages", color: "text-primary" },
              { icon: Heart, label: `${pendingDedications} dédicaces en attente`, href: "/dashboard/dedications", color: "text-data-5" },
              { icon: Podcast, label: "Gérer les podcasts", href: "/dashboard/podcasts", color: "text-data-4" },
              { icon: TrendingUp, label: "Voir les analytics", href: "/dashboard/analytics", color: "text-success" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors"
              >
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-sm font-medium text-text-primary">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      {messages && messages.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Derniers messages</h3>
            <a href="/dashboard/messages" className="text-sm text-secondary hover:underline">
              Voir tout →
            </a>
          </div>
          <div className="space-y-3">
            {messages.slice(0, 5).map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg bg-background">
                <div className="w-8 h-8 rounded-full bg-secondary-light flex items-center justify-center text-secondary text-sm font-medium">
                  {msg.sender_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{msg.sender_name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-border text-text-secondary">{msg.source}</span>
                  </div>
                  <p className="text-sm text-text-secondary truncate">{msg.content}</p>
                </div>
                <span className="text-xs text-text-tertiary">
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
