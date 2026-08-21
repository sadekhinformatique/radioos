-- RadioOS Seed Data
-- Demo environment with 3 radios, 10 users, and sample data

-- ============================================
-- USERS (Supabase auth.users would be created via API)
-- These are the public.users records
-- ============================================

INSERT INTO public.users (id, email, full_name, avatar_url, phone) VALUES
  -- Super Admin
  ('00000000-0000-0000-0000-000000000001', 'admin@radioos.com', 'Admin RadioOS', NULL, NULL),
  
  -- Radio 1: Radio OSFM (Dakar)
  ('00000000-0000-0000-0000-000000000002', 'osfm@radio.com', 'DJ Amadou', NULL, '+221771234567'),
  ('00000000-0000-0000-0000-000000000003', 'moussa@radio.com', 'Moussa Diallo', NULL, '+221772345678'),
  ('00000000-0000-0000-0000-000000000004', 'fatou@radio.com', 'Fatou Sow', NULL, '+221773456789'),
  
  -- Radio 2: Radio Soleil (Abidjan)
  ('00000000-0000-0000-0000-000000000005', 'soleil@radio.com', 'Jean Kouassi', NULL, '+225070123456'),
  ('00000000-0000-0000-0000-000000000006', 'marie@radio.com', 'Marie Traoré', NULL, '+225070234567'),
  
  -- Radio 3: Radio Espoir (Bamako)
  ('00000000-0000-0000-0000-000000000007', 'espoir@radio.com', 'Ibrahim Touré', NULL, '+22376123456'),
  ('00000000-0000-0000-0000-000000000008', 'aminata@radio.com', 'Aminata Keita', NULL, '+22376234567'),
  
  -- Advertisers
  ('00000000-0000-0000-0000-000000000009', 'pub@orange.sn', 'Orange Sénégal', NULL, '+221770000001'),
  ('00000000-0000-0000-0000-000000000010', 'pub@wave.com', 'Wave Money', NULL, '+221770000002');

-- ============================================
-- RADIOS
-- ============================================

INSERT INTO public.radios (id, name, slug, description, country, city, languages, timezone, contact_email, subscription_plan) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Radio OSFM', 'radio-osfm', 'La radio qui vous connecte au monde. Musique, info, culture et divertissement.', 'Sénégal', 'Dakar', ARRAY['fr', 'wo'], 'Africa/Dakar', 'contact@osfm.com', 'PROFESSIONAL'),
  ('10000000-0000-0000-0000-000000000002', 'Radio Soleil', 'radio-soleil', 'La voix du soleil ivoirien. Information et divertissement 24h/24.', 'Côte d''Ivoire', 'Abidjan', ARRAY['fr'], 'Africa/Abidjan', 'contact@soleil.com', 'STARTER'),
  ('10000000-0000-0000-0000-000000000003', 'Radio Espoir', 'radio-espoir', 'La radio de l''espoir malien. Culture, musique et débats.', 'Mali', 'Bamako', ARRAY['fr', 'bm'], 'Africa/Bamako', 'contact@espoir.com', 'STARTER');

-- ============================================
-- RADIO MEMBERS
-- ============================================

INSERT INTO public.radio_members (radio_id, user_id, role) VALUES
  -- Super Admin
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SUPER_ADMIN'),
  
  -- Radio OSFM members
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'RADIO_OWNER'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'HOST'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'EDITOR'),
  
  -- Radio Soleil members
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'RADIO_OWNER'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'HOST'),
  
  -- Radio Espoir members
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 'RADIO_OWNER'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'HOST');

-- ============================================
-- STREAMS
-- ============================================

INSERT INTO public.streams (radio_id, name, url, type, is_primary, status, bitrate, codec) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Primary', 'https://stream.osfm.sn/live', 'icecast', TRUE, 'ONLINE', 128, 'MP3'),
  ('10000000-0000-0000-0000-000000000001', 'Backup', 'https://backup.osfm.sn/live', 'icecast', FALSE, 'ONLINE', 64, 'MP3'),
  ('10000000-0000-0000-0000-000000000002', 'Primary', 'https://stream.radiosoleil.ci/live', 'icecast', TRUE, 'ONLINE', 128, 'MP3'),
  ('10000000-0000-0000-0000-000000000003', 'Primary', 'https://stream.radioespoir.ml/live', 'icecast', TRUE, 'ONLINE', 128, 'MP3');

-- ============================================
-- HOSTS
-- ============================================

INSERT INTO public.hosts (radio_id, name, bio) VALUES
  ('10000000-0000-0000-0000-000000000001', 'DJ Amadou', 'Animateur principal de la matinale. Expert en musique africaine.'),
  ('10000000-0000-0000-0000-000000000001', 'Moussa Diallo', 'Spécialiste sport. Commentateur passionné de football.'),
  ('10000000-0000-0000-0000-000000000001', 'Fatou Sow', 'Chroniqueuse culture et arts. Journaliste expérimentée.'),
  ('10000000-0000-0000-0000-000000000002', 'Jean Kouassi', 'Animateur matinal. La voix du soleil ivoirien.'),
  ('10000000-0000-0000-0000-000000000002', 'Marie Traoré', 'Animatrice afternoon. Passionnée de musique world.'),
  ('10000000-0000-0000-0000-000000000003', 'Ibrahim Touré', 'Fondateur et animateur principal.'),
  ('10000000-0000-0000-0000-000000000003', 'Aminata Keita', 'Animatrice émission culture et société.');

-- ============================================
-- PROGRAMS (Schedule)
-- ============================================

INSERT INTO public.programs (radio_id, title, description, day_of_week, start_time, end_time) VALUES
  -- Radio OSFM
  ('10000000-0000-0000-0000-000000000001', 'Le Matin Info', 'L''info du matin en direct', 1, '06:00', '09:00'),
  ('10000000-0000-0000-0000-000000000001', 'Sport Total', 'Toute l''actualité sportive', 1, '09:00', '11:00'),
  ('10000000-0000-0000-0000-000000000001', 'Musique du monde', 'Les meilleurs morceaux du monde', 1, '11:00', '13:00'),
  ('10000000-0000-0000-0000-000000000001', 'Culture & Art', 'Chronique culture et arts', 1, '14:00', '16:00'),
  ('10000000-0000-0000-0000-000000000001', 'Le Matin Info', 'L''info du matin en direct', 2, '06:00', '09:00'),
  ('10000000-0000-0000-0000-000000000001', 'Sport Total', 'Toute l''actualité sportive', 2, '09:00', '11:00'),
  
  -- Radio Soleil
  ('10000000-0000-0000-0000-000000000002', 'Réveil Soleil', 'Le matin avec Jean', 1, '06:00', '10:00'),
  ('10000000-0000-0000-0000-000000000002', 'Après-midi Soleil', 'Musique et bonne humeur', 1, '14:00', '18:00'),
  
  -- Radio Espoir
  ('10000000-0000-0000-0000-000000000003', 'Matin Espoir', 'Commencez la journée avec espoir', 1, '07:00', '10:00'),
  ('10000000-0000-0000-0000-000000000003', 'Culture & Débat', 'Débats de société', 1, '15:00', '17:00');

-- ============================================
-- PODCASTS
-- ============================================

INSERT INTO public.podcasts (radio_id, title, description, audio_url, duration_seconds, category, status, published_at) VALUES
  -- Radio OSFM
  ('10000000-0000-0000-0000-000000000001', 'Le Matin Info - Épisode 142', 'Résumé de l''actualité du jour', '#', 2732, 'Information', 'PUBLISHED', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000001', 'Sport Total - Épisode 89', 'Les résultats du weekend', '#', 4365, 'Sport', 'PUBLISHED', NOW() - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000001', 'Culture & Art - Épisode 56', 'Interview artiste local', '#', 2301, 'Culture', 'PUBLISHED', NOW() - INTERVAL '3 days'),
  ('10000000-0000-0000-0000-000000000001', 'Le Matin Info - Épisode 141', 'Résumé de la semaine', '#', 2890, 'Information', 'PUBLISHED', NOW() - INTERVAL '4 days'),
  ('10000000-0000-0000-0000-000000000001', 'Sport Total - Épisode 88', 'Coupe d''Afrique analyse', '#', 5200, 'Sport', 'PUBLISHED', NOW() - INTERVAL '5 days'),
  
  -- Radio Soleil
  ('10000000-0000-0000-0000-000000000002', 'Réveil Soleil - Épisode 45', 'Bonjour la Côte d''Ivoire', '#', 3600, 'Information', 'PUBLISHED', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000002', 'Après-midi Soleil - Épisode 32', 'Musique zouglou et coupé-décalé', '#', 4200, 'Musique', 'PUBLISHED', NOW() - INTERVAL '2 days'),
  
  -- Radio Espoir
  ('10000000-0000-0000-0000-000000000003', 'Matin Espoir - Épisode 28', 'L''espoir fait vivre', '#', 3200, 'Information', 'PUBLISHED', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000003', 'Culture & Débat - Épisode 15', 'Débat sur l''éducation au Mali', '#', 4500, 'Culture', 'PUBLISHED', NOW() - INTERVAL '3 days');

-- ============================================
-- MESSAGES (100 messages)
-- ============================================

-- Generate 100 demo messages
DO $$
DECLARE
  i INTEGER;
  radio_ids UUID[] := ARRAY[
    '10000000-0000-0000-0000-000000000001'::UUID,
    '10000000-0000-0000-0000-000000000002'::UUID,
    '10000000-0000-0000-0000-000000000003'::UUID
  ];
  sender_names TEXT[] := ARRAY['Fatou', 'Mamadou', 'Aïssatou', 'Ousmane', 'Khady', 'Ibrahima', 'Mariama', 'Abdoulaye', 'Aminata', 'Moussa'];
  messages TEXT[] := ARRAY['Super émission !', 'Bonne journée à toute l''équipe', 'Pouvez-vous passer ce morceau ?', 'Merci pour la musique', 'J''écoute depuis Abidjan', 'Content d''écouter la radio', 'Bravo pour le travail', 'Les dédicaces c''est bien', 'On vous écoute de Bamako', 'Radio préférée !'];
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO public.messages (radio_id, sender_name, content, source, created_at)
    VALUES (
      radio_ids[((i - 1) % 3) + 1],
      sender_names[((i - 1) % 10) + 1],
      messages[((i - 1) % 10) + 1],
      CASE (i % 4)
        WHEN 0 THEN 'WHATSAPP'
        WHEN 1 THEN 'WEB'
        WHEN 2 THEN 'SMS'
        ELSE 'EMAIL'
      END,
      NOW() - (random() * INTERVAL '7 days')
    );
  END LOOP;
END $$;

-- ============================================
-- DEDICATIONS (50 dedications)
-- ============================================

DO $$
DECLARE
  i INTEGER;
  radio_ids UUID[] := ARRAY[
    '10000000-0000-0000-0000-000000000001'::UUID,
    '10000000-0000-0000-0000-000000000002'::UUID,
    '10000000-0000-0000-0000-000000000003'::UUID
  ];
  sender_names TEXT[] := ARRAY['Fatou Sow', 'Mamadou Diop', 'Aïssatou Ba', 'Ousmane Fall', 'Khady Ndiaye'];
  recipient_names TEXT[] := ARRAY['Mon mari', 'Ma mère', 'Mon meilleur ami', 'Ma femme', 'Toute ma famille'];
  songs TEXT[] := ARRAY['Yolele', 'Soul Makossa', 'Bebelina', 'Premier Gaou', '1er Gaou'];
  dedication_msgs TEXT[] := ARRAY['Je t''aime', 'Bonne fête', 'Courage', 'Joyeux anniversaire', 'Tu me manques'];
BEGIN
  FOR i IN 1..50 LOOP
    INSERT INTO public.dedications (radio_id, sender_name, recipient_name, message, song_title, consent, status, created_at)
    VALUES (
      radio_ids[((i - 1) % 3) + 1],
      sender_names[((i - 1) % 5) + 1],
      recipient_names[((i - 1) % 5) + 1],
      dedication_msgs[((i - 1) % 5) + 1],
      songs[((i - 1) % 5) + 1],
      TRUE,
      CASE (i % 4)
        WHEN 0 THEN 'PENDING'
        WHEN 1 THEN 'APPROVED'
        WHEN 2 THEN 'PLAYED'
        ELSE 'REJECTED'
      END,
      NOW() - (random() * INTERVAL '7 days')
    );
  END LOOP;
END $$;

-- ============================================
-- POLLS (5 polls with options)
-- ============================================

-- Poll 1
INSERT INTO public.polls (radio_id, question, starts_at, ends_at, is_active, total_votes)
VALUES ('10000000-0000-0000-0000-000000000001', 'Quelle émission préférez-vous ?', NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', TRUE, 156);

INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Le Matin Info', 45 FROM public.polls WHERE question = 'Quelle émission préférez-vous ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Sport Total', 38 FROM public.polls WHERE question = 'Quelle émission préférez-vous ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Musique du monde', 42 FROM public.polls WHERE question = 'Quelle émission préférez-vous ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Culture & Art', 31 FROM public.polls WHERE question = 'Quelle émission préférez-vous ?';

-- Poll 2
INSERT INTO public.polls (radio_id, question, starts_at, ends_at, is_active, total_votes)
VALUES ('10000000-0000-0000-0000-000000000001', 'Quel genre musical préférez-vous ?', NOW() - INTERVAL '1 day', NOW() + INTERVAL '6 days', TRUE, 89);

INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Afrobeat', 32 FROM public.polls WHERE question = 'Quel genre musical préférez-vous ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Mbalax', 28 FROM public.polls WHERE question = 'Quel genre musical préférez-vous ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Zouglou', 18 FROM public.polls WHERE question = 'Quel genre musical préférez-vous ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'R&B', 11 FROM public.polls WHERE question = 'Quel genre musical préférez-vous ?';

-- Poll 3
INSERT INTO public.polls (radio_id, question, starts_at, ends_at, is_active, total_votes)
VALUES ('10000000-0000-0000-0000-000000000002', 'Voulez-vous plus de sport ?', NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', TRUE, 67);

INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Oui, beaucoup plus', 42 FROM public.polls WHERE question = 'Voulez-vous plus de sport ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Un peu plus', 18 FROM public.polls WHERE question = 'Voulez-vous plus de sport ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Non, c''est suffisant', 7 FROM public.polls WHERE question = 'Voulez-vous plus de sport ?';

-- Poll 4
INSERT INTO public.polls (radio_id, question, starts_at, ends_at, is_active, total_votes)
VALUES ('10000000-0000-0000-0000-000000000003', 'Quel sujet vous intéresse le plus ?', NOW() - INTERVAL '4 days', NOW() + INTERVAL '3 days', TRUE, 45);

INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Politique', 15 FROM public.polls WHERE question = 'Quel sujet vous intéresse le plus ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Sport', 18 FROM public.polls WHERE question = 'Quel sujet vous intéresse le plus ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Culture', 8 FROM public.polls WHERE question = 'Quel sujet vous intéresse le plus ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Musique', 4 FROM public.polls WHERE question = 'Quel sujet vous intéresse le plus ?';

-- Poll 5
INSERT INTO public.polls (radio_id, question, starts_at, ends_at, is_active, total_votes)
VALUES ('10000000-0000-0000-0000-000000000001', 'A quelle heure écoutez-vous la radio ?', NOW() - INTERVAL '5 days', NOW() + INTERVAL '2 days', TRUE, 123);

INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Matin (6h-12h)', 52 FROM public.polls WHERE question = 'A quelle heure écoutez-vous la radio ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Après-midi (12h-18h)', 38 FROM public.polls WHERE question = 'A quelle heure écoutez-vous la radio ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Soir (18h-24h)', 25 FROM public.polls WHERE question = 'A quelle heure écoutez-vous la radio ?';
INSERT INTO public.poll_options (poll_id, text, votes_count)
SELECT id, 'Nuit (0h-6h)', 8 FROM public.polls WHERE question = 'A quelle heure écoutez-vous la radio ?';

-- ============================================
-- ADVERTISERS
-- ============================================

INSERT INTO public.advertisers (radio_id, name, contact_email, company) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Orange Sénégal', 'pub@orange.sn', 'Orange'),
  ('10000000-0000-0000-0000-000000000001', 'Wave Money', 'pub@wave.com', 'Wave'),
  ('10000000-0000-0000-0000-000000000002', 'MTN CI', 'pub@mtn.ci', 'MTN');

-- ============================================
-- CAMPAIGNS
-- ============================================

INSERT INTO public.campaigns (radio_id, advertiser_id, name, status, budget, spent, currency, start_date, end_date, frequency) VALUES
  ('10000000-0000-0000-0000-000000000001', (SELECT id FROM public.advertisers WHERE name = 'Orange Sénégal'), 'Campagne Orange Money', 'ACTIVE', 500000, 125000, 'XOF', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', '5x/jour'),
  ('10000000-0000-0000-0000-000000000001', (SELECT id FROM public.advertisers WHERE name = 'Wave Money'), 'Campagne Wave', 'PENDING', 300000, 0, 'XOF', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '35 days', '3x/jour'),
  ('10000000-0000-0000-0000-000000000002', (SELECT id FROM public.advertisers WHERE name = 'MTN CI'), 'Campagne MTN Bonheur', 'ACTIVE', 200000, 50000, 'XOF', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '27 days', '4x/jour');

-- ============================================
-- SUBSCRIPTIONS
-- ============================================

INSERT INTO public.subscriptions (radio_id, plan, status, current_period_start, current_period_end) VALUES
  ('10000000-0000-0000-0000-000000000001', 'PROFESSIONAL', 'ACTIVE', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days'),
  ('10000000-0000-0000-0000-000000000002', 'STARTER', 'ACTIVE', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days'),
  ('10000000-0000-0000-0000-000000000003', 'STARTER', 'ACTIVE', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days');

-- ============================================
-- LISTENERS (sample data)
-- ============================================

DO $$
DECLARE
  i INTEGER;
  radio_ids UUID[] := ARRAY[
    '10000000-0000-0000-0000-000000000001'::UUID,
    '10000000-0000-0000-0000-000000000002'::UUID,
    '10000000-0000-0000-0000-000000000003'::UUID
  ];
  countries TEXT[] := ARRAY['Sénégal', 'Côte d''Ivoire', 'Mali', 'France', 'Burkina Faso'];
  devices TEXT[] := ARRAY['Mobile', 'Desktop', 'Tablet'];
  browsers TEXT[] := ARRAY['Chrome', 'Firefox', 'Safari', 'Edge'];
BEGIN
  FOR i IN 1..500 LOOP
    INSERT INTO public.listeners (radio_id, session_id, country, device, browser, started_at, duration_seconds)
    VALUES (
      radio_ids[((i - 1) % 3) + 1],
      'session_' || i,
      countries[((i - 1) % 5) + 1],
      devices[((i - 1) % 3) + 1],
      browsers[((i - 1) % 4) + 1],
      NOW() - (random() * INTERVAL '24 hours'),
      (random() * 3600)::INTEGER
    );
  END LOOP;
END $$;
