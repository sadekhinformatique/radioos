import { z } from "zod";

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { success: false as const, errors };
  }
  return { success: true as const, data: result.data };
}

export function validateSearchParams<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams) {
  const data: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    data[key] = value;
  });
  return validateRequest(schema, data);
}

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const sortBySchema = z.object({
  sortBy: z.string().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const searchSchema = z.object({
  q: z.string().optional(),
});

export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  fullName: z.string().min(2, "Le nom complet est requis"),
  radioName: z.string().min(2, "Le nom de la radio est requis").optional(),
});

// Radio schemas
export const radioSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, "Slug invalide"),
  description: z.string().max(500).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string().optional(),
  logoUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
});

// Stream schemas
export const streamSchema = z.object({
  streamUrl: z.string().url("URL de stream invalide"),
  streamType: z.enum(["icecast", "shoutcast", "hls", "other"]).default("icecast"),
  bitrate: z.number().min(32).max(320).default(128),
  codec: z.enum(["mp3", "aac", "ogg"]).default("mp3"),
  isBackup: z.boolean().default(false),
});

// Podcast schemas
export const podcastSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  audioUrl: z.string().url("URL audio invalide"),
  durationSeconds: z.number().min(1).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Message schemas
export const messageSchema = z.object({
  senderName: z.string().min(1).max(100),
  senderPhone: z.string().optional(),
  content: z.string().min(1).max(1000),
  source: z.enum(["whatsapp", "sms", "email", "app", "web"]).default("app"),
});

// Dedication schemas
export const dedicationSchema = z.object({
  senderName: z.string().min(1).max(100),
  senderPhone: z.string().optional(),
  recipientName: z.string().min(1).max(100),
  songTitle: z.string().min(1).max(200),
  artistName: z.string().min(1).max(200),
  message: z.string().max(500).optional(),
});

// Poll schemas
export const pollSchema = z.object({
  question: z.string().min(1).max(500),
  options: z.array(z.string().min(1).max(200)).min(2).max(10),
  expiresAt: z.string().datetime().optional(),
});

// Vote schema
export const voteSchema = z.object({
  pollId: z.string().uuid(),
  optionIndex: z.number().min(0),
});

// Analytics query schema
export const analyticsQuerySchema = z.object({
  period: z.enum(["today", "7d", "30d", "90d", "custom"]).default("7d"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  groupBy: z.enum(["hour", "day", "week", "month"]).default("day"),
});

// Ad campaign schemas
export const campaignSchema = z.object({
  name: z.string().min(1).max(200),
  advertiserId: z.string().uuid().optional(),
  budget: z.number().min(1000),
  startDate: z.string(),
  endDate: z.string(),
  audioUrl: z.string().url().optional(),
  targetCountries: z.array(z.string()).optional(),
  impressionsGoal: z.number().min(100).optional(),
});
