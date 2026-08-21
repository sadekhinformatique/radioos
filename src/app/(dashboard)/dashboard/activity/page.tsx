"use client";

import { useState, useEffect } from "react";
import { useMyRadio } from "@/hooks/use-radio-data";
import { createClient } from "@/utils/supabase/client";
import {
  Activity,
  Clock,
  Filter,
  Radio,
  Users,
  MessageSquare,
  Podcast,
  Settings,
  CreditCard,
  LogIn,
  LogOut,
  Shield,
} from "lucide-react";

const supabase = createClient();

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  "auth.login": "Connexion",
  "auth.logout": "Déconnexion",
  "radio.create": "Radio créée",
  "radio.update": "Radio mise à jour",
  "stream.create": "Flux ajouté",
  "stream.delete": "Flux supprimé",
  "podcast.create": "Podcast publié",
  "podcast.delete": "Podcast supprimé",
  "message.read": "Message lu",
  "dedication.approve": "Dédicace approuvée",
  "dedication.reject": "Dédicace rejetée",
  "poll.create": "Sondage créé",
  "user.invite": "Utilisateur invité",
  "settings.update": "Paramètres mis à jour",
};

const ENTITY_ICONS: Record<string, typeof Radio> = {
  radio: Radio,
  stream: Radio,
  podcast: Podcast,
  message: MessageSquare,
  dedication: MessageSquare,
  poll: Activity,
  user: Users,
  settings: Settings,
  auth: Shield,
  billing: CreditCard,
};

const ENTITY_COLORS: Record<string, string> = {
  radio: "bg-purple-100 text-purple-600",
  stream: "bg-emerald-100 text-emerald-600",
  podcast: "bg-pink-100 text-pink-600",
  message: "bg-orange-100 text-orange-600",
  dedication: "bg-rose-100 text-rose-600",
  poll: "bg-indigo-100 text-indigo-600",
  user: "bg-cyan-100 text-cyan-600",
  settings: "bg-gray-100 text-gray-600",
  auth: "bg-blue-100 text-blue-600",
  billing: "bg-amber-100 text-amber-600",
};

export default function ActivityPage() {
  const { radio } = useMyRadio();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!radio) return;

    async function fetchLogs() {
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("radio_id", radio!.id)
        .order("created_at", { ascending: false })
        .limit(100);

      setLogs(data || []);
      setLoading(false);
    }

    fetchLogs();
  }, [radio]);

  const filteredLogs = filter === "all"
    ? logs
    : logs.filter((l) => l.entity_type === filter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal d&apos;activité</h1>
          <p className="text-gray-500 mt-1">Historique des actions sur votre radio</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "all", label: "Tout" },
          { id: "auth", label: "Auth" },
          { id: "radio", label: "Radio" },
          { id: "stream", label: "Stream" },
          { id: "podcast", label: "Podcasts" },
          { id: "message", label: "Messages" },
          { id: "dedication", label: "Dédicaces" },
          { id: "poll", label: "Sondages" },
          { id: "user", label: "Utilisateurs" },
          { id: "settings", label: "Paramètres" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === item.id
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-xl border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredLogs.map((log) => {
              const Icon = ENTITY_ICONS[log.entity_type] || Activity;
              const colorClass = ENTITY_COLORS[log.entity_type] || "bg-gray-100 text-gray-600";

              return (
                <div key={log.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {ACTION_LABELS[log.action] || log.action}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="text-sm text-gray-500 truncate">
                        {JSON.stringify(log.details)}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(log.created_at)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-gray-600 font-medium">Aucune activité</p>
            <p className="text-sm mt-1">Les actions seront enregistrées ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
