"use client";

import { useState } from "react";
import { useMyRadio, useStreams, updateRecord, createRecord, deleteRecord } from "@/hooks/use-radio-data";
import { useRealtimeListeners } from "@/hooks/use-realtime-listeners";
import {
  Radio,
  Wifi,
  WifiOff,
  Headphones,
  Activity,
  Clock,
  Globe,
  Plus,
  Trash2,
  Settings,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StreamingPage() {
  const { radio } = useMyRadio();
  const { data: streams, refetch } = useStreams(radio?.id || null);
  const { count: liveListeners, isConnected } = useRealtimeListeners(radio?.id || null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStream, setNewStream] = useState({ stream_url: "", stream_type: "icecast", bitrate: 128, codec: "mp3" });

  const mainStream = streams?.find((s) => !s.is_backup);
  const backupStream = streams?.find((s) => s.is_backup);

  const handleAddStream = async () => {
    if (!radio || !newStream.stream_url) return;
    try {
      await createRecord("streams", {
        radio_id: radio.id,
        ...newStream,
        status: "offline",
        is_backup: false,
      });
      setNewStream({ stream_url: "", stream_type: "icecast", bitrate: 128, codec: "mp3" });
      setShowAddForm(false);
      refetch();
    } catch (err) {
      console.error("Error adding stream:", err);
    }
  };

  const handleDeleteStream = async (id: string) => {
    if (!confirm("Supprimer ce flux ?")) return;
    try {
      await deleteRecord("streams", id);
      refetch();
    } catch (err) {
      console.error("Error deleting stream:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Streaming</h1>
          <p className="text-gray-500 mt-1">Gérez vos flux audio en temps réel</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un flux
        </button>
      </div>

      {/* Live Status */}
      <div className={`rounded-xl p-6 ${mainStream?.status === "online" ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${mainStream?.status === "online" ? "bg-emerald-100" : "bg-red-100"}`}>
              {mainStream?.status === "online" ? (
                <Radio className="w-8 h-8 text-emerald-600" />
              ) : (
                <WifiOff className="w-8 h-8 text-red-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {mainStream?.status === "online" ? "🟢 En ligne" : "🔴 Hors ligne"}
                </h2>
                {mainStream?.status === "online" && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    <Zap className="w-3 h-3 mr-1" />
                    LIVE
                  </Badge>
                )}
              </div>
              <p className="text-gray-500 mt-1">
                {mainStream ? `${mainStream.stream_url}` : "Aucun flux configuré"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{liveListeners}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Headphones className="w-4 h-4" />
              auditeurs en ligne
            </div>
            {isConnected && (
              <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-emerald-200">
                <Wifi className="w-3 h-3 mr-1" />
                Connecté
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stream Config */}
      {mainStream && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Type</span>
            </div>
            <div className="font-semibold text-gray-900">{mainStream.stream_type.toUpperCase()}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Bitrate</span>
            </div>
            <div className="font-semibold text-gray-900">{mainStream.bitrate} kbps</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Codec</span>
            </div>
            <div className="font-semibold text-gray-900">{mainStream.codec.toUpperCase()}</div>
          </div>
        </div>
      )}

      {/* All Streams */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Tous les flux ({streams?.length || 0})</h3>
        </div>
        {streams && streams.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {streams.map((stream) => (
              <div key={stream.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {stream.status === "online" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{stream.stream_url}</div>
                    <div className="text-sm text-gray-500">
                      {stream.stream_type.toUpperCase()} • {stream.bitrate} kbps • {stream.codec.toUpperCase()}
                      {stream.is_backup && " • Backup"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteStream(stream.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-400">
            <Radio className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun flux configuré</p>
            <p className="text-sm mt-1">Ajoutez un flux Icecast/Shoutcast pour commencer</p>
          </div>
        )}
      </div>

      {/* Add Stream Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajouter un flux</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL du flux</label>
                <input
                  type="url"
                  value={newStream.stream_url}
                  onChange={(e) => setNewStream({ ...newStream, stream_url: e.target.value })}
                  placeholder="http://stream.example.com:8000/stream"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newStream.stream_type}
                    onChange={(e) => setNewStream({ ...newStream, stream_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="icecast">Icecast</option>
                    <option value="shoutcast">Shoutcast</option>
                    <option value="hls">HLS</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bitrate</label>
                  <input
                    type="number"
                    value={newStream.bitrate}
                    onChange={(e) => setNewStream({ ...newStream, bitrate: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Codec</label>
                  <select
                    value={newStream.codec}
                    onChange={(e) => setNewStream({ ...newStream, codec: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="mp3">MP3</option>
                    <option value="aac">AAC</option>
                    <option value="ogg">OGG</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
                Annuler
              </button>
              <button onClick={handleAddStream} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
