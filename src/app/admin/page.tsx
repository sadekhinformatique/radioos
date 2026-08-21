"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Radio,
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  AlertTriangle,
  Shield,
  Database,
} from "lucide-react";

const supabase = createClient();

interface AdminStats {
  totalRadios: number;
  activeRadios: number;
  totalUsers: number;
  totalStreams: number;
  onlineStreams: number;
  totalPodcasts: number;
  totalMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalRadios: 0,
    activeRadios: 0,
    totalUsers: 0,
    totalStreams: 0,
    onlineStreams: 0,
    totalPodcasts: 0,
    totalMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [radios, users, streams, podcasts, messages] = await Promise.all([
          supabase.from("radios").select("id, status", { count: "exact" }),
          supabase.from("users").select("id", { count: "exact" }),
          supabase.from("streams").select("id, status", { count: "exact" }),
          supabase.from("podcasts").select("id", { count: "exact" }),
          supabase.from("messages").select("id", { count: "exact" }),
        ]);

        setStats({
          totalRadios: radios.count || 0,
          activeRadios: radios.data?.filter((r) => r.status === "active").length || 0,
          totalUsers: users.count || 0,
          totalStreams: streams.count || 0,
          onlineStreams: streams.data?.filter((s) => s.status === "online").length || 0,
          totalPodcasts: podcasts.count || 0,
          totalMessages: messages.count || 0,
        });
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-600" />
          Super Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Vue d&apos;ensemble de la plateforme RadioOS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-500">Radios</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalRadios}</div>
          <div className="text-xs text-emerald-600">{stats.activeRadios} actives</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-500">Utilisateurs</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-gray-500">Flux</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalStreams}</div>
          <div className="text-xs text-emerald-600">{stats.onlineStreams} en ligne</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-gray-500">Contenu</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalPodcasts}</div>
          <div className="text-xs text-gray-500">podcasts • {stats.totalMessages} messages</div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">État de la plateforme</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Base de données</span>
              <span className="flex items-center gap-1 text-sm text-emerald-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Connectée
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Authentification</span>
              <span className="flex items-center gap-1 text-sm text-emerald-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Opérationnelle
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Realtime</span>
              <span className="flex items-center gap-1 text-sm text-emerald-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Actif
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="space-y-2">
            {[
              { label: "Gérer les radios", href: "/admin/radios", icon: Radio },
              { label: "Gérer les utilisateurs", href: "/admin/users", icon: Users },
              { label: "Monitoring", href: "/admin/monitoring", icon: Activity },
              { label: "Revenus", href: "/admin/revenue", icon: DollarSign },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <action.icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
