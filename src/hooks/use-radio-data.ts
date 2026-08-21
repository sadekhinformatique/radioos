"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export interface Radio {
  id: string;
  name: string;
  slug: string;
  description?: string;
  country?: string;
  city?: string;
  logo_url?: string;
  website_url?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  status: string;
  created_at: string;
}

export interface Stream {
  id: string;
  radio_id: string;
  stream_url: string;
  stream_type: string;
  bitrate: number;
  codec: string;
  status: string;
  is_backup: boolean;
  created_at: string;
}

export interface Podcast {
  id: string;
  radio_id: string;
  title: string;
  description?: string;
  audio_url: string;
  duration_seconds?: number;
  category?: string;
  tags?: string[];
  status: string;
  play_count: number;
  download_count: number;
  created_at: string;
}

export interface Message {
  id: string;
  radio_id: string;
  sender_name: string;
  sender_phone?: string;
  content: string;
  source: string;
  status: string;
  priority: string;
  created_at: string;
}

export interface Dedication {
  id: string;
  radio_id: string;
  sender_name: string;
  sender_phone?: string;
  recipient_name: string;
  song_title: string;
  artist_name: string;
  message?: string;
  status: string;
  created_at: string;
}

export interface Poll {
  id: string;
  radio_id: string;
  question: string;
  options: string[];
  status: string;
  expires_at?: string;
  created_at: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  option_index: number;
  voter_ip: string;
  created_at: string;
}

export interface Show {
  id: string;
  radio_id: string;
  title: string;
  description?: string;
  host_name?: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  category?: string;
  status: string;
  created_at: string;
}

export interface AdCampaign {
  id: string;
  radio_id: string;
  name: string;
  advertiser_id?: string;
  budget: number;
  start_date: string;
  end_date: string;
  audio_url?: string;
  target_countries?: string[];
  impressions_goal?: number;
  impressions: number;
  clicks: number;
  status: string;
  created_at: string;
}

export interface RadioMember {
  id: string;
  radio_id: string;
  user_id: string;
  role: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  radio_id: string;
  stream_id?: string;
  event_type: string;
  event_data?: Record<string, unknown>;
  country?: string;
  city?: string;
  device?: string;
  os?: string;
  browser?: string;
  quality?: string;
  duration_seconds?: number;
  recorded_at: string;
}

// ============================================
// Hook: Get current user's radio
// ============================================
export function useMyRadio() {
  const [radio, setRadio] = useState<Radio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRadio() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Get user's radio membership
        const { data: membership } = await supabase
          .from("radio_members")
          .select("radio_id")
          .eq("user_id", user.id)
          .single();

        if (!membership) {
          setLoading(false);
          return;
        }

        // Get radio details
        const { data: radio, error } = await supabase
          .from("radios")
          .select("*")
          .eq("id", membership.radio_id)
          .single();

        if (error) throw error;
        setRadio(radio);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }

    fetchRadio();
  }, []);

  return { radio, loading, error };
}

// ============================================
// Generic fetcher hook
// ============================================
function useRadioTable<T>(table: string, radioId: string | null, options?: {
  orderBy?: string;
  ascending?: boolean;
  filters?: Record<string, unknown>;
  limit?: number;
}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!radioId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from(table).select("*").eq("radio_id", radioId);

      if (options?.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
          if (value !== undefined && value !== null && value !== "") {
            query = query.eq(key, value);
          }
        }
      }

      const orderBy = options?.orderBy || "created_at";
      const ascending = options?.ascending ?? false;
      query = query.order(orderBy, { ascending });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setData(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [radioId, table, JSON.stringify(options?.filters), options?.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================
// Specific data hooks
// ============================================
export function useStreams(radioId: string | null) {
  return useRadioTable<Stream>("streams", radioId);
}

export function usePodcasts(radioId: string | null) {
  return useRadioTable<Podcast>("podcasts", radioId);
}

export function useMessages(radioId: string | null, status?: string) {
  return useRadioTable<Message>("messages", radioId, {
    filters: status ? { status } : undefined,
  });
}

export function useDedications(radioId: string | null, status?: string) {
  return useRadioTable<Dedication>("dedications", radioId, {
    filters: status ? { status } : undefined,
  });
}

export function usePolls(radioId: string | null, status?: string) {
  return useRadioTable<Poll>("polls", radioId, {
    filters: status ? { status } : undefined,
  });
}

export function useShows(radioId: string | null) {
  return useRadioTable<Show>("shows", radioId);
}

export function useCampaigns(radioId: string | null) {
  return useRadioTable<AdCampaign>("ad_campaigns", radioId);
}

export function useRadioMembers(radioId: string | null) {
  const [members, setMembers] = useState<RadioMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!radioId) { setLoading(false); return; }

    async function fetch() {
      const { data } = await supabase
        .from("radio_members")
        .select("*, user:users(id, email, full_name, avatar_url)")
        .eq("radio_id", radioId);

      setMembers(data || []);
      setLoading(false);
    }

    fetch();
  }, [radioId]);

  return { members, loading };
}

export function useAnalytics(radioId: string | null, days = 7) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListeners: 0,
    todayListeners: 0,
    avgDuration: 0,
    uniqueCountries: 0,
    topCountries: [] as { country: string; count: number }[],
    topDevices: [] as { device: string; count: number }[],
    dailyData: [] as { date: string; listeners: number; duration: number }[],
  });

  useEffect(() => {
    if (!radioId) { setLoading(false); return; }

    async function fetch() {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - days);

      const { data } = await supabase
        .from("analytics")
        .select("*")
        .eq("radio_id", radioId)
        .gte("recorded_at", dateFrom.toISOString())
        .order("recorded_at", { ascending: false });

      const allEvents = data || [];
      setEvents(allEvents);

      // Calculate stats
      const listeners = allEvents.filter(e => e.event_type === "listen_start");
      const today = new Date().toISOString().split("T")[0];
      const todayListeners = listeners.filter(e => e.recorded_at.startsWith(today));

      const countryMap = new Map<string, number>();
      const deviceMap = new Map<string, number>();
      const dailyMap = new Map<string, { listeners: number; duration: number }>();

      listeners.forEach(e => {
        if (e.country) countryMap.set(e.country, (countryMap.get(e.country) || 0) + 1);
        if (e.device) deviceMap.set(e.device, (deviceMap.get(e.device) || 0) + 1);

        const day = e.recorded_at.split("T")[0];
        if (!dailyMap.has(day)) dailyMap.set(day, { listeners: 0, duration: 0 });
        const dayData = dailyMap.get(day)!;
        dayData.listeners++;
        dayData.duration += e.duration_seconds || 0;
      });

      const totalDuration = listeners.reduce((sum, e) => sum + (e.duration_seconds || 0), 0);

      setStats({
        totalListeners: listeners.length,
        todayListeners: todayListeners.length,
        avgDuration: listeners.length > 0 ? Math.round(totalDuration / listeners.length) : 0,
        uniqueCountries: countryMap.size,
        topCountries: Array.from(countryMap.entries())
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        topDevices: Array.from(deviceMap.entries())
          .map(([device, count]) => ({ device, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        dailyData: Array.from(dailyMap.entries())
          .map(([date, data]) => ({ date, ...data }))
          .sort((a, b) => a.date.localeCompare(b.date)),
      });

      setLoading(false);
    }

    fetch();
  }, [radioId, days]);

  return { events, stats, loading };
}

// ============================================
// Mutation helpers
// ============================================
export async function createRecord(table: string, data: Record<string, unknown>) {
  const { data: result, error } = await supabase.from(table).insert(data).select().single();
  if (error) throw error;
  return result;
}

export async function updateRecord(table: string, id: string, data: Record<string, unknown>) {
  const { data: result, error } = await supabase.from(table).update(data).eq("id", id).select().single();
  if (error) throw error;
  return result;
}

export async function deleteRecord(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function updateMessageStatus(id: string, status: string) {
  return updateRecord("messages", id, { status });
}

export async function updateDedicationStatus(id: string, status: string) {
  return updateRecord("dedications", id, { status });
}
