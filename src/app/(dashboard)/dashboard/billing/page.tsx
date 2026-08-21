"use client";

import { useMyRadio } from "@/hooks/use-radio-data";
import { CreditCard, Star, Check, Shield, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BillingPage() {
  const { radio } = useMyRadio();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facturation</h1>
        <p className="text-gray-500 mt-1">Gérez votre abonnement et vos paiements</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5" />
          <span className="text-sm opacity-90">Plan actuel</span>
        </div>
        <h2 className="text-2xl font-bold">Starter</h2>
        <p className="text-blue-100 mt-1">Plan gratuit — Aucune limite de temps</p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span>✓ 1 radio</span>
          <span>✓ Streaming basique</span>
          <span>✓ 100 auditeurs max</span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            name: "Starter",
            price: "0",
            features: ["1 radio", "Streaming basique", "100 auditeurs", "5 podcasts/mois", "Messages"],
            current: true,
          },
          {
            name: "Professionnel",
            price: "25 000",
            features: ["1 radio", "Tous types de flux", "1 000 auditeurs", "Podcasts illimités", "Analytics avancés", "Publicités"],
            popular: true,
          },
          {
            name: "Enterprise",
            price: "75 000",
            features: ["Multi-radios", "Auditeurs illimités", "API complète", "White-label", "Support dédié 24/7"],
          },
        ].map((plan) => (
          <div key={plan.name} className={`bg-white rounded-xl border p-6 ${plan.popular ? "border-blue-500 shadow-lg" : "border-gray-200"}`}>
            {plan.popular && <Badge className="bg-blue-600 text-white mb-4">Le plus populaire</Badge>}
            {plan.current && <Badge className="bg-emerald-100 text-emerald-700 mb-4">Plan actuel</Badge>}
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-500"> FCFA/mois</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-lg font-medium ${
                plan.current
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={plan.current}
            >
              {plan.current ? "Plan actuel" : "Choisir"}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-blue-600" />
          Moyens de paiement
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Orange Money", "Wave", "MTN Mobile Money", "Virement bancaire"].map((method) => (
            <div key={method} className="p-4 border border-gray-200 rounded-lg text-center">
              <span className="text-sm font-medium text-gray-700">{method}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
