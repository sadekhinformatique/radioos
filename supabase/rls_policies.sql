-- RadioOS RLS Policies
-- Run this after 001_initial_schema.sql

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE radios ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dedications ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE listeners ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users in their radio
CREATE POLICY "Admins can view radio members" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_members rm
      WHERE rm.user_id = auth.uid()
      AND rm.role IN ('owner', 'admin')
      AND rm.radio_id IN (
        SELECT radio_id FROM radio_members WHERE user_id = users.id
      )
    )
  );

-- ============================================
-- RADIOS POLICIES
-- ============================================

-- Anyone can view public radio data
CREATE POLICY "Public can view radios" ON radios
  FOR SELECT USING (true);

-- Owners can update their radio
CREATE POLICY "Owners can update radio" ON radios
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = radios.id
      AND user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- Owners can delete their radio
CREATE POLICY "Owners can delete radio" ON radios
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = radios.id
      AND user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- ============================================
-- RADIO MEMBERS POLICIES
-- ============================================

-- Members can view their own membership
CREATE POLICY "Members can view own membership" ON radio_members
  FOR SELECT USING (user_id = auth.uid());

-- Owners/Admins can view all members of their radio
CREATE POLICY "Admins can view radio members" ON radio_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_members rm
      WHERE rm.radio_id = radio_members.radio_id
      AND rm.user_id = auth.uid()
      AND rm.role IN ('owner', 'admin')
    )
  );

-- Owners can manage members
CREATE POLICY "Owners can manage members" ON radio_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = radio_members.radio_id
      AND user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- ============================================
-- STREAMS POLICIES
-- ============================================

-- Members can view their radio's streams
CREATE POLICY "Members can view streams" ON streams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = streams.radio_id
      AND user_id = auth.uid()
    )
  );

-- Admins/Owners can manage streams
CREATE POLICY "Admins can manage streams" ON streams
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = streams.radio_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- SHOWS POLICIES
-- ============================================

-- Members can view their radio's shows
CREATE POLICY "Members can view shows" ON shows
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = shows.radio_id
      AND user_id = auth.uid()
    )
  );

-- Editors/Hosts can manage their shows
CREATE POLICY "Editors can manage shows" ON shows
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = shows.radio_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================
-- PODCASTS POLICIES
-- ============================================

-- Members can view their radio's podcasts
CREATE POLICY "Members can view podcasts" ON podcasts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = podcasts.radio_id
      AND user_id = auth.uid()
    )
  );

-- Public can view published podcasts
CREATE POLICY "Public can view published podcasts" ON podcasts
  FOR SELECT USING (status = 'published');

-- Editors can manage podcasts
CREATE POLICY "Editors can manage podcasts" ON podcasts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = podcasts.radio_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================
-- MESSAGES POLICIES
-- ============================================

-- Members can view their radio's messages
CREATE POLICY "Members can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = messages.radio_id
      AND user_id = auth.uid()
    )
  );

-- Members can update message status
CREATE POLICY "Members can update messages" ON messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = messages.radio_id
      AND user_id = auth.uid()
    )
  );

-- ============================================
-- DEDICATIONS POLICIES
-- ============================================

-- Members can view their radio's dedications
CREATE POLICY "Members can view dedications" ON dedications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = dedications.radio_id
      AND user_id = auth.uid()
    )
  );

-- Members can update dedication status
CREATE POLICY "Members can update dedications" ON dedications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = dedications.radio_id
      AND user_id = auth.uid()
    )
  );

-- Anyone can create dedications (public form)
CREATE POLICY "Anyone can create dedications" ON dedications
  FOR INSERT WITH CHECK (true);

-- ============================================
-- POLLS POLICIES
-- ============================================

-- Members can view their radio's polls
CREATE POLICY "Members can view polls" ON polls
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = polls.radio_id
      AND user_id = auth.uid()
    )
  );

-- Public can view active polls
CREATE POLICY "Public can view active polls" ON polls
  FOR SELECT USING (status = 'active');

-- Editors can manage polls
CREATE POLICY "Editors can manage polls" ON polls
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = polls.radio_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================
-- POLL VOTES POLICIES
-- ============================================

-- Members can view poll votes
CREATE POLICY "Members can view poll votes" ON poll_votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_members rm
      JOIN polls p ON p.radio_id = rm.radio_id
      WHERE p.id = poll_votes.poll_id
      AND rm.user_id = auth.uid()
    )
  );

-- Anyone can vote on active polls
CREATE POLICY "Anyone can vote on active polls" ON poll_votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls
      WHERE id = poll_votes.poll_id
      AND status = 'active'
    )
  );

-- ============================================
-- CAMPAIGNS POLICIES
-- ============================================

-- Members can view their radio's campaigns
CREATE POLICY "Members can view campaigns" ON campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = campaigns.radio_id
      AND user_id = auth.uid()
    )
  );

-- Admins can manage campaigns
CREATE POLICY "Admins can manage campaigns" ON campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_id = campaigns.radio_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- System can create notifications
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- ============================================
-- SUPPORT TICKETS POLICIES
-- ============================================

-- Users can view their own tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid());

-- Users can create tickets
CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own tickets
CREATE POLICY "Users can update own tickets" ON support_tickets
  FOR UPDATE USING (user_id = auth.uid());

-- Support can view all tickets
CREATE POLICY "Support can view all tickets" ON support_tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'support'
    )
  );

-- Support can update all tickets
CREATE POLICY "Support can update all tickets" ON support_tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'support'
    )
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user is radio member
CREATE OR REPLACE FUNCTION is_radio_member(radio_id UUID, required_role TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  IF required_role IS NULL THEN
    RETURN EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_members.radio_id = $1
      AND user_id = auth.uid()
    );
  ELSE
    RETURN EXISTS (
      SELECT 1 FROM radio_members
      WHERE radio_members.radio_id = $1
      AND user_id = auth.uid()
      AND role = $2
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's radio ID
CREATE OR REPLACE FUNCTION get_user_radio_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT radio_id FROM radio_members
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_radios_updated_at BEFORE UPDATE ON radios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shows_updated_at BEFORE UPDATE ON shows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_podcasts_updated_at BEFORE UPDATE ON podcasts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
