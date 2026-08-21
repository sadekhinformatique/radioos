"use client";

import { useState } from "react";
import { useMyRadio, useMessages, updateMessageStatus } from "@/hooks/use-radio-data";
import {
  MessageSquare,
  Search,
  Mail,
  MailOpen,
  Trash2,
  Star,
  MessageCircle,
  Smartphone,
  Globe,
  Inbox,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sourceIcons: Record<string, typeof MessageSquare> = {
  whatsapp: Smartphone,
  sms: Smartphone,
  email: Mail,
  app: MessageCircle,
  web: Globe,
};

const sourceColors: Record<string, string> = {
  whatsapp: "bg-green-100 text-green-700",
  sms: "bg-blue-100 text-blue-700",
  email: "bg-purple-100 text-purple-700",
  app: "bg-orange-100 text-orange-700",
  web: "bg-gray-100 text-gray-700",
};

export default function MessagesPage() {
  const { radio } = useMyRadio();
  const { data: messages, refetch } = useMessages(radio?.id || null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");

  const filteredMessages = messages?.filter((m) => {
    if (filter === "unread" && m.status !== "unread") return false;
    if (filter === "read" && m.status !== "read") return false;
    if (search && !m.sender_name.toLowerCase().includes(search.toLowerCase()) && !m.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) || [];

  const selectedMessage = messages?.find((m) => m.id === selectedId);

  const handleMarkAsRead = async (id: string) => {
    await updateMessageStatus(id, "read");
    refetch();
  };

  const unreadCount = messages?.filter((m) => m.status === "unread").length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Boîte de réception des auditeurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`p-4 rounded-xl border text-left transition-colors ${filter === "all" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}
        >
          <div className="text-2xl font-bold text-gray-900">{messages?.length || 0}</div>
          <div className="text-sm text-gray-500">Total</div>
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`p-4 rounded-xl border text-left transition-colors ${filter === "unread" ? "bg-orange-50 border-orange-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}
        >
          <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
          <div className="text-sm text-gray-500">Non lus</div>
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`p-4 rounded-xl border text-left transition-colors ${filter === "read" ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}
        >
          <div className="text-2xl font-bold text-emerald-600">{(messages?.length || 0) - unreadCount}</div>
          <div className="text-sm text-gray-500">Lus</div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => {
                const SourceIcon = sourceIcons[msg.source] || MessageSquare;
                return (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setSelectedId(msg.id);
                      if (msg.status === "unread") handleMarkAsRead(msg.id);
                    }}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedId === msg.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.status === "unread" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                        {msg.sender_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${msg.status === "unread" ? "font-semibold" : "font-medium"} text-gray-900 truncate`}>
                            {msg.sender_name}
                          </span>
                          <Badge className={`text-xs ${sourceColors[msg.source] || "bg-gray-100 text-gray-600"}`}>
                            {msg.source}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{msg.content}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Inbox className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucun message</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          {selectedMessage ? (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {selectedMessage.sender_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedMessage.sender_name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedMessage.sender_phone || selectedMessage.source} •{" "}
                    {new Date(selectedMessage.created_at).toLocaleString("fr-FR")}
                  </div>
                </div>
                <Badge className={`ml-auto ${sourceColors[selectedMessage.source] || "bg-gray-100"}`}>
                  {selectedMessage.source}
                </Badge>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{selectedMessage.content}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                  Répondre
                </button>
                <button
                  onClick={() => {
                    updateMessageStatus(selectedMessage.id, "archived");
                    setSelectedId(null);
                    refetch();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
                >
                  Archiver
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Sélectionnez un message</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
