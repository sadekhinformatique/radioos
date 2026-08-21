"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Radio, Search, Globe, Users, Activity, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const supabase = createClient();

interface RadioItem {
  id: string;
  name: string;
  slug: string;
  country?: string;
  city?: string;
  status: string;
  created_at: string;
  owner_id: string;
}

export default function AdminRadiosPage() {
  const [radios, setRadios] = useState<RadioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("radios")
        .select("*")
        .order("created_at", { ascending: false });

      setRadios(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  const filtered = radios.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Toutes les radios ({radios.length})</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Radio</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Slug</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Localisation</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Créée le</th>
                  <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((radio) => (
                  <tr key={radio.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                          {radio.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{radio.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{radio.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {radio.city && radio.country ? `${radio.city}, ${radio.country}` : radio.country || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={radio.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}>
                        {radio.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(radio.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a
                        href={`/radio/${radio.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded-lg inline-flex"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Radio className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune radio trouvée</p>
        </div>
      )}
    </div>
  );
}
