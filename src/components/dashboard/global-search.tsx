"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Search,
  Radio,
  MessageSquare,
  Podcast,
  Users,
  Headphones,
  X,
  ArrowRight,
} from "lucide-react";

const supabase = createClient();

interface SearchResult {
  type: "radio" | "podcast" | "message" | "user";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: typeof Radio;
}

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search when query changes
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      const searchResults: SearchResult[] = [];

      // Search podcasts
      const { data: podcasts } = await supabase
        .from("podcasts")
        .select("id, title, description")
        .ilike("title", `%${query}%`)
        .limit(3);

      podcasts?.forEach((p) => {
        searchResults.push({
          type: "podcast",
          id: p.id,
          title: p.title,
          subtitle: p.description || "Podcast",
          href: "/dashboard/podcasts",
          icon: Podcast,
        });
      });

      // Search messages
      const { data: messages } = await supabase
        .from("messages")
        .select("id, sender_name, content")
        .ilike("sender_name", `%${query}%`)
        .limit(3);

      messages?.forEach((m) => {
        searchResults.push({
          type: "message",
          id: m.id,
          title: m.sender_name,
          subtitle: m.content?.substring(0, 50) || "Message",
          href: "/dashboard/messages",
          icon: MessageSquare,
        });
      });

      setResults(searchResults);
      setLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Rechercher...</span>
        <kbd className="hidden md:inline text-xs bg-white px-1.5 py-0.5 rounded border border-gray-200">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[20vh]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un podcast, message, utilisateur..."
                className="flex-1 text-sm outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{result.title}</div>
                          <div className="text-xs text-gray-500 truncate">{result.subtitle}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              ) : query.length >= 2 ? (
                <div className="p-8 text-center text-gray-400">
                  <p className="text-sm">Aucun résultat pour &quot;{query}&quot;</p>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p className="text-sm">Tapez au moins 2 caractères</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>⌘K pour ouvrir • Esc pour fermer</span>
              <span>Navigation rapide</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
