"use client";

import { useState } from "react";
import { useMyRadio, usePodcasts, createRecord, deleteRecord } from "@/hooks/use-radio-data";
import {
  Podcast,
  Play,
  Pause,
  Download,
  Share2,
  Plus,
  Search,
  Clock,
  Headphones,
  Calendar,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PodcastsPage() {
  const { radio } = useMyRadio();
  const { data: podcasts, refetch } = usePodcasts(radio?.id || null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filtered = podcasts?.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    return true;
  }) || [];

  const categories = [...new Set(podcasts?.map((p) => p.category).filter(Boolean) || [])];
  const totalPlays = podcasts?.reduce((sum, p) => sum + (p.play_count || 0), 0) || 0;
  const totalDownloads = podcasts?.reduce((sum, p) => sum + (p.download_count || 0), 0) || 0;

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce podcast ?")) return;
    await deleteRecord("podcasts", id);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Podcasts</h1>
          <p className="text-gray-500 mt-1">Gérez vos podcasts et épisodes</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{podcasts?.length || 0}</div>
          <div className="text-sm text-gray-500">Podcasts</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{totalPlays}</div>
          <div className="text-sm text-gray-500">Écoutes</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{totalDownloads}</div>
          <div className="text-sm text-gray-500">Téléchargements</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Podcasts Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((podcast) => (
            <div key={podcast.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Podcast className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{podcast.title}</h3>
                  <p className="text-sm text-gray-500 truncate mt-0.5">{podcast.description || "Pas de description"}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(podcast.duration_seconds)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Headphones className="w-3 h-3" />
                      {podcast.play_count || 0} écoutes
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(podcast.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPlayingId(playingId === podcast.id ? null : podcast.id)}
                    className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                  >
                    {playingId === podcast.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(podcast.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <Podcast className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium text-gray-600">Aucun podcast</p>
          <p className="text-sm mt-1">Ajoutez votre premier podcast pour commencer</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajouter un podcast</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL audio</label>
                <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Annuler</button>
              <button onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium">Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
