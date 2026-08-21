import { Metadata } from "next";
import {
  Radio,
  Users,
  Globe,
  Clock,
  Play,
  Pause,
  MessageSquare,
  Share2,
  Headphones,
  Podcast,
  Calendar,
  Heart,
  Volume2,
  VolumeX,
  Download,
  ExternalLink,
  Smartphone,
  Copy,
  Check,
  Send,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButtons } from "./share-buttons";
import { WhatsAppButton } from "./whatsapp-button";
import { AudioPlayer } from "./audio-player";

async function getRadio(slug: string) {
  return {
    name: "Radio OSFM",
    slug: "radio-osfm",
    description:
      "La radio qui vous connecte au monde. Musique, info, culture et divertissement.",
    logo_url: null,
    cover_url: null,
    country: "Sénégal",
    city: "Dakar",
    is_live: true,
    listeners_count: 1284,
    stream_url: "http://stream.radioos.sn:8000/live",
    whatsapp_number: "+221771234567",
    website: "https://radioos.sn",
    social: {
      facebook: "https://facebook.com/radioosfm",
      twitter: "https://x.com/radioosfm",
      instagram: "https://instagram.com/radioosfm",
      youtube: "",
    },
    current_show: {
      title: "Le Matin Info",
      host: "DJ Amadou",
      start_time: "06:00",
      end_time: "09:00",
    },
    next_show: {
      title: "Sport Total",
      host: "Moussa Diallo",
      start_time: "09:00",
      end_time: "11:00",
    },
    programs: [
      { title: "Le Matin Info", day: "Lundi", time: "06:00 - 09:00" },
      { title: "Sport Total", day: "Lundi", time: "09:00 - 11:00" },
      { title: "Musique du monde", day: "Lundi", time: "11:00 - 13:00" },
      { title: "Culture & Art", day: "Lundi", time: "14:00 - 16:00" },
    ],
    podcasts: [
      {
        title: "Le Matin Info - Épisode 142",
        duration: "45:32",
        date: "Aujourd'hui",
        downloads: 1240,
      },
      {
        title: "Sport Total - Épisode 89",
        duration: "1:12:45",
        date: "Hier",
        downloads: 890,
      },
      {
        title: "Culture & Art - Épisode 56",
        duration: "38:21",
        date: "Il y a 2 jours",
        downloads: 560,
      },
    ],
    hosts: [
      { name: "DJ Amadou", role: "Animateur matin", bio: "Passionné de musique africaine depuis 15 ans." },
      { name: "Moussa Diallo", role: "Animateur sport", bio: "Journaliste sportif spécialisé football." },
      { name: "Fatou Sow", role: "Animateur culture", bio: "Artiste et critique culturelle." },
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const radio = await getRadio(slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://radioos.sn";

  return {
    title: `${radio.name} - Écoutez en direct sur RadioOS`,
    description: radio.description,
    keywords: [
      radio.name,
      "radio en ligne",
      "radio africaine",
      "écoute en direct",
      "streaming audio",
      radio.city,
      radio.country,
    ],
    authors: [{ name: radio.name }],
    openGraph: {
      title: `${radio.name} - En direct`,
      description: radio.description,
      type: "website",
      url: `${baseUrl}/radio/${slug}`,
      siteName: "RadioOS",
      locale: "fr_SN",
      images: [
        {
          url: `${baseUrl}/api/og?radio=${slug}`,
          width: 1200,
          height: 630,
          alt: `${radio.name} - Radio en ligne`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${radio.name} - En direct`,
      description: radio.description,
      images: [`${baseUrl}/api/og?radio=${slug}`],
    },
    manifest: "/manifest.json",
    themeColor: "#2563EB",
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: radio.name,
    },
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "application-name": radio.name,
      "msapplication-TileColor": "#2563EB",
    },
  };
}

export default async function PublicRadioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const radio = await getRadio(slug);
  const pageUrl = `https://radioos.sn/radio/${slug}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* PWA Install Banner */}
      <div id="pwa-banner" className="bg-blue-600 text-white text-center py-2 px-4 text-sm hidden">
        <div className="flex items-center justify-center gap-3">
          <Smartphone className="w-4 h-4" />
          <span>Installez {radio.name} sur votre téléphone</span>
          <button
            id="pwa-install-btn"
            className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-50"
          >
            Installer
          </button>
          <button
            id="pwa-dismiss-btn"
            className="text-white/70 hover:text-white ml-2"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-4xl">
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur-sm shadow-xl">
              {radio.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{radio.name}</h1>
                {radio.is_live && (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-medium shadow-lg shadow-red-500/30">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                    EN DIRECT
                  </span>
                )}
              </div>
              <p className="mt-2 text-blue-100">{radio.description}</p>
              <div className="mt-3 flex items-center gap-4 text-sm text-blue-200 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {radio.city}, {radio.country}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {radio.listeners_count.toLocaleString("fr-FR")} auditeurs
                </span>
              </div>
              {/* Social Links */}
              <div className="mt-4 flex items-center gap-2">
                {radio.social.facebook && (
                  <a
                    href={radio.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white/10 p-2 hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {radio.social.twitter && (
                  <a
                    href={radio.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white/10 p-2 hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {radio.social.instagram && (
                  <a
                    href={radio.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white/10 p-2 hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </a>
                )}
                <a
                  href={`https://api.whatsapp.com/send?phone=${radio.whatsapp_number?.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(`Bonjour! J'écoute ${radio.name} en direct.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-green-500 p-2 hover:bg-green-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player */}
      <div className="mx-auto max-w-4xl px-4 -mt-6 sm:px-6 lg:px-8 relative z-10">
        <AudioPlayer
          streamUrl={radio.stream_url}
          radioName={radio.name}
          currentShow={radio.current_show.title}
          currentHost={radio.current_show.host}
          isLive={radio.is_live}
          listenersCount={radio.listeners_count}
        />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Current Show */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-blue-600" />
                  Émission en cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {radio.current_show.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {radio.current_show.start_time} - {radio.current_show.end_time} •{" "}
                      {radio.current_show.host}
                    </p>
                  </div>
                  <Badge variant="online">EN DIRECT</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Podcasts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Podcast className="h-5 w-5 text-purple-600" />
                  Derniers podcasts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {radio.podcasts.map((podcast, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                        <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {podcast.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {podcast.duration} • {podcast.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {podcast.downloads}
                        </span>
                        <ShareButtons
                          title={podcast.title}
                          url={`${pageUrl}?podcast=${i}`}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Show */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Prochaine émission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {radio.next_show.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {radio.next_show.start_time} - {radio.next_show.end_time}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Animé par <span className="font-medium">{radio.next_show.host}</span>
                </p>
              </CardContent>
            </Card>

            {/* Program */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Programme du jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {radio.programs.map((program, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between text-sm p-2 rounded-lg ${
                        i === 0 ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {program.title}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {program.time}
                        </p>
                      </div>
                      {i === 0 && <Badge variant="online" className="text-xs">EN COURS</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hosts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-pink-600" />
                  Animateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {radio.hosts.map((host, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-medium text-white">
                        {host.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {host.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {host.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Partager cette radio
                </h4>
                <ShareButtons
                  title={`Écoutez ${radio.name} en direct!`}
                  url={pageUrl}
                  size="md"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      {radio.whatsapp_number && (
        <WhatsAppButton
          phoneNumber={radio.whatsapp_number}
          radioName={radio.name}
        />
      )}
    </div>
  );
}
