"use client";

import { useMyRadio, useShows } from "@/hooks/use-radio-data";
import { Calendar, Clock, Radio } from "lucide-react";

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const dayNamesFull = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default function ProgramsPage() {
  const { radio } = useMyRadio();
  const { data: shows } = useShows(radio?.id || null);

  const currentDay = new Date().getDay();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Programmation</h1>
        <p className="text-gray-500 mt-1">Grille horaire de vos émissions</p>
      </div>

      {/* Weekly Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-3 bg-gray-50 text-xs font-medium text-gray-500">Heure</div>
          {dayNamesFull.map((day, idx) => (
            <div key={day} className={`p-3 text-xs font-medium text-center ${idx === currentDay ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500"}`}>
              {dayNames[idx]}
              {idx === currentDay && <div className="text-[10px] mt-0.5">Aujourd&apos;hui</div>}
            </div>
          ))}
        </div>
        <div className="divide-y divide-gray-100" style={{ minHeight: "400px" }}>
          {Array.from({ length: 12 }, (_, i) => i + 6).map((hour) => (
            <div key={hour} className="grid grid-cols-8 min-h-[60px]">
              <div className="p-2 bg-gray-50 text-xs text-gray-400 border-r border-gray-200">
                {hour.toString().padStart(2, "0")}:00
              </div>
              {dayNamesFull.map((_, dayIdx) => {
                const show = shows?.find((s) => {
                  const startHour = parseInt(s.start_time?.split(":")[0] || "0");
                  return s.day_of_week === dayIdx && startHour === hour;
                });
                return (
                  <div key={dayIdx} className={`border-r border-gray-100 p-1 ${dayIdx === currentDay ? "bg-blue-50/30" : ""}`}>
                    {show && (
                      <div className="bg-blue-100 text-blue-800 rounded p-1 text-[10px] font-medium truncate">
                        {show.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {(!shows || shows.length === 0) && (
        <div className="text-center py-8 text-gray-400">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune émission dans la grille</p>
        </div>
      )}
    </div>
  );
}
