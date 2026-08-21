"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Headphones,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Tag,
  Paperclip,
  ExternalLink,
  Eye,
  ArrowUpRight,
  Wifi,
  CreditCard,
  Radio,
  Settings,
  HelpCircle,
} from "lucide-react";

type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";
type TicketCategory = "technical" | "billing" | "streaming" | "account" | "advertising" | "other";

interface Comment {
  id: string;
  author: string;
  role: "user" | "support";
  content: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: "low" | "normal" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  comments: Comment[];
}

const tickets: Ticket[] = [
  {
    id: "TKT-1247",
    subject: "Le flux audio ne démarre pas",
    description: "Depuis ce matin, mon flux Icecast ne se connecte plus au dashboard. J'ai vérifié le serveur et le flux fonctionne directement via le player natif. Le problème semble venir de la connexion RadioOS.",
    category: "streaming",
    status: "in_progress",
    priority: "high",
    createdAt: "2025-08-21T08:30:00",
    updatedAt: "2025-08-21T10:15:00",
    assignee: "Support Technique",
    comments: [
      { id: "1", author: "Amadou Diallo", role: "user", content: "Le flux ne démarre pas depuis ce matin. Mon serveur Icecast fonctionne normalement.", timestamp: "2025-08-21T08:30:00" },
      { id: "2", author: "Agent Support", role: "support", content: "Bonjour Amadou, nous avons bien reçu votre signalement. Pouvez-vous nous confirmer l'URL exacte de votre flux ?", timestamp: "2025-08-21T09:00:00" },
      { id: "3", author: "Amadou Diallo", role: "user", content: "L'URL est http://stream.radioos.sn:8000/live", timestamp: "2025-08-21T09:15:00" },
      { id: "4", author: "Agent Support", role: "support", content: "Merci. Nous vérifions la connexion. Un problème de pare-feu a été détecté côté serveur. Nous corrigeons cela.", timestamp: "2025-08-21T10:15:00" },
    ],
  },
  {
    id: "TKT-1246",
    subject: "Impossible de télécharger un podcast",
    description: "Quand j'essaie d'upload un fichier MP3 de 50MB, la barre de progression atteint 90% puis échoue avec une erreur réseau.",
    category: "technical",
    status: "open",
    priority: "normal",
    createdAt: "2025-08-20T14:00:00",
    updatedAt: "2025-08-20T14:00:00",
    comments: [
      { id: "1", author: "Fatima Sy", role: "user", content: "Impossible d'upload des fichiers podcasts de plus de 20MB.", timestamp: "2025-08-20T14:00:00" },
    ],
  },
  {
    id: "TKT-1245",
    subject: "Changement de plan abonnement",
    description: "Je souhaite passer du plan Starter au plan Professional. Comment procéder ?",
    category: "billing",
    status: "waiting",
    priority: "normal",
    createdAt: "2025-08-19T11:00:00",
    updatedAt: "2025-08-20T09:30:00",
    assignee: "Support Facturation",
    comments: [
      { id: "1", author: "Ibrahim Cissé", role: "user", content: "Je veux passer au plan Professional.", timestamp: "2025-08-19T11:00:00" },
      { id: "2", author: "Agent Support", role: "support", content: "Bien sûr ! Vous pouvez upgrader depuis Paramètres > Abonnement. Le changement prendra effet immédiatement. Le tarif est de 25,000 FCFA/mois.", timestamp: "2025-08-19T14:00:00" },
      { id: "3", author: "Ibrahim Cissé", role: "user", content: "J'ai essayé mais le bouton ne fonctionne pas. J'ai le navigateur Chrome sur Android.", timestamp: "2025-08-20T09:30:00" },
    ],
  },
  {
    id: "TKT-1244",
    subject: "Demande de remboursement",
    description: "J'ai été facturé deux fois ce mois-ci. Pouvez-vous vérifier et procéder au remboursement ?",
    category: "billing",
    status: "resolved",
    priority: "high",
    createdAt: "2025-08-15T09:00:00",
    updatedAt: "2025-08-17T16:00:00",
    assignee: "Support Facturation",
    comments: [
      { id: "1", author: "Moussa Sow", role: "user", content: "Double facturation sur mon compte.", timestamp: "2025-08-15T09:00:00" },
      { id: "2", author: "Agent Support", role: "support", content: "Nous avons identifié le problème. Un remboursement de 25,000 FCFA a été initié.", timestamp: "2025-08-16T10:00:00" },
      { id: "3", author: "Moussa Sow", role: "user", content: "Merci, bien reçu !", timestamp: "2025-08-17T16:00:00" },
    ],
  },
  {
    id: "TKT-1243",
    subject: "Analytics ne se chargent pas",
    description: "La page analytics affiche un écran vide. Les graphiques ne se chargent pas du tout.",
    category: "technical",
    status: "closed",
    priority: "normal",
    createdAt: "2025-08-10T13:00:00",
    updatedAt: "2025-08-12T11:00:00",
    assignee: "Support Technique",
    comments: [
      { id: "1", author: "Aïssatou Ndiaye", role: "user", content: "Analytics ne charge pas.", timestamp: "2025-08-10T13:00:00" },
      { id: "2", author: "Agent Support", role: "support", content: "Bug identifié et corrigé. Veuillez vider le cache de votre navigateur.", timestamp: "2025-08-11T09:00:00" },
      { id: "3", author: "Aïssatou Ndiaye", role: "user", content: "C'est résolu, merci !", timestamp: "2025-08-12T11:00:00" },
    ],
  },
  {
    id: "TKT-1242",
    subject: "Comment connecter WhatsApp Business ?",
    description: "Je souhaite intégrer WhatsApp Business pour recevoir les messages de mes auditeurs. Comment faire ?",
    category: "other",
    status: "open",
    priority: "low",
    createdAt: "2025-08-21T07:00:00",
    updatedAt: "2025-08-21T07:00:00",
    comments: [
      { id: "1", author: "DJ Afro", role: "user", content: "Comment connecter WhatsApp ?", timestamp: "2025-08-21T07:00:00" },
    ],
  },
];

const statusConfig: Record<TicketStatus, { label: string; color: string; icon: React.ElementType; variant: "default" | "secondary" | "warning" | "danger" | "success" }> = {
  open: { label: "Ouvert", color: "bg-blue-500", icon: AlertCircle, variant: "default" },
  in_progress: { label: "En cours", color: "bg-yellow-500", icon: RefreshCw, variant: "warning" },
  waiting: { label: "En attente", color: "bg-orange-500", icon: Clock, variant: "warning" },
  resolved: { label: "Résolu", color: "bg-green-500", icon: CheckCircle2, variant: "success" },
  closed: { label: "Fermé", color: "bg-gray-500", icon: XCircle, variant: "secondary" },
};

const categoryConfig: Record<TicketCategory, { label: string; icon: React.ElementType; color: string }> = {
  technical: { label: "Technique", icon: Settings, color: "text-blue-500" },
  billing: { label: "Facturation", icon: CreditCard, color: "text-purple-500" },
  streaming: { label: "Streaming", icon: Wifi, color: "text-green-500" },
  account: { label: "Compte", icon: User, color: "text-orange-500" },
  advertising: { label: "Publicité", icon: Tag, color: "text-pink-500" },
  other: { label: "Autre", icon: HelpCircle, color: "text-gray-500" },
};

const priorityConfig = {
  low: { label: "Basse", color: "bg-gray-100 text-gray-700" },
  normal: { label: "Normale", color: "bg-blue-100 text-blue-700" },
  high: { label: "Haute", color: "bg-orange-100 text-orange-700" },
  urgent: { label: "Urgente", color: "bg-red-100 text-red-700" },
};

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showNewTicket, setShowNewTicket] = useState(false);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const currentTicket = tickets.find((t) => t.id === selectedTicket);

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const waitingCount = tickets.filter((t) => t.status === "waiting").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Support
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {openCount} ouverts • {inProgressCount} en cours • {waitingCount} en attente
          </p>
        </div>
        <Button onClick={() => setShowNewTicket(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          const count = tickets.filter((t) => t.status === key).length;
          return (
            <Card
              key={key}
              className={`cursor-pointer transition-colors ${
                statusFilter === key ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color}/20`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                    <div className="text-xs text-gray-500">{config.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Rechercher un ticket..." className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Toutes catégories</option>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        {/* Ticket List */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-[700px] overflow-y-auto">
              {filteredTickets.map((ticket) => {
                const status = statusConfig[ticket.status];
                const StatusIcon = status.icon;
                const category = categoryConfig[ticket.category];
                const CategoryIcon = category.icon;

                return (
                  <div
                    key={ticket.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      selectedTicket === ticket.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <StatusIcon className={`w-5 h-5 ${status.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400 font-mono">{ticket.id}</span>
                          <Badge variant={status.variant} className="text-xs py-0">
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className={`text-xs py-0 ${priorityConfig[ticket.priority].color}`}>
                            {priorityConfig[ticket.priority].label}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {ticket.subject}
                        </h3>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <CategoryIcon className={`w-3 h-3 ${category.color}`} />
                            {category.label}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(ticket.updatedAt).toLocaleDateString("fr-FR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {ticket.comments.length}
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

        {/* Ticket Detail */}
        <Card>
          {currentTicket ? (
            <>
              <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-400 font-mono">{currentTicket.id}</span>
                      <Badge variant={statusConfig[currentTicket.status].variant}>
                        {statusConfig[currentTicket.status].label}
                      </Badge>
                      <Badge variant="outline" className={priorityConfig[currentTicket.priority].color}>
                        Priorité {priorityConfig[currentTicket.priority].label}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{currentTicket.subject}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        {(() => {
                          const CatIcon = categoryConfig[currentTicket.category].icon;
                          return <CatIcon className={`w-4 h-4 ${categoryConfig[currentTicket.category].color}`} />;
                        })()}
                        {categoryConfig[currentTicket.category].label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(currentTicket.createdAt).toLocaleString("fr-FR")}
                      </span>
                      {currentTicket.assignee && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {currentTicket.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {currentTicket.status === "open" && (
                      <Button size="sm">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Prendre en charge
                      </Button>
                    )}
                    {currentTicket.status === "in_progress" && (
                      <Button size="sm" variant="outline">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Résoudre
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {currentTicket.description}
                  </p>
                </div>

                {/* Conversation */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">
                    Conversation ({currentTicket.comments.length})
                  </h4>
                  <div className="space-y-4">
                    {currentTicket.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`flex gap-3 ${
                          comment.role === "support" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${
                            comment.role === "support"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {comment.role === "support" ? "S" : comment.author.charAt(0)}
                        </div>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            comment.role === "support"
                              ? "bg-green-50 dark:bg-green-900/20"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.timestamp).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Box */}
                  {currentTicket.status !== "closed" && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          A
                        </div>
                        <div className="flex-1">
                          <textarea
                            className="w-full h-20 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Écrire une réponse..."
                          />
                          <div className="flex items-center justify-between mt-2">
                            <Button variant="ghost" size="sm">
                              <Paperclip className="w-4 h-4 mr-1" />
                              Joindre
                            </Button>
                            <Button size="sm">
                              <Send className="w-4 h-4 mr-1" />
                              Envoyer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-96 text-gray-500">
              <Headphones className="w-12 h-12 mb-4 opacity-50" />
              <p>Sélectionnez un ticket pour le consulter</p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Nouveau ticket
              </h2>
              <button onClick={() => setShowNewTicket(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Catégorie
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-sm">
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priorité
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-sm">
                  <option value="low">Basse</option>
                  <option value="normal" selected>Normale</option>
                  <option value="high">Haute</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sujet
                </label>
                <Input placeholder="Décrivez brièvement votre problème" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  className="w-full h-32 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Expliquez votre problème en détail..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pièce jointe
                </label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                  <Paperclip className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Glissez un fichier ici ou{" "}
                    <span className="text-blue-500 cursor-pointer">parcourir</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, PDF, MP4 (max 10MB)
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-6 border-t border-gray-200 dark:border-gray-800">
              <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                Annuler
              </Button>
              <Button onClick={() => setShowNewTicket(false)}>
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
