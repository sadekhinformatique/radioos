"use client";

import { useState } from "react";
import { useMyRadio, usePolls, createRecord, updateRecord, deleteRecord } from "@/hooks/use-radio-data";
import { BarChart3, Plus, Clock, CheckCircle, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PollsPage() {
  const { radio } = useMyRadio();
  const { data: polls, refetch } = usePolls(radio?.id || null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });

  const activePolls = polls?.filter((p) => p.status === "active") || [];
  const completedPolls = polls?.filter((p) => p.status === "completed") || [];

  const handleCreate = async () => {
    if (!radio || !newPoll.question || newPoll.options.filter(Boolean).length < 2) return;
    await createRecord("polls", {
      radio_id: radio.id,
      question: newPoll.question,
      options: newPoll.options.filter(Boolean),
      status: "active",
    });
    setNewPoll({ question: "", options: ["", ""] });
    setShowCreateForm(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce sondage ?")) return;
    await deleteRecord("polls", id);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sondages</h1>
          <p className="text-gray-500 mt-1">Créez et gérez vos sondages en temps réel</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau sondage
        </button>
      </div>

      {/* Active Polls */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sondages actifs ({activePolls.length})</h2>
        {activePolls.length > 0 ? (
          <div className="space-y-4">
            {activePolls.map((poll) => (
              <div key={poll.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{poll.question}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Actif
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(poll.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(poll.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {poll.options.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-lg h-8 overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-lg" style={{ width: "0%" }} />
                      </div>
                      <span className="text-sm text-gray-700 w-32 truncate">{option}</span>
                      <span className="text-xs text-gray-400 w-8 text-right">0%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  0 votes
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-gray-600 font-medium">Aucun sondage actif</p>
            <p className="text-sm mt-1">Créez un sondage pour engager votre audience</p>
          </div>
        )}
      </div>

      {/* Completed Polls */}
      {completedPolls.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sondages terminés ({completedPolls.length})</h2>
          <div className="space-y-3">
            {completedPolls.map((poll) => (
              <div key={poll.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{poll.question}</h3>
                  <span className="text-sm text-gray-500">{poll.options.length} options</span>
                </div>
                <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Terminé
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouveau sondage</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  placeholder="Quelle est votre question ?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                {newPoll.options.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const options = [...newPoll.options];
                      options[idx] = e.target.value;
                      setNewPoll({ ...newPoll, options });
                    }}
                    placeholder={`Option ${idx + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                ))}
                {newPoll.options.length < 10 && (
                  <button
                    onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Ajouter une option
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Annuler</button>
              <button onClick={handleCreate} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium">Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
