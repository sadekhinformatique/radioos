"use client";

import { useMyRadio, useShows } from "@/hooks/use-radio-data";
import { Headphones, Clock, User, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default function ShowsPage() {
  const { radio } = useMyRadio();
  const { data: shows } = useShows(radio?.id || null);

  const groupedByDay = dayNames.map((name, idx) => ({
    name,
    shows: shows?.filter((s) => s.day_of_week === idx) || [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Émissions</h1>
        <p className="text-gray-500 mt-1">Programmation de vos émissions</p>
      </div>

      {shows && shows.length > 0 ? (
        <div className="space-y-6">
          {groupedByDay.map((day) => (
            <div key={day.name}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{day.name}</h2>
              {day.shows.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {day.shows.map((show) => (
                    <div key={show.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Headphones className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{show.title}</h3>
                          {show.description && <p className="text-sm text-gray-500 mt-1">{show.description}</p>}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {show.start_time} — {show.end_time}
                            </span>
                            {show.host_name && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {show.host_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          {show.status || "Actif"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-2">Aucune émission</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <Headphones className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-gray-600 font-medium">Aucune émission configurée</p>
          <p className="text-sm mt-1">Ajoutez vos émissions pour remplir la programmation</p>
        </div>
      )}
    </div>
  );
}
