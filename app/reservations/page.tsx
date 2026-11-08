"use client";

import { useState, useMemo, useEffect } from "react";
import { mockReservations } from "@/lib/mockData";
import { Search, ChevronDown, Plus, Edit2, X, Calendar } from "lucide-react";

type FilterType = "alle" | "kommende" | "aktive" | "udløbne";
type SortType = "navn" | "start" | "slut";
type ViewType = "liste" | "kalender";

function getStatusColor(status: string): string {
  if (status === "kommende") return "bg-blue-50 border-blue-200";
  if (status === "aktiv") return "bg-green-50 border-green-200";
  return "bg-gray-50 border-gray-200";
}

function getStatusBadgeColor(status: string): string {
  if (status === "kommende") return "bg-blue-100 text-blue-800";
  if (status === "aktiv") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
}

function getStatusLabel(status: string): string {
  if (status === "kommende") return "Kommende";
  if (status === "aktiv") return "Aktiv";
  return "Udløbet";
}

function calculateDaysUntilStart(startdato: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startdato);
  start.setHours(0, 0, 0, 0);
  return Math.floor((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function Reservations() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("alle");
  const [sort, setSort] = useState<SortType>("start");
  const [view, setView] = useState<ViewType>("liste");
  const [expandedAction, setExpandedAction] = useState<number | null>(null);
  const [reservationsWithStatus, setReservationsWithStatus] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updated = mockReservations.map((res) => {
      const start = new Date(res.startdato);
      start.setHours(0, 0, 0, 0);
      const slut = new Date(res.slutdato);
      slut.setHours(0, 0, 0, 0);

      let status = res.status;
      if (today >= start && today <= slut) {
        status = "aktiv";
      } else if (today > slut) {
        status = "udløbet";
      } else {
        status = "kommende";
      }

      const daysUntilStart = Math.floor(
        (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      const daysRemaining = Math.floor(
        (slut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return { ...res, status, daysUntilStart, daysRemaining };
    });

    setReservationsWithStatus(updated);
    setIsLoaded(true);
  }, []);

  const filteredAndSorted = useMemo(() => {
    if (!isLoaded) return [];

    let result = reservationsWithStatus.filter((res) => {
      const matchesSearch =
        res.item.toLowerCase().includes(search.toLowerCase()) ||
        res.medlem.toLowerCase().includes(search.toLowerCase()) ||
        res.kategori.toLowerCase().includes(search.toLowerCase());

      let matchesFilter = true;
      if (filter === "kommende") {
        matchesFilter = res.status === "kommende";
      } else if (filter === "aktive") {
        matchesFilter = res.status === "aktiv";
      } else if (filter === "udløbne") {
        matchesFilter = res.status === "udløbet";
      }

      return matchesSearch && matchesFilter;
    });

    result.sort((a, b) => {
      if (sort === "navn") {
        return a.item.localeCompare(b.item);
      } else if (sort === "start") {
        return new Date(a.startdato).getTime() - new Date(b.startdato).getTime();
      } else {
        return new Date(a.slutdato).getTime() - new Date(b.slutdato).getTime();
      }
    });

    return result;
  }, [search, filter, sort, reservationsWithStatus, isLoaded]);

  const stats = {
    aktive: reservationsWithStatus.filter((r) => r.status === "aktiv").length,
    denneUge: reservationsWithStatus.filter(
      (r) =>
        r.status === "aktiv" ||
        (r.status === "kommende" && r.daysUntilStart <= 7 && r.daysUntilStart >= 0)
    ).length,
    kommende: reservationsWithStatus.filter((r) => r.status === "kommende").length,
    udløbne: reservationsWithStatus.filter((r) => r.status === "udløbet").length,
  };

  if (!isLoaded) {
    return <div className="text-center py-12">Indlæser...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservationer</h1>
          <p className="text-gray-600 mt-1">Administrer enhedsreservationer</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm md:text-base">
          <Plus className="w-4 h-4" />
          Opret reservation
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon="📅"
          title="Aktive"
          value={stats.aktive}
          color="bg-green-50"
          textColor="text-green-600"
        />
        <StatCard
          icon="📆"
          title="Denne uge"
          value={stats.denneUge}
          color="bg-orange-50"
          textColor="text-orange-600"
        />
        <StatCard
          icon="📋"
          title="Kommende"
          value={stats.kommende}
          color="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          icon="❌"
          title="Udløbne"
          value={stats.udløbne}
          color="bg-gray-50"
          textColor="text-gray-600"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Søg efter enhed, medlem eller kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["alle", "kommende", "aktive", "udløbne"] as FilterType[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {f === "alle"
                  ? "Alle"
                  : f === "kommende"
                    ? "Kommende"
                    : f === "aktive"
                      ? "Aktive"
                      : "Udløbne"}
              </button>
            )
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 md:flex-none">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10 text-sm"
            >
              <option value="start">Sorter efter startdato</option>
              <option value="slut">Sorter efter slutdato</option>
              <option value="navn">Sorter efter navn</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setView("liste")}
              className={`px-3 py-1 rounded transition-colors text-sm ${
                view === "liste"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Listevisning"
            >
              Liste
            </button>
            <button
              onClick={() => setView("kalender")}
              className={`px-3 py-1 rounded transition-colors text-sm flex items-center gap-1 ${
                view === "kalender"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Kalendervisning"
            >
              <Calendar className="w-4 h-4" />
              Kalender
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Ingen reservationer fundet</p>
        </div>
      ) : view === "liste" ? (
        <ListeView
          reservations={filteredAndSorted}
          expandedAction={expandedAction}
          onToggleAction={setExpandedAction}
        />
      ) : (
        <KalenderView reservations={filteredAndSorted} />
      )}
    </div>
  );
}

function ListeView({
  reservations,
  expandedAction,
  onToggleAction,
}: {
  reservations: any[];
  expandedAction: number | null;
  onToggleAction: (id: number | null) => void;
}) {
  return (
    <div className="space-y-3">
      {reservations.map((res) => (
        <div
          key={res.id}
          className={`bg-white rounded-lg shadow border p-4 md:p-6 transition-all ${getStatusColor(
            res.status
          )}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
            {/* Billede & Navn */}
            <div className="flex items-start gap-3">
              <span className="text-4xl">{res.billede}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {res.item}
                </h3>
                <p className="text-xs text-gray-500">{res.kategori}</p>
              </div>
            </div>

            {/* Medlem */}
            <div className="hidden md:block">
              <p className="font-medium text-gray-900">{res.medlem}</p>
            </div>

            {/* Datoer */}
            <div className="hidden lg:block text-sm">
              <p className="text-gray-600">
                Start: <span className="font-medium text-gray-900">{res.startdato}</span>
              </p>
              <p className="text-gray-600">
                Slut: <span className="font-medium text-gray-900">{res.slutdato}</span>
              </p>
            </div>

            {/* Status */}
            <div className="text-center">
              <span
                className={`inline-block text-xs font-bold px-3 py-2 rounded-full ${getStatusBadgeColor(
                  res.status
                )}`}
              >
                {getStatusLabel(res.status)}
              </span>
            </div>

            {/* Action Toggle */}
            <div className="flex justify-end">
              <button
                onClick={() =>
                  onToggleAction(expandedAction === res.id ? null : res.id)
                }
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    expandedAction === res.id ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Info */}
          <div className="md:hidden mt-4 pt-4 border-t space-y-2 text-sm">
            <div>
              <p className="text-gray-600">Medlem: {res.medlem}</p>
            </div>
            <div>
              <p className="text-gray-600">
                Start: <span className="font-medium">{res.startdato}</span>
              </p>
              <p className="text-gray-600">
                Slut: <span className="font-medium">{res.slutdato}</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          {expandedAction === res.id && (
            <div className="mt-4 pt-4 border-t flex flex-col md:flex-row gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Edit2 className="w-4 h-4" />
                Redigér
              </button>
              <button className="flex-1 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Opret lignende
              </button>
              <button className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <X className="w-4 h-4" />
                Annullér
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function KalenderView({ reservations }: { reservations: any[] }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    "Januar",
    "Februar",
    "Marts",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        {monthNames[currentMonth]} {currentYear}
      </h2>

      <div className="grid grid-cols-7 gap-2">
        {["Man", "Tirs", "Ons", "Tors", "Fre", "Lør", "Søn"].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 text-sm">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dateStr =
            day === null
              ? null
              : `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          const resForDay = dateStr
            ? reservations.filter((r) => {
                const start = new Date(r.startdato);
                const end = new Date(r.slutdato);
                const current = new Date(dateStr);
                return current >= start && current <= end;
              })
            : [];

          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          return (
            <div
              key={index}
              className={`p-2 rounded-lg border text-center text-sm min-h-[80px] flex flex-col ${
                day === null
                  ? "bg-gray-50 border-gray-200"
                  : isToday
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-200"
              }`}
            >
              {day && <div className="font-semibold text-gray-900">{day}</div>}
              <div className="mt-1 space-y-1 flex-1">
                {resForDay.slice(0, 2).map((res) => (
                  <div
                    key={res.id}
                    className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 truncate"
                    title={res.item}
                  >
                    {res.billede} {res.item.split(" ")[0]}
                  </div>
                ))}
                {resForDay.length > 2 && (
                  <div className="text-xs text-gray-600">+{resForDay.length - 2} mere</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
  textColor,
}: {
  icon: string;
  title: string;
  value: number;
  color: string;
  textColor: string;
}) {
  return (
    <div className={`${color} rounded-lg p-4 md:p-6`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl md:text-3xl">{icon}</span>
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-700">{title}</p>
          <p className={`text-2xl md:text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
