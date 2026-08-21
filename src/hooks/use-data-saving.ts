'use client';

import { useState, useEffect, useCallback } from 'react';

// Data saving modes
export const DATA_MODES = {
  AUTO: 'auto',
  LOW: 'low',        // 24-32 kbps
  MEDIUM: 'medium',  // 64-96 kbps
  HIGH: 'high',      // 128+ kbps
  TEXT_ONLY: 'text', // No images, minimal data
} as const;

export type DataMode = (typeof DATA_MODES)[keyof typeof DATA_MODES];

interface DataSavingState {
  mode: DataMode;
  isLowData: boolean;
  estimatedKbps: number;
  setMode: (mode: DataMode) => void;
  getStreamQuality: () => { bitrate: number; label: string };
  shouldLoadImages: () => boolean;
  shouldLoadAudio: () => boolean;
  getDataUsage: () => { current: number; limit: number };
}

// Quality presets
const QUALITY_PRESETS: Record<DataMode, { bitrate: number; label: string; audioBitrate: number }> = {
  [DATA_MODES.AUTO]: { bitrate: 0, label: 'Automatique', audioBitrate: 0 },
  [DATA_MODES.LOW]: { bitrate: 32, label: 'Économie (32 kbps)', audioBitrate: 32 },
  [DATA_MODES.MEDIUM]: { bitrate: 96, label: 'Standard (96 kbps)', audioBitrate: 96 },
  [DATA_MODES.HIGH]: { bitrate: 128, label: 'Haute qualité (128 kbps)', audioBitrate: 128 },
  [DATA_MODES.TEXT_ONLY]: { bitrate: 0, label: 'Texte seul', audioBitrate: 0 },
};

// Connection type detection
function getConnectionInfo(): {
  effectiveType: string;
  downlink: number;
  saveData: boolean;
} {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const conn = (navigator as any).connection;
    return {
      effectiveType: conn.effectiveType || '4g',
      downlink: conn.downlink || 10,
      saveData: conn.saveData || false,
    };
  }
  return { effectiveType: '4g', downlink: 10, saveData: false };
}

// Detect if connection is slow
function isSlowConnection(): boolean {
  const conn = getConnectionInfo();
  
  // If user has enabled data saver
  if (conn.saveData) return true;
  
  // If connection type indicates slow
  if (['slow-2g', '2g', '3g'].includes(conn.effectiveType)) return true;
  
  // If downlink is very low
  if (conn.downlink < 1) return true;
  
  return false;
}

/**
 * Hook for data-saving mode management
 */
export function useDataSaving(): DataSavingState {
  const [mode, setModeState] = useState<DataMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('radioos-data-mode');
      if (saved && saved in QUALITY_PRESETS) {
        return saved as DataMode;
      }
    }
    return DATA_MODES.AUTO;
  });

  const [isLowData, setIsLowData] = useState(false);
  const [estimatedKbps, setEstimatedKbps] = useState(128);

  // Auto-detect slow connection
  useEffect(() => {
    if (mode === DATA_MODES.AUTO) {
      const slow = isSlowConnection();
      setIsLowData(slow);
      setEstimatedKbps(slow ? 32 : 128);
    } else {
      const preset = QUALITY_PRESETS[mode];
      setIsLowData(mode === DATA_MODES.LOW || mode === DATA_MODES.TEXT_ONLY);
      setEstimatedKbps(preset.bitrate);
    }
  }, [mode]);

  // Listen for connection changes
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const conn = (navigator as any).connection;
      const handler = () => {
        if (mode === DATA_MODES.AUTO) {
          const slow = isSlowConnection();
          setIsLowData(slow);
          setEstimatedKbps(slow ? 32 : 128);
        }
      };

      conn.addEventListener('change', handler);
      return () => conn.removeEventListener('change', handler);
    }
  }, [mode]);

  const setMode = useCallback((newMode: DataMode) => {
    setModeState(newMode);
    localStorage.setItem('radioos-data-mode', newMode);
  }, []);

  const getStreamQuality = useCallback(() => {
    if (mode === DATA_MODES.AUTO) {
      const slow = isSlowConnection();
      return {
        bitrate: slow ? 32 : 128,
        label: slow ? 'Économie auto (32 kbps)' : 'Haute qualité auto (128 kbps)',
      };
    }
    const preset = QUALITY_PRESETS[mode];
    return { bitrate: preset.bitrate, label: preset.label };
  }, [mode]);

  const shouldLoadImages = useCallback(() => {
    return mode !== DATA_MODES.TEXT_ONLY;
  }, [mode]);

  const shouldLoadAudio = useCallback(() => {
    return mode !== DATA_MODES.TEXT_ONLY;
  }, [mode]);

  const getDataUsage = useCallback(() => {
    // Estimate monthly usage in MB
    const hoursPerDay = 2; // Average listening time
    const daysPerMonth = 30;
    const kbps = getStreamQuality().bitrate;
    const mbPerMonth = (kbps * 3600 * hoursPerDay * daysPerMonth) / (8 * 1024);
    
    return {
      current: Math.round(mbPerMonth),
      limit: 1000, // 1GB default limit
    };
  }, [getStreamQuality]);

  return {
    mode,
    isLowData,
    estimatedKbps,
    setMode,
    getStreamQuality,
    shouldLoadImages,
    shouldLoadAudio,
    getDataUsage,
  };
}

/**
 * Data Saving Toggle Component Props
 */
export interface DataSavingToggleProps {
  className?: string;
  onModeChange?: (mode: DataMode) => void;
}

/**
 * Get the best stream URL based on data mode
 */
export function getOptimalStreamUrl(
  streamUrls: Array<{ url: string; bitrate: number }>,
  mode: DataMode
): string | null {
  if (streamUrls.length === 0) return null;

  // Sort by bitrate
  const sorted = [...streamUrls].sort((a, b) => a.bitrate - b.bitrate);

  switch (mode) {
    case DATA_MODES.LOW:
      // Get lowest bitrate
      return sorted[0]?.url || null;

    case DATA_MODES.MEDIUM:
      // Get medium bitrate (around 64-96 kbps)
      const medium = sorted.find((s) => s.bitrate >= 64 && s.bitrate <= 96);
      return medium?.url || sorted[Math.floor(sorted.length / 2)]?.url || null;

    case DATA_MODES.HIGH:
      // Get highest bitrate
      return sorted[sorted.length - 1]?.url || null;

    case DATA_MODES.TEXT_ONLY:
      // No audio
      return null;

    case DATA_MODES.AUTO:
    default:
      // Auto: use lowest if slow connection, highest otherwise
      const slow = isSlowConnection();
      return slow ? sorted[0]?.url : sorted[sorted.length - 1]?.url;
  }
}
