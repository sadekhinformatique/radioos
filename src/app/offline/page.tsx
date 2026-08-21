'use client';

import { WifiOff, RefreshCw, Radio } from 'lucide-react';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Radio className="w-10 h-10 text-orange-500" />
          <span className="text-2xl font-bold text-gray-900">RadioOS</span>
        </div>

        {/* Offline Icon */}
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-12 h-12 text-orange-500" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Vous êtes hors ligne
        </h1>
        <p className="text-gray-600 mb-8">
          Il semble que vous n&apos;ayez pas de connexion internet.
          Vérifiez votre connexion et réessayez.
        </p>

        {/* Retry Button */}
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          <RefreshCw className="w-5 h-5" />
          Réessayer
        </button>

        {/* Tips */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Conseils :</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              Vérifiez votre connexion Wi-Fi
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              Activez les données mobiles
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              Redémarrez votre routeur
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
