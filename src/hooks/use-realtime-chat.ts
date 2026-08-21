"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSupabaseRealtime, CHANNELS } from "@/lib/realtime/client";

export interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar?: string;
  content: string;
  timestamp: number;
  isSystem?: boolean;
}

interface UseRealtimeChatOptions {
  radioId: string | null;
  maxLength?: number;
}

export function useRealtimeChat({ radioId, maxLength = 100 }: UseRealtimeChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const channelRef = useRef<ReturnType<typeof getSupabaseRealtime>['channel'] | null>(null);

  useEffect(() => {
    if (!radioId) return;

    const supabase = getSupabaseRealtime();
    const channelName = CHANNELS.chat(radioId);

    const channel = supabase.channel(channelName);

    channel
      .on("broadcast", { event: "chat_message" }, ({ payload }: { payload: ChatMessage }) => {
        setMessages((prev) => {
          const next = [...prev, payload];
          return next.slice(-maxLength);
        });
      })
      .on("broadcast", { event: "chat_typing" }, ({ payload }: { payload: { sender: string } }) => {
        // Could show typing indicator
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.values(state).flat().length;
        setOnlineCount(count);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          await channel.track({
            user_id: `user_${Date.now()}`,
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
  }, [radioId, maxLength]);

  const sendMessage = useCallback(
    (sender: string, content: string, senderAvatar?: string) => {
      if (!radioId || !channelRef.current || !content.trim()) return;

      const message: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender,
        senderAvatar,
        content: content.trim(),
        timestamp: Date.now(),
      };

      channelRef.current.send({
        type: "broadcast",
        event: "chat_message",
        payload: message,
      });

      // Optimistic update
      setMessages((prev) => {
        const next = [...prev, message];
        return next.slice(-maxLength);
      });
    },
    [radioId, maxLength]
  );

  const sendTyping = useCallback(
    (sender: string) => {
      if (!radioId || !channelRef.current) return;

      channelRef.current.send({
        type: "broadcast",
        event: "chat_typing",
        payload: { sender },
      });
    },
    [radioId]
  );

  return {
    messages,
    sendMessage,
    sendTyping,
    isConnected,
    onlineCount,
    clearMessages: () => setMessages([]),
  };
}
