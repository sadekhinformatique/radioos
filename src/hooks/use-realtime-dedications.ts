"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSupabaseRealtime, CHANNELS } from "@/lib/realtime/client";

export interface RealtimeDedication {
  id: string;
  senderName: string;
  recipientName: string;
  songTitle: string;
  artistName: string;
  message?: string;
  status: "pending" | "approved" | "played" | "rejected";
  timestamp: number;
}

export function useRealtimeDedications(radioId: string | null) {
  const [dedications, setDedications] = useState<RealtimeDedication[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<ReturnType<typeof getSupabaseRealtime>['channel'] | null>(null);

  useEffect(() => {
    if (!radioId) return;

    const supabase = getSupabaseRealtime();
    const channelName = CHANNELS.dedications(radioId);

    const channel = supabase.channel(channelName);

    channel
      .on("broadcast", { event: "dedication_new" }, ({ payload }: { payload: RealtimeDedication }) => {
        setDedications((prev) => [payload, ...prev].slice(0, 50));
      })
      .on("broadcast", { event: "dedication_approved" }, ({ payload }: { payload: { id: string } }) => {
        setDedications((prev) =>
          prev.map((d) => (d.id === payload.id ? { ...d, status: "approved" as const } : d))
        );
      })
      .on("broadcast", { event: "dedication_played" }, ({ payload }: { payload: { id: string } }) => {
        setDedications((prev) =>
          prev.map((d) => (d.id === payload.id ? { ...d, status: "played" as const } : d))
        );
      })
      .on("broadcast", { event: "dedication_rejected" }, ({ payload }: { payload: { id: string } }) => {
        setDedications((prev) =>
          prev.map((d) => (d.id === payload.id ? { ...d, status: "rejected" as const } : d))
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

  const broadcastNewDedication = useCallback(
    (dedication: Omit<RealtimeDedication, "timestamp">) => {
      if (!radioId || !channelRef.current) return;

      const payload: RealtimeDedication = {
        ...dedication,
        timestamp: Date.now(),
      };

      channelRef.current.send({
        type: "broadcast",
        event: "dedication_new",
        payload,
      });
    },
    [radioId]
  );

  const broadcastStatusChange = useCallback(
    (id: string, status: "approved" | "played" | "rejected") => {
      if (!radioId || !channelRef.current) return;

      const eventName =
        status === "approved"
          ? "dedication_approved"
          : status === "played"
          ? "dedication_played"
          : "dedication_rejected";

      channelRef.current.send({
        type: "broadcast",
        event: eventName,
        payload: { id },
      });
    },
    [radioId]
  );

  return {
    dedications,
    isConnected,
    broadcastNewDedication,
    broadcastStatusChange,
  };
}
