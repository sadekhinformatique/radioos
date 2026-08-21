-- Security Database Schema for RadioOS

-- Audit Logs (Append-only, immutable)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event details
  event TEXT NOT NULL,
  
  -- Actor information
  actor_id UUID REFERENCES auth.users(id),
  actor_email TEXT,
  actor_role TEXT,
  
  -- Tenant context
  radio_id UUID REFERENCES radios(id),
  
  -- Target of the action
  target_type TEXT, -- 'user', 'radio', 'stream', 'podcast', etc.
  target_id UUID,
  
  -- Additional context
  metadata JSONB DEFAULT '{}',
  
  -- Request details
  ip_address TEXT,
  user_agent TEXT,
  
  -- Integrity
  checksum TEXT NOT NULL,
  
  -- Timestamp (immutable)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON audit_logs(event);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_radio ON audit_logs(radio_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_type, target_id);

-- Listener Consents
CREATE TABLE IF NOT EXISTS listener_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Listener identifier (hashed IP)
  listener_ip_hash TEXT NOT NULL,
  
  -- Consent details
  consent_type TEXT NOT NULL CHECK (consent_type IN ('tracking', 'analytics', 'marketing', 'third_party')),
  granted BOOLEAN NOT NULL,
  
  -- Context
  radio_id UUID REFERENCES radios(id),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Validity
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Privacy Policy Acceptances
CREATE TABLE IF NOT EXISTS privacy_policy_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Policy version
  policy_version TEXT NOT NULL,
  
  -- Radio context
  radio_id UUID REFERENCES radios(id),
  
  -- Listener (for non-authenticated users)
  listener_ip_hash TEXT,
  
  -- User (for authenticated users)
  user_id UUID REFERENCES auth.users(id),
  
  -- Acceptance timestamp
  accepted_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Number Mappings
CREATE TABLE IF NOT EXISTS whatsapp_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Radio context
  radio_id UUID NOT NULL REFERENCES radios(id),
  
  -- WhatsApp details
  phone_number TEXT NOT NULL UNIQUE,
  phone_number_id TEXT, -- WhatsApp Business Phone Number ID
  
  -- Status
  status TEXT CHECK (status IN ('pending', 'verified', 'active', 'inactive')) DEFAULT 'pending',
  
  -- Verification
  verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Incidents Log
CREATE TABLE IF NOT EXISTS security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Incident details
  type TEXT NOT NULL, -- 'rate_limit', 'unauthorized_access', 'malware', etc.
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  
  -- Context
  radio_id UUID REFERENCES radios(id),
  user_id UUID REFERENCES auth.users(id),
  
  -- Details
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Request details
  ip_address TEXT,
  user_agent TEXT,
  
  -- Resolution
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File Upload Quotas
CREATE TABLE IF NOT EXISTS upload_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User context
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Quota period
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- Usage
  uploads_count INTEGER DEFAULT 0,
  uploads_size_bytes BIGINT DEFAULT 0,
  
  -- Limits
  max_uploads INTEGER DEFAULT 100,
  max_size_bytes BIGINT DEFAULT 10737418240, -- 10GB
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, period_start)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_listener_consents_ip ON listener_consents(listener_ip_hash);
CREATE INDEX IF NOT EXISTS idx_listener_consents_radio ON listener_consents(radio_id);
CREATE INDEX IF NOT EXISTS idx_security_incidents_type ON security_incidents(type);
CREATE INDEX IF NOT EXISTS idx_security_incidents_radio ON security_incidents(radio_id);
CREATE INDEX IF NOT EXISTS idx_upload_quotas_user ON upload_quotas(user_id);

-- Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE listener_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_policy_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_quotas ENABLE ROW LEVEL SECURITY;

-- Audit Logs: Insert only for everyone, read only for admins
CREATE POLICY "Anyone can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Platform admins can read audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Radio owners can read own audit logs" ON audit_logs
  FOR SELECT USING (
    radio_id IN (
      SELECT radio_id FROM radio_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- CRITICAL: No UPDATE or DELETE on audit_logs
-- This is enforced at the application level too

-- WhatsApp Numbers: Radio members can manage their own
CREATE POLICY "Radio members can view own WhatsApp numbers" ON whatsapp_numbers
  FOR SELECT USING (
    radio_id IN (
      SELECT radio_id FROM radio_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Radio owners can manage WhatsApp numbers" ON whatsapp_numbers
  FOR ALL USING (
    radio_id IN (
      SELECT radio_id FROM radio_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Security Incidents: Platform admins can manage all
CREATE POLICY "Platform admins can manage incidents" ON security_incidents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Upload Quotas: Users can view their own
CREATE POLICY "Users can view own upload quotas" ON upload_quotas
  FOR SELECT USING (user_id = auth.uid());

-- Function to check upload quota
CREATE OR REPLACE FUNCTION check_upload_quota(
  p_user_id UUID,
  p_file_size BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
  current_quota upload_quotas%ROWTYPE;
  period_start TIMESTAMPTZ;
BEGIN
  -- Get current month's period
  period_start := date_trunc('month', NOW());
  
  -- Get or create quota record
  INSERT INTO upload_quotas (user_id, period_start, period_end)
  VALUES (p_user_id, period_start, period_start + INTERVAL '1 month')
  ON CONFLICT (user_id, period_start) DO NOTHING;
  
  SELECT * INTO current_quota
  FROM upload_quotas
  WHERE user_id = p_user_id AND period_start = period_start;
  
  -- Check limits
  IF current_quota.uploads_count >= current_quota.max_uploads THEN
    RETURN FALSE;
  END IF;
  
  IF current_quota.uploads_size_bytes + p_file_size > current_quota.max_size_bytes THEN
    RETURN FALSE;
  END IF;
  
  -- Update usage
  UPDATE upload_quotas
  SET uploads_count = uploads_count + 1,
      uploads_size_bytes = uploads_size_bytes + p_file_size
  WHERE user_id = p_user_id AND period_start = period_start;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
