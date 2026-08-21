-- RadioOS RLS Policies (VERSION CORRIGÉE)
-- Gère les politiques existantes avec DROP IF EXISTS

-- ============================================
-- SUPPRIMER LES ANCIENNES POLITIQUES
-- ============================================

-- Users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view radio members" ON users;

-- Radios
DROP POLICY IF EXISTS "Public can view radios" ON radios;
DROP POLICY IF EXISTS "Public radios are viewable by everyone" ON radios;
DROP POLICY IF EXISTS "Radio members can view their radio" ON radios;
DROP POLICY IF EXISTS "Owners can update radio" ON radios;
DROP POLICY IF EXISTS "Radio owners can update their radio" ON radios;
DROP POLICY IF EXISTS "Owners can delete radio" ON radios;
DROP POLICY IF EXISTS "Super admins can do everything" ON radios;

-- Radio Members
DROP POLICY IF EXISTS "Members can view own membership" ON radio_members;
DROP POLICY IF EXISTS "Admins can view radio members" ON radio_members;
DROP POLICY IF EXISTS "Owners can manage members" ON radio_members;
DROP POLICY IF EXISTS "Radio owners can manage members" ON radio_members;

-- Streams
DROP POLICY IF EXISTS "Members can view streams" ON streams;
DROP POLICY IF EXISTS "Radio members can view streams" ON streams;
DROP POLICY IF EXISTS "Admins can manage streams" ON streams;
DROP POLICY IF EXISTS "Radio admins can manage streams" ON streams;

-- Stream Health
DROP POLICY IF EXISTS "Radio members can view stream health" ON stream_health;
DROP POLICY IF EXISTS "System can insert stream health" ON stream_health;

-- Programs
DROP POLICY IF EXISTS "Public can view programs of public radios" ON programs;
DROP POLICY IF EXISTS "Radio members can manage programs" ON programs;

-- Shows
DROP POLICY IF EXISTS "Public can view shows of public radios" ON shows;
DROP POLICY IF EXISTS "Members can view shows" ON shows;
DROP POLICY IF EXISTS "Radio members can manage shows" ON shows;
DROP POLICY IF EXISTS "Editors can manage shows" ON shows;

-- Hosts
DROP POLICY IF EXISTS "Public can view hosts of public radios" ON hosts;
DROP POLICY IF EXISTS "Radio members can manage hosts" ON hosts;

-- Podcasts
DROP POLICY IF EXISTS "Public can view published podcasts" ON podcasts;
DROP POLICY IF EXISTS "Members can view podcasts" ON podcasts;
DROP POLICY IF EXISTS "Radio members can manage podcasts" ON podcasts;
DROP POLICY IF EXISTS "Editors can manage podcasts" ON podcasts;

-- Podcast Categories
DROP POLICY IF EXISTS "Radio members can manage podcast categories" ON podcast_categories;

-- Messages
DROP POLICY IF EXISTS "Members can view messages" ON messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
DROP POLICY IF EXISTS "Radio members can update messages" ON messages;

-- Dedications
DROP POLICY IF EXISTS "Members can view dedications" ON dedications;
DROP POLICY IF EXISTS "Anyone can create dedications" ON dedications;
DROP POLICY IF EXISTS "Radio members can update dedications" ON dedications;

-- Polls
DROP POLICY IF EXISTS "Public can view active polls" ON polls;
DROP POLICY IF EXISTS "Members can view polls" ON polls;
DROP POLICY IF EXISTS "Radio members can manage polls" ON polls;
DROP POLICY IF EXISTS "Editors can manage polls" ON polls;

-- Poll Options
DROP POLICY IF EXISTS "Public can view poll options" ON poll_options;
DROP POLICY IF EXISTS "Radio members can manage poll options" ON poll_options;

-- Poll Votes
DROP POLICY IF EXISTS "Anyone can vote" ON poll_votes;
DROP POLICY IF EXISTS "Members can view poll votes" ON poll_votes;
DROP POLICY IF EXISTS "Anyone can vote on active polls" ON poll_votes;
DROP POLICY IF EXISTS "Radio members can view votes" ON poll_votes;

-- Listeners
DROP POLICY IF EXISTS "Radio members can view listeners" ON listeners;
DROP POLICY IF EXISTS "System can insert listeners" ON listeners;

-- Audience Snapshots
DROP POLICY IF EXISTS "Radio members can view snapshots" ON audience_snapshots;
DROP POLICY IF EXISTS "System can insert snapshots" ON audience_snapshots;

-- Analytics
DROP POLICY IF EXISTS "Radio members can view analytics" ON analytics;
DROP POLICY IF EXISTS "System can insert analytics" ON analytics;

-- Advertisers
DROP POLICY IF EXISTS "Radio members can view advertisers" ON advertisers;
DROP POLICY IF EXISTS "Radio admins can manage advertisers" ON advertisers;

-- Campaigns
DROP POLICY IF EXISTS "Radio members can view campaigns" ON campaigns;
DROP POLICY IF EXISTS "Radio admins can manage campaigns" ON campaigns;
DROP POLICY IF EXISTS "Admins can manage campaigns" ON campaigns;

-- Subscriptions
DROP POLICY IF EXISTS "Radio owners can view subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Radio members can view subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Super admins can manage subscriptions" ON subscriptions;

-- Invoices
DROP POLICY IF EXISTS "Radio owners can view invoices" ON invoices;
DROP POLICY IF EXISTS "Radio members can view invoices" ON invoices;

-- Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

-- Support Tickets
DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can create tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can update own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Support can view all tickets" ON support_tickets;
DROP POLICY IF EXISTS "Support can update all tickets" ON support_tickets;

-- Audit Logs
DROP POLICY IF EXISTS "Radio members can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;

-- ============================================
-- FONCTIONS HELPER
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_radio_ids()
RETURNS SETOF UUID AS $$
  SELECT radio_id FROM public.radio_members WHERE user_id = auth.uid() AND is_active = TRUE;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.radio_members
    WHERE user_id = auth.uid() AND role = 'SUPER_ADMIN' AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.user_has_role(p_radio_id UUID, p_roles TEXT[])
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.radio_members
    WHERE user_id = auth.uid() AND radio_id = p_radio_id AND role = ANY(p_roles) AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- CRÉER LES NOUVELLES POLITIQUES
-- ============================================

-- USERS
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- RADIOS
CREATE POLICY "Public radios are viewable by everyone"
  ON radios FOR SELECT
  USING (is_public = TRUE OR is_super_admin());

CREATE POLICY "Radio members can view their radio"
  ON radios FOR SELECT
  USING (id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Radio owners can update their radio"
  ON radios FOR UPDATE
  USING (public.user_has_role(id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN']));

CREATE POLICY "Super admins can do everything"
  ON radios FOR ALL
  USING (is_super_admin());

-- RADIO MEMBERS
CREATE POLICY "Radio members can view members of their radio"
  ON radio_members FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Radio owners can manage members"
  ON radio_members FOR ALL
  USING (public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN']));

-- STREAMS
CREATE POLICY "Radio members can view streams"
  ON streams FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Radio admins can manage streams"
  ON streams FOR ALL
  USING (public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN']));

-- STREAM HEALTH
CREATE POLICY "Radio members can view stream health"
  ON stream_health FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "System can insert stream health"
  ON stream_health FOR INSERT
  WITH CHECK (TRUE);

-- PROGRAMS
CREATE POLICY "Public can view programs of public radios"
  ON programs FOR SELECT
  USING (radio_id IN (SELECT id FROM radios WHERE is_public = TRUE));

CREATE POLICY "Radio members can manage programs"
  ON programs FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- SHOWS
CREATE POLICY "Public can view shows of public radios"
  ON shows FOR SELECT
  USING (radio_id IN (SELECT id FROM radios WHERE is_public = TRUE));

CREATE POLICY "Radio members can manage shows"
  ON shows FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- HOSTS
CREATE POLICY "Public can view hosts of public radios"
  ON hosts FOR SELECT
  USING (radio_id IN (SELECT id FROM radios WHERE is_public = TRUE));

CREATE POLICY "Radio members can manage hosts"
  ON hosts FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- PODCASTS
CREATE POLICY "Public can view published podcasts"
  ON podcasts FOR SELECT
  USING (status = 'PUBLISHED' AND radio_id IN (SELECT id FROM radios WHERE is_public = TRUE));

CREATE POLICY "Radio members can manage podcasts"
  ON podcasts FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- PODCAST CATEGORIES
CREATE POLICY "Radio members can manage podcast categories"
  ON podcast_categories FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- MESSAGES
CREATE POLICY "Radio members can view messages"
  ON messages FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Radio members can update messages"
  ON messages FOR UPDATE
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- DEDICATIONS
CREATE POLICY "Radio members can view dedications"
  ON dedications FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Anyone can insert dedications"
  ON dedications FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Radio members can update dedications"
  ON dedications FOR UPDATE
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- POLLS
CREATE POLICY "Public can view active polls"
  ON polls FOR SELECT
  USING (is_active = TRUE AND radio_id IN (SELECT id FROM radios WHERE is_public = TRUE));

CREATE POLICY "Radio members can manage polls"
  ON polls FOR ALL
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- POLL OPTIONS
CREATE POLICY "Public can view poll options"
  ON poll_options FOR SELECT
  USING (TRUE);

CREATE POLICY "Radio members can manage poll options"
  ON poll_options FOR ALL
  USING (poll_id IN (
    SELECT id FROM polls WHERE radio_id IN (SELECT public.get_user_radio_ids())
  ) OR is_super_admin());

-- POLL VOTES
CREATE POLICY "Anyone can vote"
  ON poll_votes FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Radio members can view votes"
  ON poll_votes FOR SELECT
  USING (TRUE);

-- LISTENERS
CREATE POLICY "Radio members can view listeners"
  ON listeners FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "System can insert listeners"
  ON listeners FOR INSERT
  WITH CHECK (TRUE);

-- AUDIENCE SNAPSHOTS
CREATE POLICY "Radio members can view snapshots"
  ON audience_snapshots FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "System can insert snapshots"
  ON audience_snapshots FOR INSERT
  WITH CHECK (TRUE);

-- ANALYTICS
CREATE POLICY "Radio members can view analytics"
  ON analytics FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "System can insert analytics"
  ON analytics FOR INSERT
  WITH CHECK (TRUE);

-- ADVERTISERS
CREATE POLICY "Radio members can view advertisers"
  ON advertisers FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Radio admins can manage advertisers"
  ON advertisers FOR ALL
  USING (public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN']));

-- CAMPAIGNS
CREATE POLICY "Radio members can view campaigns"
  ON campaigns FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Radio admins can manage campaigns"
  ON campaigns FOR ALL
  USING (public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN']));

-- SUBSCRIPTIONS
CREATE POLICY "Radio owners can view subscriptions"
  ON subscriptions FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "Super admins can manage subscriptions"
  ON subscriptions FOR ALL
  USING (is_super_admin());

-- INVOICES
CREATE POLICY "Radio owners can view invoices"
  ON invoices FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

-- NOTIFICATIONS
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (TRUE);

-- SUPPORT TICKETS
CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  USING (user_id = auth.uid() OR is_super_admin());

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tickets"
  ON support_tickets FOR UPDATE
  USING (user_id = auth.uid() OR is_super_admin());

-- AUDIT LOGS
CREATE POLICY "Radio members can view audit logs"
  ON audit_logs FOR SELECT
  USING (radio_id IN (SELECT public.get_user_radio_ids()) OR is_super_admin());

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- TRIGGERS UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer et recréer les triggers
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_users_updated_at ON users;
  DROP TRIGGER IF EXISTS update_radios_updated_at ON radios;
  DROP TRIGGER IF EXISTS update_shows_updated_at ON shows;
  DROP TRIGGER IF EXISTS update_podcasts_updated_at ON podcasts;
  DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
END $$;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_radios_updated_at
  BEFORE UPDATE ON radios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_shows_updated_at
  BEFORE UPDATE ON shows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_podcasts_updated_at
  BEFORE UPDATE ON podcasts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
