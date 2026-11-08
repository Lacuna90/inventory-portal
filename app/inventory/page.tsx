"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockInventoryItems } from "@/lib/mockData";
import { Grid, List, Search, X, Plus } from "lucide-react";

type ViewType = "card" | "list";
type StatusFilter = "alle" | "hjemme" | "udlånt" | "reserveret" | "til_salg" | "solgt" | "defekt";

const statusLabels: Record<string, { label: string; color: string }> = {
  hjemme: { label: "Hjemme", color: "bg-green-100 text-green-800" },
  udlånt: { label: "Udlånt", color: "bg-orange-100 text-orange-800" },
  reserveret: { label: "Reserveret", color: "bg-purple-100 text-purple-800" },
  til_salg: { label: "Til salg", color: "bg-blue-100 text-blue-800" },
  solgt: { label: "Solgt", color: "bg-gray-100 text-gray-800" },
  defekt: { label: "Defekt", color: "bg-red-100 text-red-800" },
};

export default function Inventory() {
  const router = useRouter();
  const [view, setView] = useState<ViewType>("card");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("alle");

  const filteredItems = useMemo(() => {
    return mockInventoryItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.kategori.toLowerCase().includes(search.toLowerCase()) ||
        item.lokation.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        selectedStatus === "alle" || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, selectedStatus]);

  const totalItems = filteredItems.reduce((sum, item) => sum + item.mængde, 0);

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventar</h1>
          <p className="text-gray-600 mt-1">Oversigt over alle inventargenstande</p>
        </div>
        <button
          onClick={() => router.push("/inventory/new")}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Opret enhed</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Søg efter navn, kategori eller lokation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Filtre</h3>
        <div className="flex flex-wrap gap-2">
          {(
            [
              "alle",
              "hjemme",
              "udlånt",
              "reserveret",
              "til_salg",
              "solgt",
              "defekt",
            ] as StatusFilter[]
          ).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {status === "alle" ? "Alle" : statusLabels[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* View Toggle & Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{filteredItems.length}</span> genstande (
            <span className="font-semibold">{totalItems}</span> stk total)
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 bg-gray-200 p-1 rounded-lg w-fit">
          <button
            onClick={() => setView("card")}
            className={`p-2 rounded transition-colors ${
              view === "card"
                ? "bg-white text-blue-600 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
            title="Card view"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded transition-colors ${
              view === "list"
                ? "bg-white text-blue-600 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
            title="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Ingen genstande fundet</p>
        </div>
      ) : view === "card" ? (
        <CardView items={filteredItems} />
      ) : (
        <ListView items={filteredItems} />
      )}
    </div>
  );
}

function CardView({ items }: { items: typeof mockInventoryItems }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
        >
          {/* Image/Icon */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center">
            <span className="text-5xl">{item.billede}</span>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{item.kategori}</p>
            </div>

            {/* Status Badge */}
            <div>
              <span
                className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                  statusLabels[item.status].color
                }`}
              >
                {statusLabels[item.status].label}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 border-t pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mængde:</span>
                <span className="font-semibold text-gray-900">{item.mængde} stk</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lokation:</span>
                <span className="font-semibold text-gray-900">{item.lokation}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-600">Hjemme: {item.mængdeHjemme}</span>
                <span className="text-orange-600">Udlånt: {item.mængdeUdlånt}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListView({ items }: { items: typeof mockInventoryItems }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                Billede
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                Navn
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                Kategori
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900">
                Mængde
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                Lokation
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-center text-2xl">
                  {item.billede}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {item.kategori}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                      statusLabels[item.status].color
                    }`}
                  >
                    {statusLabels[item.status].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.mængde}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {item.lokation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
