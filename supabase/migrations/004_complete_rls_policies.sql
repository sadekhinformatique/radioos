-- ============================================
-- RADIOOS - COMPLETE DATABASE FIX
-- Migration 004: Fix all missing RLS policies
-- Uses DROP IF EXISTS to avoid conflicts
-- ============================================

-- MIGRATION 003: Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- USERS: Add INSERT and DELETE
-- ============================================
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own profile" ON public.users;
CREATE POLICY "Users can delete own profile"
  ON public.users FOR DELETE
  USING (id = auth.uid());

-- ============================================
-- RADIOS: Add DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio owners can delete their radio" ON public.radios;
CREATE POLICY "Radio owners can delete their radio"
  ON public.radios FOR DELETE
  USING (
    public.user_has_role(id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER'])
  );

-- ============================================
-- RADIO_MEMBERS: Add UPDATE and DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio owners can update members" ON public.radio_members;
CREATE POLICY "Radio owners can update members"
  ON public.radio_members FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

DROP POLICY IF EXISTS "Radio owners can delete members" ON public.radio_members;
CREATE POLICY "Radio owners can delete members"
  ON public.radio_members FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER'])
  );

-- ============================================
-- STREAMS: Add UPDATE and DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio owners can update streams" ON public.streams;
CREATE POLICY "Radio owners can update streams"
  ON public.streams FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

DROP POLICY IF EXISTS "Radio owners can delete streams" ON public.streams;
CREATE POLICY "Radio owners can delete streams"
  ON public.streams FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- PROGRAMS: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can create programs" ON public.programs;
CREATE POLICY "Radio members can create programs"
  ON public.programs FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN', 'EDITOR'])
  );

DROP POLICY IF EXISTS "Radio members can update programs" ON public.programs;
CREATE POLICY "Radio members can update programs"
  ON public.programs FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN', 'EDITOR'])
  );

DROP POLICY IF EXISTS "Radio members can delete programs" ON public.programs;
CREATE POLICY "Radio members can delete programs"
  ON public.programs FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- SHOWS: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can create shows" ON public.shows;
CREATE POLICY "Radio members can create shows"
  ON public.shows FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN', 'EDITOR', 'HOST'])
  );

DROP POLICY IF EXISTS "Radio members can update shows" ON public.shows;
CREATE POLICY "Radio members can update shows"
  ON public.shows FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN', 'EDITOR', 'HOST'])
  );

DROP POLICY IF EXISTS "Radio members can delete shows" ON public.shows;
CREATE POLICY "Radio members can delete shows"
  ON public.shows FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- HOSTS: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can create hosts" ON public.hosts;
CREATE POLICY "Radio members can create hosts"
  ON public.hosts FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

DROP POLICY IF EXISTS "Radio members can update hosts" ON public.hosts;
CREATE POLICY "Radio members can update hosts"
  ON public.hosts FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

DROP POLICY IF EXISTS "Radio members can delete hosts" ON public.hosts;
CREATE POLICY "Radio members can delete hosts"
  ON public.hosts FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- PODCASTS: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can create podcasts" ON public.podcasts;
CREATE POLICY "Radio members can create podcasts"
  ON public.podcasts FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN', 'EDITOR', 'HOST'])
  );

DROP POLICY IF EXISTS "Radio members can update podcasts" ON public.podcasts;
CREATE POLICY "Radio members can update podcasts"
  ON public.podcasts FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN', 'EDITOR', 'HOST'])
  );

DROP POLICY IF EXISTS "Radio members can delete podcasts" ON public.podcasts;
CREATE POLICY "Radio members can delete podcasts"
  ON public.podcasts FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- PODCAST_CATEGORIES: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can create podcast categories" ON public.podcast_categories;
CREATE POLICY "Radio members can create podcast categories"
  ON public.podcast_categories FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

DROP POLICY IF EXISTS "Radio members can update podcast categories" ON public.podcast_categories;
CREATE POLICY "Radio members can update podcast categories"
  ON public.podcast_categories FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

DROP POLICY IF EXISTS "Radio members can delete podcast categories" ON public.podcast_categories;
CREATE POLICY "Radio members can delete podcast categories"
  ON public.podcast_categories FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- MESSAGES: Add DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can delete messages" ON public.messages;
CREATE POLICY "Radio members can delete messages"
  ON public.messages FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- DEDICATIONS: Add DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can delete dedications" ON public.dedications;
CREATE POLICY "Radio members can delete dedications"
  ON public.dedications FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- POLLS: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can create polls" ON public.polls;
CREATE POLICY "Radio members can create polls"
  ON public.polls FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN', 'EDITOR'])
  );

DROP POLICY IF EXISTS "Radio members can update polls" ON public.polls;
CREATE POLICY "Radio members can update polls"
  ON public.polls FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN', 'EDITOR'])
  );

DROP POLICY IF EXISTS "Radio members can delete polls" ON public.polls;
CREATE POLICY "Radio members can delete polls"
  ON public.polls FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- POLL_OPTIONS: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can create poll options" ON public.poll_options;
CREATE POLICY "Radio members can create poll options"
  ON public.poll_options FOR INSERT
  WITH CHECK (
    poll_id IN (
      SELECT id FROM public.polls WHERE radio_id IN (SELECT public.get_user_radio_ids())
    ) OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "Radio members can update poll options" ON public.poll_options;
CREATE POLICY "Radio members can update poll options"
  ON public.poll_options FOR UPDATE
  USING (
    poll_id IN (
      SELECT id FROM public.polls WHERE radio_id IN (SELECT public.get_user_radio_ids())
    ) OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "Radio members can delete poll options" ON public.poll_options;
CREATE POLICY "Radio members can delete poll options"
  ON public.poll_options FOR DELETE
  USING (
    poll_id IN (
      SELECT id FROM public.polls WHERE radio_id IN (SELECT public.get_user_radio_ids())
    ) OR public.is_super_admin()
  );

-- ============================================
-- POLL_VOTES: Add UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can update votes" ON public.poll_votes;
CREATE POLICY "Radio members can update votes"
  ON public.poll_votes FOR UPDATE
  USING (TRUE);

DROP POLICY IF EXISTS "Radio members can delete votes" ON public.poll_votes;
CREATE POLICY "Radio members can delete votes"
  ON public.poll_votes FOR DELETE
  USING (TRUE);

-- ============================================
-- LISTENERS: Add UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "System can update listeners" ON public.listeners;
CREATE POLICY "System can update listeners"
  ON public.listeners FOR UPDATE
  USING (TRUE);

DROP POLICY IF EXISTS "System can delete old listeners" ON public.listeners;
CREATE POLICY "System can delete old listeners"
  ON public.listeners FOR DELETE
  USING (TRUE);

-- ============================================
-- AUDIENCE_SNAPSHOTS: Add UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "System can update snapshots" ON public.audience_snapshots;
CREATE POLICY "System can update snapshots"
  ON public.audience_snapshots FOR UPDATE
  USING (TRUE);

DROP POLICY IF EXISTS "System can delete old snapshots" ON public.audience_snapshots;
CREATE POLICY "System can delete old snapshots"
  ON public.audience_snapshots FOR DELETE
  USING (TRUE);

-- ============================================
-- ADVERTISERS: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can create advertisers" ON public.advertisers;
CREATE POLICY "Radio members can create advertisers"
  ON public.advertisers FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

DROP POLICY IF EXISTS "Radio members can update advertisers" ON public.advertisers;
CREATE POLICY "Radio members can update advertisers"
  ON public.advertisers FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

DROP POLICY IF EXISTS "Radio members can delete advertisers" ON public.advertisers;
CREATE POLICY "Radio members can delete advertisers"
  ON public.advertisers FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- CAMPAIGNS: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio members can create campaigns" ON public.campaigns;
CREATE POLICY "Radio members can create campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

DROP POLICY IF EXISTS "Radio members can update campaigns" ON public.campaigns;
CREATE POLICY "Radio members can update campaigns"
  ON public.campaigns FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

DROP POLICY IF EXISTS "Radio members can delete campaigns" ON public.campaigns;
CREATE POLICY "Radio members can delete campaigns"
  ON public.campaigns FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );

-- ============================================
-- SUBSCRIPTIONS: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio owners can create subscriptions" ON public.subscriptions;
CREATE POLICY "Radio owners can create subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER'])
  );

DROP POLICY IF EXISTS "Radio owners can update subscriptions" ON public.subscriptions;
CREATE POLICY "Radio owners can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER'])
  );

DROP POLICY IF EXISTS "Radio owners can delete subscriptions" ON public.subscriptions;
CREATE POLICY "Radio owners can delete subscriptions"
  ON public.subscriptions FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER'])
  );

-- ============================================
-- INVOICES: Add INSERT, UPDATE, DELETE
-- ============================================
DROP POLICY IF EXISTS "Radio owners can create invoices" ON public.invoices;
CREATE POLICY "Radio owners can create invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER'])
  );

DROP POLICY IF EXISTS "Radio owners can update invoices" ON public.invoices;
CREATE POLICY "Radio owners can update invoices"
  ON public.invoices FOR UPDATE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER'])
  );

DROP POLICY IF EXISTS "Radio owners can delete invoices" ON public.invoices;
CREATE POLICY "Radio owners can delete invoices"
  ON public.invoices FOR DELETE
  USING (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER'])
  );

-- ============================================
-- NOTIFICATIONS: Add DELETE
-- ============================================
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- SUPPORT_TICKETS: Add DELETE
-- ============================================
DROP POLICY IF EXISTS "Users can delete own tickets" ON public.support_tickets;
CREATE POLICY "Users can delete own tickets"
  ON public.support_tickets FOR DELETE
  USING (user_id = auth.uid() OR public.is_super_admin());

-- ============================================
-- ADDITIONAL INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_advertisers_radio_id ON public.advertisers(radio_id);
CREATE INDEX IF NOT EXISTS idx_invoices_radio_id ON public.invoices(radio_id);
CREATE INDEX IF NOT EXISTS idx_listeners_radio_started ON public.listeners(radio_id, started_at);
CREATE INDEX IF NOT EXISTS idx_poll_votes_option ON public.poll_votes(option_id);
