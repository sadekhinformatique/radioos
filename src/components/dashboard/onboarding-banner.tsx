"use client";

import { Radio, ArrowRight } from "lucide-react";
import Link from "next/link";

export function OnboardingBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Radio className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Bienvenue sur RadioOS ! 🎙️</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Créez votre radio en quelques étapes simples pour commencer à diffuser.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/onboarding"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
        >
          Commencer
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
