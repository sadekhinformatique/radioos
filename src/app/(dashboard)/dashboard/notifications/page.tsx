"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Wifi,
  WifiOff,
  DollarSign,
  MessageSquare,
  Heart,
  Megaphone,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Settings,
  Mail,
  Smartphone,
  ExternalLink,
  Archive,
  Search,
  RefreshCw,
} from "lucide-react";

type NotificationType =
  | "stream_offline"
  | "stream_restored"
  | "new_message"
  | "new_dedication"
  | "new_campaign"
  | "payment_received"
  | "subscription_expiring"
  | "audience_spike"
  | "system_alert";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "stream_offline",
    title: "Stream hors ligne",
    message: "Votre flux principal est interrompu depuis 5 minutes.",
    timestamp: "2025-08-21T10:30:00",
    read: false,
    actionUrl: "/dashboard/streaming",
    actionLabel: "Voir le streaming",
  },
  {
    id: "2",
    type: "new_message",
    title: "Nouveau message",
    message: "Aminata Diallo vous a envoyé un message: \"Bonjour, j'aimerais faire une dédicace...\"",
    timestamp: "2025-08-21T10:15:00",
    read: false,
    actionUrl: "/dashboard/messages",
    actionLabel: "Voir le message",
  },
  {
    id: "3",
    type: "new_dedication",
    title: "Nouvelle dédicace",
    message: "Ousmane Fall a envoyé une dédicace pour Moussa: \"Bonne fête!\"",
    timestamp: "2025-08-21T09:45:00",
    read: false,
    actionUrl: "/dashboard/dedications",
    actionLabel: "Voir la dédicace",
  },
  {
    id: "4",
    type: "audience_spike",
    title: "Pic d'audience détecté",
    message: "Votre audience a atteint 2,456 auditeurs simultanés, soit +45% par rapport à la moyenne.",
    timestamp: "2025-08-21T09:30:00",
    read: true,
    actionUrl: "/dashboard/analytics",
    actionLabel: "Voir les analytics",
  },
  {
    id: "5",
    type: "new_campaign",
    title: "Nouvelle campagne",
    message: "Orange Money a créé une nouvelle campagne: \"Lancement Orange Money 2.0\".",
    timestamp: "2025-08-21T09:00:00",
    read: true,
    actionUrl: "/dashboard/advertising",
    actionLabel: "Voir les campagnes",
  },
  {
    id: "6",
    type: "payment_received",
    title: "Paiement reçu",
    message: "Paiement de 150,000 FCFA reçu pour votre abonnement Professional.",
    timestamp: "2025-08-20T16:00:00",
    read: true,
  },
  {
    id: "7",
    type: "stream_restored",
    title: "Stream rétabli",
    message: "Votre flux principal est de nouveau en ligne. Durée de l'interruption: 12 minutes.",
    timestamp: "2025-08-20T14:30:00",
    read: true,
  },
  {
    id: "8",
    type: "subscription_expiring",
    title: "Abonnement expirant",
    message: "Votre abonnement Professional expire dans 7 jours. Renouvelez pour continuer.",
    timestamp: "2025-08-19T09:00:00",
    read: true,
    actionUrl: "/dashboard/settings",
    actionLabel: "Gérer l'abonnement",
  },
  {
    id: "9",
    type: "system_alert",
    title: "Mise à jour système",
    message: "RadioOS a été mis à jour vers la version 2.4. Nouvelles fonctionnalités disponibles.",
    timestamp: "2025-08-18T10:00:00",
    read: true,
  },
  {
    id: "10",
    type: "new_message",
    title: "Nouveau message",
    message: "Fatou Sow: \"Bravo pour la nouvelle émission!\"",
    timestamp: "2025-08-17T15:00:00",
    read: true,
  },
];

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  stream_offline: { icon: WifiOff, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  stream_restored: { icon: Wifi, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  new_message: { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  new_dedication: { icon: Heart, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
  new_campaign: { icon: Megaphone, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  payment_received: { icon: DollarSign, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  subscription_expiring: { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  audience_spike: { icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  system_alert: { icon: Settings, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800" },
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [items, setItems] = useState(notifications);

  const filtered = items.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const unreadCount = items.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount > 0
              ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
              : "Tout est lu"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {items.length}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Bell className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {unreadCount}
                </div>
                <div className="text-sm text-gray-500">Non lues</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {items.length - unreadCount}
                </div>
                <div className="text-sm text-gray-500">Lues</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {items.filter((n) => n.type === "stream_offline" && !n.read).length}
                </div>
                <div className="text-sm text-gray-500">Alertes</div>
              </div>
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
              <Input placeholder="Rechercher une notification..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Toutes
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                <Bell className="w-3 h-3 mr-1" />
                Non lues
                {unreadCount > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white text-xs">{unreadCount}</Badge>
                )}
              </Button>
              <Button
                variant={filter === "read" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("read")}
              >
                <Check className="w-3 h-3 mr-1" />
                Lues
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent className="pt-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <BellOff className="w-12 h-12 mb-4 opacity-50" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;

                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                      notification.read
                        ? "bg-gray-50 dark:bg-gray-800/30"
                        : "bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-medium ${
                            notification.read
                              ? "text-gray-700 dark:text-gray-300"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(notification.timestamp).toLocaleString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                          >
                            {notification.actionLabel}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          title="Marquer comme lu"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-600"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Préférences de notification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Mail, label: "Email", description: "Recevoir par email", enabled: true },
              { icon: Bell, label: "Push", description: "Notifications navigateur", enabled: true },
              { icon: Smartphone, label: "SMS", description: "Alertes urgentes uniquement", enabled: false },
            ].map((pref) => {
              const PrefIcon = pref.icon;
              return (
                <div
                  key={pref.label}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <PrefIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {pref.label}
                      </div>
                      <div className="text-xs text-gray-500">{pref.description}</div>
                    </div>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      pref.enabled ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        pref.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
