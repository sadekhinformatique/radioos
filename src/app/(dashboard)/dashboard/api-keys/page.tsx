"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useMyRadio } from "@/hooks/use-radio-data";
import { useToast } from "@/components/ui/toast";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  Calendar,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const supabase = createClient();

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
  is_active: boolean;
}

// Generate a random API key
function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "ros_";
  for (let i = 0; i < 48; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export default function ApiKeysPage() {
  const { radio } = useMyRadio();
  const { addToast } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(["read"]);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  // Simulated API keys (would come from Supabase in production)
  useEffect(() => {
    if (radio) {
      // In production, fetch from a api_keys table
      setKeys([
        {
          id: "key_1",
          name: "Application Mobile",
          key_prefix: "ros_a1b2c3d4",
          scopes: ["read", "write"],
          last_used_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
          is_active: true,
        },
        {
          id: "key_2",
          name: "Intégration Webhook",
          key_prefix: "ros_x9y8z7w6",
          scopes: ["read"],
          expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
          created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
          is_active: true,
        },
      ]);
      setLoading(false);
    }
  }, [radio]);

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;

    const newKey = generateApiKey();
    const newApiKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key_prefix: newKey.substring(0, 12) + "...",
      scopes: newKeyScopes,
      created_at: new Date().toISOString(),
      is_active: true,
    };

    setKeys((prev) => [newApiKey, ...prev]);
    setCreatedKey(newKey);
    setNewKeyName("");
    setNewKeyScopes(["read"]);
    setShowCreate(false);

    addToast({
      type: "success",
      title: "Clé API créée",
      message: "Copiez et sauvegardez-la, elle ne sera plus visible.",
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer cette clé API ?")) return;
    setKeys((prev) => prev.filter((k) => k.id !== id));
    addToast({ type: "success", title: "Clé supprimée" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({ type: "success", title: "Copié dans le presse-papier" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clés API</h1>
          <p className="text-gray-500 mt-1">Gérez les accès API à votre radio</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle clé
        </button>
      </div>

      {/* Created Key Alert */}
      {createdKey && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-emerald-800">Clé créée avec succès !</div>
              <div className="text-sm text-emerald-600 mt-1">
                Copiez cette clé et stockez-la en sécurité. Elle ne sera plus visible après cette session.
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(createdKey)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copier
            </button>
          </div>
          <div className="mt-3 p-3 bg-white rounded-lg font-mono text-sm text-gray-800 break-all">
            {createdKey}
          </div>
        </div>
      )}

      {/* API Keys List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Clés actives ({keys.filter((k) => k.is_active).length})</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : keys.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {keys.map((apiKey) => (
              <div key={apiKey.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Key className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{apiKey.name}</div>
                      <div className="text-sm text-gray-500 font-mono">{apiKey.key_prefix}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs text-gray-400">
                      <div>
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Créée le {new Date(apiKey.created_at).toLocaleDateString("fr-FR")}
                      </div>
                      {apiKey.last_used_at && (
                        <div>Dernière utilisation : {new Date(apiKey.last_used_at).toLocaleDateString("fr-FR")}</div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {apiKey.scopes.map((scope) => (
                        <Badge key={scope} className="bg-gray-100 text-gray-600 text-xs">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDelete(apiKey.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-gray-600 font-medium">Aucune clé API</p>
            <p className="text-sm mt-1">Créez une clé pour accéder à l&apos;API RadioOS</p>
          </div>
        )}
      </div>

      {/* API Documentation Link */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Sécurité
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Les clés API donnent accès à vos données RadioOS</li>
          <li>• Ne partagez jamais vos clés publiquement</li>
          <li>• Utilisez des clés séparées pour chaque intégration</li>
          <li>• Supprimez les clés inutilisées régulièrement</li>
        </ul>
        <a
          href="/dashboard/api-docs"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          Voir la documentation API →
        </a>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouvelle clé API</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="ex: Application Mobile, Webhook, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="flex gap-2">
                  {["read", "write", "admin"].map((scope) => (
                    <button
                      key={scope}
                      onClick={() => {
                        setNewKeyScopes((prev) =>
                          prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
                        );
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                        newKeyScopes.includes(scope)
                          ? "bg-blue-50 border-blue-300 text-blue-700"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
                Annuler
              </button>
              <button onClick={handleCreateKey} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
