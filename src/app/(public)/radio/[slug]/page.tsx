"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LiveChat } from "./live-chat";
import { LiveListeners } from "./live-listeners";
import { LivePoll } from "./live-poll";
import { ShareButtons } from "./share-buttons";
import { WhatsAppButton } from "./whatsapp-button";
import {
  Radio,
  Headphones,
  Clock,
  Globe,
  Music,
  Podcast,
  MessageCircle,
  Heart,
  BarChart3,
  Play,
  Pause,
  Calendar,
  MapPin,
  Share2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const supabase = createClient();

interface RadioData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  country?: string;
  city?: string;
  logo_url?: string;
  website_url?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

interface StreamData {
  id: string;
  stream_url: string;
  stream_type: string;
  bitrate: number;
  codec: string;
  status: string;
}

interface PodcastData {
  id: string;
  title: string;
  description?: string;
  audio_url: string;
  duration_seconds?: number;
  category?: string;
  created_at: string;
  play_count: number;
}

interface ShowData {
  id: string;
  title: string;
  description?: string;
  host_name?: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
}

export default function PublicRadioPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [radio, setRadio] = useState<RadioData | null>(null);
  const [stream, setStream] = useState<StreamData | null>(null);
  const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
  const [shows, setShows] = useState<ShowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetch() {
      // Get radio
      const { data: radioData, error } = await supabase
        .from("radios")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .single();

      if (error || !radioData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setRadio(radioData);

      // Get stream
      const { data: streamData } = await supabase
        .from("streams")
        .select("*")
        .eq("radio_id", radioData.id)
        .order("is_backup", { ascending: true })
        .limit(1)
        .single();

      setStream(streamData);

      // Get podcasts
      const { data: podcastData } = await supabase
        .from("podcasts")
        .select("*")
        .eq("radio_id", radioData.id)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(10);

      setPodcasts(podcastData || []);

      // Get shows
      const { data: showData } = await supabase
        .from("shows")
        .select("*")
        .eq("radio_id", radioData.id)
        .order("day_of_week", { ascending: true });

      setShows(showData || []);
      setLoading(false);
    }

    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (notFound || !radio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Radio introuvable</h1>
          <p className="text-gray-500">Cette radio n&apos;existe pas ou n&apos;est plus active.</p>
        </div>
      </div>
    );
  }

  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const currentDay = new Date().getDay();
  const todayShows = shows.filter((s) => s.day_of_week === currentDay);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              {radio.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-gray-900">{radio.name}</h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {radio.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{radio.city}</span>}
                {radio.country && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{radio.country}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShareButtons url={typeof window !== "undefined" ? window.location.href : ""} title={radio.name} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Player */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                  <Radio className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{radio.name}</h2>
                  {stream && (
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <span>{stream.bitrate} kbps</span>
                      <span>•</span>
                      <span>{stream.codec.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>

              {stream ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center hover:bg-white/90 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </button>
                  <div className="flex-1">
                    <div className="text-sm text-blue-100 mb-1">
                      {stream.status === "online" ? "🟢 En direct" : "🔴 Hors ligne"}
                    </div>
                    <div className="text-xs text-blue-200">{stream.stream_url}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-blue-200">
                  <p>Aucun flux audio configuré</p>
                </div>
              )}
            </div>

            {/* Description */}
            {radio.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-gray-600 leading-relaxed">{radio.description}</p>
              </div>
            )}

            {/* Today's Shows */}
            {todayShows.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Programme d&apos;aujourd&apos;hui
                </h3>
                <div className="space-y-3">
                  {todayShows.map((show) => (
                    <div key={show.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-mono text-gray-500 w-24">
                        {show.start_time} — {show.end_time}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{show.title}</div>
                        {show.host_name && <div className="text-xs text-gray-500">Avec {show.host_name}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Podcasts */}
            {podcasts.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Podcast className="w-5 h-5 text-purple-600" />
                  Derniers podcasts
                </h3>
                <div className="space-y-3">
                  {podcasts.map((podcast) => (
                    <div key={podcast.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                        <Podcast className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{podcast.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          {podcast.duration_seconds && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.floor(podcast.duration_seconds / 60)}:{(podcast.duration_seconds % 60).toString().padStart(2, "0")}
                            </span>
                          )}
                          <span>{new Date(podcast.created_at).toLocaleDateString("fr-FR")}</span>
                          <span className="flex items-center gap-1">
                            <Headphones className="w-3 h-3" />
                            {podcast.play_count || 0}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <LiveListeners radioId={radio.id} />
            <LivePoll radioId={radio.id} />
            <LiveChat radioId={radio.id} radioName={radio.name} />

            {/* Social Links */}
            {(radio.facebook || radio.twitter || radio.instagram || radio.website_url) && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Suivez-nous</h3>
                <div className="flex gap-2">
                  {radio.website_url && (
                    <a href={radio.website_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {radio.facebook && (
                    <a href={radio.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200">
                      <span className="text-blue-600 text-sm font-bold">f</span>
                    </a>
                  )}
                  {radio.twitter && (
                    <a href={radio.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-100 rounded-lg hover:bg-sky-200">
                      <span className="text-sky-600 text-sm font-bold">X</span>
                    </a>
                  )}
                  {radio.instagram && (
                    <a href={radio.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-100 rounded-lg hover:bg-pink-200">
                      <span className="text-pink-600 text-sm font-bold">ig</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <WhatsAppButton radioName={radio.name} />
    </div>
  );
}
