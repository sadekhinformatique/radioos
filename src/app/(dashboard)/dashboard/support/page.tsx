"use client";

import { useState } from "react";
import { useMyRadio } from "@/hooks/use-radio-data";
import { HelpCircle, MessageSquare, Plus, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SupportPage() {
  const { radio } = useMyRadio();
  const [showNewTicket, setShowNewTicket] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-500 mt-1">Besoin d&apos;aide ? Contactez notre équipe</p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau ticket
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
        <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium text-gray-600">Centre de support</p>
        <p className="text-sm mt-1 max-w-md mx-auto">
          Créez un ticket pour signaler un problème ou poser une question.
          Notre équipe vous répondra dans les plus brefs délais.
        </p>
      </div>

      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouveau ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Technique</option>
                  <option>Facturation</option>
                  <option>Streaming</option>
                  <option>Compte</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNewTicket(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Annuler</button>
              <button onClick={() => setShowNewTicket(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
