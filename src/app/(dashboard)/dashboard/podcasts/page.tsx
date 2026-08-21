import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Plus,
  Search,
  Play,
  Pause,
  Download,
  Share2,
  Clock,
  Calendar,
  Tag,
  Mic,
  Brain,
  FileText,
  Eye,
  Edit,
  Trash2,
  BarChart,
  Filter,
  Headphones,
} from "lucide-react";

const podcasts = [
  {
    id: "1",
    title: "Interview du Président de la République",
    description:
      "Entretien exclusif sur les projets de développement du pays pour les 5 prochaines années.",
    show: "Les Info du Jour",
    host: "Fatima Sy",
    duration: "45:32",
    status: "published" as const,
    category: "Interview",
    publishedAt: "2025-08-20",
    downloads: 12450,
    listens: 34200,
    hasTranscript: true,
    tags: ["politique", "interview", "exclusif"],
  },
  {
    id: "2",
    title: "Top 10 Afrobeats de la Semaine",
    description: "Découvrez les meilleurs titres Afrobeats de cette semaine.",
    show: "Musique Africaine",
    host: "Ibrahim Cissé",
    duration: "1:15:00",
    status: "published" as const,
    category: "Musique",
    publishedAt: "2025-08-19",
    downloads: 8920,
    listens: 28700,
    hasTranscript: false,
    tags: ["afrobeats", "musique", "top10"],
  },
  {
    id: "3",
    title: "Débat: L'Avenir de l'Éducation au Sénégal",
    description:
      "Table ronde avec des experts sur les défis et opportunités de l'éducation.",
    show: "Espace Culture",
    host: "Aïssatou Ndiaye",
    duration: "58:15",
    status: "draft" as const,
    category: "Culture",
    publishedAt: null,
    downloads: 0,
    listens: 0,
    hasTranscript: false,
    tags: ["éducation", "débat", "sénégal"],
  },
  {
    id: "4",
    title: "Analyse Tactical: Finale de la Ligue des Champions",
    description:
      "Décryptage tactique de la grande finale avec nos experts sportifs.",
    show: "Sport Total",
    host: "Moussa Sow",
    duration: "32:48",
    status: "published" as const,
    category: "Sport",
    publishedAt: "2025-08-18",
    downloads: 15680,
    listens: 42100,
    hasTranscript: true,
    tags: ["football", "ligue des champions", "analyse"],
  },
  {
    id: "5",
    title: "Gospel Session Acoustique",
    description:
      "Session acoustique spéciale avec les meilleurs artistes gospel locaux.",
    show: "Gospel & Louanges",
    host: "Pasteur Oumar",
    duration: "1:02:30",
    status: "published" as const,
    category: "Musique",
    publishedAt: "2025-08-17",
    downloads: 5420,
    listens: 18900,
    hasTranscript: false,
    tags: ["gospel", "acoustique", "live"],
  },
  {
    id: "6",
    title: "Podcast Spécial: Indépendance du Sénégal",
    description:
      "Retour historique sur l'indépendance et les grands moments de l'histoire du Sénégal.",
    show: "Espace Culture",
    host: "Aïssatou Ndiaye",
    duration: "1:22:15",
    status: "archived" as const,
    category: "Histoire",
    publishedAt: "2025-04-04",
    downloads: 28900,
    listens: 67400,
    hasTranscript: true,
    tags: ["histoire", "sénégal", "indépendance"],
  },
];

const categories = [
  "Tous",
  "Interview",
  "Musique",
  "Culture",
  "Sport",
  "Histoire",
  "Religieux",
  "Politique",
];

const statusConfig = {
  published: { label: "Publié", variant: "default" as const },
  draft: { label: "Brouillon", variant: "secondary" as const },
  archived: { label: "Archivé", variant: "outline" as const },
};

export default function PodcastsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Podcasts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gérez et publiez vos podcasts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau podcast
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Mic className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {podcasts.length}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Headphones className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(podcasts.reduce((a, p) => a + p.listens, 0) / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-gray-500">Écoutes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(podcasts.reduce((a, p) => a + p.downloads, 0) / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-gray-500">Téléchargements</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Brain className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {podcasts.filter((p) => p.hasTranscript).length}
                </div>
                <div className="text-sm text-gray-500">Transcrits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un podcast..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={cat === "Tous" ? "default" : "outline"}
                  size="sm"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Podcasts List */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {podcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Thumbnail placeholder */}
                <div className="w-full md:w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mic className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {podcast.title}
                        </h3>
                        <Badge variant={statusConfig[podcast.status].variant}>
                          {statusConfig[podcast.status].label}
                        </Badge>
                        {podcast.hasTranscript && (
                          <Badge variant="outline" className="text-green-600">
                            <FileText className="w-3 h-3 mr-1" />
                            Transcrit
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {podcast.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mic className="w-3 h-3" />
                          {podcast.show}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {podcast.duration}
                        </span>
                        {podcast.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {podcast.publishedAt}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <BarChart className="w-3 h-3" />
                          {podcast.listens.toLocaleString()} écoutes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {podcast.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:flex-shrink-0">
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                  {!podcast.hasTranscript && podcast.status === "published" && (
                    <Button variant="outline" size="sm" className="text-orange-600">
                      <Brain className="w-4 h-4 mr-1" />
                      Transcrire
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
