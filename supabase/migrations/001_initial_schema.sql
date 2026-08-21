-- RadioOS Database Schema
-- Phase 1: Core tables for multi-tenant SaaS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS & AUTH
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ORGANIZATIONS & RADIOS
-- ============================================

-- Organizations (for future multi-org support)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Radio stations
CREATE TABLE public.radios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  languages TEXT[] DEFAULT ARRAY['fr']::TEXT[],
  timezone TEXT DEFAULT 'Africa/Dakar',
  website_url TEXT,
  whatsapp_number TEXT,
  social_links JSONB DEFAULT '{}'::JSONB,
  contact_email TEXT,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  subscription_plan TEXT DEFAULT 'STARTER' CHECK (subscription_plan IN ('STARTER', 'PROFESSIONAL', 'ENTERPRISE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Radio members (users assigned to radios)
CREATE TABLE public.radio_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN (
    'SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN', 'EDITOR',
    'HOST', 'ANALYST', 'ADVERTISER', 'SUPPORT', 'LISTENER'
  )),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(radio_id, user_id)
);

-- ============================================
-- STREAMING
-- ============================================

-- Streams
CREATE TABLE public.streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Primary',
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'icecast',
  is_primary BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  bitrate INTEGER,
  codec TEXT,
  status TEXT DEFAULT 'OFFLINE' CHECK (status IN ('ONLINE', 'OFFLINE', 'ERROR')),
  last_checked_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stream health monitoring
CREATE TABLE public.stream_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('ONLINE', 'OFFLINE', 'ERROR')),
  latency_ms INTEGER,
  error_message TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PROGRAMS & SHOWS
-- ============================================

-- Programs (recurring schedule)
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  host_id UUID,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shows (individual episodes)
CREATE TABLE public.shows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  host_id UUID,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  is_live BOOLEAN DEFAULT FALSE,
  listeners_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hosts
CREATE TABLE public.hosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}'::JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PODCASTS
-- ============================================

CREATE TABLE public.podcast_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(radio_id, slug)
);

CREATE TABLE public.podcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  category TEXT,
  host_id UUID,
  tags TEXT[],
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  published_at TIMESTAMPTZ,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INTERACTIONS
-- ============================================

-- Messages from listeners
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_phone TEXT,
  sender_email TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  source TEXT DEFAULT 'WEB' CHECK (source IN ('WEB', 'WHATSAPP', 'SMS', 'EMAIL')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dedications
CREATE TABLE public.dedications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_identifier TEXT,
  recipient_name TEXT NOT NULL,
  message TEXT NOT NULL,
  song_title TEXT,
  consent BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'PLAYED', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Polls
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.poll_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(poll_id, session_id)
);

-- ============================================
-- ANALYTICS
-- ============================================

-- Listener sessions
CREATE TABLE public.listeners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  ip_hash TEXT,
  country TEXT,
  city TEXT,
  device TEXT,
  os TEXT,
  browser TEXT,
  user_agent TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  quality TEXT
);

-- Audience snapshots (periodic aggregated data)
CREATE TABLE public.audience_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  listeners_count INTEGER DEFAULT 0,
  unique_listeners INTEGER DEFAULT 0,
  country_breakdown JSONB DEFAULT '{}'::JSONB,
  device_breakdown JSONB DEFAULT '{}'::JSONB,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ADVERTISING
-- ============================================

CREATE TABLE public.advertisers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  advertiser_id UUID NOT NULL REFERENCES public.advertisers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')),
  budget NUMERIC(12,2) DEFAULT 0,
  spent NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'XOF',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  frequency TEXT,
  time_slots JSONB,
  targeting JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- BILLING
-- ============================================

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'STARTER' CHECK (plan IN ('STARTER', 'PROFESSIONAL', 'ENTERPRISE')),
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS & SUPPORT
-- ============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  radio_id UUID REFERENCES public.radios(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  radio_id UUID REFERENCES public.radios(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'OTHER' CHECK (category IN ('TECHNICAL', 'BILLING', 'STREAMING', 'ACCOUNT', 'ADVERTISING', 'OTHER')),
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED')),
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- AUDIT LOG
-- ============================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  radio_id UUID REFERENCES public.radios(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE INDEX idx_users_email ON public.users(email);

-- Radios
CREATE INDEX idx_radios_slug ON public.radios(slug);
CREATE INDEX idx_radios_country ON public.radios(country);
CREATE INDEX idx_radios_is_active ON public.radios(is_active);

-- Radio Members
CREATE INDEX idx_radio_members_radio_id ON public.radio_members(radio_id);
CREATE INDEX idx_radio_members_user_id ON public.radio_members(user_id);

-- Streams
CREATE INDEX idx_streams_radio_id ON public.streams(radio_id);
CREATE INDEX idx_streams_status ON public.streams(status);

-- Stream Health
CREATE INDEX idx_stream_health_stream_id ON public.stream_health(stream_id);
CREATE INDEX idx_stream_health_radio_id ON public.stream_health(radio_id);
CREATE INDEX idx_stream_health_checked_at ON public.stream_health(checked_at);

-- Programs
CREATE INDEX idx_programs_radio_id ON public.programs(radio_id);
CREATE INDEX idx_programs_day_of_week ON public.programs(day_of_week);

-- Shows
CREATE INDEX idx_shows_radio_id ON public.shows(radio_id);
CREATE INDEX idx_shows_scheduled_at ON public.shows(scheduled_at);

-- Podcasts
CREATE INDEX idx_podcasts_radio_id ON public.podcasts(radio_id);
CREATE INDEX idx_podcasts_status ON public.podcasts(status);
CREATE INDEX idx_podcasts_published_at ON public.podcasts(published_at);

-- Messages
CREATE INDEX idx_messages_radio_id ON public.messages(radio_id);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Dedications
CREATE INDEX idx_dedications_radio_id ON public.dedications(radio_id);
CREATE INDEX idx_dedications_status ON public.dedications(status);

-- Polls
CREATE INDEX idx_polls_radio_id ON public.polls(radio_id);
CREATE INDEX idx_polls_is_active ON public.polls(is_active);

-- Listeners
CREATE INDEX idx_listeners_radio_id ON public.listeners(radio_id);
CREATE INDEX idx_listeners_started_at ON public.listeners(started_at);
CREATE INDEX idx_listeners_session_id ON public.listeners(session_id);

-- Audience Snapshots
CREATE INDEX idx_audience_snapshots_radio_id ON public.audience_snapshots(radio_id);
CREATE INDEX idx_audience_snapshots_recorded_at ON public.audience_snapshots(recorded_at);

-- Campaigns
CREATE INDEX idx_campaigns_radio_id ON public.campaigns(radio_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);

-- Subscriptions
CREATE INDEX idx_subscriptions_radio_id ON public.subscriptions(radio_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Audit Logs
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_radio_id ON public.audit_logs(radio_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dedications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listeners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Helper function to get user's radio_ids
CREATE OR REPLACE FUNCTION public.get_user_radio_ids()
RETURNS SETOF UUID AS $$
  SELECT radio_id FROM public.radio_members WHERE user_id = auth.uid() AND is_active = TRUE;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.radio_members
    WHERE user_id = auth.uid() AND role = 'SUPER_ADMIN' AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user has specific role in radio
CREATE OR REPLACE FUNCTION public.user_has_role(p_radio_id UUID, p_roles TEXT[])
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.radio_members
    WHERE user_id = auth.uid() AND radio_id = p_radio_id AND role = ANY(p_roles) AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- USERS policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- RADIOS policies
CREATE POLICY "Public radios are viewable by everyone"
  ON public.radios FOR SELECT
  USING (is_public = TRUE OR is_super_admin());

CREATE POLICY "Radio members can view their radio"
  ON public.radios FOR SELECT
  USING (id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Radio owners can update their radio"
  ON public.radios FOR UPDATE
  USING (public.user_has_role(id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN']));

CREATE POLICY "Super admins can do everything"
  ON public.radios FOR ALL
  USING (is_super_admin());

-- RADIO MEMBERS policies
CREATE POLICY "Radio members can view members of their radio"
  ON public.radio_members FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Radio owners can manage members"
  ON public.radio_members FOR ALL
  USING (public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN']));

-- STREAMS policies
CREATE POLICY "Radio members can view streams"
  ON public.streams FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Radio admins can manage streams"
  ON public.streams FOR ALL
  USING (public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN']));

-- STREAM HEALTH policies
CREATE POLICY "Radio members can view stream health"
  ON public.stream_health FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "System can insert stream health"
  ON public.stream_health FOR INSERT
  WITH CHECK (TRUE);

-- PROGRAMS policies
CREATE POLICY "Public can view programs of public radios"
  ON public.programs FOR SELECT
  USING (radio_id IN (SELECT id FROM public.radios WHERE is_public = TRUE));

CREATE POLICY "Radio members can manage programs"
  ON public.programs FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- SHOWS policies
CREATE POLICY "Public can view shows of public radios"
  ON public.shows FOR SELECT
  USING (radio_id IN (SELECT id FROM public.radios WHERE is_public = TRUE));

CREATE POLICY "Radio members can manage shows"
  ON public.shows FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- HOSTS policies
CREATE POLICY "Public can view hosts of public radios"
  ON public.hosts FOR SELECT
  USING (radio_id IN (SELECT id FROM public.radios WHERE is_public = TRUE));

CREATE POLICY "Radio members can manage hosts"
  ON public.hosts FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- PODCASTS policies
CREATE POLICY "Public can view published podcasts"
  ON public.podcasts FOR SELECT
  USING (status = 'PUBLISHED' AND radio_id IN (SELECT id FROM public.radios WHERE is_public = TRUE));

CREATE POLICY "Radio members can manage podcasts"
  ON public.podcasts FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- PODCAST CATEGORIES policies
CREATE POLICY "Radio members can manage podcast categories"
  ON public.podcast_categories FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- MESSAGES policies
CREATE POLICY "Radio members can view messages"
  ON public.messages FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Anyone can insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Radio members can update messages"
  ON public.messages FOR UPDATE
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- DEDICATIONS policies
CREATE POLICY "Radio members can view dedications"
  ON public.dedications FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Anyone can insert dedications"
  ON public.dedications FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Radio members can update dedications"
  ON public.dedications FOR UPDATE
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- POLLS policies
CREATE POLICY "Public can view active polls"
  ON public.polls FOR SELECT
  USING (is_active = TRUE AND radio_id IN (SELECT id FROM public.radios WHERE is_public = TRUE));

CREATE POLICY "Radio members can manage polls"
  ON public.polls FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- POLL OPTIONS policies
CREATE POLICY "Public can view poll options"
  ON public.poll_options FOR SELECT
  USING (TRUE);

CREATE POLICY "Radio members can manage poll options"
  ON public.poll_options FOR ALL
  USING (poll_id IN (
    SELECT id FROM public.polls WHERE radio_id IN (SELECT public.get_user_radio_ids())
  ) OR is_super_admin());

-- POLL VOTES policies
CREATE POLICY "Anyone can vote"
  ON public.poll_votes FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Radio members can view votes"
  ON public.poll_votes FOR SELECT
  USING (TRUE);

-- LISTENERS policies
CREATE POLICY "Radio members can view listeners"
  ON public.listeners FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "System can insert listeners"
  ON public.listeners FOR INSERT
  WITH CHECK (TRUE);

-- AUDIENCE SNAPSHOTS policies
CREATE POLICY "Radio members can view snapshots"
  ON public.audience_snapshots FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "System can insert snapshots"
  ON public.audience_snapshots FOR INSERT
  WITH CHECK (TRUE);

-- ADVERTISERS policies
CREATE POLICY "Radio members can view advertisers"
  ON public.advertisers FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Radio admins can manage advertisers"
  ON public.advertisers FOR ALL
  USING (public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN']));

-- CAMPAIGNS policies
CREATE POLICY "Radio members can view campaigns"
  ON public.campaigns FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Radio admins can manage campaigns"
  ON public.campaigns FOR ALL
  USING (public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN']));

-- SUBSCRIPTIONS policies
CREATE POLICY "Radio owners can view subscriptions"
  ON public.subscriptions FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Super admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (is_super_admin());

-- INVOICES policies
CREATE POLICY "Radio owners can view invoices"
  ON public.invoices FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- NOTIFICATIONS policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (TRUE);

-- SUPPORT TICKETS policies
CREATE POLICY "Users can view own tickets"
  ON public.support_tickets FOR SELECT
  USING (user_id = auth.uid() OR is_super_admin());

CREATE POLICY "Users can create tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tickets"
  ON public.support_tickets FOR UPDATE
  USING (user_id = auth.uid() OR is_super_admin());

-- AUDIT LOGS policies
CREATE POLICY "Radio members can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_radios_updated_at
  BEFORE UPDATE ON public.radios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_streams_updated_at
  BEFORE UPDATE ON public.streams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_shows_updated_at
  BEFORE UPDATE ON public.shows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_hosts_updated_at
  BEFORE UPDATE ON public.hosts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_podcasts_updated_at
  BEFORE UPDATE ON public.podcasts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_dedications_updated_at
  BEFORE UPDATE ON public.dedications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON public.polls
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_advertisers_updated_at
  BEFORE UPDATE ON public.advertisers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
