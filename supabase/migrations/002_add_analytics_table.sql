-- Analytics table (for tracking listening events and aggregations)
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radio_id UUID NOT NULL REFERENCES public.radios(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::JSONB,
  listener_session_id TEXT,
  country TEXT,
  city TEXT,
  device TEXT,
  os TEXT,
  browser TEXT,
  quality TEXT,
  duration_seconds INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX idx_analytics_radio_id ON public.analytics(radio_id);
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX idx_analytics_recorded_at ON public.analytics(recorded_at);
CREATE INDEX idx_analytics_radio_recorded ON public.analytics(radio_id, recorded_at);

-- Enable RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Radio members can view analytics"
  ON public.analytics FOR SELECT
  USING (
    radio_id IN (SELECT public.get_user_radio_ids())
    OR is_super_admin()
  );

CREATE POLICY "System can insert analytics"
  ON public.analytics FOR INSERT
  WITH CHECK (TRUE);

-- Trigger for updated_at
CREATE TRIGGER update_analytics_updated_at
  BEFORE UPDATE ON public.analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
