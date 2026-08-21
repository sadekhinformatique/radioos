import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Radio,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6h - 23h

const programs = [
  {
    id: "1",
    name: "Réveil Matinal",
    host: "Amadou Diallo",
    day: "Lundi",
    startHour: 6,
    endHour: 9,
    category: "Matinale",
    color: "bg-orange-500",
  },
  {
    id: "2",
    name: "Les Info du Jour",
    host: "Fatima Sy",
    day: "Lundi",
    startHour: 9,
    endHour: 10,
    category: "Info",
    color: "bg-blue-500",
  },
  {
    id: "3",
    name: "Musique Africaine",
    host: "Ibrahim Cissé",
    day: "Lundi",
    startHour: 10,
    endHour: 13,
    category: "Musique",
    color: "bg-green-500",
  },
  {
    id: "4",
    name: "Espace Culture",
    host: "Aïssatou Ndiaye",
    day: "Lundi",
    startHour: 14,
    endHour: 16,
    category: "Culture",
    color: "bg-purple-500",
  },
  {
    id: "5",
    name: "Sport Total",
    host: "Moussa Sow",
    day: "Lundi",
    startHour: 17,
    endHour: 19,
    category: "Sport",
    color: "bg-red-500",
  },
  {
    id: "6",
    name: "Nuit Louma",
    host: "DJ Afro",
    day: "Lundi",
    startHour: 21,
    endHour: 23,
    category: "Musique",
    color: "bg-indigo-500",
  },
  {
    id: "7",
    name: "Réveil Matinal",
    host: "Amadou Diallo",
    day: "Mardi",
    startHour: 6,
    endHour: 9,
    category: "Matinale",
    color: "bg-orange-500",
  },
  {
    id: "8",
    name: "Talk Show",
    host: "Fatima Sy",
    day: "Mardi",
    startHour: 10,
    endHour: 12,
    category: "Talk",
    color: "bg-teal-500",
  },
  {
    id: "9",
    name: "Gospel & Louanges",
    host: "Pasteur Oumar",
    day: "Mercredi",
    startHour: 8,
    endHour: 10,
    category: "Religieux",
    color: "bg-yellow-500",
  },
  {
    id: "10",
    name: "Marché Price",
    host: "Ibrahim Cissé",
    day: "Samedi",
    startHour: 7,
    endHour: 10,
    category: "Économie",
    color: "bg-emerald-500",
  },
];

function TimeSlot({ program }: { program: (typeof programs)[0] }) {
  const height = (program.endHour - program.startHour) * 64;
  const top = (program.startHour - 6) * 64;

  return (
    <div
      className={`absolute left-1 right-1 rounded-lg ${program.color} text-white p-2 text-xs overflow-hidden cursor-pointer hover:opacity-90 transition-opacity z-10`}
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      <div className="font-semibold truncate">{program.name}</div>
      <div className="opacity-80 truncate">{program.host}</div>
      <div className="opacity-70 mt-1">
        {`${String(program.startHour).padStart(2, "0")}:00 - ${String(program.endHour).padStart(2, "0")}:00`}
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Programmation
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gérez la grille horaire de votre radio
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un programme
        </Button>
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { name: "Matinale", color: "bg-orange-500" },
          { name: "Info", color: "bg-blue-500" },
          { name: "Musique", color: "bg-green-500" },
          { name: "Culture", color: "bg-purple-500" },
          { name: "Sport", color: "bg-red-500" },
          { name: "Talk", color: "bg-teal-500" },
          { name: "Religieux", color: "bg-yellow-500" },
          { name: "Économie", color: "bg-emerald-500" },
        ].map((cat) => (
          <div key={cat.name} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${cat.color}`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle className="text-lg">
                Semaine du 18 - 24 Août 2025
              </CardTitle>
            </div>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-1" />
              Aujourd&apos;hui
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Day Headers */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700">
                <div className="p-2 text-xs text-gray-500 font-medium">
                  Heure
                </div>
                {DAYS.map((day, i) => (
                  <div
                    key={day}
                    className={`p-2 text-center text-xs font-semibold ${
                      i === 0
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Grid */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)]">
                {/* Hour Column */}
                <div>
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-start justify-end pr-2 pt-1"
                    >
                      <span className="text-xs text-gray-400">
                        {String(hour).padStart(2, "0")}:00
                      </span>
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {DAYS.map((day, dayIndex) => (
                  <div
                    key={day}
                    className="relative border-l border-gray-100 dark:border-gray-800"
                  >
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        className={`h-16 border-b border-gray-100 dark:border-gray-800 ${
                          dayIndex === 0
                            ? "bg-blue-50/30 dark:bg-blue-900/10"
                            : ""
                        }`}
                      />
                    ))}
                    {/* Programs */}
                    {programs
                      .filter((p) => p.day === day)
                      .map((program) => (
                        <TimeSlot key={program.id} program={program} />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Liste des programmes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Programme
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Animateur
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Jour
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Horaires
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Catégorie
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr
                    key={program.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${program.color}`}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {program.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {program.host}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {program.day}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {`${String(program.startHour).padStart(2, "0")}:00 - ${String(program.endHour).padStart(2, "0")}:00`}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{program.category}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
