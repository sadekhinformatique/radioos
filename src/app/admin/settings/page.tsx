"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Save,
  Shield,
  Globe,
  Mail,
  Bell,
  CreditCard,
  Database,
  Server,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Key,
  Lock,
} from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paramètres plateforme
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Configuration globale de RadioOS
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Général
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom de la plateforme
              </label>
              <Input defaultValue="RadioOS" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                URL principale
              </label>
              <Input defaultValue="https://radioos.sn" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email de support
              </label>
              <Input defaultValue="support@radioos.sn" type="email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fuseau horaire
              </label>
              <Input defaultValue="Africa/Dakar (GMT+0)" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Plans d&apos;abonnement
              </CardTitle>
              <CardDescription>
                Configurez les plans proposés aux radios
              </CardDescription>
            </div>
            <Button size="sm">
              Ajouter un plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "75,000",
                period: "mois",
                features: ["1 flux audio", "5 émissions", "10 podcasts", "Analytics basique", "Support email"],
                radioCount: 24,
                color: "border-blue-500",
              },
              {
                name: "Professional",
                price: "150,000",
                period: "mois",
                features: ["2 flux audio", "Émissions illimitées", "Podcasts illimités", "Analytics avancés", "Publicités", "Support prioritaire"],
                radioCount: 15,
                color: "border-purple-500",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "500,000",
                period: "mois",
                features: ["Flux illimités", "Tout du Professional", "API accès", "White-label", "Manager dédié", "SLA 99.9%"],
                radioCount: 3,
                color: "border-yellow-500",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-xl border-2 ${plan.color} ${
                  plan.popular ? "ring-2 ring-purple-500" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500">
                    Populaire
                  </Badge>
                )}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-500"> FCFA/{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-sm text-gray-500">
                  {plan.radioCount} radio{plan.radioCount !== 1 ? "s" : ""}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Modifier
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Authentification à deux facteurs</div>
              <div className="text-sm text-gray-500">Exiger le 2FA pour tous les Super Admin</div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Rotation automatique des clés API</div>
              <div className="text-sm text-gray-500">Rotation toutes les 90 jours</div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Rate limiting</div>
              <div className="text-sm text-gray-500">100 requêtes/minute par IP</div>
            </div>
            <Input defaultValue="100" className="w-24" />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <Download className="w-4 h-4 mr-2" />
              Exporter toutes les données
            </Button>
            <Button variant="outline" className="justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Importer des données
            </Button>
            <Button variant="outline" className="justify-start">
              <RefreshCw className="w-4 h-4 mr-2" />
              Vider le cache
            </Button>
            <Button variant="outline" className="justify-start">
              <Database className="w-4 h-4 mr-2" />
              Nettoyer les logs
            </Button>
          </div>
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-700 dark:text-red-400">
                Zone dangereuse
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  Mode maintenance
                </div>
                <div className="text-xs text-red-500">
                  Désactive l&apos;accès public à la plateforme
                </div>
              </div>
              <Button variant="destructive" size="sm">
                Activer
              </Button>
            </div>
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
  );
}
