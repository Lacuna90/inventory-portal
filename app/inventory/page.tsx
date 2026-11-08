"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockInventoryItems, kategorier } from "@/lib/mockData";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

type StatusFilter = "alle" | "hjemme" | "udlånt" | "reserveret" | "til_salg" | "solgt" | "defekt";

const statusLabels: Record<string, { label: string; color: string }> = {
  hjemme: { label: "Hjemme", color: "bg-green-500/10 text-green-700 dark:text-green-400" },
  udlånt: { label: "Udlånt", color: "bg-orange-500/10 text-orange-700 dark:text-orange-400" },
  reserveret: { label: "Reserveret", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  til_salg: { label: "Til salg", color: "bg-primary/10 text-primary dark:text-primary/80" },
  solgt: { label: "Solgt", color: "bg-muted text-muted-foreground" },
  defekt: { label: "Defekt", color: "bg-red-500/10 text-red-700 dark:text-red-400" },
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
          <h1 className="text-3xl font-bold text-foreground">Inventar</h1>
          <p className="text-muted-foreground mt-1">Oversigt over alle inventargenstande</p>
        </div>
        <button
          onClick={() => router.push("/inventory/new")}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
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
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedKategori === k.navn
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-border bg-card hover:border-primary/50 dark:hover:border-primary/40"
            }`}
          >
            <div className="text-3xl mb-2">{k.ikon}</div>
            <p className="font-semibold text-foreground text-sm">{k.navn}</p>
            <p className="text-2xl font-bold text-primary mt-1">{k.count}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {k.items.slice(0, 2).map((item) => item.name).join(", ")}
              {k.items.length > 2 ? "..." : ""}
            </p>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Søg efter navn, kategori eller lokation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border bg-card text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">Ingen genstande fundet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/inventory/${item.id}`}
              className="bg-card rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all overflow-hidden block border border-border"
            >
              {/* Image/Icon */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
                <span className="text-5xl">{item.billede}</span>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.kategori}</p>
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
                <div className="space-y-2 border-t border-border pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mængde:</span>
                    <span className="font-semibold text-foreground">{item.mængde} stk</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lokation:</span>
                    <span className="font-semibold text-foreground">{item.lokation}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600 dark:text-green-400">Hjemme: {item.mængdeHjemme}</span>
                    <span className="text-orange-600 dark:text-orange-400">Udlånt: {item.mængdeUdlånt}</span>
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

