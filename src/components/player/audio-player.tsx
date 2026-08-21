"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  Radio,
  Wifi,
  WifiOff,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AudioPlayerProps {
  streamUrl?: string;
  title?: string;
  artist?: string;
  isLive?: boolean;
  isOnAir?: boolean;
  className?: string;
  compact?: boolean;
}

export function AudioPlayer({
  streamUrl = "",
  title = "RadioOS Live",
  artist = "En direct",
  isLive = true,
  isOnAir = true,
  className,
  compact = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(80);
  const [isConnected, setIsConnected] = React.useState(true);
  const [listeners, setListeners] = React.useState(1284);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const togglePlay = React.useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(streamUrl);
      audioRef.current.volume = volume / 100;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, streamUrl, volume]);

  const toggleMute = React.useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseInt(e.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
    },
    []
  );

  const handleShare = React.useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Écoutez ${title} en direct sur RadioOS`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [title]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setListeners((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:bg-gray-900/95",
          className
        )}
      >
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{artist}</p>
        </div>
        {isLive && (
          <Badge variant="online" className="hidden sm:flex">
            LIVE
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-900",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
        >
          {isPlaying ? (
            <Pause className="h-7 w-7" />
          ) : (
            <Play className="h-7 w-7 ml-1" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {title}
            </p>
            {isLive && (
              <span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                LIVE
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{artist}</p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 accent-blue-600"
          />
        </div>

        <button
          onClick={handleShare}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            {isConnected ? (
              <Wifi className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-red-500" />
            )}
            {isConnected ? "Connecté" : "Déconnecté"}
          </span>
          <span className="flex items-center gap-1">
            <Radio className="h-3.5 w-3.5" />
            128 kbps
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {listeners.toLocaleString("fr-FR")} auditeurs
          </span>
        </div>
      </div>
    </div>
  );
}
