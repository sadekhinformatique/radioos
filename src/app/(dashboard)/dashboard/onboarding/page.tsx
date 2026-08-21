"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Radio,
  Globe,
  Music,
  Users,
  Zap,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const supabase = createClient();

const steps = [
  { id: 1, title: "Votre radio", icon: Radio, description: "Nom et identité" },
  { id: 2, title: "Localisation", icon: Globe, description: "Pays et ville" },
  { id: 3, title: "Type de radio", icon: Music, description: "Catégorie et style" },
  { id: 4, title: "Votre flux", icon: Zap, description: "URL de streaming" },
  { id: 5, title: "Équipe", icon: Users, description: "Présentateurs" },
];

const radioTypes = [
  { id: "general", label: "Généraliste", emoji: "📻", description: "Tous genres, toute audience" },
  { id: "music", label: "Musique", emoji: "🎵", description: "Pop, rock, Afrobeats, etc." },
  { id: "news", label: "Info/News", emoji: "📰", description: "Actualités et débats" },
  { id: "sport", label: "Sport", emoji: "⚽", description: "Football, basketball, etc." },
  { id: "culture", label: "Culture", emoji: "🎭", description: "Art, littérature, cinéma" },
  { id: "religious", label: "Religieux", emoji: "🕌", description: "Spiritualité et foi" },
  { id: "youth", label: "Jeunes", emoji: "🎉", description: "Pour les 15-30 ans" },
  { id: "local", label: "Local", emoji: "🏘️", description: "Communauté locale" },
];

const countries = [
  "Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Guinée",
  "Cameroun", "Bénin", "Niger", "Togo", "Congo", "Gabon",
  "RDC", "Madagascar", "Maroc", "Tunisie", "Algérie",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [existingRadio, setExistingRadio] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    country: "",
    city: "",
    radioType: "",
    streamUrl: "",
    streamType: "icecast",
    presenterName: "",
  });

  // Check if user already has a radio
  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: membership } = await supabase
        .from("radio_members")
        .select("radio_id")
        .eq("user_id", user.id)
        .single();

      if (membership) {
        setExistingRadio(true);
      }
    }
    check();
  }, [router]);

  // Auto-generate slug from name
  useEffect(() => {
    if (form.name) {
      const slug = form.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setForm((f) => ({ ...f, slug }));
    }
  }, [form.name]);

  if (existingRadio) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Check className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Radio déjà configurée !</h2>
          <p className="text-gray-500 mb-4">Votre radio est prête.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Aller au dashboard →
          </button>
        </div>
      </div>
    );
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return form.name.length >= 2;
      case 2: return form.country.length > 0;
      case 3: return form.radioType.length > 0;
      case 4: return true; // Stream is optional
      case 5: return true;
      default: return false;
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      // Create radio
      const { data: radio, error: radioError } = await supabase
        .from("radios")
        .insert({
          name: form.name,
          slug: form.slug,
          description: form.description || `${form.name} - Radio en ligne`,
          country: form.country,
          city: form.city,
          status: "active",
          owner_id: user.id,
        })
        .select()
        .single();

      if (radioError) throw radioError;

      // Add user as owner
      await supabase.from("radio_members").insert({
        radio_id: radio.id,
        user_id: user.id,
        role: "owner",
      });

      // Add stream if provided
      if (form.streamUrl) {
        await supabase.from("streams").insert({
          radio_id: radio.id,
          stream_url: form.streamUrl,
          stream_type: form.streamType,
          bitrate: 128,
          codec: "mp3",
          status: "offline",
          is_backup: false,
        });
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating radio:", err);
      alert("Erreur lors de la création. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Créez votre radio 🎙️</h1>
        <p className="text-gray-500 mt-2">Quelques étapes pour démarrer</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                currentStep > step.id
                  ? "bg-emerald-500 text-white"
                  : currentStep === step.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-12 h-1 mx-1 ${currentStep > step.id ? "bg-emerald-500" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {/* Step 1: Name */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Quel est le nom de votre radio ?</h2>
              <p className="text-gray-500 text-sm">C&apos;est le nom que vos auditeurs verront</p>
            </div>
            <div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ex: Radio OSFM, Africa Hit, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              {form.slug && (
                <p className="mt-2 text-sm text-gray-500">
                  URL publique : <span className="font-mono text-blue-600">radioos.com/radio/{form.slug}</span>
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Décrivez votre radio en quelques mots..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Où se trouve votre radio ?</h2>
              <p className="text-gray-500 text-sm">Aide les auditeurs à vous trouver</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
              <div className="grid grid-cols-3 gap-2">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => setForm({ ...form, country })}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      form.country === country
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="ex: Dakar, Abidjan, Bamako..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Radio Type */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Quel type de radio ?</h2>
              <p className="text-gray-500 text-sm">Choisissez la catégorie principale</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {radioTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setForm({ ...form, radioType: type.id })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.radioType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">{type.emoji}</div>
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Stream */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Connectez votre flux audio</h2>
              <p className="text-gray-500 text-sm">Vous pouvez le faire plus tard aussi</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL du flux</label>
              <input
                type="url"
                value={form.streamUrl}
                onChange={(e) => setForm({ ...form, streamUrl: e.target.value })}
                placeholder="http://stream.example.com:8000/stream"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de serveur</label>
              <div className="flex gap-3">
                {["icecast", "shoutcast", "hls"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setForm({ ...form, streamType: type })}
                    className={`flex-1 p-3 rounded-lg border-2 font-medium text-sm transition-colors ${
                      form.streamType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
              💡 Pas de flux ? Pas de problème ! Vous pouvez ajouter votre stream plus tard depuis les paramètres.
            </div>
          </div>
        )}

        {/* Step 5: Team */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Ajoutez votre équipe</h2>
              <p className="text-gray-500 text-sm">Vous pouvez inviter des membres plus tard</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom (présentateur)</label>
              <input
                type="text"
                value={form.presenterName}
                onChange={(e) => setForm({ ...form, presenterName: e.target.value })}
                placeholder="Votre nom"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
              ✨ Vous pourrez inviter des présentateurs, producteurs et administrateurs depuis la page Équipe.
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-gray-900">Résumé :</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📻 <strong>{form.name}</strong></p>
                <p>🌍 {form.country}{form.city ? `, ${form.city}` : ""}</p>
                <p>🎵 {radioTypes.find((t) => t.id === form.radioType)?.label || "Non défini"}</p>
                {form.streamUrl && <p>🔊 Flux connecté</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </button>
        {currentStep < 5 ? (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canProceed()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                Créer ma radio 🚀
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
