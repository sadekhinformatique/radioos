"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Mail,
  MailOpen,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Clock,
  Phone,
  ChevronDown,
  Inbox,
  Send,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const messages = [
  {
    id: "1",
    sender: "Aminata Diallo",
    phone: "+221 77 123 45 67",
    subject: "Demande de dédicace pour mariage",
    preview:
      "Bonjour, je voudrais faire une dédicace pour le mariage de mon frère qui aura lieu samedi prochain...",
    content:
      "Bonjour, je voudrais faire une dédicace pour le mariage de mon frère qui aura lieu samedi prochain. La chanson préférée est \"Love Nwantiti\" de CKay. Merci beaucoup!",
    timestamp: "2025-08-21T10:30:00",
    read: false,
    starred: true,
    priority: "high" as const,
    source: "whatsapp" as const,
  },
  {
    id: "2",
    sender: "Ousmane Fall",
    phone: "+221 78 234 56 78",
    subject: "Question sur le programme",
    preview:
      "Bonjour, à quelle heure commence l'émission de sport aujourd'hui? J'ai raté l'annonce...",
    content:
      "Bonjour, à quelle heure commence l'émission de sport aujourd'hui? J'ai raté l'annonce ce matin. Merci!",
    timestamp: "2025-08-21T09:45:00",
    read: false,
    starred: false,
    priority: "normal" as const,
    source: "sms" as const,
  },
  {
    id: "3",
    sender: "Fatou Sow",
    phone: "+221 76 345 67 89",
    subject: "Félicitations pour la nouvelle émission",
    preview:
      "Bravo pour la nouvelle émission du matin! C'est vraiment bien et j'adore la musique qu'on y entend...",
    content:
      "Bravo pour la nouvelle émission du matin! C'est vraiment bien et j'adore la musique qu'on y entend. Continuez comme ça! On vous écoute tous les matins au travail.",
    timestamp: "2025-08-21T08:20:00",
    read: true,
    starred: true,
    priority: "normal" as const,
    source: "whatsapp" as const,
  },
  {
    id: "4",
    sender: "Mamadou Ba",
    phone: "+221 79 456 78 90",
    subject: "Signalement de problème de diffusion",
    preview:
      "Le flux radio ne fonctionne pas depuis 20 minutes. J'essaie de connecter depuis mon téléphone mais rien ne marche...",
    content:
      "Le flux radio ne fonctionne pas depuis 20 minutes. J'essaie de connecter depuis mon téléphone mais rien ne marche. Est-ce qu'il y a un problème technique?",
    timestamp: "2025-08-21T07:15:00",
    read: true,
    starred: false,
    priority: "urgent" as const,
    source: "email" as const,
  },
  {
    id: "5",
    sender: "Aïcha Ndiaye",
    phone: "+221 77 567 89 01",
    subject: "Souhait d'anniversaire",
    preview:
      "Je voudrais envoyer un message d'anniversaire à ma meilleure amie Mariama. Elle fête ses 25 ans demain...",
    content:
      "Je voudrais envoyer un message d'anniversaire à ma meilleure amie Mariama. Elle fête ses 25 ans demain et j'aimerais lui dédier la chanson \"Happy\" de Pharrell Williams. Merci!",
    timestamp: "2025-08-20T18:30:00",
    read: true,
    starred: false,
    priority: "normal" as const,
    source: "whatsapp" as const,
  },
  {
    id: "6",
    sender: "Ibrahima Diop",
    phone: "+221 78 678 90 12",
    subject: "Proposition de chanson",
    preview:
      "Bonjour! J'aimerais vous proposer d'ajouter les nouveaux titres de Wally Seck dans la playlist...",
    content:
      "Bonjour! J'aimerais vous proposer d'ajouter les nouveaux titres de Wally Seck dans la playlist. Ses derniers morceaux sont vraiment bons et beaucoup de gens les demandent!",
    timestamp: "2025-08-20T15:45:00",
    read: true,
    starred: false,
    priority: "low" as const,
    source: "sms" as const,
  },
];

const priorityConfig = {
  urgent: { label: "Urgent", color: "bg-red-500", icon: AlertCircle },
  high: { label: "Prioritaire", color: "bg-orange-500", icon: Star },
  normal: { label: "Normal", color: "bg-blue-500", icon: Mail },
  low: { label: "Faible", color: "bg-gray-500", icon: ChevronDown },
};

const sourceConfig = {
  whatsapp: { label: "WhatsApp", color: "bg-green-500" },
  sms: { label: "SMS", color: "bg-blue-500" },
  email: { label: "Email", color: "bg-purple-500" },
};

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.read;
    if (filter === "starred") return msg.starred;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount} non lus • Boîte de réception
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Archiver
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Répondre
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Message List */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                <Inbox className="w-4 h-4 mr-1" />
                Tous
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                <Mail className="w-4 h-4 mr-1" />
                Non lus
                {unreadCount > 0 && (
                  <Badge className="ml-1 bg-red-500">{unreadCount}</Badge>
                )}
              </Button>
              <Button
                variant={filter === "starred" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("starred")}
              >
                <Star className="w-4 h-4 mr-1" />
                Prioritaires
              </Button>
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Rechercher..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-[600px] overflow-y-auto">
              {filteredMessages.map((message) => {
                const priorityInfo = priorityConfig[message.priority];
                const sourceInfo = sourceConfig[message.source];

                return (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      selectedMessage === message.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    } ${!message.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                    onClick={() => setSelectedMessage(message.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {!message.read ? (
                          <Mail className="w-5 h-5 text-blue-500" />
                        ) : (
                          <MailOpen className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`font-medium truncate ${
                              !message.read
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {message.sender}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <div
                              className={`w-2 h-2 rounded-full ${priorityInfo.color}`}
                            />
                            {message.starred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 truncate mt-0.5">
                          {message.subject}
                        </div>
                        <div className="text-xs text-gray-400 truncate mt-1">
                          {message.preview}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs py-0">
                            {message.source === "whatsapp" && (
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                            )}
                            {sourceInfo.label}
                          </Badge>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(message.timestamp).toLocaleTimeString(
                              "fr-FR",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card>
          {selectedMessage ? (
            (() => {
              const msg = messages.find((m) => m.id === selectedMessage);
              if (!msg) return null;
              const priorityInfo = priorityConfig[msg.priority];
              const PriorityIcon = priorityInfo.icon;

              return (
                <>
                  <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{msg.subject}</CardTitle>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                          <span className="font-medium">{msg.sender}</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {msg.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(msg.timestamp).toLocaleString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={`${
                              msg.priority === "urgent"
                                ? "border-red-500 text-red-500"
                                : msg.priority === "high"
                                ? "border-orange-500 text-orange-500"
                                : ""
                            }`}
                          >
                            <PriorityIcon className="w-3 h-3 mr-1" />
                            {priorityInfo.label}
                          </Badge>
                          <Badge variant="outline">
                            {sourceConfig[msg.source].label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Star
                            className={`w-4 h-4 ${
                              msg.starred ? "text-yellow-500 fill-yellow-500" : ""
                            }`}
                          />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                      <Button>
                        <Reply className="w-4 h-4 mr-2" />
                        Répondre
                      </Button>
                      <Button variant="outline">
                        <Forward className="w-4 h-4 mr-2" />
                        Transférer
                      </Button>
                      <Button variant="outline">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Réponse IA
                      </Button>
                    </div>
                  </CardContent>
                </>
              );
            })()
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-96 text-gray-500">
              <Inbox className="w-12 h-12 mb-4 opacity-50" />
              <p>Sélectionnez un message pour le lire</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
