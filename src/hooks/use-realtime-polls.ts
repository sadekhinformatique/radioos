"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSupabaseRealtime, CHANNELS } from "@/lib/realtime/client";

export interface PollOption {
  text: string;
  votes: number;
  percentage: number;
}

export interface RealtimePoll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  isActive: boolean;
  expiresAt?: number;
}

export interface PollVoteEvent {
  pollId: string;
  optionIndex: number;
  totalVotes: number;
  results: PollOption[];
}

export function useRealtimePolls(radioId: string | null) {
  const [activePoll, setActivePoll] = useState<RealtimePoll | null>(null);
  const [voteAnimation, setVoteAnimation] = useState<{ optionIndex: number } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<ReturnType<typeof getSupabaseRealtime>['channel'] | null>(null);
  const votedPollsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!radioId) return;

    const supabase = getSupabaseRealtime();
    const channelName = CHANNELS.polls(radioId);

    const channel = supabase.channel(channelName);

    channel
      .on("broadcast", { event: "poll_created" }, ({ payload }: { payload: RealtimePoll }) => {
        setActivePoll(payload);
        votedPollsRef.current.delete(payload.id);
      })
      .on("broadcast", { event: "poll_vote" }, ({ payload }: { payload: PollVoteEvent }) => {
        setActivePoll((prev) => {
          if (!prev || prev.id !== payload.pollId) return prev;
          return {
            ...prev,
            options: payload.results,
            totalVotes: payload.totalVotes,
          };
        });
        setVoteAnimation({ optionIndex: payload.optionIndex });
        setTimeout(() => setVoteAnimation(null), 600);
      })
      .on("broadcast", { event: "poll_closed" }, ({ payload }: { payload: { pollId: string } }) => {
        setActivePoll((prev) => {
          if (!prev || prev.id !== payload.pollId) return prev;
          return { ...prev, isActive: false };
        });
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

  const vote = useCallback(
    (pollId: string, optionIndex: number) => {
      if (!radioId || !channelRef.current) return false;

      // Check if already voted
      if (votedPollsRef.current.has(pollId)) {
        return false;
      }

      votedPollsRef.current.add(pollId);

      channelRef.current.send({
        type: "broadcast",
        event: "poll_vote",
        payload: { pollId, optionIndex },
      });

      return true;
    },
    [radioId]
  );

  const hasVoted = useCallback((pollId: string) => {
    return votedPollsRef.current.has(pollId);
  }, []);

  return {
    activePoll,
    vote,
    hasVoted,
    voteAnimation,
    isConnected,
  };
}
