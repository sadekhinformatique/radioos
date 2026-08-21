"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  Radio,
  Users,
  Wifi,
  WifiOff,
  Signal,
} from "lucide-react";
import { ShareButtons } from "./share-buttons";

interface AudioPlayerProps {
  streamUrl: string;
  radioName: string;
  currentShow: string;
  currentHost: string;
  isLive: boolean;
  listenersCount: number;
}

export function AudioPlayer({
  streamUrl,
  radioName,
  currentShow,
  currentHost,
  isLive,
  listenersCount,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [dataSaving, setDataSaving] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connected");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "none";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setConnectionStatus("connecting");
      audio.src = streamUrl;
      audio.load();
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setConnectionStatus("connected");
        })
        .catch(() => {
          setConnectionStatus("error");
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseInt(e.target.value);
    audio.volume = newVolume / 100;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
      audio.muted = false;
    }
  };

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 relative">
      {/* Data Saving Banner */}
      {dataSaving && (
        <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
          <Signal className="w-4 h-4" />
          <span>Mode économie de données activé (32 kbps)</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={connectionStatus === "connecting"}
          className={`flex h-14 w-14 items-center justify-center rounded-full text-white transition-all shadow-lg ${
            connectionStatus === "connecting"
              ? "bg-gray-400 cursor-not-allowed"
              : isPlaying
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25"
          }`}
        >
          {connectionStatus === "connecting" ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-7 w-7" />
          ) : (
            <Play className="h-7 w-7 ml-1" />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {radioName}
            </p>
            {isLive && (
              <span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white flex-shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                LIVE
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {currentShow} • {currentHost}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {listenersCount.toLocaleString("fr-FR")} auditeurs
            </span>
            <span className="flex items-center gap-1">
              {connectionStatus === "connected" ? (
                <Wifi className="h-3.5 w-3.5 text-green-500" />
              ) : connectionStatus === "connecting" ? (
                <Wifi className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-red-500" />
              )}
              {connectionStatus === "connected"
                ? "Connecté"
                : connectionStatus === "connecting"
                ? "Connexion..."
                : "Erreur"}
            </span>
            <span>{dataSaving ? "32 kbps" : "128 kbps"}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
            />
          </div>

          {/* Data Saving Toggle */}
          <button
            onClick={() => setDataSaving(!dataSaving)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              dataSaving
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            }`}
            title="Mode économie de données"
          >
            <Signal className="w-4 h-4" />
          </button>

          {/* Share */}
          <div className="relative">
            <button
              onClick={() => setShowShare(!showShare)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Share2 className="h-5 w-5" />
            </button>
            {showShare && (
              <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <ShareButtons
                  title={`Écoutez ${radioName} en direct!`}
                  url={pageUrl}
                  size="md"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
