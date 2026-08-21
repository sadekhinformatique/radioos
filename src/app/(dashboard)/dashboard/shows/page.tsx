import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Mic,
  Plus,
  Search,
  Calendar,
  Clock,
  Users,
  Radio,
  Play,
  Pause,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

const shows = [
  {
    id: "1",
    name: "Réveil Matinal",
    host: "Amadou Diallo",
    description: "Start your day with the best music and news",
    status: "live" as const,
    listeners: 1847,
    schedule: "Lun-Ven, 06:00 - 09:00",
    category: "Matinale",
    episodes: 245,
    lastAired: "2025-08-21",
  },
  {
    id: "2",
    name: "Les Info du Jour",
    host: "Fatima Sy",
    description: "Complete news coverage with analysis and interviews",
    status: "scheduled" as const,
    listeners: 0,
    schedule: "Lun-Ven, 09:00 - 10:00",
    category: "Info",
    episodes: 312,
    lastAired: "2025-08-20",
  },
  {
    id: "3",
    name: "Musique Africaine",
    host: "Ibrahim Cissé",
    description: "The best Afrobeats, Mbalax, and Mandé music",
    status: "scheduled" as const,
    listeners: 0,
    schedule: "Lun-Sam, 10:00 - 13:00",
    category: "Musique",
    episodes: 198,
    lastAired: "2025-08-19",
  },
  {
    id: "4",
    name: "Espace Culture",
    host: "Aïssatou Ndiaye",
    description: "Art, literature, cinema and cultural events",
    status: "completed" as const,
    listeners: 0,
    schedule: "Mar & Jeu, 14:00 - 16:00",
    category: "Culture",
    episodes: 87,
    lastAired: "2025-08-19",
  },
  {
    id: "5",
    name: "Sport Total",
    host: "Moussa Sow",
    description: "Football, basketball, and all sports news",
    status: "scheduled" as const,
    listeners: 0,
    schedule: "Lun-Ven, 17:00 - 19:00",
    category: "Sport",
    episodes: 156,
    lastAired: "2025-08-20",
  },
  {
    id: "6",
    name: "Nuit Louma",
    host: "DJ Afro",
    description: "Mix exclusif pour la nuit",
    status: "scheduled" as const,
    listeners: 0,
    schedule: "Ven-Sam, 21:00 - 00:00",
    category: "Musique",
    episodes: 52,
    lastAired: "2025-08-16",
  },
  {
    id: "7",
    name: "Talk Show Politique",
    host: "Fatima Sy",
    description: "Debates and interviews on current affairs",
    status: "completed" as const,
    listeners: 0,
    schedule: "Mer, 18:00 - 20:00",
    category: "Talk",
    episodes: 45,
    lastAired: "2025-08-17",
  },
  {
    id: "8",
    name: "Gospel & Louanges",
    host: "Pasteur Oumar",
    description: "Moments of worship and spiritual enrichment",
    status: "scheduled" as const,
    listeners: 0,
    schedule: "Mer, 08:00 - 10:00",
    category: "Religieux",
    episodes: 98,
    lastAired: "2025-08-17",
  },
];

const statusConfig = {
  live: { label: "En direct", color: "bg-red-500", icon: Radio },
  scheduled: { label: "Programmé", color: "bg-blue-500", icon: Clock },
  completed: { label: "Terminé", color: "bg-gray-500", icon: Calendar },
};

export default function ShowsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Émissions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gérez vos émissions et animateurs
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle émission
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {shows.length}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">
                {shows.filter((s) => s.status === "live").length}
              </div>
              <div className="text-sm text-gray-500">En direct</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {shows.filter((s) => s.status === "scheduled").length}
              </div>
              <div className="text-sm text-gray-500">Programmées</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {shows.reduce((acc, s) => acc + s.episodes, 0)}
              </div>
              <div className="text-sm text-gray-500">Épisodes</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher une émission..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Shows Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shows.map((show) => {
          const statusInfo = statusConfig[show.status];
          const StatusIcon = statusInfo.icon;

          return (
            <Card
              key={show.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{show.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{show.host}</p>
                  </div>
                  <Badge
                    variant={show.status === "live" ? "default" : "secondary"}
                    className={
                      show.status === "live"
                        ? "bg-red-500 hover:bg-red-600"
                        : ""
                    }
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {show.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {show.schedule}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mic className="w-4 h-4" />
                    {show.episodes} épisodes
                  </div>

                  {show.status === "live" && (
                    <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
                      <Users className="w-4 h-4" />
                      {show.listeners.toLocaleString()} auditeurs
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Badge variant="outline">{show.category}</Badge>
                  <div className="flex items-center gap-1">
                    {show.status === "live" && (
                      <Button variant="ghost" size="sm">
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
