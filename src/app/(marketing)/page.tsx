import {
  Radio,
  BarChart3,
  Podcast,
  MessageSquare,
  Megaphone,
  Shield,
  Zap,
  Globe,
  Play,
  Users,
  Clock,
  Smartphone,
  Check,
  ArrowRight,
  Star,
  Wifi,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              🎙️ La plateforme n°1 pour les radios africaines
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Le système d&apos;exploitation
              <br />
              <span className="text-blue-200">numérique des radios.</span>
            </h1>
            <p className="mt-6 text-lg text-blue-100 sm:text-xl">
              Streaming, audience, podcasts, interaction et monétisation réunis
              dans une seule plateforme.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl shadow-black/20">
                  Créer ma radio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Play className="mr-2 h-5 w-5" />
                Voir la plateforme
              </Button>
            </div>
          </div>
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-4xl rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="rounded-xl bg-gray-900 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-xs text-gray-500">dashboard.radioos.com</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Auditeurs", value: "1,284", icon: Users },
                    { label: "En ligne", value: "1,284", icon: Wifi },
                    { label: "Émissions", value: "12", icon: Radio },
                    { label: "Podcasts", value: "48", icon: Podcast },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-gray-800 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-gray-400">{stat.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Les radios méritent mieux qu&apos;un simple lecteur
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Aujourd&apos;hui, les radios font face à des défis majeurs : gérer
              leur streaming, suivre leur audience, publier leurs podcasts et
              interagir avec leurs auditeurs, tout en développant leurs revenus.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Radio className="h-6 w-6" />,
                title: "Flux dispersés",
                description:
                  "Gérer Icecast, Shoutcast et AzuraCast séparément, sans vision globale.",
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Pas de visibilité",
                description:
                  "Impossible de savoir combien d'auditeurs écoutent et d'où ils viennent.",
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "Interaction limitée",
                description:
                  "Pas de moyen simple de recevoir des messages, dédicaces et sondages.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-gray-50 px-4 py-24 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              RadioOS : votre quartier général numérique
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Une seule plateforme pour tout gérer. Connectez votre flux existant
              et commencez à suivre votre audience en quelques minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Tout ce dont votre radio a besoin
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Des fonctionnalités puissantes conçues pour les radios modernes.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Radio className="h-6 w-6" />,
                title: "Streaming",
                description:
                  "Connectez votre flux Icecast, Shoutcast ou HLS. Monitoring en temps réel.",
                color: "blue",
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Audience",
                description:
                  "Suivez vos auditeurs en temps réel. Pays, appareils, durée d'écoute.",
                color: "green",
              },
              {
                icon: <Podcast className="h-6 w-6" />,
                title: "Podcasts",
                description:
                  "Publiez et gérez vos podcasts. Transcription IA et résumés automatiques.",
                color: "purple",
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "Interaction",
                description:
                  "Messages, dédicaces, sondages. Interagissez avec vos auditeurs.",
                color: "pink",
              },
              {
                icon: <Megaphone className="h-6 w-6" />,
                title: "Publicité",
                description:
                  "Gérez vos campagnes publicitaires et maximisez vos revenus.",
                color: "orange",
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Page publique",
                description:
                  "Une page professionnelle pour votre radio. Responsive et rapide.",
                color: "teal",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-gray-200 p-6 transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:hover:border-gray-700"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${feature.color}-50 text-${feature.color}-600 dark:bg-${feature.color}-950 dark:text-${feature.color}-400`}
                >
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="bg-gray-50 px-4 py-24 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
                Dashboard temps réel
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Visualisez vos performances en temps réel. Auditeurs, durée
                d&apos;écoute, popularité des émissions — tout est disponible
                instantanément.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Auditeurs simultanés en temps réel",
                  "Statistiques par pays et ville",
                  "Durée moyenne d'écoute",
                  "Émissions les plus populaires",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Auditeurs
                    </p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      1,284
                    </p>
                    <p className="text-xs text-green-600">+18.4%</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Durée moy.
                    </p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                      34 min
                    </p>
                    <p className="text-xs text-green-600">+31.7%</p>
                  </div>
                  <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-950">
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Émissions
                    </p>
                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                      12
                    </p>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-4 dark:bg-orange-950">
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Podcasts
                    </p>
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                      48
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Streaming Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl bg-gray-900 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75" />
                  </div>
                  <span className="text-sm font-medium text-green-400">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600">
                    <Radio className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      Radio OSFM
                    </p>
                    <p className="text-sm text-gray-400">128 kbps • MP3</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>1,284 auditeurs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Globe className="h-4 w-4" />
                    <span>12 pays</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
                Connectez votre flux existant
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Ne changez rien à votre infrastructure. RadioOS se connecte à
                Icecast, Shoutcast, AzuraCast et tout flux HTTP/HLS.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Monitoring automatique du flux",
                  "Alertes en cas de panne",
                  "Backup automatique",
                  "Qualité adaptative (128/64/32 kbps)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="bg-gray-50 px-4 py-24 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Analytics avancés
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Comprenez votre audience comme jamais auparavant.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              {
                icon: <Users className="h-6 w-6" />,
                title: "Auditeurs",
                value: "1,284",
                change: "+18.4%",
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Durée moy.",
                value: "34 min",
                change: "+5.2%",
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Pays",
                value: "12",
                change: "+2",
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Pic du jour",
                value: "2,436",
                change: "+31.7%",
              },
            ].map((stat) => (
              <div
                key={stat.title}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  {stat.icon}
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Podcasts Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
                CMS Podcast intégré
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Publiez vos podcasts en quelques clics. L&apos;IA génère
                automatiquement le titre, la description et les chapitres.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Transcription automatique par IA",
                  "Titre et description suggérés",
                  "Chapitres générés automatiquement",
                  "Distribution multi-plateformes",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                      <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gray-900 p-6 shadow-2xl">
              <div className="space-y-4">
                {[
                  {
                    title: "Le Matin Info - Épisode 142",
                    duration: "45:32",
                    date: "Aujourd'hui",
                  },
                  {
                    title: "Sport Total - Épisode 89",
                    duration: "1:12:45",
                    date: "Hier",
                  },
                  {
                    title: "Culture & Art - Épisode 56",
                    duration: "38:21",
                    date: "Il y a 2 jours",
                  },
                ].map((podcast, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl bg-gray-800 p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{podcast.title}</p>
                      <p className="text-sm text-gray-400">
                        {podcast.duration} • {podcast.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interaction Section */}
      <section className="bg-gray-50 px-4 py-24 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Interaction en temps réel
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Messages, dédicaces, sondages — connectez-vous à vos auditeurs
              comme jamais.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <MessageSquare className="h-10 w-10 text-blue-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Messages
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Recevez les messages de vos auditeurs en temps réel.
                  Répondez directement depuis le dashboard.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Star className="h-10 w-10 text-pink-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Dédicaces
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Les auditeurs envoient des dédicaces. Validez et diffusez
                  directement en ondes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <BarChart3 className="h-10 w-10 text-green-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Sondages
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Créez des sondages et visualisez les résultats en temps réel.
                  Engagez votre audience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advertising Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
                Monétisez votre radio
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Gérez vos campagnes publicitaires et suivez vos revenus en un
                clic.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Créez des campagnes en quelques clics",
                  "Suivez les impressions et la portée",
                  "Gérez les annonceurs et les budgets",
                  "Rapports détaillés et exportables",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                      <Check className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gray-900 p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="rounded-xl bg-gray-800 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">
                        Campagne Mobile Money
                      </p>
                      <p className="text-sm text-gray-400">
                        Orange Money • 15-30 Août
                      </p>
                    </div>
                    <Badge variant="success">ACTIVE</Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
                    <span>12,450 impressions</span>
                    <span>3,200 portée</span>
                    <span>850,000 FCFA</span>
                  </div>
                </div>
                <div className="rounded-xl bg-gray-800 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">
                        Campagne Telecom
                      </p>
                      <p className="text-sm text-gray-400">
                        Free • 1-15 Septembre
                      </p>
                    </div>
                    <Badge variant="pending">EN ATTENTE</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 px-4 py-24 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Tarifs adaptés à votre radio
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Commencez gratuitement, évoluez à votre rythme.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "0",
                currency: "FCFA",
                period: "/mois",
                description: "Pour les radios qui démarrent",
                features: [
                  "1 radio",
                  "Streaming basique",
                  "100 auditeurs max",
                  "Podcasts (5/mois)",
                  "Messages",
                  "Page publique",
                ],
                cta: "Commencer gratuitement",
                popular: false,
              },
              {
                name: "Professionnel",
                price: "25 000",
                currency: "FCFA",
                period: "/mois",
                description: "Pour les radios établies",
                features: [
                  "1 radio",
                  "Tous les types de flux",
                  "1 000 auditeurs",
                  "Podcasts illimités",
                  "Analytics avancés",
                  "Publicités",
                  "Dédicaces & Sondages",
                  "Support prioritaire",
                ],
                cta: "Passer au Professionnel",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "75 000",
                currency: "FCFA",
                period: "/mois",
                description: "Pour les groupes de radios",
                features: [
                  "Multi-radios",
                  "Auditeurs illimités",
                  "API complète",
                  "White-label",
                  "Support dédié",
                  "SLA garanti",
                  "Analytics premium",
                  "Intégrations custom",
                ],
                cta: "Contacter l'équipe",
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-blue-600 bg-white shadow-xl dark:bg-gray-800"
                    : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {plan.currency}
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-8 block">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Questions fréquentes
          </h2>
          <div className="mt-12 space-y-6">
            {[
              {
                q: "Faut-il changer mon infrastructure de streaming ?",
                a: "Non ! RadioOS se connecte à votre flux existant (Icecast, Shoutcast, AzuraCast, HLS). Vous gardez votre infrastructure actuelle.",
              },
              {
                q: "Combien d'auditeurs puis-je avoir ?",
                a: "Le plan Starter supporte jusqu'à 100 auditeurs simultanés. Le plan Professionnel supporte 1,000 auditeurs. Le plan Enterprise est illimité.",
              },
              {
                q: "Puis-je payer en FCFA ?",
                a: "Oui ! Nous supportons le paiement en FCFA via Mobile Money (Orange Money, Wave, MTN) et les cartes bancaires.",
              },
              {
                q: "Y a-t-il un engagement ?",
                a: "Non, vous pouvez annuler votre abonnement à tout moment. Le plan Starter est gratuit et sans engagement.",
              },
              {
                q: "Comment fonctionne l'IA pour les podcasts ?",
                a: "L'IA analyse votre fichier audio et génère automatiquement le titre, la description, les chapitres et les mots-clés. Vous pouvez tout modifier avant publication.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 p-6 dark:border-gray-800"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {faq.q}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Prêt à数字化 votre radio ?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Rejoignez des centaines de radios qui utilisent RadioOS pour
            développer leur audience et leurs revenus.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="xl"
                className="bg-white text-blue-700 hover:bg-blue-50"
              >
                Créer ma radio gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
