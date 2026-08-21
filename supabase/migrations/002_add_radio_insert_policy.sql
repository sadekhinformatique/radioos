-- Add INSERT policy for radios table
-- Authenticated users can create their own radio

CREATE POLICY "Authenticated users can create radio"
  ON public.radios FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Also add INSERT policy for radio_members
-- Users can add themselves as owner when creating a radio

CREATE POLICY "Users can add themselves as radio member"
  ON public.radio_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND role = 'RADIO_OWNER'
  );

-- Add INSERT policy for streams
-- Radio owners can add streams to their radio

CREATE POLICY "Radio owners can create streams"
  ON public.streams FOR INSERT
  WITH CHECK (
    public.user_has_role(radio_id, ARRAY['SUPER_ADMIN', 'RADIO_OWNER', 'RADIO_ADMIN'])
  );
