import {
  Radio,
  Users,
  Headphones,
  Globe,
  Clock,
  TrendingUp,
  Podcast,
  MessageSquare,
  Heart,
  Megaphone,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vue d&apos;ensemble de votre radio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="online" className="gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            En ligne
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Auditeurs actuels"
          value="1 284"
          change={18.4}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Pic du jour"
          value="2 436"
          change={31.7}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Durée moyenne"
          value="34 min"
          change={-5.2}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          title="Pays"
          value="12"
          change={8.3}
          icon={<Globe className="h-5 w-5" />}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current Program */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-blue-600" />
              Programme actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Le Matin Info
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    06:00 - 09:00 • DJ Amadou
                  </p>
                </div>
                <Badge variant="online">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  LIVE
                </Badge>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{ width: "65%" }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>06:00</span>
                <span>07:57</span>
                <span>09:00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Show */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Prochaine émission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Sport Total
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  09:00 - 11:00
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Animé par <span className="font-medium">Moussa Diallo</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Commence dans 1h 03min
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                Messages récents
              </span>
              <Badge variant="secondary">24</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  name: "Fatou Sow",
                  message: "Super émission ce matin !",
                  time: "il y a 5 min",
                },
                {
                  name: "Mamadou Diop",
                  message: "Pouvez-vous passer le morceau de Baaba Maal ?",
                  time: "il y a 12 min",
                },
                {
                  name: "Aïssatou Ba",
                  message: "Bonne journée à toute l'équipe !",
                  time: "il y a 18 min",
                },
              ].map((msg, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {msg.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {msg.name}
                      </span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-purple-600" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: <Podcast className="h-5 w-5" />,
                  label: "Nouveau podcast",
                  href: "/dashboard/podcasts/new",
                  color: "bg-orange-50 text-orange-600",
                },
                {
                  icon: <Heart className="h-5 w-5" />,
                  label: "Voir dédicaces",
                  href: "/dashboard/dedications",
                  color: "bg-pink-50 text-pink-600",
                },
                {
                  icon: <Radio className="h-5 w-5" />,
                  label: "Vérifier flux",
                  href: "/dashboard/streaming",
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  icon: <Users className="h-5 w-5" />,
                  label: "Audience",
                  href: "/dashboard/analytics",
                  color: "bg-green-50 text-green-600",
                },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 text-center transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900"
                >
                  <div className={`rounded-lg p-2 ${action.color}`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {action.label}
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audience Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Audience aujourd&apos;hui
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Graphique d&apos;audience
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Intégration Recharts à venir
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
