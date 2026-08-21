export type UserRole =
  | "SUPER_ADMIN"
  | "RADIO_OWNER"
  | "RADIO_ADMIN"
  | "EDITOR"
  | "HOST"
  | "ANALYST"
  | "ADVERTISER"
  | "SUPPORT"
  | "LISTENER";

export type StreamStatus = "ONLINE" | "OFFLINE" | "ERROR";

export type DedicationStatus = "PENDING" | "APPROVED" | "PLAYED" | "REJECTED";

export type CampaignStatus =
  | "DRAFT"
  | "PENDING"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED";

export type SubscriptionPlan = "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED";

export type TicketCategory =
  | "TECHNICAL"
  | "BILLING"
  | "STREAMING"
  | "ACCOUNT"
  | "ADVERTISING"
  | "OTHER";

export type NotificationType =
  | "STREAM_OFFLINE"
  | "STREAM_RESTORED"
  | "NEW_CAMPAIGN"
  | "NEW_MESSAGE"
  | "NEW_PAYMENT"
  | "SUBSCRIPTION_EXPIRING"
  | "AUDIENCE_SPIKE"
  | "SERVER_INCIDENT";

// Database models
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Radio {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  country: string;
  city: string;
  languages: string[];
  timezone: string;
  website_url?: string;
  whatsapp_number?: string;
  social_links?: Record<string, string>;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  is_public: boolean;
  subscription_plan: SubscriptionPlan;
  created_at: string;
  updated_at: string;
}

export interface RadioMember {
  id: string;
  radio_id: string;
  user_id: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Stream {
  id: string;
  radio_id: string;
  name: string;
  url: string;
  type: string;
  is_primary: boolean;
  is_active: boolean;
  bitrate?: number;
  codec?: string;
  status: StreamStatus;
  last_checked_at?: string;
  last_error?: string;
  created_at: string;
  updated_at: string;
}

export interface StreamHealth {
  id: string;
  stream_id: string;
  radio_id: string;
  status: StreamStatus;
  latency_ms?: number;
  error_message?: string;
  checked_at: string;
}

export interface Program {
  id: string;
  radio_id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  day_of_week: number; // 0=Sunday, 6=Saturday
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  host_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Show {
  id: string;
  radio_id: string;
  program_id?: string;
  title: string;
  description?: string;
  image_url?: string;
  host_id?: string;
  scheduled_at: string;
  duration_minutes: number;
  is_live: boolean;
  listeners_count: number;
  created_at: string;
  updated_at: string;
}

export interface Host {
  id: string;
  radio_id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  social_links?: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Podcast {
  id: string;
  radio_id: string;
  title: string;
  description?: string;
  image_url?: string;
  audio_url: string;
  duration_seconds: number;
  category?: string;
  host_id?: string;
  tags?: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  published_at?: string;
  downloads_count: number;
  created_at: string;
  updated_at: string;
}

export interface PodcastCategory {
  id: string;
  radio_id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Message {
  id: string;
  radio_id: string;
  sender_name: string;
  sender_phone?: string;
  sender_email?: string;
  content: string;
  is_read: boolean;
  is_archived: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  source: "WEB" | "WHATSAPP" | "SMS" | "EMAIL";
  created_at: string;
}

export interface Dedication {
  id: string;
  radio_id: string;
  sender_name: string;
  sender_identifier?: string;
  recipient_name: string;
  message: string;
  song_title?: string;
  consent: boolean;
  status: DedicationStatus;
  created_at: string;
  updated_at: string;
}

export interface Poll {
  id: string;
  radio_id: string;
  question: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  total_votes: number;
  created_at: string;
  updated_at: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  votes_count: number;
  created_at: string;
}

export interface Listener {
  id: string;
  radio_id: string;
  session_id: string;
  ip_hash?: string;
  country?: string;
  city?: string;
  device?: string;
  os?: string;
  browser?: string;
  user_agent?: string;
  started_at: string;
  ended_at?: string;
  duration_seconds: number;
  quality?: string;
}

export interface AudienceSnapshot {
  id: string;
  radio_id: string;
  listeners_count: number;
  unique_listeners: number;
  country_breakdown?: Record<string, number>;
  device_breakdown?: Record<string, number>;
  recorded_at: string;
}

export interface Campaign {
  id: string;
  radio_id: string;
  advertiser_id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  currency: string;
  start_date: string;
  end_date: string;
  frequency: string;
  time_slots?: Record<string, string>[];
  targeting?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Advertiser {
  id: string;
  radio_id: string;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  radio_id: string;
  plan: SubscriptionPlan;
  status: "ACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING";
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  radio_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  payment_method?: string;
  paid_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  radio_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}

export interface Media {
  id: string;
  radio_id: string;
  type: "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT";
  url: string;
  name: string;
  size_bytes: number;
  mime_type: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  radio_id?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  radio_id?: string;
  subject: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  created_at: string;
  updated_at: string;
}

// Dashboard stats
export interface DashboardStats {
  currentListeners: number;
  peakListeners: number;
  averageDuration: number;
  totalSessions: number;
  countriesCount: number;
  listenerChange: number;
  peakChange: number;
  durationChange: number;
  sessionChange: number;
}
