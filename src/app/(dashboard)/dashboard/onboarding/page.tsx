"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Radio,
  Upload,
  Globe,
  MapPin,
  Languages,
  Link,
  Clock,
  Mail,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const steps = [
  { id: 1, title: "Nom de la radio", icon: Radio },
  { id: 2, title: "Logo", icon: Upload },
  { id: 3, title: "Pays", icon: Globe },
  { id: 4, title: "Ville", icon: MapPin },
  { id: 5, title: "Langues", icon: Languages },
  { id: 6, title: "URL du flux", icon: Link },
  { id: 7, title: "Type de flux", icon: Radio },
  { id: 8, title: "Fuseau horaire", icon: Clock },
  { id: 9, title: "Contact", icon: Mail },
  { id: 10, title: "Finaliser", icon: Check },
];

const checklist = [
  { label: "Compte créé", completed: true },
  { label: "Radio créée", completed: false },
  { label: "Flux connecté", completed: false },
  { label: "Logo ajouté", completed: false },
  { label: "Programme configuré", completed: false },
  { label: "Première émission créée", completed: false },
  { label: "Page publique publiée", completed: false },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: "",
    logo: null as File | null,
    country: "",
    city: "",
    languages: [] as string[],
    streamUrl: "",
    streamType: "",
    timezone: "",
    contactEmail: "",
    contactPhone: "",
  });

  const updateForm = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quel est le nom de votre radio ?
            </h3>
            <Input
              placeholder="Radio OSFM"
              value={formData.name}
              onChange={(e) => updateForm("name", e.target.value)}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Ajoutez le logo de votre radio
            </h3>
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors cursor-pointer">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Cliquez pour upload ou glissez-déposez
                </p>
                <p className="text-xs text-gray-400">PNG, JPG jusqu&apos;à 5MB</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Dans quel pays se trouve votre radio ?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Sénégal",
                "Côte d'Ivoire",
                "Mali",
                "Burkina Faso",
                "Cameroun",
                "Guinée",
                "Niger",
                "Tchad",
                "Togo",
                "Bénin",
                "RD Congo",
                "Congo",
                "Gabon",
                "Madagascar",
                "France",
                "Maroc",
                "Tunisie",
                "Algérie",
              ].map((country) => (
                <button
                  key={country}
                  onClick={() => updateForm("country", country)}
                  className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                    formData.country === country
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-800"
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Dans quelle ville ?
            </h3>
            <Input
              placeholder="Dakar"
              value={formData.city}
              onChange={(e) => updateForm("city", e.target.value)}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quelles langues parle votre radio ?
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Français", "Arabe", "Anglais", "Wolof", "Bambara", "Peul", "Dioula"].map(
                (lang) => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      formData.languages.includes(lang)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-800"
                    }`}
                  >
                    {lang}
                  </button>
                )
              )}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              URL de votre flux audio
            </h3>
            <Input
              placeholder="https://stream.votreradio.com/live"
              value={formData.streamUrl}
              onChange={(e) => updateForm("streamUrl", e.target.value)}
            />
            <p className="text-sm text-gray-500">
              L&apos;URL complète de votre flux (Icecast, Shoutcast, HLS, etc.)
            </p>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Type de flux
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {["Icecast", "Shoutcast", "AzuraCast", "HLS", "MP3 Direct", "AAC Direct", "Autre"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => updateForm("streamType", type)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      formData.streamType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-800"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Fuseau horaire
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {["GMT+0 (Dakar)", "GMT+1 (Abidjan)", "GMT+2 (Douala)", "GMT+3 (Antananarivo)"].map(
                (tz) => (
                  <button
                    key={tz}
                    onClick={() => updateForm("timezone", tz)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      formData.timezone === tz
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-800"
                    }`}
                  >
                    {tz}
                  </button>
                )
              )}
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Informations de contact
            </h3>
            <Input
              label="Email de contact"
              type="email"
              placeholder="contact@votreradio.com"
              value={formData.contactEmail}
              onChange={(e) => updateForm("contactEmail", e.target.value)}
            />
            <Input
              label="Téléphone"
              type="tel"
              placeholder="+221 77 123 45 67"
              value={formData.contactPhone}
              onChange={(e) => updateForm("contactPhone", e.target.value)}
            />
          </div>
        );
      case 10:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Récapitulatif
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nom</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formData.name || "Non renseigné"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pays</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formData.country || "Non renseigné"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ville</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formData.city || "Non renseigné"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Langues</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formData.languages.join(", ") || "Non renseigné"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Flux</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formData.streamType || "Non renseigné"}
                </span>
              </div>
            </div>
            <Button className="w-full" size="lg">
              Créer ma radio
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Configuration de votre radio
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Suivez les étapes pour configurer votre espace radio
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Steps Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      currentStep === step.id
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                        : step.id < currentStep
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        currentStep === step.id
                          ? "bg-blue-600 text-white"
                          : step.id < currentStep
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                      }`}
                    >
                      {step.id < currentStep ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span>{step.title}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        item.completed
                          ? "bg-green-100 text-green-600"
                          : "border border-gray-300"
                      }`}
                    >
                      {item.completed && <Check className="h-3 w-3" />}
                    </div>
                    <span
                      className={`text-sm ${
                        item.completed
                          ? "text-green-600 line-through"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {renderStep()}
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                {currentStep < 10 ? (
                  <Button
                    onClick={() => setCurrentStep((s) => Math.min(10, s + 1))}
                  >
                    Suivant
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button>Créer ma radio</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
