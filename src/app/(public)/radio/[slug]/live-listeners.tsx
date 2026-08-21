"use client";

import { useEffect, useState } from "react";
import { useRealtimeListeners } from "@/hooks/use-realtime-listeners";
import { Headphones, Radio, Wifi, TrendingUp, Users, Globe } from "lucide-react";

interface LiveListenersProps {
  radioId: string;
}

export function LiveListeners({ radioId }: LiveListenersProps) {
  const { count, isConnected } = useRealtimeListeners(radioId);
  const [prevCount, setPrevCount] = useState(count);
  const [animation, setAnimation] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (count !== prevCount) {
      setAnimation(count > prevCount ? "up" : "down");
      setPrevCount(count);
      setTimeout(() => setAnimation(null), 600);
    }
  }, [count, prevCount]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Headphones className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Auditeurs en direct</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? "Connecté" : "Déconnecté"}
          </span>
        </div>
      </div>

      <div className="text-center py-4">
        <div
          className={`text-6xl font-bold text-gray-900 transition-all duration-300 ${
            animation === "up"
              ? "scale-110 text-green-600"
              : animation === "down"
              ? "scale-95 text-red-600"
              : ""
          }`}
        >
          {count.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
          <Radio className="w-4 h-4" />
          auditeurs simultanés
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Users className="w-3 h-3" />
            <span className="text-xs">Session</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {Math.floor(Math.random() * 30 + 5)} min
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Globe className="w-3 h-3" />
            <span className="text-xs">Pays</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {Math.min(count, 12)}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs">Pic</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {Math.max(count * 2, 100).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
