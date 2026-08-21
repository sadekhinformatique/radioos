# PROMPT MAÎTRE, CONSTRUCTION DU SaaS RADIOOS

Tu es un architecte logiciel senior, développeur full-stack, ingénieur DevOps, spécialiste SaaS multi-tenant, streaming audio, radio numérique, analytics, sécurité et UX.

Ta mission est de concevoir et développer une plateforme SaaS professionnelle appelée provisoirement **RadioOS**.

RadioOS doit devenir un système central permettant aux radios de gérer leur présence numérique, leur streaming, leurs auditeurs, leurs émissions, leurs podcasts, leurs interactions, leurs statistiques et leur monétisation.

Ne construis pas un simple lecteur radio. Construis une véritable plateforme SaaS multi-tenant.

---

# 1. OBJECTIF DU PRODUIT

RadioOS doit permettre à une radio de :

- créer son compte ;
- créer son espace radio ;
- connecter son flux audio existant ;
- diffuser son direct sur le Web ;
- suivre ses auditeurs en temps réel ;
- analyser son audience ;
- gérer ses émissions ;
- gérer ses programmes ;
- publier des podcasts ;
- recevoir des messages ;
- recevoir des dédicaces ;
- créer des sondages ;
- gérer ses contenus ;
- gérer ses campagnes publicitaires ;
- suivre ses revenus ;
- recevoir des notifications ;
- gérer ses utilisateurs ;
- gérer son abonnement ;
- obtenir une page publique professionnelle ;
- disposer d'une PWA responsive ;
- connecter ultérieurement une application mobile native.

La plateforme doit être conçue dès le départ pour supporter plusieurs radios indépendantes.

---

# 2. CIBLE

La cible initiale est :

- radios FM ;
- radios communautaires ;
- radios religieuses ;
- radios privées ;
- radios universitaires ;
- webradios ;
- radios africaines francophones.

Le produit doit être particulièrement adapté aux marchés africains.

Prendre en compte :

- connexions mobiles variables ;
- consommation de données ;
- paiements en FCFA ;
- smartphones Android ;
- WhatsApp ;
- français ;
- arabe ;
- éventuellement wolof ;
- faible coût d'infrastructure ;
- besoin de simplicité pour les équipes radio.

---

# 3. ARCHITECTURE SAAS

Construis une architecture multi-tenant robuste.

Structure logique :

RadioOS
├── Super Admin
├── Tenant Radio
│   ├── Dashboard
│   ├── Streaming
│   ├── Audience
│   ├── Programmes
│   ├── Émissions
│   ├── Podcasts
│   ├── Messages
│   ├── Dédicaces
│   ├── Sondages
│   ├── Publicités
│   ├── Utilisateurs
│   ├── Facturation
│   └── Paramètres
└── Auditeurs

Chaque radio doit être isolée logiquement.

Toutes les données appartenant à une radio doivent être liées à son tenant_id ou radio_id.

Aucune radio ne doit pouvoir consulter ou modifier les données d'une autre radio.

Utiliser PostgreSQL et des politiques RLS lorsque Supabase est utilisé.

---

# 4. STACK TECHNIQUE

Utiliser une architecture moderne.

Frontend :

- Next.js ;
- React ;
- TypeScript ;
- Tailwind CSS ;
- composants UI modernes ;
- responsive design ;
- PWA.

Backend :

- Next.js ;
- API REST ou architecture API moderne ;
- TypeScript ;
- PostgreSQL.

Base de données :

- Supabase PostgreSQL ;
- Supabase Auth ;
- Supabase Storage ;
- Supabase Realtime.

Infrastructure :

- Docker ;
- Cloudflare ;
- VPS ou cloud ;
- Redis lorsque nécessaire ;
- système de files/queues pour les traitements asynchrones.

Streaming :

Prévoir l'intégration avec :

- Icecast ;
- Shoutcast ;
- AzuraCast ;
- autres sources HTTP/HLS compatibles.

Ne pas obliger une radio à migrer son infrastructure de streaming existante.

RadioOS doit pouvoir se connecter à un flux existant.

---

# 5. IDENTITÉ VISUELLE

Créer une interface SaaS moderne et professionnelle.

Style :

- sobre ;
- premium ;
- moderne ;
- rapide ;
- lisible ;
- responsive ;
- adaptée aux écrans desktop, tablette et mobile.

Éviter les interfaces surchargées.

Créer :

- sidebar ;
- topbar ;
- dashboard cards ;
- graphiques ;
- tableaux ;
- modales ;
- notifications ;
- filtres ;
- recherche ;
- menus contextuels.

L'interface doit donner l'impression d'un véritable produit SaaS commercial.

---

# 6. LANDING PAGE

Créer une landing page professionnelle.

Sections :

1. Hero.
2. Présentation du problème.
3. Solution RadioOS.
4. Fonctionnalités.
5. Dashboard.
6. Streaming.
7. Analytics.
8. Podcasts.
9. Interaction.
10. Publicité.
11. Tarifs.
12. FAQ.
13. CTA.
14. Footer.

Hero :

Titre :

"Le système d'exploitation numérique des radios."

Sous-titre :

"Streaming, audience, podcasts, interaction et monétisation réunis dans une seule plateforme."

CTA :

"Créer ma radio"

Deuxième CTA :

"Voir la plateforme"

---

# 7. AUTHENTIFICATION

Créer un système d'authentification complet.

Méthodes :

- email + mot de passe ;
- Google OAuth si disponible ;
- récupération du mot de passe ;
- vérification email ;
- sessions sécurisées ;
- déconnexion ;
- gestion des appareils.

Prévoir les rôles :

SUPER_ADMIN
RADIO_OWNER
RADIO_ADMIN
EDITOR
HOST
ANALYST
ADVERTISER
SUPPORT
LISTENER

Utiliser RBAC.

Chaque permission doit être contrôlée côté serveur.

Ne jamais faire confiance uniquement au frontend.

---

# 8. ONBOARDING RADIO

Après inscription :

Étape 1 :

Nom de la radio.

Étape 2 :

Logo.

Étape 3 :

Pays.

Étape 4 :

Ville.

Étape 5 :

Langues.

Étape 6 :

URL du flux.

Étape 7 :

Type de flux.

Étape 8 :

Fuseau horaire.

Étape 9 :

Informations de contact.

Étape 10 :

Création de l'espace radio.

Afficher une checklist de configuration.

Exemple :

[✓] Compte créé
[✓] Radio créée
[ ] Flux connecté
[ ] Logo ajouté
[ ] Programme configuré
[ ] Première émission créée
[ ] Page publique publiée

---

# 9. DASHBOARD RADIO

Créer un dashboard temps réel.

Afficher :

- statut du streaming ;
- auditeurs actuels ;
- pic d'audience ;
- durée moyenne d'écoute ;
- sessions ;
- pays ;
- villes ;
- appareils ;
- programme actuel ;
- prochaine émission ;
- podcasts ;
- messages ;
- dédicaces ;
- campagnes publicitaires ;
- revenus.

Exemple :

AUDITEURS ACTUELS
1 284

PIC DU JOUR
2 436

DURÉE MOYENNE
34 min

PAYS
12

Afficher les évolutions :

+18,4 %
-5,2 %
+31,7 %

---

# 10. MODULE STREAMING

Créer une interface :

Streaming

Statut :

● CONNECTÉ

Afficher :

- URL du flux ;
- type ;
- codec ;
- bitrate ;
- disponibilité ;
- latence ;
- erreurs ;
- dernière interruption ;
- durée du dernier incident.

Créer un système de monitoring.

Le système doit vérifier périodiquement le flux.

Si le flux tombe :

1. détecter ;
2. enregistrer l'incident ;
3. notifier l'administrateur ;
4. tenter le flux secondaire si configuré ;
5. enregistrer la durée de la panne.

Prévoir :

PRIMARY_STREAM
BACKUP_STREAM

---

# 11. LECTEUR AUDIO

Créer un lecteur audio professionnel.

Fonctions :

- play ;
- pause ;
- volume ;
- mute ;
- progression lorsque disponible ;
- titre actuel ;
- artiste ;
- pochette ;
- statut live ;
- partage ;
- choix qualité ;
- mode économie de données.

Prévoir plusieurs qualités :

128 kbps
64 kbps
32 kbps

Ne pas supposer que tous les flux supportent plusieurs qualités.

Afficher uniquement les qualités disponibles.

---

# 12. PAGE PUBLIQUE DE LA RADIO

Chaque radio doit obtenir une page publique.

Exemple :

/radio/[slug]

Contenu :

- logo ;
- nom ;
- lecteur ;
- statut live ;
- auditeurs ;
- émission actuelle ;
- prochaine émission ;
- programme ;
- podcasts ;
- actualités ;
- animateurs ;
- messages ;
- réseaux sociaux ;
- bouton WhatsApp ;
- partage.

La page doit être extrêmement rapide sur mobile.

---

# 13. PROGRAMMATION

Créer un module Programme.

Une radio peut créer :

- émission ;
- animateur ;
- jour ;
- heure de début ;
- heure de fin ;
- description ;
- image ;
- catégorie.

Créer une vue :

- jour ;
- semaine ;
- calendrier.

Afficher le programme sur la page publique.

---

# 14. PODCASTS

Créer un véritable CMS podcast.

Fonctions :

- upload audio ;
- titre ;
- description ;
- image ;
- catégorie ;
- animateur ;
- date ;
- durée ;
- tags ;
- publication ;
- brouillon ;
- archive.

Prévoir :

- lecteur ;
- téléchargement ;
- partage ;
- statistiques.

---

# 15. IA POUR LES PODCASTS

Créer un système d'automatisation IA.

À partir d'un fichier audio :

1. transcription ;
2. titre proposé ;
3. résumé ;
4. description ;
5. chapitres ;
6. mots-clés ;
7. extraits intéressants.

L'utilisateur doit toujours pouvoir modifier les résultats avant publication.

Ne jamais publier automatiquement un contenu IA sans option de validation humaine.

---

# 16. INTERACTION AUDITEURS

Créer :

Messages
Dédicaces
Sondages
Demandes
Concours

Les animateurs doivent pouvoir consulter les messages en temps réel.

Créer :

- boîte de réception ;
- filtres ;
- statut lu/non lu ;
- priorité ;
- recherche ;
- archivage.

---

# 17. DÉDICACES

Créer un formulaire :

Nom
Téléphone ou identifiant
Destinataire
Message
Chanson
Consentement

La radio reçoit la demande dans son dashboard.

Statuts :

PENDING
APPROVED
PLAYED
REJECTED

---

# 18. SONDAGES

Créer un système de sondages.

Exemple :

"Quelle émission préférez-vous ?"

Options :

Matin
Midi
Soir
Sport

Afficher les résultats en temps réel.

Prévoir :

- date de début ;
- date de fin ;
- nombre de votes ;
- résultats ;
- export.

---

# 19. ANALYTICS

Créer un module Analytics professionnel.

Métriques :

- auditeurs simultanés ;
- auditeurs uniques ;
- sessions ;
- durée moyenne ;
- durée totale ;
- pays ;
- villes ;
- appareils ;
- OS ;
- navigateur ;
- heures d'écoute ;
- émissions les plus écoutées ;
- podcasts les plus écoutés.

Créer des graphiques :

- audience horaire ;
- audience quotidienne ;
- audience hebdomadaire ;
- audience mensuelle.

Créer des filtres :

Aujourd'hui
7 jours
30 jours
90 jours
Personnalisé

---

# 20. ANALYTICS TEMPS RÉEL

Utiliser Supabase Realtime lorsque pertinent.

Afficher :

"1 284 auditeurs maintenant"

Mettre à jour les données sans rechargement de page.

Prévoir une architecture capable de supporter plusieurs milliers de connexions.

Ne pas stocker inutilement chaque événement brut dans PostgreSQL si cela provoque une surcharge.

Prévoir une architecture analytique évolutive.

---

# 21. GESTION PUBLICITAIRE

Créer Ad Manager.

Une radio peut créer :

- annonceur ;
- campagne ;
- publicité ;
- budget ;
- période ;
- fréquence ;
- horaires ;
- ciblage.

Statuts :

DRAFT
PENDING
ACTIVE
PAUSED
COMPLETED
CANCELLED

Afficher :

- impressions ;
- diffusions ;
- portée ;
- auditeurs ;
- période ;
- budget ;
- revenus.

---

# 22. ESPACE ANNONCEUR

Créer un espace séparé.

L'annonceur peut :

- créer son compte ;
- créer une campagne ;
- déposer son fichier audio ;
- choisir les radios ;
- choisir les dates ;
- choisir son budget ;
- suivre les performances ;
- télécharger les rapports.

---

# 23. FACTURATION

Créer un système d'abonnement.

Plans :

STARTER
PROFESSIONAL
ENTERPRISE

Prévoir :

- abonnement ;
- renouvellement ;
- facture ;
- paiement ;
- statut ;
- historique.

Préparer l'architecture pour intégrer :

- paiement par carte ;
- Mobile Money ;
- Wave ;
- Orange Money ;
- PayDunya ;
- autres prestataires selon le pays.

Ne pas coder de fausses intégrations. Créer des interfaces d'intégration propres.

---

# 24. NOTIFICATIONS

Créer un système de notifications.

Canaux :

- notification interne ;
- email ;
- push ;
- WhatsApp lorsqu'une intégration officielle est configurée.

Événements :

- streaming hors ligne ;
- streaming rétabli ;
- nouvelle campagne ;
- nouveau message ;
- nouveau paiement ;
- abonnement expirant ;
- pic d'audience ;
- incident serveur.

---

# 25. WHATSAPP

Préparer une intégration officielle WhatsApp Business API.

Architecture :

WhatsApp
↓
Webhook
↓
RadioOS
↓
Inbox
↓
Utilisateur radio

Centraliser :

- messages ;
- messages vocaux ;
- demandes ;
- dédicaces.

Ne pas utiliser de méthode non officielle ou de scraping WhatsApp.

---

# 26. MULTILINGUE

Prévoir l'internationalisation dès la première version.

Langues :

- Français ;
- Arabe ;
- Anglais.

Prévoir l'ajout futur du Wolof et d'autres langues.

Ne pas coder les textes directement dans les composants.

Utiliser un système i18n.

---

# 27. PWA

La plateforme publique doit fonctionner comme une PWA.

Fonctions :

- installation sur téléphone ;
- icône ;
- splash screen ;
- lecteur audio ;
- notifications push si supportées ;
- fonctionnement optimisé sur mobile.

---

# 28. RESPONSIVE DESIGN

Tester obligatoirement :

Mobile
Tablet
Laptop
Desktop
Écrans larges

La plateforme doit être utilisable avec un écran 21:9.

Le dashboard doit utiliser correctement l'espace disponible.

Le menu doit rester navigable.

Les longues pages doivent avoir un scroll vertical naturel.

---

# 29. BASE DE DONNÉES

Créer une architecture PostgreSQL propre.

Tables principales :

users
roles
permissions
organizations
radios
radio_members
radio_settings
streams
stream_health
programs
shows
hosts
podcasts
podcast_categories
messages
dedications
polls
poll_options
poll_votes
listeners
listener_sessions
analytics_events
audience_snapshots
advertisers
campaigns
advertisements
campaign_impressions
subscriptions
plans
invoices
payments
notifications
media
audit_logs
support_tickets

Toutes les relations doivent être correctement définies.

Créer les index nécessaires.

Utiliser UUID.

Utiliser created_at et updated_at.

Prévoir soft delete lorsque pertinent.

---

# 30. SÉCURITÉ

Appliquer :

- RLS ;
- RBAC ;
- validation serveur ;
- rate limiting ;
- protection CSRF lorsque nécessaire ;
- protection XSS ;
- validation des uploads ;
- contrôle MIME ;
- limites de taille ;
- logs de sécurité ;
- audit logs ;
- gestion sécurisée des secrets.

Ne jamais exposer :

- clés API ;
- mots de passe ;
- service role keys ;
- secrets serveur.

---

# 31. STOCKAGE

Utiliser Supabase Storage pour :

- logos ;
- images ;
- podcasts ;
- fichiers audio ;
- documents ;
- publicités audio.

Créer des buckets séparés lorsque pertinent.

Contrôler strictement les accès.

---

# 32. API

Créer une API propre.

Préparer des endpoints pour :

- radios ;
- streaming ;
- programmes ;
- podcasts ;
- messages ;
- statistiques ;
- campagnes ;
- utilisateurs ;
- abonnements.

Prévoir une future API publique pour permettre :

- applications mobiles ;
- lecteurs externes ;
- sites partenaires ;
- intégrations tierces.

---

# 33. SUPER ADMIN

Créer un dashboard Super Admin.

Afficher :

Nombre total de radios
Radios actives
Radios suspendues
Utilisateurs
Auditeurs
Flux actifs
Incidents
Revenus
Abonnements
Tickets support

Permettre :

- créer ;
- modifier ;
- suspendre ;
- supprimer ;
- rechercher ;
- filtrer.

---

# 34. MONITORING GLOBAL

Le Super Admin doit pouvoir voir :

Flux en ligne
Flux hors ligne
Latence
Erreurs
Serveurs
Incidents

Créer un système d'alertes.

---

# 35. AUDIT LOG

Enregistrer les actions importantes :

- connexion ;
- modification du profil ;
- modification du flux ;
- création d'émission ;
- suppression ;
- modification des permissions ;
- création de campagne ;
- paiement ;
- changement d'abonnement.

Afficher :

Utilisateur
Action
Date
IP lorsque légalement approprié
Ressource
Résultat

---

# 36. SUPPORT

Créer un système de tickets.

Catégories :

Technique
Facturation
Streaming
Compte
Publicité
Autre

Statuts :

OPEN
IN_PROGRESS
WAITING
RESOLVED
CLOSED

---

# 37. PERFORMANCE

La plateforme doit être rapide.

Optimiser :

- images ;
- requêtes SQL ;
- pagination ;
- cache ;
- lazy loading ;
- code splitting ;
- API ;
- requêtes realtime.

Ne pas charger inutilement toutes les données.

Utiliser pagination et filtres serveur.

---

# 38. SEO

Chaque radio doit disposer de métadonnées personnalisables :

title
description
keywords
Open Graph
Twitter Card
favicon
canonical URL

Créer des URLs propres :

/radio/radio-name
/radio/radio-name/programmes
/radio/radio-name/podcasts
/radio/radio-name/emissions

---

# 39. PARTAGE

Chaque émission et podcast doit pouvoir être partagé.

Prévoir :

WhatsApp
Facebook
X
Telegram
Copier le lien

Créer automatiquement les métadonnées Open Graph.

---

# 40. ARCHITECTURE FUTURE

Concevoir le système afin de pouvoir ajouter ultérieurement :

- application Android ;
- application iOS ;
- marketplace publicitaire ;
- CDN propriétaire ;
- transcription IA ;
- génération de clips ;
- traduction automatique ;
- recommandations personnalisées ;
- abonnement auditeur ;
- contenu premium ;
- statistiques avancées ;
- API publique ;
- white-label ;
- réseau publicitaire multi-radio.

---

# 41. ROADMAP DE DÉVELOPPEMENT

NE PAS essayer de construire toutes les fonctionnalités en même temps.

Phase 1 :

- architecture ;
- authentification ;
- multi-tenant ;
- Supabase ;
- dashboard ;
- création radio ;
- connexion flux ;
- lecteur ;
- page publique ;
- monitoring basique.

Phase 2 :

- programmes ;
- émissions ;
- podcasts ;
- messages ;
- dédicaces ;
- sondages ;
- analytics.

Phase 3 :

- abonnements ;
- facturation ;
- publicité ;
- annonceurs ;
- notifications.

Phase 4 :

- IA ;
- WhatsApp ;
- PWA avancée ;
- analytics avancés.

Phase 5 :

- marketplace ;
- mobile natif ;
- API ;
- white-label.

---

# 42. RÈGLE IMPORTANTE

Ne casse aucune fonctionnalité existante lorsque tu modifies une partie du système.

Avant toute modification :

1. analyser l'architecture ;
2. analyser la base de données ;
3. analyser les dépendances ;
4. identifier les impacts ;
5. modifier ;
6. tester ;
7. vérifier les régressions.

---

# 43. TESTS

Créer :

- tests unitaires ;
- tests d'intégration ;
- tests API ;
- tests authentification ;
- tests RLS ;
- tests multi-tenant ;
- tests streaming ;
- tests responsive ;
- tests de permissions ;
- tests de facturation.

Tester impérativement qu'une radio A ne peut jamais accéder aux données de la radio B.

---

# 44. DONNÉES DE DÉMONSTRATION

Créer un environnement de démonstration avec :

3 radios fictives
10 utilisateurs
20 émissions
30 podcasts
100 messages
50 dédicaces
5 sondages
3 annonceurs
5 campagnes

Utiliser uniquement des données fictives.

---

# 45. EXPÉRIENCE UTILISATEUR

Le système doit être compréhensible par une personne qui n'est pas développeur.

Un responsable radio doit pouvoir :

Créer sa radio
Connecter son flux
Publier son programme
Voir ses auditeurs
Publier un podcast
Lire ses messages
Créer une campagne

sans avoir besoin de connaissances techniques.

---

# 46. PRINCIPES DE DÉVELOPPEMENT

Priorité absolue :

1. Sécurité.
2. Fiabilité.
3. Simplicité.
4. Performance.
5. Scalabilité.
6. UX.
7. Esthétique.

Ne jamais créer une fonctionnalité uniquement pour faire joli.

Chaque écran doit répondre à un besoin métier réel.

---

# 47. LIVRABLE ATTENDU

Construire une application fonctionnelle.

Ne pas fournir uniquement des maquettes.

Créer réellement :

- frontend ;
- backend ;
- base PostgreSQL ;
- authentification ;
- RLS ;
- API ;
- dashboard ;
- pages publiques ;
- composants ;
- migrations ;
- seed ;
- validations ;
- gestion des erreurs ;
- tests ;
- documentation.

Le code doit être propre, modulaire et maintenable.

---

# 48. CONFIGURATION ENVIRONNEMENT

Prévoir un fichier :

.env.example

avec notamment :

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=

Ne jamais placer les secrets directement dans le code.

---

# 49. APPROCHE DE TRAVAIL

Commence par analyser le projet existant.

Ne détruis rien.

Identifie :

- architecture ;
- framework ;
- composants ;
- routes ;
- base de données ;
- authentification ;
- variables d'environnement ;
- dépendances.

Ensuite propose une architecture.

Puis implémente progressivement.

Après chaque grande fonctionnalité :

- vérifier TypeScript ;
- vérifier lint ;
- vérifier build ;
- tester les routes ;
- tester l'authentification ;
- tester les permissions ;
- tester la base de données.

Corriger les erreurs avant de passer à la fonctionnalité suivante.

---

# 50. CRITÈRE FINAL

À la fin, RadioOS doit donner l'impression d'un véritable produit SaaS commercial prêt à être présenté à une radio.

Une radio doit pouvoir arriver sur la plateforme et comprendre immédiatement :

"Je peux connecter ma radio, suivre mon audience, publier mes émissions, gérer mes podcasts, communiquer avec mes auditeurs et développer mes revenus."

Ne transforme pas RadioOS en simple CMS.

Construis une infrastructure numérique complète destinée aux radios.

Commence par le MVP, mais construis l'architecture de manière à pouvoir évoluer vers plusieurs milliers de radios et des centaines de milliers d'auditeurs.

Avant de coder, présente brièvement :

1. l'architecture technique proposée ;
2. le schéma de base de données ;
3. l'arborescence du projet ;
4. les modules ;
5. les dépendances principales ;
6. le plan d'implémentation.

Puis commence immédiatement l'implémentation du MVP.