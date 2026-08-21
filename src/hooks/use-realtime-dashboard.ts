"use client";

import { useEffect, useState, useRef } from "react";
import { getSupabaseRealtime, CHANNELS } from "@/lib/realtime/client";

export interface DashboardEvent {
  type:
    | "listener_update"
    | "message_new"
    | "dedication_new"
    | "poll_vote"
    | "stream_status"
    | "campaign_impression"
    | "podcast_play";
  data: Record<string, unknown>;
  timestamp: number;
}

export interface DashboardStats {
  liveListeners: number;
  todayListens: number;
  unreadMessages: number;
  pendingDedications: number;
  activePolls: number;
  streamStatus: "online" | "offline" | "warning";
}

export function useRealtimeDashboard(radioId: string | null) {
  const [stats, setStats] = useState<DashboardStats>({
    liveListeners: 0,
    todayListens: 0,
    unreadMessages: 0,
    pendingDedications: 0,
    activePolls: 0,
    streamStatus: "offline",
  });
  const [recentEvents, setRecentEvents] = useState<DashboardEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<ReturnType<typeof getSupabaseRealtime>['channel'] | null>(null);

  useEffect(() => {
    if (!radioId) return;

    const supabase = getSupabaseRealtime();
    const channelName = CHANNELS.dashboard(radioId);

    const channel = supabase.channel(channelName);

    channel
      .on("broadcast", { event: "stats_update" }, ({ payload }: { payload: Partial<DashboardStats> }) => {
        setStats((prev) => ({ ...prev, ...payload }));
      })
      .on("broadcast", { event: "listener_update" }, ({ payload }: { payload: { count: number } }) => {
        setStats((prev) => ({ ...prev, liveListeners: payload.count }));
        addEvent({ type: "listener_update", data: payload, timestamp: Date.now() });
      })
      .on("broadcast", { event: "message_new" }, ({ payload }: { payload: { id: string; sender: string } }) => {
        setStats((prev) => ({ ...prev, unreadMessages: prev.unreadMessages + 1 }));
        addEvent({ type: "message_new", data: payload, timestamp: Date.now() });
      })
      .on("broadcast", { event: "dedication_new" }, ({ payload }: { payload: { id: string; senderName: string } }) => {
        setStats((prev) => ({ ...prev, pendingDedications: prev.pendingDedications + 1 }));
        addEvent({ type: "dedication_new", data: payload, timestamp: Date.now() });
      })
      .on("broadcast", { event: "poll_vote" }, ({ payload }: { payload: { pollId: string } }) => {
        addEvent({ type: "poll_vote", data: payload, timestamp: Date.now() });
      })
      .on("broadcast", { event: "stream_status" }, ({ payload }: { payload: { status: "online" | "offline" | "warning" } }) => {
        setStats((prev) => ({ ...prev, streamStatus: payload.status }));
        addEvent({ type: "stream_status", data: payload, timestamp: Date.now() });
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    channelRef.current = channel;

    function addEvent(event: DashboardEvent) {
      setRecentEvents((prev) => [event, ...prev].slice(0, 50));
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [radioId]);

  return {
    stats,
    recentEvents,
    isConnected,
  };
}
