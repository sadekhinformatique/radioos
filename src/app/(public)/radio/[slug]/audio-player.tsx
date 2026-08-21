"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  Wifi,
  WifiOff,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface AudioPlayerProps {
  streamUrl: string;
  streamType: string;
  radioName: string;
  isLive: boolean;
  bitrate: number;
}

export function AudioPlayer({ streamUrl, streamType, radioName, isLive, bitrate }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSaving, setDataSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error" | "idle">("idle");

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "none";
    audioRef.current = audio;

    audio.addEventListener("play", () => {
      setIsPlaying(true);
      setConnectionStatus("connected");
      setError(null);
    });

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("waiting", () => {
      setIsLoading(true);
    });

    audio.addEventListener("canplay", () => {
      setIsLoading(false);
      setConnectionStatus("connected");
    });

    audio.addEventListener("error", () => {
      setIsPlaying(false);
      setIsLoading(false);
      setConnectionStatus("error");
      setError("Impossible de se connecter au flux audio");
    });

    audio.addEventListener("stalled", () => {
      setConnectionStatus("connecting");
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    setIsLoading(true);
    setConnectionStatus("connecting");
    setError(null);

    try {
      // For HLS streams, use hls.js
      if (streamType === "hls" && typeof window !== "undefined") {
        // Dynamic import of hls.js
        const Hls = (await import("hls.js")).default;
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(audio);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            audio.play().catch(() => {});
          });
        } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
          // Native HLS support (Safari)
          audio.src = streamUrl;
          audio.play().catch(() => {});
        }
      } else {
        // Direct stream (Icecast, Shoutcast, etc.)
        audio.src = streamUrl;
        await audio.play();
      }
    } catch (err) {
      setError("Erreur de connexion au flux");
      setConnectionStatus("error");
      setIsLoading(false);
    }
  }, [streamUrl, streamType, isPlaying]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleDataSaving = () => {
    setDataSaving(!dataSaving);
    // In a real app, this would switch to a lower bitrate stream
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{radioName}</h2>
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <span>{bitrate} kbps</span>
              <span>•</span>
              <span>{streamType.toUpperCase()}</span>
              {dataSaving && (
                <>
                  <span>•</span>
                  <span className="text-yellow-300">Mode économie</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connectionStatus === "connected" && (
            <div className="flex items-center gap-1 text-xs text-emerald-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connecté
            </div>
          )}
          {connectionStatus === "connecting" && (
            <div className="flex items-center gap-1 text-xs text-amber-300">
              <Loader2 className="w-3 h-3 animate-spin" />
              Connexion...
            </div>
          )}
          {connectionStatus === "error" && (
            <div className="flex items-center gap-1 text-xs text-red-300">
              <WifiOff className="w-3 h-3" />
              Erreur
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-300" />
          <span className="text-sm text-red-200">{error}</span>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {/* Data Saving Toggle */}
        <button
          onClick={toggleDataSaving}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            dataSaving ? "bg-yellow-500/30 text-yellow-200" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          📶 {dataSaving ? "32 kbps" : "Économie"}
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={!streamUrl || isLoading}
          className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center hover:bg-white/90 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105"
        >
          {isLoading ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-10 h-10" />
          ) : (
            <Play className="w-10 h-10 ml-1" />
          )}
        </button>

        {/* Status */}
        <div className="text-center">
          <div className={`text-sm font-medium ${isLive ? "text-emerald-300" : "text-gray-400"}`}>
            {isLive ? "🟢 LIVE" : "⚪ Hors ligne"}
          </div>
          <div className="text-xs text-blue-200 mt-0.5">
            {isPlaying ? "En lecture" : "En pause"}
          </div>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {isMuted || volume === 0 ? (
            <VolumeX className="w-5 h-5 text-blue-200" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
        />
        <span className="text-xs text-blue-200 w-8 text-right">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>

      {/* Connection Info */}
      {!streamUrl && (
        <div className="text-center py-4 text-blue-200 text-sm">
          Aucun flux audio configuré pour cette radio
        </div>
      )}
    </div>
  );
}
