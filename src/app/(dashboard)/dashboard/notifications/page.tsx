"use client";

import { useMyRadio } from "@/hooks/use-radio-data";
import { Bell, Radio, MessageSquare, Heart, BarChart3, Zap } from "lucide-react";

export default function NotificationsPage() {
  const { radio } = useMyRadio();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 mt-1">Alertes et notifications en temps réel</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
        <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium text-gray-600">Notifications en temps réel</p>
        <p className="text-sm mt-1 max-w-md mx-auto">
          Les notifications apparaîtront ici en temps réel : nouveaux messages, dédicaces, votes de sondages,
          changements de statut du stream, etc.
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto">
          {[
            { icon: Radio, label: "Stream", color: "text-blue-600" },
            { icon: MessageSquare, label: "Messages", color: "text-orange-600" },
            { icon: Heart, label: "Dédicaces", color: "text-pink-600" },
            { icon: BarChart3, label: "Sondages", color: "text-purple-600" },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-gray-50 rounded-lg">
              <item.icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
              <span className="text-xs text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
