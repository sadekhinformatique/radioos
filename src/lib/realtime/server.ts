import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

/**
 * Server-side realtime broadcaster
 * Use this from API routes / server actions to broadcast events
 */

function getServerSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

export const CHANNELS = {
  listeners: (radioId: string) => `radio:listeners:${radioId}`,
  chat: (radioId: string) => `radio:chat:${radioId}`,
  dedications: (radioId: string) => `radio:dedications:${radioId}`,
  polls: (radioId: string) => `radio:polls:${radioId}`,
  streamStatus: (radioId: string) => `radio:stream:${radioId}`,
  dashboard: (radioId: string) => `radio:dashboard:${radioId}`,
} as const;

export async function broadcastToChannel(
  radioId: string,
  channelType: keyof typeof CHANNELS,
  event: string,
  payload: Record<string, unknown>
) {
  const supabase = getServerSupabase();
  const channelName = CHANNELS[channelType](radioId);

  const channel = supabase.channel(channelName);

  await channel.send({
    type: "broadcast",
    event,
    payload,
  });

  // Cleanup
  setTimeout(() => {
    supabase.removeChannel(channel);
  }, 1000);
}

// ============================================
// Convenience Broadcasters
// ============================================

export async function broadcastListenerCount(radioId: string, count: number) {
  return broadcastToChannel(radioId, "streamStatus", "listener_count", { count });
}

export async function broadcastStreamStatus(
  radioId: string,
  streamId: string,
  status: "online" | "offline" | "warning",
  listeners: number,
  bitrate: number,
  uptime: number
) {
  return broadcastToChannel(radioId, "streamStatus", "stream_status", {
    streamId,
    status,
    listeners,
    bitrate,
    uptime,
    lastUpdate: Date.now(),
  });
}

export async function broadcastChatMessage(
  radioId: string,
  message: { id: string; sender: string; content: string; timestamp: number }
) {
  return broadcastToChannel(radioId, "chat", "chat_message", message);
}

export async function broadcastNewDedication(
  radioId: string,
  dedication: {
    id: string;
    senderName: string;
    recipientName: string;
    songTitle: string;
    artistName: string;
    message?: string;
    status: string;
  }
) {
  return broadcastToChannel(radioId, "dedications", "dedication_new", {
    ...dedication,
    timestamp: Date.now(),
  });
}

export async function broadcastDedicationStatus(
  radioId: string,
  id: string,
  status: "approved" | "played" | "rejected"
) {
  const event = `dedication_${status}`;
  return broadcastToChannel(radioId, "dedications", event, { id });
}

export async function broadcastPollCreated(
  radioId: string,
  poll: { id: string; question: string; options: { text: string; votes: number; percentage: number }[] }
) {
  return broadcastToChannel(radioId, "polls", "poll_created", {
    ...poll,
    totalVotes: 0,
    isActive: true,
  });
}

export async function broadcastPollVote(
  radioId: string,
  pollId: string,
  optionIndex: number,
  totalVotes: number,
  results: { text: string; votes: number; percentage: number }[]
) {
  return broadcastToChannel(radioId, "polls", "poll_vote", {
    pollId,
    optionIndex,
    totalVotes,
    results,
  });
}

export async function broadcastDashboardStats(
  radioId: string,
  stats: {
    liveListeners?: number;
    todayListens?: number;
    unreadMessages?: number;
    pendingDedications?: number;
    streamStatus?: "online" | "offline" | "warning";
  }
) {
  return broadcastToChannel(radioId, "dashboard", "stats_update", stats);
}

export async function broadcastDashboardEvent(
  radioId: string,
  eventType: string,
  data: Record<string, unknown>
) {
  return broadcastToChannel(radioId, "dashboard", eventType, data);
}
