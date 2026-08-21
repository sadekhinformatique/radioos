"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSupabaseRealtime, CHANNELS, generateListenerId } from "@/lib/realtime/client";

interface ListenerState {
  count: number;
  listeners: Map<string, { joinedAt: number; country?: string; device?: string }>;
}

export function useRealtimeListeners(radioId: string | null) {
  const [state, setState] = useState<ListenerState>({
    count: 0,
    listeners: new Map(),
  });
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<ReturnType<typeof getSupabaseRealtime>['channel'] | null>(null);
  const listenerIdRef = useRef(generateListenerId());

  useEffect(() => {
    if (!radioId) return;

    const supabase = getSupabaseRealtime();
    const channelName = CHANNELS.listeners(radioId);
    const myListenerId = listenerIdRef.current;

    // Create presence channel
    const channel = supabase.channel(channelName);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const presenceMap = state[channelName] || [];

        const listeners = new Map<string, { joinedAt: number; country?: string; device?: string }>();
        presenceMap.forEach((p: Record<string, unknown>) => {
          const id = p.listenerId as string;
          if (id !== myListenerId) {
            listeners.set(id, {
              joinedAt: new Date(p.online_at as string).getTime(),
              country: p.country as string | undefined,
              device: p.device as string | undefined,
            });
          }
        });

        setState({
          count: listeners.size + 1, // +1 for self
          listeners,
        });
      })
      .on("presence", { event: "join" }, ({ key, newPresences }: { key: string; newPresences: Record<string, unknown>[] }) => {
        setState((prev) => ({
          ...prev,
          count: prev.count + newPresences.length,
        }));
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }: { key: string; leftPresences: Record<string, unknown>[] }) => {
        setState((prev) => ({
          ...prev,
          count: Math.max(0, prev.count - leftPresences.length),
        }));
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          await channel.track({
            listenerId: myListenerId,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.untrack();
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [radioId]);

  return {
    count: state.count,
    listeners: state.listeners,
    isConnected,
    listenerId: listenerIdRef.current,
  };
}
