"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  BarChart3,
  Plus,
  Search,
  Clock,
  Users,
  Vote,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Trash2,
  Edit,
  Eye,
  Share2,
  Calendar,
  TrendingUp,
  Trophy,
} from "lucide-react";

const polls = [
  {
    id: "1",
    question: "Quelle émission préférez-vous?",
    status: "active" as const,
    startDate: "2025-08-18",
    endDate: "2025-08-25",
    totalVotes: 4523,
    options: [
      { id: "1", text: "Réveil Matinal", votes: 1823, percentage: 40.3 },
      { id: "2", text: "Musique Africaine", votes: 1456, percentage: 32.2 },
      { id: "3", text: "Sport Total", votes: 789, percentage: 17.4 },
      { id: "4", text: "Espace Culture", votes: 455, percentage: 10.1 },
    ],
  },
  {
    id: "2",
    question: "Quel genre musical souhaitez-vous davantage?",
    status: "active" as const,
    startDate: "2025-08-20",
    endDate: "2025-08-27",
    totalVotes: 2891,
    options: [
      { id: "1", text: "Afrobeats", votes: 1156, percentage: 40.0 },
      { id: "2", text: "Mbalax", votes: 867, percentage: 30.0 },
      { id: "3", text: "Hip-Hop Africain", votes: 578, percentage: 20.0 },
      { id: "4", text: "Gospel", votes: 289, percentage: 10.0 },
    ],
  },
  {
    id: "3",
    question: "À quelle heure écoutez-vous le plus la radio?",
    status: "completed" as const,
    startDate: "2025-08-01",
    endDate: "2025-08-08",
    totalVotes: 8934,
    options: [
      { id: "1", text: "Matin (6h-10h)", votes: 3574, percentage: 40.0 },
      { id: "2", text: "Midi (10h-14h)", votes: 2680, percentage: 30.0 },
      { id: "3", text: "Après-midi (14h-18h)", votes: 1787, percentage: 20.0 },
      { id: "4", text: "Soir (18h-22h)", votes: 893, percentage: 10.0 },
    ],
  },
  {
    id: "4",
    question: "Seriez-vous intéressé par un podcast hebdomadaire?",
    status: "completed" as const,
    startDate: "2025-07-15",
    endDate: "2025-07-22",
    totalVotes: 3456,
    options: [
      { id: "1", text: "Oui, très intéressé!", votes: 2073, percentage: 60.0 },
      { id: "2", text: "Peut-être", votes: 1037, percentage: 30.0 },
      { id: "3", text: "Non, pas intéressé", votes: 346, percentage: 10.0 },
    ],
  },
  {
    id: "5",
    question: "Que pensez-vous de la nouvelle identité sonore?",
    status: "draft" as const,
    startDate: null,
    endDate: null,
    totalVotes: 0,
    options: [
      { id: "1", text: "J'adore", votes: 0, percentage: 0 },
      { id: "2", text: "C'est bien", votes: 0, percentage: 0 },
      { id: "3", text: "Je préfère l'ancienne", votes: 0, percentage: 0 },
    ],
  },
];

const statusConfig = {
  active: {
    label: "Actif",
    color: "bg-green-500",
    icon: Play,
    variant: "default" as const,
  },
  completed: {
    label: "Terminé",
    color: "bg-gray-500",
    icon: CheckCircle2,
    variant: "secondary" as const,
  },
  draft: {
    label: "Brouillon",
    color: "bg-yellow-500",
    icon: Edit,
    variant: "outline" as const,
  },
};

export default function PollsPage() {
  const [activePoll, setActivePoll] = useState<string>("1");

  const currentPoll = polls.find((p) => p.id === activePoll);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sondages
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Créez et gérez vos sondages interactifs
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau sondage
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {polls.length}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {polls.filter((p) => p.status === "active").length}
                </div>
                <div className="text-sm text-gray-500">Actifs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Vote className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {polls.reduce((a, p) => a + p.totalVotes, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Votes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(
                    polls.reduce((a, p) => a + p.totalVotes, 0) /
                      Math.max(polls.filter((p) => p.status === "active").length, 1)
                  ).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Moy. votes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Poll List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sondages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {polls.map((poll) => {
                const statusInfo = statusConfig[poll.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={poll.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      activePoll === poll.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                    onClick={() => setActivePoll(poll.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
                          {poll.question}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Vote className="w-3 h-3" />
                            {poll.totalVotes.toLocaleString()}
                          </span>
                          {poll.endDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {poll.endDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={statusInfo.variant}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Poll Detail */}
        <Card>
          {currentPoll ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {currentPoll.question}
                    </CardTitle>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <Badge variant={statusConfig[currentPoll.status].variant}>
                        {statusConfig[currentPoll.status].label}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Vote className="w-4 h-4" />
                        {currentPoll.totalVotes.toLocaleString()} votes
                      </span>
                      {currentPoll.startDate && currentPoll.endDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {currentPoll.startDate} → {currentPoll.endDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {currentPoll.status === "active" && (
                      <Button variant="outline" size="sm">
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      Partager
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Results */}
                <div className="space-y-6">
                  {currentPoll.options.map((option, index) => (
                    <div key={option.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {index === 0 &&
                            currentPoll.totalVotes > 0 && (
                              <Trophy className="w-5 h-5 text-yellow-500" />
                            )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {option.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            {option.votes.toLocaleString()} votes
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {option.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            index === 0
                              ? "bg-blue-500"
                              : index === 1
                              ? "bg-green-500"
                              : index === 2
                              ? "bg-orange-500"
                              : "bg-purple-500"
                          }`}
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentPoll.totalVotes.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Votes totaux</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentPoll.options.length}
                      </div>
                      <div className="text-sm text-gray-500">Options</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">
                        {currentPoll.options[0]?.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">1er choix</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentPoll.startDate
                          ? Math.ceil(
                              (new Date(currentPoll.endDate!).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : "—"}
                      </div>
                      <div className="text-sm text-gray-500">Jours restants</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-96 text-gray-500">
              <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
              <p>Sélectionnez un sondage pour voir les résultats</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
