import { createBrowserClient } from "@supabase/ssr";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseRealtime() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
}

// ============================================
// Channel Names
// ============================================

export const CHANNELS = {
  /**
   * Live listener count channel
   * Broadcasts: { type: "listener_join" | "listener_leave", radioId, listenerId, count }
   */
  listeners: (radioId: string) => `radio:listeners:${radioId}`,

  /**
   * Live chat channel
   * Broadcasts: { type: "chat_message", id, sender, content, timestamp }
   */
  chat: (radioId: string) => `radio:chat:${radioId}`,

  /**
   * Live dedications channel
   * Broadcasts: { type: "dedication_new" | "dedication_approved" | "dedication_played", dedication }
   */
  dedications: (radioId: string) => `radio:dedications:${radioId}`,

  /**
   * Live poll voting channel
   * Broadcasts: { type: "poll_vote", pollId, optionIndex, totalVotes, results }
   */
  polls: (radioId: string) => `radio:polls:${radioId}`,

  /**
   * Live stream status channel
   * Broadcasts: { type: "stream_status", streamId, status, listeners }
   */
  streamStatus: (radioId: string) => `radio:stream:${radioId}`,

  /**
   * Dashboard admin channel (private)
   * Broadcasts: all events for admin dashboard
   */
  dashboard: (radioId: string) => `radio:dashboard:${radioId}`,
} as const;

// ============================================
// Listener Tracking
// ============================================

export interface ListenerInfo {
  id: string;
  joinedAt: number;
  country?: string;
  device?: string;
}

const activeListeners = new Map<string, ListenerInfo>();
let listenerId = "";

export function generateListenerId(): string {
  if (!listenerId) {
    listenerId = `listener_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  return listenerId;
}

export function joinAsListener(radioId: string, metadata?: { country?: string; device?: string }) {
  const id = generateListenerId();
  const info: ListenerInfo = {
    id,
    joinedAt: Date.now(),
    ...metadata,
  };
  activeListeners.set(radioId, info);

  const channel = getSupabaseRealtime().channel(CHANNELS.listeners(radioId));
  channel.track({
    listenerId: id,
    ...metadata,
    online_at: new Date().toISOString(),
  });

  return { id, channel };
}

export function leaveAsListener(radioId: string) {
  activeListeners.delete(radioId);
  const channel = getSupabaseRealtime().channel(CHANNELS.listeners(radioId));
  channel.untrack();
}

// ============================================
// Broadcast Helpers
// ============================================

export function broadcastToRadio(radioId: string, event: string, payload: Record<string, unknown>) {
  const channel = getSupabaseRealtime().channel(CHANNELS.dashboard(radioId));
  channel.send({
    type: "broadcast",
    event,
    payload,
  });
}
