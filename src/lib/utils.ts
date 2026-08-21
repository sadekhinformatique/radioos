import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toLocaleString("fr-FR");
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

export function formatDate(date: string | Date, locale = "fr-FR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date, locale = "fr-FR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const STREAM_TYPES = [
  { value: "icecast", label: "Icecast" },
  { value: "shoutcast", label: "Shoutcast" },
  { value: "azuracast", label: "AzuraCast" },
  { value: "hls", label: "HLS" },
  { value: "mp3", label: "MP3 Direct" },
  { value: "aac", label: "AAC Direct" },
  { value: "other", label: "Autre" },
] as const;

export const COUNTRIES = [
  { code: "SN", name: "Sénégal" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "ML", name: "Mali" },
  { code: "BF", name: "Burkina Faso" },
  { code: "CM", name: "Cameroun" },
  { code: "GN", name: "Guinée" },
  { code: "NE", name: "Niger" },
  { code: "TD", name: "Tchad" },
  { code: "TG", name: "Togo" },
  { code: "BJ", name: "Bénin" },
  { code: "CD", name: "RD Congo" },
  { code: "CG", name: "Congo" },
  { code: "GA", name: "Gabon" },
  { code: "MG", name: "Madagascar" },
  { code: "SN", name: "Sénégal" },
  { code: "FR", name: "France" },
  { code: "MA", name: "Maroc" },
  { code: "TN", name: "Tunisie" },
  { code: "DZ", name: "Algérie" },
] as const;

export const LANGUAGES = [
  { code: "fr", name: "Français" },
  { code: "ar", name: "Arabe" },
  { code: "en", name: "Anglais" },
  { code: "wo", name: "Wolof" },
  { code: "bm", name: "Bambara" },
  { code: "ff", name: "Peul" },
  { code: "dyu", name: "Dioula" },
] as const;
