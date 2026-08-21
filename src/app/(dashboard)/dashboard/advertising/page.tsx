"use client";

import { useMyRadio, useCampaigns } from "@/hooks/use-radio-data";
import { Megaphone, TrendingUp, Eye, MousePointer, DollarSign } from "lucide-react";

export default function AdvertisingPage() {
  const { radio } = useMyRadio();
  const { data: campaigns } = useCampaigns(radio?.id || null);

  const activeCampaigns = campaigns?.filter((c) => c.status === "active") || [];
  const totalImpressions = campaigns?.reduce((sum, c) => sum + (c.impressions || 0), 0) || 0;
  const totalBudget = campaigns?.reduce((sum, c) => sum + (c.budget || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Publicités</h1>
        <p className="text-gray-500 mt-1">Gérez vos campagnes publicitaires</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-500">Campagnes</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{campaigns?.length || 0}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-gray-500">Actives</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{activeCampaigns.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-500">Impressions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-gray-500">Budget total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalBudget.toLocaleString()} FCFA</div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Campagnes ({campaigns?.length || 0})</h3>
        </div>
        {campaigns && campaigns.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(campaign.start_date).toLocaleDateString("fr-FR")} — {new Date(campaign.end_date).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{campaign.budget.toLocaleString()} FCFA</div>
                    <div className="text-sm text-gray-500">{campaign.impressions.toLocaleString()} impressions</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-gray-600 font-medium">Aucune campagne</p>
            <p className="text-sm mt-1">Créez votre première campagne publicitaire</p>
          </div>
        )}
      </div>
    </div>
  );
}
