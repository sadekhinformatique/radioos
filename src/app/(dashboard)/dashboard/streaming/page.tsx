import {
  Radio,
  Wifi,
  WifiOff,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

export default function StreamingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Streaming
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitoring et gestion de votre flux audio
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Vérifier le flux
        </Button>
      </div>

      {/* Status Banner */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Flux principal connecté
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Dernière vérification : il y a 2 minutes • Latence : 45ms
              </p>
            </div>
            <Badge variant="online" className="ml-auto">
              CONNECTÉ
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stream Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Statut"
          value="En ligne"
          icon={<Wifi className="h-5 w-5" />}
          description="Flux principal"
        />
        <StatCard
          title="Latence"
          value="45 ms"
          icon={<Activity className="h-5 w-5" />}
          description="Temps de réponse"
        />
        <StatCard
          title="Uptime"
          value="99.8%"
          icon={<Clock className="h-5 w-5" />}
          description="30 derniers jours"
        />
        <StatCard
          title="Incidents"
          value="2"
          icon={<AlertTriangle className="h-5 w-5" />}
          description="Ce mois-ci"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Primary Stream */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-blue-600" />
              Flux principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    URL
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-mono truncate">
                    https://stream.radioos.com/live
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Type
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Icecast
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Codec
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    MP3
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Bitrate
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    128 kbps
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Disponible et fonctionnel
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup Stream */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-orange-600" />
              Flux secondaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    URL
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-mono truncate">
                    https://backup.radioos.com/live
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Type
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Icecast
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Codec
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    MP3
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Bitrate
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    64 kbps
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  En attente de configuration
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incident History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Historique des incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                date: "15 Août 2026, 14:32",
                duration: "12 minutes",
                type: "Interruption du flux",
                status: "resolved",
              },
              {
                date: "8 Août 2026, 09:15",
                duration: "3 minutes",
                type: "Latence élevée",
                status: "resolved",
              },
            ].map((incident, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {incident.type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {incident.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{incident.duration}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
