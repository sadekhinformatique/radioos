"use client";

import { useEffect, useState, useCallback } from "react";
import { useRealtimeDashboard } from "@/hooks/use-realtime-dashboard";
import { X, MessageSquare, Heart, BarChart3, Radio, Headphones } from "lucide-react";

interface RealtimeNotificationsProps {
  radioId: string;
}

interface Notification {
  id: string;
  type: "message" | "dedication" | "poll" | "stream" | "listener";
  title: string;
  body: string;
  timestamp: number;
}

export function RealtimeNotifications({ radioId }: RealtimeNotificationsProps) {
  const { recentEvents } = useRealtimeDashboard(radioId);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const latest = recentEvents[0];
    if (!latest) return;

    const notif: Notification = {
      id: `${latest.timestamp}`,
      type: getNotifType(latest.type),
      title: getNotifTitle(latest.type),
      body: getNotifBody(latest),
      timestamp: latest.timestamp,
    };

    setNotifications((prev) => [notif, ...prev].slice(0, 5));

    // Auto-dismiss after 5s
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }, 5000);
  }, [recentEvents]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2" style={{ maxWidth: "380px" }}>
      {notifications.map((notif) => (
        <NotificationToast key={notif.id} notification={notif} onDismiss={dismiss} />
      ))}
    </div>
  );
}

function NotificationToast({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const iconMap = {
    message: <MessageSquare className="w-5 h-5" />,
    dedication: <Heart className="w-5 h-5" />,
    poll: <BarChart3 className="w-5 h-5" />,
    stream: <Radio className="w-5 h-5" />,
    listener: <Headphones className="w-5 h-5" />,
  };

  const colorMap = {
    message: "bg-blue-500",
    dedication: "bg-pink-500",
    poll: "bg-purple-500",
    stream: "bg-emerald-500",
    listener: "bg-orange-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-in-right">
      <div className="flex items-start gap-3 p-4">
        <div
          className={`w-10 h-10 rounded-lg ${colorMap[notification.type]} text-white flex items-center justify-center flex-shrink-0`}
        >
          {iconMap[notification.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 text-sm">{notification.title}</div>
          <div className="text-gray-500 text-sm mt-0.5 truncate">{notification.body}</div>
          <div className="text-gray-400 text-xs mt-1">
            {new Date(notification.timestamp).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        <button
          onClick={() => onDismiss(notification.id)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className={`h-1 ${colorMap[notification.type]}`} />
    </div>
  );
}

function getNotifType(type: string): Notification["type"] {
  if (type.includes("message")) return "message";
  if (type.includes("dedication")) return "dedication";
  if (type.includes("poll")) return "poll";
  if (type.includes("stream")) return "stream";
  return "listener";
}

function getNotifTitle(type: string): string {
  if (type.includes("message")) return "💬 Nouveau message";
  if (type.includes("dedication")) return "💖 Nouvelle dédicace";
  if (type.includes("poll")) return "📊 Nouveau vote";
  if (type.includes("stream")) return "🎙️ Statut du stream";
  return "👥 Auditeur";
}

function getNotifBody(event: { type: string; data: Record<string, unknown> }): string {
  if (event.type.includes("message")) {
    return `De ${(event.data as { sender?: string }).sender || "Inconnu"}`;
  }
  if (event.type.includes("dedication")) {
    return `De ${(event.data as { senderName?: string }).senderName || "Inconnu"}`;
  }
  if (event.type.includes("poll")) {
    return "Un auditeur a voté";
  }
  if (event.type.includes("stream")) {
    const status = (event.data as { status?: string }).status;
    return status === "online" ? "🟢 En ligne" : "🔴 Hors ligne";
  }
  return "Nouvel auditeur connecté";
}
