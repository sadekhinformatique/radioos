"use client";

import { useState } from "react";
import { useMyRadio, useRadioMembers, createRecord, deleteRecord } from "@/hooks/use-radio-data";
import { Users, UserPlus, Shield, Trash2, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const roleLabels: Record<string, string> = {
  owner: "Propriétaire",
  admin: "Administrateur",
  editor: "Éditeur",
  presenter: "Présentateur",
  producer: "Producteur",
  viewer: "Observateur",
};

const roleColors: Record<string, string> = {
  owner: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  editor: "bg-emerald-100 text-emerald-700",
  presenter: "bg-orange-100 text-orange-700",
  producer: "bg-pink-100 text-pink-700",
  viewer: "bg-gray-100 text-gray-700",
};

export default function UsersPage() {
  const { radio } = useMyRadio();
  const { members, loading } = useRadioMembers(radio?.id || null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Équipe</h1>
          <p className="text-gray-500 mt-1">Gérez les membres de votre radio</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Inviter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Membres ({members.length})</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : members.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {members.map((member) => (
              <div key={member.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {member.user?.full_name?.charAt(0) || member.user?.email?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{member.user?.full_name || "Sans nom"}</div>
                    <div className="text-sm text-gray-500">{member.user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${roleColors[member.role] || "bg-gray-100 text-gray-700"}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {roleLabels[member.role] || member.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-gray-600 font-medium">Aucun membre</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Inviter un membre</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="editor">Éditeur</option>
                  <option value="presenter">Présentateur</option>
                  <option value="producer">Producteur</option>
                  <option value="admin">Administrateur</option>
                  <option value="viewer">Observateur</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInvite(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Annuler</button>
              <button onClick={() => setShowInvite(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Envoyer l&apos;invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
