"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Ban,
  CheckCircle2,
  Clock,
  Radio,
  Mail,
  Shield,
  Eye,
  ArrowUpRight,
  TrendingUp,
  UserPlus,
  Crown,
  Mic,
  BarChart3,
} from "lucide-react";

const allUsers = [
  { id: "1", name: "Amadou Diallo", email: "amadou@radioos.sn", role: "RADIO_OWNER", radio: "RadioOS FM", status: "active", lastActive: "2025-08-21T10:30:00", joinedAt: "2024-01-15" },
  { id: "2", name: "Fatima Sy", email: "fatima@radioos.sn", role: "RADIO_ADMIN", radio: "Radio Horizon", status: "active", lastActive: "2025-08-21T09:45:00", joinedAt: "2024-03-20" },
  { id: "3", name: "Ibrahim Cissé", email: "ibrahim@radioos.sn", role: "HOST", radio: "Radio Salam", status: "active", lastActive: "2025-08-20T18:00:00", joinedAt: "2024-06-10" },
  { id: "4", name: "Kofi Mensah", email: "kofi@woelab.tg", role: "RADIO_OWNER", radio: "Woelab Radio", status: "active", lastActive: "2025-08-21T08:00:00", joinedAt: "2024-06-05" },
  { id: "5", name: "Marie Koné", email: "marie@radio-univers.ci", role: "RADIO_OWNER", radio: "Radio Univers", status: "inactive", lastActive: "2025-08-15T14:00:00", joinedAt: "2024-02-28" },
  { id: "6", name: "Oumar Fall", email: "oumar@radioos.sn", role: "ANALYST", radio: "RadioOS FM", status: "active", lastActive: "2025-08-21T07:00:00", joinedAt: "2025-01-10" },
  { id: "7", name: "Aïcha Traoré", email: "aicha@radio-nostalgie.gn", role: "RADIO_OWNER", radio: "Radio Nostalgie", status: "active", lastActive: "2025-08-21T06:30:00", joinedAt: "2024-04-18" },
  { id: "8", name: "DJ Afro", email: "djafro@radioos.sn", role: "HOST", radio: "RadioOS FM", status: "inactive", lastActive: "2025-08-10T22:00:00", joinedAt: "2024-09-01" },
  { id: "9", name: "Moussa Diallo", email: "moussa@fm-express.bf", role: "RADIO_OWNER", radio: "FM Express", status: "active", lastActive: "2025-08-21T09:00:00", joinedAt: "2025-08-01" },
  { id: "10", name: "Pasteur Oumar", email: "oumar@gospel-plus.sn", role: "RADIO_OWNER", radio: "Radio Gospel Plus", status: "active", lastActive: "2025-08-20T20:00:00", joinedAt: "2024-08-12" },
];

const roleConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  RADIO_OWNER: { label: "Propriétaire", color: "bg-yellow-500", icon: Crown },
  RADIO_ADMIN: { label: "Admin", color: "bg-blue-500", icon: Shield },
  EDITOR: { label: "Éditeur", color: "bg-purple-500", icon: Edit },
  HOST: { label: "Animateur", color: "bg-green-500", icon: Mic },
  ANALYST: { label: "Analyste", color: "bg-orange-500", icon: BarChart3 },
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.radio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Utilisateurs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {allUsers.length} utilisateurs sur la plateforme
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Inviter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{allUsers.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {allUsers.filter((u) => u.status === "active").length}
              </div>
              <div className="text-sm text-gray-500">Actifs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">
                {allUsers.filter((u) => u.role === "RADIO_OWNER").length}
              </div>
              <div className="text-sm text-gray-500">Propriétaires</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {allUsers.filter((u) => u.role === "HOST").length}
              </div>
              <div className="text-sm text-gray-500">Animateurs</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher un utilisateur, email, radio..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Utilisateur</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Rôle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Radio</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Dernière activité</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const role = roleConfig[user.role] || { label: user.role, color: "bg-gray-500", icon: Shield };
                  const RoleIcon = role.icon;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="gap-1">
                          <RoleIcon className="w-3 h-3" />
                          {role.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Radio className="w-3 h-3" />
                          {user.radio}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={user.status === "active" ? "bg-green-100 text-green-700" : ""}
                        >
                          {user.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(user.lastActive).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500">
                            <Ban className="w-4 h-4" />
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
    </div>
  );
}
