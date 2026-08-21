"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Music,
  Search,
  Filter,
  Check,
  X,
  Play,
  Clock,
  User,
  Phone,
  Heart,
  Volume2,
  Ban,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mic,
} from "lucide-react";

const dedications = [
  {
    id: "1",
    sender: "Aminata Diallo",
    phone: "+221 77 123 45 67",
    recipient: "Mariama Diallo",
    message:
      "Joyeux anniversaire ma chérie! Que Dieu te bénisse abondamment. Je t'offre cette chanson pour te dire combien tu comptes pour moi.",
    song: "Love Nwantiti - CKay",
    show: "Musique Africaine",
    status: "pending" as const,
    timestamp: "2025-08-21T10:30:00",
    consent: true,
  },
  {
    id: "2",
    sender: "Ousmane Fall",
    phone: "+221 78 234 56 78",
    recipient: "Moussa Fall",
    message:
      "Mon frère, je pense à toi en ce jour spécial. Profite bien de ta fête et écoute cette chanson en souvenir de nous.",
    song: "Bouger Bouger - Youssou N'Dour",
    show: "Réveil Matinal",
    status: "approved" as const,
    timestamp: "2025-08-21T09:15:00",
    consent: true,
  },
  {
    id: "3",
    sender: "Fatou Sow",
    phone: "+221 76 345 67 89",
    recipient: "Aïcha Sow",
    message:
      "À ma meilleure amie, merci pour tout ton soutien. Cette chanson c'est pour toi!",
    song: "Ten Feet - Wally Seck",
    show: "Musique Africaine",
    status: "played" as const,
    timestamp: "2025-08-21T08:00:00",
    consent: true,
  },
  {
    id: "4",
    sender: "Moussa Ba",
    phone: "+221 79 456 78 90",
    recipient: "Sa famille entière",
    message:
      "Je veux dédier cette chanson à toute ma famille qui m'écoute en ce moment. Bonne journée à tous!",
    song: "Is Beauty a Crime - Baaba Maal",
    show: "Espace Culture",
    status: "pending" as const,
    timestamp: "2025-08-21T07:45:00",
    consent: true,
  },
  {
    id: "5",
    sender: "Aïcha Ndiaye",
    phone: "+221 77 567 89 01",
    recipient: "Ses parents",
    message:
      "Je souhaite dédier cette chanson à mes chers parents pour tout ce qu'ils font pour nous.",
    song: "Père - Ismael Lô",
    show: "Gospel & Louanges",
    status: "rejected" as const,
    timestamp: "2025-08-20T18:30:00",
    consent: true,
  },
  {
    id: "6",
    sender: "Ibrahima Diop",
    phone: "+221 78 678 90 12",
    recipient: "Ses collègues de travail",
    message:
      "Pour toute l'équipe du bureau, merci pour votre énergie et bonne continuation!",
    song: "C'est l'amour - Daara J",
    show: "Sport Total",
    status: "approved" as const,
    timestamp: "2025-08-20T16:00:00",
    consent: true,
  },
];

const statusConfig = {
  pending: {
    label: "En attente",
    color: "bg-yellow-500",
    icon: Clock,
    variant: "secondary" as const,
  },
  approved: {
    label: "Approuvée",
    color: "bg-blue-500",
    icon: CheckCircle2,
    variant: "default" as const,
  },
  played: {
    label: "Diffusée",
    color: "bg-green-500",
    icon: Play,
    variant: "default" as const,
  },
  rejected: {
    label: "Refusée",
    color: "bg-red-500",
    icon: XCircle,
    variant: "danger" as const,
  },
};

export default function DedicationsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredDedications = dedications.filter((d) => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  const pendingCount = dedications.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dédicaces
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {pendingCount} dédicaces en attente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Volume2 className="w-4 h-4 mr-2" />
            Lire la prochaine
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          const count = dedications.filter((d) => d.status === key).length;
          return (
            <Card key={key}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${config.color}/20`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {count}
                    </div>
                    <div className="text-sm text-gray-500">{config.label}</div>
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
              <Input placeholder="Rechercher..." className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Toutes
              </Button>
              {Object.entries(statusConfig).map(([key, config]) => (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(key)}
                >
                  {config.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dedications List */}
      <div className="space-y-4">
        {filteredDedications.map((dedication) => {
          const statusInfo = statusConfig[dedication.status];
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={dedication.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Song Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {dedication.song}
                        </h3>
                        <Badge variant={statusInfo.variant}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {dedication.sender}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {dedication.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          Pour: {dedication.recipient}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      &ldquo;{dedication.message}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <Mic className="w-3 h-3" />
                      {dedication.show}
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      {new Date(dedication.timestamp).toLocaleTimeString(
                        "fr-FR",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-shrink-0">
                    {dedication.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Refuser
                        </Button>
                      </>
                    )}
                    {dedication.status === "approved" && (
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        <Play className="w-4 h-4 mr-1" />
                        Diffuser
                      </Button>
                    )}
                    {dedication.status === "played" && (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Diffusé
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
