"use client";

import { useState } from "react";
import { useMyRadio, useDedications, updateDedicationStatus } from "@/hooks/use-radio-data";
import { Heart, Check, X, Play, Clock, Music, User, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "En attente", color: "text-amber-700", bg: "bg-amber-100 border-amber-200" },
  approved: { label: "Approuvée", color: "text-blue-700", bg: "bg-blue-100 border-blue-200" },
  played: { label: "Diffusée", color: "text-emerald-700", bg: "bg-emerald-100 border-emerald-200" },
  rejected: { label: "Rejetée", color: "text-red-700", bg: "bg-red-100 border-red-200" },
};

export default function DedicationsPage() {
  const { radio } = useMyRadio();
  const { data: dedications, refetch } = useDedications(radio?.id || null);
  const [filter, setFilter] = useState<string>("pending");

  const filteredDedications = dedications?.filter((d) => filter === "all" || d.status === filter) || [];
  const pendingCount = dedications?.filter((d) => d.status === "pending").length || 0;

  const handleStatusChange = async (id: string, status: string) => {
    await updateDedicationStatus(id, status);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dédicaces</h1>
        <p className="text-gray-500 mt-1">Gérez les dédicaces de vos auditeurs</p>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2">
        {["pending", "approved", "played", "rejected", "all"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {status === "pending" && `En attente (${pendingCount})`}
            {status === "approved" && "Approuvées"}
            {status === "played" && "Diffusées"}
            {status === "rejected" && "Rejetées"}
            {status === "all" && "Toutes"}
          </button>
        ))}
      </div>

      {/* Dedications List */}
      {filteredDedications.length > 0 ? (
        <div className="space-y-4">
          {filteredDedications.map((ded) => {
            const config = statusConfig[ded.status] || statusConfig.pending;
            return (
              <div key={ded.id} className={`bg-white rounded-xl border p-6 ${config.bg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{ded.song_title}</span>
                        <span className="text-gray-400">—</span>
                        <span className="text-gray-600">{ded.artist_name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          De : {ded.sender_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Pour : {ded.recipient_name}
                        </span>
                      </div>
                      {ded.message && (
                        <div className="mt-2 flex items-start gap-1 text-sm text-gray-600">
                          <MessageCircle className="w-3 h-3 mt-0.5" />
                          &quot;{ded.message}&quot;
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ded.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(ded.id, "approved")}
                          className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"
                          title="Approuver"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(ded.id, "rejected")}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          title="Rejeter"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {ded.status === "approved" && (
                      <button
                        onClick={() => handleStatusChange(ded.id, "played")}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                        title="Marquer comme diffusée"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    <Badge className={`${config.bg} ${config.color} border`}>
                      {config.label}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium text-gray-600">Aucune dédicace {filter !== "all" ? `en statut "${filter}"` : ""}</p>
          <p className="text-sm mt-1">Les dédicaces des auditeurs apparaîtront ici</p>
        </div>
      )}
    </div>
  );
}
