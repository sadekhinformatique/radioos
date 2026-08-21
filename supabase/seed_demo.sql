-- ============================================
-- DONNÉES DE DÉMONSTRATION RADIOOS
-- ============================================
-- Exécutez ceci APRÈS avoir créé les tables et RLS
-- Note: Ceci désactive temporairement RLS pour l'insertion

-- Désactiver RLS temporairement
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE radios DISABLE ROW LEVEL SECURITY;
ALTER TABLE radio_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE streams DISABLE ROW LEVEL SECURITY;
ALTER TABLE shows DISABLE ROW LEVEL SECURITY;
ALTER TABLE hosts DISABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE dedications DISABLE ROW LEVEL SECURITY;
ALTER TABLE polls DISABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;

-- ============================================
-- UTILISATEURS (doivent correspondre à des auth.users)
-- Les IDs ici sont des exemples - adaptez-les
-- ============================================

-- Note: Vous devez d'abord créer un compte via l'interface
-- puis exécuter ces requêtes avec votre vrais user_id

-- Exemple de données (à adapter avec vos vrais IDs):
-- INSERT INTO users (id, email, full_name) VALUES
-- ('votre-user-id', 'votre@email.com', 'Votre Nom');

-- ============================================
-- RADIO DE DÉMONSTRATION
-- ============================================

-- Insérez votre radio (remplacez l'owner_id par votre vrai ID user)
-- INSERT INTO radios (id, name, slug, description, country, city, owner_id, is_active, is_public) VALUES
-- ('radio-demo-id', 'Radio OSFM', 'radio-osfm', 'La radio qui vous connecte au monde', 'Sénégal', 'Dakar', 'votre-user-id', true, true);

-- ============================================
-- MEMBRES
-- ============================================

-- INSERT INTO radio_members (radio_id, user_id, role) VALUES
-- ('radio-demo-id', 'votre-user-id', 'RADIO_OWNER');

-- ============================================
-- FLUX AUDIO
-- ============================================

-- INSERT INTO streams (radio_id, name, url, type, is_primary, bitrate, codec, status) VALUES
-- ('radio-demo-id', 'Flux Principal', 'http://stream.example.com:8000/live', 'icecast', true, 128, 'mp3', 'ONLINE');

-- ============================================
-- ÉMISSIONS
-- ============================================

-- INSERT INTO shows (radio_id, title, description, scheduled_at, duration_minutes) VALUES
-- ('radio-demo-id', 'Le Matin Info', 'L''info du matin en direct', NOW(), 180),
-- ('radio-demo-id', 'Musique Africaine', 'Les meilleurs titres africains', NOW() + INTERVAL '3 hours', 180),
-- ('radio-demo-id', 'Sport Total', 'Toute l''actualité sportive', NOW() + INTERVAL '5 hours', 120);

-- ============================================
-- PODCASTS
-- ============================================

-- INSERT INTO podcasts (radio_id, title, description, audio_url, duration_seconds, status, published_at) VALUES
-- ('radio-demo-id', 'Épisode 1 - Le lancement', 'Notre premier épisode !', 'https://example.com/ep1.mp3', 2700, 'PUBLISHED', NOW()),
-- ('radio-demo-id', 'Épisode 2 - Les.invités', 'Interview spéciale', 'https://example.com/ep2.mp3', 3600, 'PUBLISHED', NOW() - INTERVAL '1 day');

-- ============================================
-- MESSAGES
-- ============================================

-- INSERT INTO messages (radio_id, sender_name, content, source) VALUES
-- ('radio-demo-id', 'Aminata', 'Bonjour, j''adore votre radio !', 'WHATSAPP'),
-- ('radio-demo-id', 'Moussa', 'Excellente émission ce matin', 'SMS'),
-- ('radio-demo-id', 'Fatou', 'Je voudrais une dédicace', 'WEB');

-- ============================================
-- DÉDICACES
-- ============================================

-- INSERT INTO dedications (radio_id, sender_name, recipient_name, message, song_title, consent, status) VALUES
-- ('radio-demo-id', 'Aminata', 'Mariama', 'Bonne fête ma chérie !', 'Love Nwantiti - CKay', true, 'PENDING'),
-- ('radio-demo-id', 'Ousmane', 'Moussa', 'Joyeux anniversaire frère !', 'Bouger Bouger - Youssou N''Dour', true, 'APPROVED');

-- ============================================
-- SONDAGES
-- ============================================

-- INSERT INTO polls (radio_id, question, starts_at, ends_at, is_active) VALUES
-- ('radio-demo-id', 'Quelle émission préférez-vous ?', NOW(), NOW() + INTERVAL '7 days', true);

-- INSERT INTO poll_options (poll_id, text, votes_count) VALUES
-- ((SELECT id FROM polls WHERE question = 'Quelle émission préférez-vous ?'), 'Le Matin Info', 45),
-- ((SELECT id FROM polls WHERE question = 'Quelle émission préférez-vous ?'), 'Musique Africaine', 67),
-- ((SELECT id FROM polls WHERE question = 'Quelle émission préférez-vous ?'), 'Sport Total', 34);

-- ============================================
-- RÉACTIVER RLS
-- ============================================

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
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
