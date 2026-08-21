"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSupabaseRealtime, CHANNELS } from "@/lib/realtime/client";

export interface StreamStatus {
  streamId: string;
  status: "online" | "offline" | "warning";
  listeners: number;
  bitrate: number;
  uptime: number; // seconds
  lastUpdate: number;
}

export function useRealtimeStream(radioId: string | null) {
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState<{ type: "info" | "warning" | "error"; message: string; timestamp: number }[]>([]);
  const channelRef = useRef<ReturnType<typeof getSupabaseRealtime>['channel'] | null>(null);

  useEffect(() => {
    if (!radioId) return;

    const supabase = getSupabaseRealtime();
    const channelName = CHANNELS.streamStatus(radioId);

    const channel = supabase.channel(channelName);

    channel
      .on("broadcast", { event: "stream_status" }, ({ payload }: { payload: StreamStatus }) => {
        setStreamStatus((prev) => {
          // Detect status changes for alerts
          if (prev && prev.status !== payload.status) {
            const alertMsg =
              payload.status === "online"
                ? "🟢 Le stream est de nouveau en ligne"
                : payload.status === "offline"
                ? "🔴 Le stream est hors ligne"
                : "⚠️ Le stream rencontre des problèmes";

            const alertType: "info" | "warning" | "error" = payload.status === "online" ? "info" : "warning";
            setAlerts((a) =>
              [
                { type: alertType, message: alertMsg, timestamp: Date.now() },
                ...a,
              ].slice(0, 10)
            );
          }
          return payload;
        });
      })
      .on("broadcast", { event: "listener_count" }, ({ payload }: { payload: { count: number } }) => {
        setStreamStatus((prev) =>
          prev ? { ...prev, listeners: payload.count, lastUpdate: Date.now() } : prev
        );
      })
      .on("broadcast", { event: "stream_alert" }, ({ payload }: { payload: { type: "info" | "warning" | "error"; message: string } }) => {
        setAlerts((a) =>
          [{ ...payload, timestamp: Date.now() }, ...a].slice(0, 10)
        );
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [radioId]);

  const dismissAlert = useCallback((timestamp: number) => {
    setAlerts((prev) => prev.filter((a) => a.timestamp !== timestamp));
  }, []);

  return {
    streamStatus,
    isConnected,
    alerts,
    dismissAlert,
  };
}
