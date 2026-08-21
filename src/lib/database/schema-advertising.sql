-- Advertising Marketplace Schema for RadioOS
-- Supports multi-radio campaigns with budget distribution

-- Advertisers table (can run campaigns across multiple radios)
CREATE TABLE IF NOT EXISTS advertisers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  type TEXT CHECK (type IN ('individual', 'company', 'agency')) DEFAULT 'individual',
  status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns table (can be assigned to multiple radios)
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES advertisers(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'pending', 'active', 'paused', 'completed', 'cancelled')) DEFAULT 'draft',
  
  -- Budget
  total_budget DECIMAL(10,2) NOT NULL,
  spent_budget DECIMAL(10,2) DEFAULT 0,
  daily_budget DECIMAL(10,2),
  
  -- Dates
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  
  -- Targeting
  target_audience TEXT, -- e.g., '18-35', 'urban', 'national'
  target_radios TEXT[], -- List of radio IDs, empty = open to all
  
  -- Creative
  audio_url TEXT,
  image_url TEXT,
  message TEXT,
  
  -- Commission
  platform_commission_percent DECIMAL(5,2) DEFAULT 15.00, -- RadioOS takes 15%
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign-Radio junction table (multi-radio assignment)
CREATE TABLE IF NOT EXISTS campaign_radios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  radio_id UUID NOT NULL REFERENCES radios(id),
  
  -- Per-radio budget allocation
  allocated_budget DECIMAL(10,2) NOT NULL,
  spent_budget DECIMAL(10,2) DEFAULT 0,
  
  -- Per-radio settings
  impressions_limit INTEGER,
  plays_limit INTEGER,
  
  -- Status per radio
  status TEXT CHECK (status IN ('pending', 'active', 'paused', 'completed')) DEFAULT 'pending',
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Revenue split
  radio_revenue_percent DECIMAL(5,2) DEFAULT 85.00, -- Radio gets 85%
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(campaign_id, radio_id)
);

-- Ad impressions tracking
CREATE TABLE IF NOT EXISTS ad_impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id),
  radio_id UUID NOT NULL REFERENCES radios(id),
  
  -- Impression data
  impression_type TEXT CHECK (impression_type IN ('play', 'banner', 'popup', 'audio_preroll', 'audio_midroll', 'audio_postroll')),
  listener_ip_hash TEXT, -- Hashed IP for uniqueness
  user_agent TEXT,
  
  -- Timing
  duration_ms INTEGER, -- For audio plays
  completed BOOLEAN DEFAULT FALSE, -- Did they listen to the full ad?
  
  -- Revenue
  revenue_amount DECIMAL(10,4), -- CPM-based revenue
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad clicks tracking (for interactive ads)
CREATE TABLE IF NOT EXISTS ad_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  impression_id UUID NOT NULL REFERENCES ad_impressions(id),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id),
  radio_id UUID NOT NULL REFERENCES radios(id),
  
  click_url TEXT,
  click_type TEXT CHECK (click_type IN ('link', 'button', 'cta')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad performance reports (daily aggregates)
CREATE TABLE IF NOT EXISTS ad_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id),
  radio_id UUID NOT NULL REFERENCES radios(id),
  
  report_date DATE NOT NULL,
  
  -- Metrics
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0, -- Full ad plays
  unique_listeners INTEGER DEFAULT 0,
  
  -- Revenue
  impressions_revenue DECIMAL(10,2) DEFAULT 0,
  clicks_revenue DECIMAL(10,2) DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  
  -- Costs
  advertiser_cost DECIMAL(10,2) DEFAULT 0,
  radio_revenue DECIMAL(10,2) DEFAULT 0,
  platform_commission DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(campaign_id, radio_id, report_date)
);

-- Invoices for advertisers
CREATE TABLE IF NOT EXISTS ad_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  advertiser_id UUID NOT NULL REFERENCES advertisers(id),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id),
  
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  status TEXT CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
  
  due_date TIMESTAMPTZ NOT NULL,
  paid_at TIMESTAMPTZ,
  
  -- Payment method
  payment_method TEXT, -- 'mobile_money', 'card', 'transfer', 'ussd'
  payment_reference TEXT,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Radio payouts
CREATE TABLE IF NOT EXISTS ad_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  radio_id UUID NOT NULL REFERENCES radios(id),
  
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  
  -- Payout method
  payout_method TEXT, -- 'mobile_money', 'bank_transfer'
  payout_account TEXT, -- Phone number or bank account
  
  -- Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Campaigns included
  campaign_ids UUID[] NOT NULL,
  
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaign_radios_campaign ON campaign_radios(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_radios_radio ON campaign_radios(radio_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_campaign ON ad_impressions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_radio ON ad_impressions(radio_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_date ON ad_impressions(created_at);
CREATE INDEX IF NOT EXISTS idx_ad_reports_date ON ad_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_ad_invoices_advertiser ON ad_invoices(advertiser_id);

-- Row Level Security
ALTER TABLE advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_radios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Advertisers can see their own data
CREATE POLICY "Advertisers can view own data" ON advertisers
  FOR SELECT USING (
    id IN (
      SELECT advertiser_id FROM ad_campaigns 
      WHERE id IN (
        SELECT campaign_id FROM campaign_radios 
        WHERE radio_id IN (
          SELECT radio_id FROM radio_members WHERE user_id = auth.uid()
        )
      )
    )
    OR id IN (
      SELECT advertiser_id FROM ad_invoices
      WHERE advertiser_id IN (
        SELECT id FROM advertisers WHERE email = auth.email()
      )
    )
  );

-- Radio members can see campaigns assigned to their radio
CREATE POLICY "Radio members can view assigned campaigns" ON ad_campaigns
  FOR SELECT USING (
    id IN (
      SELECT campaign_id FROM campaign_radios 
      WHERE radio_id IN (
        SELECT radio_id FROM radio_members WHERE user_id = auth.uid()
      )
    )
  );

-- Platform admins can see all
CREATE POLICY "Platform admins can manage all" ON ad_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Impressions are append-only (no updates/deletes)
CREATE POLICY "System can insert impressions" ON ad_impressions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Radio members can view own impressions" ON ad_impressions
  FOR SELECT USING (
    radio_id IN (
      SELECT radio_id FROM radio_members WHERE user_id = auth.uid()
    )
  );

-- Function to calculate campaign spend
CREATE OR REPLACE FUNCTION calculate_campaign_spend(campaign_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_spent DECIMAL;
BEGIN
  SELECT COALESCE(SUM(impressions_revenue + clicks_revenue), 0)
  INTO total_spent
  FROM ad_reports
  WHERE campaign_id = campaign_uuid;
  
  RETURN total_spent;
END;
$$ LANGUAGE plpgsql;

-- Function to check if campaign budget is exceeded
CREATE OR REPLACE FUNCTION is_campaign_budget_exceeded(campaign_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  campaign_budget DECIMAL;
  total_spent DECIMAL;
BEGIN
  SELECT total_budget INTO campaign_budget
  FROM ad_campaigns WHERE id = campaign_uuid;
  
  total_spent := calculate_campaign_spend(campaign_uuid);
  
  RETURN total_spent >= campaign_budget;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update campaign spent_budget
CREATE OR REPLACE FUNCTION update_campaign_spent_budget()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ad_campaigns
  SET spent_budget = calculate_campaign_spend(NEW.campaign_id)
  WHERE id = NEW.campaign_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_campaign_spent
  AFTER INSERT ON ad_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_spent_budget();
