"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Settings,
  Radio,
  Bell,
  Users,
  Save,
  Upload,
  Globe,
  Clock,
  Mail,
  Smartphone,
  Volume2,
  Link,
  Wifi,
  WifiOff,
  Shield,
  Key,
  Trash2,
  Plus,
  Edit,
  Check,
  X,
  Eye,
  EyeOff,
  ExternalLink,
  Copy,
  RefreshCw,
  AlertTriangle,
  Info,
  Image,
} from "lucide-react";

type Tab = "profile" | "stream" | "notifications" | "team";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profil Radio", icon: Radio },
  { id: "stream", label: "Streaming", icon: Wifi },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Équipe", icon: Users },
];

const notificationSettings = [
  {
    id: "stream_offline",
    label: "Stream hors ligne",
    description: "Alerte quand le flux audio est interrompu",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "stream_restored",
    label: "Stream rétabli",
    description: "Notification quand le flux revient en ligne",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "new_message",
    label: "Nouveau message",
    description: "Quand un auditeur envoie un message",
    email: false,
    push: true,
    sms: false,
  },
  {
    id: "new_dedication",
    label: "Nouvelle dédicace",
    description: "Quand une demande de dédicace est reçue",
    email: false,
    push: true,
    sms: false,
  },
  {
    id: "new_campaign",
    label: "Nouvelle campagne",
    description: "Quand une campagne publicitaire est créée",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "payment_received",
    label: "Paiement reçu",
    description: "Confirmation de paiement",
    email: true,
    push: true,
    sms: true,
  },
  {
    id: "subscription_expiring",
    label: "Abonnement expirant",
    description: "Rappel avant expiration de l'abonnement",
    email: true,
    push: true,
    sms: true,
  },
  {
    id: "audience_spike",
    label: "Pic d'audience",
    description: "Alerte quand l'audience dépasse un seuil",
    email: false,
    push: true,
    sms: false,
  },
];

const teamMembers = [
  { id: "1", name: "Amadou Diallo", email: "amadou@radioos.sn", role: "Propriétaire", status: "active", online: true },
  { id: "2", name: "Fatima Sy", email: "fatima@radioos.sn", role: "Administrateur", status: "active", online: true },
  { id: "3", name: "Ibrahim Cissé", email: "ibrahim@radioos.sn", role: "Animateur", status: "active", online: false },
  { id: "4", name: "Aïssatou Ndiaye", email: "aissatou@radioos.sn", role: "Animateur", status: "active", online: false },
  { id: "5", name: "Moussa Sow", email: "moussa@radioos.sn", role: "Éditeur", status: "active", online: true },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState(notificationSettings);

  const toggleNotification = (id: string, channel: "email" | "push" | "sms") => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, [channel]: !n[channel] } : n
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paramètres
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Configurez votre radio et vos préférences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la radio</CardTitle>
              <CardDescription>
                Modifiez les informations publiques de votre station
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                  R
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Changer le logo
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG ou SVG. 512x512px recommandé.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nom de la radio
                  </label>
                  <Input defaultValue="RadioOS FM" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Slug (URL publique)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">/radio/</span>
                    <Input defaultValue="radioos-fm" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pays
                  </label>
                  <Input defaultValue="Sénégal" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ville
                  </label>
                  <Input defaultValue="Dakar" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Langues
                  </label>
                  <Input defaultValue="Français, Wolof" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fuseau horaire
                  </label>
                  <Input defaultValue="Africa/Dakar (GMT+0)" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  className="w-full h-24 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="RadioOS FM - La station qui vous connecte à l'Afrique. Musique, info, culture et divertissement 24h/24."
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Coordonnées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email de contact
                  </label>
                  <Input defaultValue="contact@radioos.sn" type="email" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Téléphone
                  </label>
                  <Input defaultValue="+221 77 123 45 67" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site web
                  </label>
                  <Input defaultValue="https://radioos.sn" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    WhatsApp
                  </label>
                  <Input defaultValue="+221 77 123 45 67" />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Réseaux sociaux
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Facebook URL" defaultValue="https://facebook.com/radioos" />
                  <Input placeholder="X (Twitter) URL" defaultValue="https://x.com/radioos" />
                  <Input placeholder="Instagram URL" defaultValue="" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO & Métadonnées</CardTitle>
              <CardDescription>
                Configurez l&apos;apparence de votre page dans les moteurs de recherche
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Titre Meta
                </label>
                <Input defaultValue="RadioOS FM - Radio en ligne Sénégal" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description Meta
                </label>
                <textarea
                  className="w-full h-16 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="Écoutez RadioOS FM en direct. Musique africaine, info, culture et divertissement. Rejoignez notre communauté d'auditeurs."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      )}

      {/* Stream Tab */}
      {activeTab === "stream" && (
        <div className="space-y-6">
          {/* Primary Stream */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Flux principal</CardTitle>
                  <CardDescription>
                    Configurez votre source audio principale
                  </CardDescription>
                </div>
                <Badge variant="default" className="bg-green-500">
                  <Wifi className="w-3 h-3 mr-1" />
                  Connecté
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL du flux
                  </label>
                  <Input defaultValue="http://stream.radioos.sn:8000/live" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type de flux
                  </label>
                  <Input defaultValue="Icecast / SHOUTcast" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Codec
                  </label>
                  <Input defaultValue="MP3" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bitrate
                  </label>
                  <Input defaultValue="128 kbps" disabled />
                </div>
              </div>

              {/* Connection Info */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Statut</span>
                  <span className="flex items-center gap-2 text-green-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    En ligne
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Latence</span>
                  <span className="text-gray-900 dark:text-white">45ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Dernière vérification</span>
                  <span className="text-gray-900 dark:text-white">Il y a 30s</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Uptime</span>
                  <span className="text-gray-900 dark:text-white">99.8% (30 jours)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tester la connexion
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir le flux
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup Stream */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Flux de secours</CardTitle>
                  <CardDescription>
                    Source alternative en cas de panne du flux principal
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Non configuré
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL du flux de secours
                  </label>
                  <Input placeholder="http://backup.stream.example.com/live" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Basculer automatiquement
                  </label>
                  <div className="flex items-center gap-3 h-10">
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                    </button>
                    <span className="text-sm text-gray-500">
                      Désactivé
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Key */}
          <Card>
            <CardHeader>
              <CardTitle>Clé API du stream</CardTitle>
              <CardDescription>
                Utilisez cette clé pour connecter des applications tierces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    defaultValue="rso_sk_live_abc123def456ghi789jkl012mno345"
                    readOnly
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  Copier
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Régénérer
                </Button>
              </div>
              <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Ne partagez jamais cette clé publiquement. Elle donne accès à votre flux audio.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Bitrate Options */}
          <Card>
            <CardHeader>
              <CardTitle>Qualités disponibles</CardTitle>
              <CardDescription>
                Les auditeurs pourront choisir parmi ces qualités
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { bitrate: "128 kbps", label: "Haute qualité", default: true },
                  { bitrate: "64 kbps", label: "Qualité standard", default: true },
                  { bitrate: "32 kbps", label: "Économique (données mobiles)", default: true },
                ].map((q) => (
                  <div
                    key={q.bitrate}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {q.bitrate}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          — {q.label}
                        </span>
                      </div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Canaux de notification</CardTitle>
              <CardDescription>
                Activez ou désactivez les canaux pour tous les événements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Événement
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">
                        <Mail className="w-4 h-4 mx-auto" />
                        Email
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">
                        <Bell className="w-4 h-4 mx-auto" />
                        Push
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">
                        <Smartphone className="w-4 h-4 mx-auto" />
                        SMS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((n) => (
                      <tr
                        key={n.id}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {n.label}
                          </div>
                          <div className="text-xs text-gray-500">{n.description}</div>
                        </td>
                        {(["email", "push", "sms"] as const).map((channel) => (
                          <td key={channel} className="text-center py-3 px-4">
                            <button
                              onClick={() => toggleNotification(n.id, channel)}
                              className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                n[channel] ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  n[channel] ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Heures de silence</CardTitle>
              <CardDescription>
                Désactivez les notifications push pendant ces heures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                  </button>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Activer
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="time" defaultValue="22:00" className="w-32" />
                  <span className="text-gray-500">à</span>
                  <Input type="time" defaultValue="07:00" className="w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audience Alert Threshold */}
          <Card>
            <CardHeader>
              <CardTitle>Seuil d&apos;alerte d&apos;audience</CardTitle>
              <CardDescription>
                Recevez une alerte quand l&apos;audience dépasse ce seuil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                  </button>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Activer
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Plus de</span>
                  <Input type="number" defaultValue="2000" className="w-24" />
                  <span className="text-sm text-gray-500">auditeurs simultanés</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Membres de l&apos;équipe
              </h2>
              <p className="text-sm text-gray-500">
                {teamMembers.length} membre{teamMembers.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Inviter un membre
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${
                            member.online ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{member.role}</Badge>
                      <div className="flex items-center gap-1">
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
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rôles disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Propriétaire", desc: "Accès total, gestion facturation", color: "bg-yellow-500" },
                  { name: "Administrateur", desc: "Gestion complète sauf facturation", color: "bg-blue-500" },
                  { name: "Éditeur", desc: "Émissions, podcasts, messages", color: "bg-purple-500" },
                  { name: "Animateur", desc: "Ses émissions, messages, dédicaces", color: "bg-green-500" },
                  { name: "Analyste", desc: "Lecture analytics et rapports", color: "bg-orange-500" },
                  { name: "Annonceur", desc: "Campagnes et stats publicitaires", color: "bg-pink-500" },
                ].map((role) => (
                  <div
                    key={role.name}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className={`w-3 h-3 rounded-full ${role.color} mt-1`} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {role.name}
                      </div>
                      <div className="text-xs text-gray-500">{role.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
