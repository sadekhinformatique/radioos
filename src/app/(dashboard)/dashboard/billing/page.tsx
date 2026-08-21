"use client";

import { useState } from "react";
import {
  CreditCard,
  Check,
  Star,
  ArrowRight,
  Download,
  Receipt,
  Smartphone,
  Wallet,
  AlertCircle,
  Clock,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Headphones,
  FileText,
  Users,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Banknote,
  Building2,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    id: "starter",
    name: "Starter",
    nameAr: "Débutant",
    description: "Pour les radios qui démarrent",
    price: 0,
    currency: "FCFA",
    period: "/mois",
    popular: false,
    color: "gray",
    features: [
      { text: "1 radio", included: true },
      { text: "Streaming basique (Icecast/Shoutcast)", included: true },
      { text: "100 auditeurs max", included: true },
      { text: "5 podcasts / mois", included: true },
      { text: "Messages auditeurs", included: true },
      { text: "Page publique", included: true },
      { text: "Analytics basiques", included: true },
      { text: "Support email", included: true },
      { text: "Analytics avancés", included: false },
      { text: "Publicités", included: false },
      { text: "Dédicaces & Sondages", included: false },
      { text: "API", included: false },
    ],
  },
  {
    id: "pro",
    name: "Professionnel",
    description: "Pour les radios établies",
    price: 25000,
    currency: "FCFA",
    period: "/mois",
    popular: true,
    color: "blue",
    features: [
      { text: "1 radio", included: true },
      { text: "Tous les types de flux", included: true },
      { text: "1 000 auditeurs", included: true },
      { text: "Podcasts illimités", included: true },
      { text: "Messages avancés", included: true },
      { text: "Page publique premium", included: true },
      { text: "Analytics avancés", included: true },
      { text: "Publicités", included: true },
      { text: "Dédicaces & Sondages", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Export de données", included: true },
      { text: "API", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Pour les groupes de radios",
    price: 75000,
    currency: "FCFA",
    period: "/mois",
    popular: false,
    color: "purple",
    features: [
      { text: "Multi-radios (illimité)", included: true },
      { text: "Tous types de flux + API", included: true },
      { text: "Auditeurs illimités", included: true },
      { text: "Podcasts illimités", included: true },
      { text: "Toutes fonctionnalités", included: true },
      { text: "Page publique white-label", included: true },
      { text: "Analytics premium", included: true },
      { text: "Publicités illimitées", included: true },
      { text: "API complète", included: true },
      { text: "Support dédié (24/7)", included: true },
      { text: "SLA garanti 99.9%", included: true },
      { text: "Intégrations custom", included: true },
    ],
  },
];

const paymentHistory = [
  {
    id: "INV-2026-001",
    date: "2026-08-15",
    amount: 25000,
    currency: "FCFA",
    method: "Orange Money",
    methodIcon: "🟠",
    status: "paid",
    description: "Abonnement Professionnel - Août 2026",
    reference: "OM-20260815-4829",
  },
  {
    id: "INV-2026-002",
    date: "2026-07-15",
    amount: 25000,
    currency: "FCFA",
    method: "Wave",
    methodIcon: "🔵",
    status: "paid",
    description: "Abonnement Professionnel - Juillet 2026",
    reference: "WV-20260715-3847",
  },
  {
    id: "INV-2026-003",
    date: "2026-06-15",
    amount: 25000,
    currency: "FCFA",
    method: "Mobile Money",
    methodIcon: "📱",
    status: "paid",
    description: "Abonnement Professionnel - Juin 2026",
    reference: "MM-20260615-2938",
  },
  {
    id: "INV-2026-004",
    date: "2026-05-15",
    amount: 25000,
    currency: "FCFA",
    method: "Orange Money",
    methodIcon: "🟠",
    status: "paid",
    description: "Abonnement Professionnel - Mai 2026",
    reference: "OM-20260515-1847",
  },
  {
    id: "INV-2026-005",
    date: "2026-04-15",
    amount: 25000,
    currency: "FCFA",
    method: "MTN Mobile Money",
    methodIcon: "🟡",
    status: "paid",
    description: "Abonnement Professionnel - Avril 2026",
    reference: "MTN-20260415-0736",
  },
];

const mobileMoneyProviders = [
  {
    id: "orange",
    name: "Orange Money",
    icon: "🟠",
    color: "bg-orange-500",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    countries: ["Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Cameroun"],
    fees: "1.5%",
    maxAmount: "500 000 FCFA",
    processingTime: "Instantané",
  },
  {
    id: "wave",
    name: "Wave",
    icon: "🔵",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    countries: ["Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso"],
    fees: "1%",
    maxAmount: "1 000 000 FCFA",
    processingTime: "Instantané",
  },
  {
    id: "mtn",
    name: "MTN Mobile Money",
    icon: "🟡",
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    countries: ["Cameroun", "Côte d'Ivoire", "Burkina Faso", "Guinée"],
    fees: "2%",
    maxAmount: "300 000 FCFA",
    processingTime: "1-2 minutes",
  },
  {
    id: "moov",
    name: "Moov Money",
    icon: "🔷",
    color: "bg-indigo-500",
    textColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    countries: ["Bénin", "Burkina Faso", "Niger", "Togo"],
    fees: "1.8%",
    maxAmount: "200 000 FCFA",
    processingTime: "Instantané",
  },
];

const invoices = [
  {
    id: "INV-2026-001",
    date: "2026-08-15",
    amount: 25000,
    tax: 0,
    total: 25000,
    status: "paid",
    dueDate: "2026-08-15",
    paidDate: "2026-08-15",
  },
  {
    id: "INV-2026-002",
    date: "2026-07-15",
    amount: 25000,
    tax: 0,
    total: 25000,
    status: "paid",
    dueDate: "2026-07-15",
    paidDate: "2026-07-15",
  },
  {
    id: "INV-2026-003",
    date: "2026-06-15",
    amount: 25000,
    tax: 0,
    total: 25000,
    status: "paid",
    dueDate: "2026-06-15",
    paidDate: "2026-06-15",
  },
  {
    id: "INV-2026-004",
    date: "2026-05-15",
    amount: 25000,
    tax: 0,
    total: 25000,
    status: "paid",
    dueDate: "2026-05-15",
    paidDate: "2026-05-15",
  },
  {
    id: "INV-2026-005",
    date: "2026-04-15",
    amount: 25000,
    tax: 0,
    total: 25000,
    status: "paid",
    dueDate: "2026-04-15",
    paidDate: "2026-04-15",
  },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<"plans" | "history" | "payment" | "invoices">("plans");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("25000");

  const currentPlan = plans[1]; // Pro plan

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Payé
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Échoué
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturation & Abonnement</h1>
          <p className="text-gray-500 mt-1">
            Gérez votre abonnement, effectuez des paiements et consultez votre historique
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
            <Star className="w-4 h-4 mr-1" />
            Plan {currentPlan.name}
          </Badge>
        </div>
      </div>

      {/* Current Plan Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Plan actuel</span>
            </div>
            <h2 className="text-2xl font-bold">{currentPlan.name}</h2>
            <p className="text-blue-100 mt-1">
              Renouvellement automatique le 15 septembre 2026
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{formatAmount(currentPlan.price)}</div>
            <div className="text-blue-200">{currentPlan.currency}{currentPlan.period}</div>
            <div className="mt-3 flex items-center gap-2 text-sm text-blue-100">
              <Clock className="w-4 h-4" />
              <span>24 jours restants</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Headphones className="w-4 h-4" />
            <span>1 000 auditeurs max</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4" />
            <span>Podcasts illimités</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics avancés</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: "plans", label: "Comparer les plans", icon: Star },
            { id: "payment", label: "Effectuer un paiement", icon: CreditCard },
            { id: "history", label: "Historique des paiements", icon: Clock },
            { id: "invoices", label: "Factures", icon: Receipt },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Plans Comparison Tab */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${billingCycle === "monthly" ? "font-medium text-gray-900" : "text-gray-500"}`}>
              Mensuel
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                billingCycle === "annual" ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  billingCycle === "annual" ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === "annual" ? "font-medium text-gray-900" : "text-gray-500"}`}>
              Annuel
              <Badge className="ml-2 bg-emerald-100 text-emerald-700 border-emerald-200">-20%</Badge>
            </span>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const annualPrice = Math.round(plan.price * 0.8);
              const displayPrice = billingCycle === "annual" ? annualPrice : plan.price;
              const isCurrentPlan = plan.id === currentPlan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                    plan.popular
                      ? "border-blue-500 shadow-lg"
                      : isCurrentPlan
                      ? "border-emerald-500"
                      : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Le plus populaire
                      </Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-emerald-600 text-white px-4 py-1">
                        <Check className="w-3 h-3 mr-1" />
                        Plan actuel
                      </Badge>
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{plan.description}</p>

                    <div className="mt-4 flex items-baseline gap-1">
                      {plan.price === 0 ? (
                        <span className="text-4xl font-bold text-gray-900">Gratuit</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-gray-900">
                            {formatAmount(displayPrice)}
                          </span>
                          <span className="text-gray-500">{plan.currency}</span>
                        </>
                      )}
                      {plan.price > 0 && (
                        <span className="text-gray-500 text-sm">{plan.period}</span>
                      )}
                    </div>
                    {billingCycle === "annual" && plan.price > 0 && (
                      <p className="text-sm text-emerald-600 mt-1">
                        Économisez {formatAmount(Math.round(plan.price * 12 * 0.2))} FCFA/an
                      </p>
                    )}

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          {feature.included ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm ${
                              feature.included ? "text-gray-700" : "text-gray-400"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        isCurrentPlan
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : plan.popular
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? (
                        "Plan actuel"
                      ) : plan.price === 0 ? (
                        "Commencer gratuitement"
                      ) : (
                        <>
                          Choisir {plan.name}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Comparaison détaillée des fonctionnalités</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Fonctionnalité</th>
                    <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Starter</th>
                    <th className="text-center px-6 py-3 text-sm font-medium text-blue-600">Professionnel</th>
                    <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Auditeurs simultanés", starter: "100", pro: "1 000", enterprise: "Illimité" },
                    { name: "Radios", starter: "1", pro: "1", enterprise: "Illimité" },
                    { name: "Podcasts", starter: "5/mois", pro: "Illimité", enterprise: "Illimité" },
                    { name: "Messages", starter: "Basique", pro: "Avancé", enterprise: "Avancé + API" },
                    { name: "Analytics", starter: "Basiques", pro: "Avancés", enterprise: "Premium" },
                    { name: "Publicités", starter: "—", pro: "✓", enterprise: "Illimité" },
                    { name: "Dédicaces & Sondages", starter: "—", pro: "✓", enterprise: "✓" },
                    { name: "Support", starter: "Email", pro: "Prioritaire", enterprise: "24/7 Dédié" },
                    { name: "API", starter: "—", pro: "—", enterprise: "Complète" },
                    { name: "White-label", starter: "—", pro: "—", enterprise: "✓" },
                    { name: "SLA", starter: "—", pro: "99.5%", enterprise: "99.9%" },
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-3 text-sm text-gray-900">{row.name}</td>
                      <td className="px-6 py-3 text-sm text-center text-gray-600">{row.starter}</td>
                      <td className="px-6 py-3 text-sm text-center text-blue-600 font-medium">{row.pro}</td>
                      <td className="px-6 py-3 text-sm text-center text-gray-600">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === "payment" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mobile Money Payment */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Payer par Mobile Money</h3>
            </div>

            {/* Provider Selection */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-medium text-gray-700">Choisir un opérateur</label>
              <div className="grid grid-cols-2 gap-3">
                {mobileMoneyProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedProvider === provider.id
                        ? `${provider.borderColor} ${provider.bgColor}`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{provider.name}</div>
                        <div className="text-xs text-gray-500">Frais: {provider.fees}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedProvider && (
              <>
                {/* Provider Details */}
                <div className={`p-4 rounded-lg ${mobileMoneyProviders.find((p) => p.id === selectedProvider)?.bgColor} mb-6`}>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Frais de transaction</div>
                      <div className="font-medium text-gray-900">
                        {mobileMoneyProviders.find((p) => p.id === selectedProvider)?.fees}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Montant max</div>
                      <div className="font-medium text-gray-900">
                        {mobileMoneyProviders.find((p) => p.id === selectedProvider)?.maxAmount}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Délai de traitement</div>
                      <div className="font-medium text-gray-900">
                        {mobileMoneyProviders.find((p) => p.id === selectedProvider)?.processingTime}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Pays supportés</div>
                      <div className="font-medium text-gray-900">
                        {mobileMoneyProviders.find((p) => p.id === selectedProvider)?.countries.length} pays
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de téléphone
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+221 77 123 45 67"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant à payer (FCFA)
                    </label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        min="500"
                        step="500"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        FCFA
                      </span>
                    </div>
                  </div>

                  {/* Quick Amounts */}
                  <div className="flex gap-2">
                    {[25000, 50000, 75000, 100000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setPaymentAmount(amount.toString())}
                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                          paymentAmount === amount.toString()
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {formatAmount(amount)}
                      </button>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Payer maintenant
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    En cliquant, vous serez redirigé vers l&apos;interface de paiement Mobile Money
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Payment Methods & Info */}
          <div className="space-y-6">
            {/* Bank Transfer */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Virement bancaire</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Banque</span>
                  <span className="text-sm font-medium text-gray-900">Banque Atlantique Sénégal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">IBAN</span>
                  <span className="text-sm font-medium text-gray-900 font-mono">SN012 01001 00000789012345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">BIC/SWIFT</span>
                  <span className="text-sm font-medium text-gray-900 font-mono">ATLDSNDA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Bénéficiaire</span>
                  <span className="text-sm font-medium text-gray-900">RadioOS SARL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Référence</span>
                  <span className="text-sm font-medium text-blue-600 font-mono">RADIOS-2026-001</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Incluez la référence dans votre virement pour un traitement automatique
              </p>
            </div>

            {/* Payment Info */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Paiement sécurisé</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Chiffrement SSL 256 bits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Aucune donnée bancaire stockée
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Conforme PCI-DSS
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Remboursement sous 48h en cas d&apos;erreur
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Questions fréquentes</h3>
              <div className="space-y-4">
                {[
                  {
                    q: "Comment fonctionne le paiement Mobile Money ?",
                    a: "Sélectionnez votre opérateur, entrez votre numéro et le montant. Vous recevrez une demande de confirmation sur votre téléphone. Validez et le paiement est instantané.",
                  },
                  {
                    q: "Puis-je changer de plan à tout moment ?",
                    a: "Oui ! Vous pouvez upgrader ou downgrader à tout moment. Le changement prend effet immédiatement et la facturation est au prorata.",
                  },
                  {
                    q: "Comment obtenir un remboursement ?",
                    a: "Contactez notre support dans les 48h suivant le paiement. Nous traitons les remboursements sous 3-5 jours ouvrés.",
                  },
                ].map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{faq.q}</p>
                        <p className="text-sm text-gray-600 mt-1">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">Tous les statuts</option>
                  <option value="paid">Payé</option>
                  <option value="pending">En attente</option>
                  <option value="failed">Échoué</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">Tous les moyens</option>
                  <option value="orange">Orange Money</option>
                  <option value="wave">Wave</option>
                  <option value="mtn">MTN</option>
                </select>
              </div>
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exporter CSV
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Total payé (2026)</div>
                <div className="text-xl font-bold text-gray-900">{formatAmount(125000)} FCFA</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Dernier paiement</div>
                <div className="text-xl font-bold text-gray-900">15 Août 2026</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Moyenne / mois</div>
                <div className="text-xl font-bold text-gray-900">{formatAmount(25000)} FCFA</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Prochain paiement</div>
                <div className="text-xl font-bold text-blue-600">15 Sept 2026</div>
              </div>
            </div>
          </div>

          {/* Payment List */}
          <div className="divide-y divide-gray-100">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                      {payment.methodIcon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{payment.description}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{payment.method}</span>
                        <span>•</span>
                        <span>{payment.reference}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatAmount(payment.amount)} {payment.currency}</div>
                      <div className="text-sm text-gray-500">{formatDate(payment.date)}</div>
                    </div>
                    {getStatusBadge(payment.status)}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Factures</h3>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Tout télécharger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">N° Facture</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Description</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Montant HT</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">TVA</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900">{invoice.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">Abonnement Professionnel</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">{formatAmount(invoice.amount)} FCFA</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500">{formatAmount(invoice.tax)} FCFA</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                      {formatAmount(invoice.total)} FCFA
                    </td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(invoice.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Télécharger PDF">
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voir les détails">
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Affichage de 1 à 5 sur 5 factures
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Précédent
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
