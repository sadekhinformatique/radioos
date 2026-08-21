"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Users as UsersIcon,
  Plus,
  Search,
  Mail,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Key,
  Eye,
  Radio,
  Crown,
  Mic,
  BarChart3,
  Megaphone,
  Headphones,
  Settings,
  Send,
  Copy,
  ExternalLink,
  AlertCircle,
  Filter,
} from "lucide-react";

const users = [
  {
    id: "1",
    name: "Amadou Diallo",
    email: "amadou@radioos.sn",
    role: "RADIO_OWNER" as const,
    status: "active" as const,
    lastActive: "2025-08-21T10:30:00",
    avatar: null,
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Fatima Sy",
    email: "fatima@radioos.sn",
    role: "RADIO_ADMIN" as const,
    status: "active" as const,
    lastActive: "2025-08-21T09:45:00",
    avatar: null,
    joinedAt: "2024-03-20",
  },
  {
    id: "3",
    name: "Ibrahim Cissé",
    email: "ibrahim@radioos.sn",
    role: "HOST" as const,
    status: "active" as const,
    lastActive: "2025-08-20T18:00:00",
    avatar: null,
    joinedAt: "2024-06-10",
  },
  {
    id: "4",
    name: "Aïssatou Ndiaye",
    email: "aissatou@radioos.sn",
    role: "HOST" as const,
    status: "active" as const,
    lastActive: "2025-08-19T16:30:00",
    avatar: null,
    joinedAt: "2024-07-05",
  },
  {
    id: "5",
    name: "Moussa Sow",
    email: "moussa@radioos.sn",
    role: "EDITOR" as const,
    status: "active" as const,
    lastActive: "2025-08-21T08:15:00",
    avatar: null,
    joinedAt: "2024-08-12",
  },
  {
    id: "6",
    name: "DJ Afro",
    email: "djafro@radioos.sn",
    role: "HOST" as const,
    status: "inactive" as const,
    lastActive: "2025-08-10T22:00:00",
    avatar: null,
    joinedAt: "2024-09-01",
  },
  {
    id: "7",
    name: "Oumar Fall",
    email: "oumar@radioos.sn",
    role: "ANALYST" as const,
    status: "active" as const,
    lastActive: "2025-08-21T07:00:00",
    avatar: null,
    joinedAt: "2025-01-10",
  },
  {
    id: "8",
    name: "Mariama Ba",
    email: "mariama@radioos.sn",
    role: "ADVERTISER" as const,
    status: "active" as const,
    lastActive: "2025-08-18T14:20:00",
    avatar: null,
    joinedAt: "2025-02-15",
  },
];

const invitations = [
  {
    id: "1",
    email: "nouveau@radioos.sn",
    role: "HOST" as const,
    invitedBy: "Amadou Diallo",
    sentAt: "2025-08-20T14:00:00",
    expiresAt: "2025-08-27T14:00:00",
    status: "pending" as const,
  },
  {
    id: "2",
    email: "invite@radioos.sn",
    role: "EDITOR" as const,
    invitedBy: "Fatima Sy",
    sentAt: "2025-08-19T10:00:00",
    expiresAt: "2025-08-26T10:00:00",
    status: "expired" as const,
  },
];

const roleConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType; permissions: string[] }
> = {
  RADIO_OWNER: {
    label: "Propriétaire",
    color: "bg-yellow-500",
    icon: Crown,
    permissions: ["Tout"],
  },
  RADIO_ADMIN: {
    label: "Administrateur",
    color: "bg-blue-500",
    icon: Shield,
    permissions: [
      "Gestion complète",
      "Utilisateurs",
      "Paramètres",
      "Facturation",
    ],
  },
  EDITOR: {
    label: "Éditeur",
    color: "bg-purple-500",
    icon: Edit,
    permissions: [
      "Émissions",
      "Podcasts",
      "Messages",
      "Programmes",
    ],
  },
  HOST: {
    label: "Animateur",
    color: "bg-green-500",
    icon: Mic,
    permissions: [
      "Émissions assignées",
      "Messages",
      "Dédicaces",
    ],
  },
  ANALYST: {
    label: "Analyste",
    color: "bg-orange-500",
    icon: BarChart3,
    permissions: [
      "Lecture analytics",
      "Rapports",
      "Export",
    ],
  },
  ADVERTISER: {
    label: "Annonceur",
    color: "bg-pink-500",
    icon: Megaphone,
    permissions: [
      "Campagnes",
      "Statistiques pub",
    ],
  },
};

const allPermissions = [
  { id: "dashboard.view", label: "Voir le dashboard", category: "Dashboard" },
  { id: "streaming.manage", label: "Gérer le streaming", category: "Streaming" },
  { id: "programs.manage", label: "Gérer les programmes", category: "Programmes" },
  { id: "shows.manage", label: "Gérer les émissions", category: "Émissions" },
  { id: "shows.host", label: "Animer des émissions", category: "Émissions" },
  { id: "podcasts.manage", label: "Gérer les podcasts", category: "Podcasts" },
  { id: "messages.read", label: "Lire les messages", category: "Messages" },
  { id: "messages.reply", label: "Répondre aux messages", category: "Messages" },
  { id: "dedications.manage", label: "Gérer les dédicaces", category: "Dédicaces" },
  { id: "polls.manage", label: "Gérer les sondages", category: "Sondages" },
  { id: "analytics.view", label: "Voir les analytics", category: "Analytics" },
  { id: "analytics.export", label: "Exporter les rapports", category: "Analytics" },
  { id: "ads.manage", label: "Gérer les publicités", category: "Publicités" },
  { id: "users.manage", label: "Gérer les utilisateurs", category: "Utilisateurs" },
  { id: "settings.manage", label: "Gérer les paramètres", category: "Paramètres" },
  { id: "billing.view", label: "Voir la facturation", category: "Facturation" },
  { id: "billing.manage", label: "Gérer la facturation", category: "Facturation" },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<"users" | "invitations" | "roles">("users");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const activeUsers = users.filter((u) => u.status === "active").length;
  const pendingInvites = invitations.filter((i) => i.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Utilisateurs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gérez les membres de votre radio et leurs permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserPlus className="w-4 h-4 mr-2" />
            Inviter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.length}
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
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeUsers}
                </div>
                <div className="text-sm text-gray-500">Actifs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingInvites}
                </div>
                <div className="text-sm text-gray-500">Invitations</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Object.keys(roleConfig).length}
                </div>
                <div className="text-sm text-gray-500">Rôles</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <Button
          variant={activeTab === "users" ? "default" : "ghost"}
          onClick={() => setActiveTab("users")}
        >
          <UsersIcon className="w-4 h-4 mr-2" />
          Membres
        </Button>
        <Button
          variant={activeTab === "invitations" ? "default" : "ghost"}
          onClick={() => setActiveTab("invitations")}
        >
          <Mail className="w-4 h-4 mr-2" />
          Invitations
        </Button>
        <Button
          variant={activeTab === "roles" ? "default" : "ghost"}
          onClick={() => setActiveTab("roles")}
        >
          <Key className="w-4 h-4 mr-2" />
          Rôles & Permissions
        </Button>
      </div>

      {activeTab === "users" && (
        <>
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Rechercher un utilisateur..." className="pl-10" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Rôle
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    Statut
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Utilisateur</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Rôle</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Dernière activité</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Membre depuis</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const role = roleConfig[user.role];
                      const RoleIcon = role.icon;

                      return (
                        <tr
                          key={user.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                          onClick={() => setSelectedUser(user.id)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary" className="gap-1">
                              <div className={`w-2 h-2 rounded-full ${role.color}`} />
                              {role.label}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={user.status === "active" ? "default" : "secondary"}
                              className={
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                            >
                              {user.status === "active" ? "Actif" : "Inactif"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {new Date(user.lastActive).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="py-3 px-4 text-gray-500">{user.joinedAt}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "invitations" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invitations en attente</CardTitle>
            <Button size="sm">
              <Send className="w-4 h-4 mr-2" />
              Nouvelle invitation
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {invite.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {roleConfig[invite.role].label} • Invité par {invite.invitedBy}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Envoyé le {new Date(invite.sentAt).toLocaleDateString("fr-FR")} •
                        Expire le {new Date(invite.expiresAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        invite.status === "pending" ? "secondary" : "outline"
                      }
                    >
                      {invite.status === "pending" ? "En attente" : "Expirée"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "roles" && (
        <div className="space-y-6">
          {/* Roles Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(roleConfig).map(([key, role]) => {
              const RoleIcon = role.icon;
              const memberCount = users.filter((u) => u.role === key).length;

              return (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${role.color}/20`}>
                          <RoleIcon className={`w-5 h-5 ${role.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{role.label}</CardTitle>
                          <div className="text-xs text-gray-500">
                            {memberCount} membre{memberCount !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {role.permissions.map((perm) => (
                        <div
                          key={perm}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          {perm}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Permissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Matrice des permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Permission
                      </th>
                      {Object.values(roleConfig).map((role) => (
                        <th
                          key={role.label}
                          className="text-center py-3 px-2 font-medium text-gray-500"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${role.color}`} />
                            <span className="text-xs">{role.label}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allPermissions.map((perm) => (
                      <tr
                        key={perm.id}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="py-3 px-4">
                          <div className="text-gray-900 dark:text-white">{perm.label}</div>
                          <div className="text-xs text-gray-400">{perm.category}</div>
                        </td>
                        {Object.entries(roleConfig).map(([key, role]) => {
                          const hasPerm =
                            key === "RADIO_OWNER" ||
                            (key === "RADIO_ADMIN" && !perm.id.includes("billing")) ||
                            (key === "EDITOR" &&
                              ["shows", "podcasts", "messages", "programs"].some(
                                (p) => perm.id.startsWith(p)
                              )) ||
                            (key === "HOST" &&
                              ["shows.host", "messages.read", "messages.reply", "dedications"].some(
                                (p) => perm.id.startsWith(p)
                              )) ||
                            (key === "ANALYST" &&
                              perm.id.startsWith("analytics")) ||
                            (key === "ADVERTISER" && perm.id.startsWith("ads"));

                          return (
                            <td key={key} className="text-center py-3 px-2">
                              {hasPerm ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-auto" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
