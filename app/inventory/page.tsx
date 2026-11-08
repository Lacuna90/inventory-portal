"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockInventoryItems, kategorier } from "@/lib/mockData";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

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
  const [search, setSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return mockInventoryItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.kategori.toLowerCase().includes(search.toLowerCase()) ||
        item.lokation.toLowerCase().includes(search.toLowerCase());

      const matchesKategori = selectedKategori === null || item.kategori === selectedKategori;

      return matchesSearch && matchesKategori;
    });
  }, [search, selectedKategori]);

  const itemsByKategori = useMemo(() => {
    return kategorier.map((k) => ({
      ...k,
      count: mockInventoryItems.filter((item) => item.kategori === k.navn).length,
      items: mockInventoryItems
        .filter((item) => item.kategori === k.navn)
        .slice(0, 5),
    }));
  }, []);

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

      {/* Category Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {itemsByKategori.map((k) => (
          <button
            key={k.navn}
            onClick={() => setSelectedKategori(selectedKategori === k.navn ? null : k.navn)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedKategori === k.navn
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="text-3xl mb-2">{k.ikon}</div>
            <p className="font-semibold text-gray-900 text-sm">{k.navn}</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{k.count}</p>
            <p className="text-xs text-gray-500 mt-2">
              {k.items.slice(0, 2).map((item) => item.name).join(", ")}
              {k.items.length > 2 ? "..." : ""}
            </p>
          </button>
        ))}
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

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Ingen genstande fundet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/inventory/${item.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all overflow-hidden block"
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

