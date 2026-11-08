"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { mockLoans } from "@/lib/mockData";
import { Search, ChevronDown, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

type FilterType = "alle" | "aktive" | "forsinkede" | "denne_uge";
type SortType = "navn" | "retur" | "dage";

function getStatusColor(daysLeft: number): string {
  if (daysLeft < 0) return "bg-destructive/5 border-destructive/20";
  if (daysLeft <= 7) return "bg-yellow-500/5 border-yellow-500/20";
  return "bg-green-500/5 border-green-500/20";
}

function getStatusBadgeColor(daysLeft: number): string {
  if (daysLeft < 0) return "bg-destructive/10 text-destructive dark:text-red-400";
  if (daysLeft <= 7) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
  return "bg-green-500/10 text-green-700 dark:text-green-400";
}

function getStatusLabel(daysLeft: number): string {
  if (daysLeft < 0) return `${Math.abs(daysLeft)} dage forsinket`;
  if (daysLeft === 0) return "Retur i dag";
  if (daysLeft === 1) return "Retur i morgen";
  return `${daysLeft} dage tilbage`;
}

export default function Loans() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("alle");
  const [sort, setSort] = useState<SortType>("retur");
  const [expandedAction, setExpandedAction] = useState<number | null>(null);
  const [loansWithDaysLeft, setLoansWithDaysLeft] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updated = mockLoans.map((loan) => {
      const returnDate = new Date(loan.til);
      returnDate.setHours(0, 0, 0, 0);
      const daysLeft = Math.floor(
        (returnDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return { ...loan, daysLeft, returnDateTicks: returnDate.getTime() };
    });

    setLoansWithDaysLeft(updated);
    setIsLoaded(true);
  }, []);

  const filteredAndSorted = useMemo(() => {
    if (!isLoaded) return [];

    let result = loansWithDaysLeft.filter((loan) => {
      const matchesSearch =
        loan.item.toLowerCase().includes(search.toLowerCase()) ||
        loan.medlem.toLowerCase().includes(search.toLowerCase()) ||
        loan.kategori.toLowerCase().includes(search.toLowerCase());

      let matchesFilter = true;
      if (filter === "aktive") {
        matchesFilter = loan.daysLeft >= 0;
      } else if (filter === "forsinkede") {
        matchesFilter = loan.daysLeft < 0;
      } else if (filter === "denne_uge") {
        matchesFilter = loan.daysLeft >= 0 && loan.daysLeft <= 7;
      }

      return matchesSearch && matchesFilter;
    });

    result.sort((a, b) => {
      if (sort === "navn") {
        return a.item.localeCompare(b.item);
      } else if (sort === "retur") {
        return a.returnDateTicks - b.returnDateTicks;
      } else {
        return a.daysLeft - b.daysLeft;
      }
    });

    return result;
  }, [search, filter, sort, loansWithDaysLeft, isLoaded]);

  const stats = {
    aktive: loansWithDaysLeft.filter((l) => l.daysLeft >= 0).length,
    forsinkede: loansWithDaysLeft.filter((l) => l.daysLeft < 0).length,
    denneUge: loansWithDaysLeft.filter((l) => l.daysLeft >= 0 && l.daysLeft <= 7)
      .length,
  };

  if (!isLoaded) {
    return <div className="text-center py-12">Indlæser...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Udlån</h1>
        <p className="text-muted-foreground mt-1">Administrer udlånte genstande</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon="📤"
          title="Aktive udlån"
          value={stats.aktive}
          color="bg-blue-500/10"
          textColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon="⚠️"
          title="Forsinkede udlån"
          value={stats.forsinkede}
          color="bg-red-500/10"
          textColor="text-red-600 dark:text-red-400"
        />
        <StatCard
          icon="📅"
          title="Returneres denne uge"
          value={stats.denneUge}
          color="bg-orange-500/10"
          textColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Søg efter enhed, låner eller kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border bg-card text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["alle", "aktive", "forsinkede", "denne_uge"] as FilterType[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f === "alle"
                  ? "Alle"
                  : f === "aktive"
                    ? "Aktive"
                    : f === "forsinkede"
                      ? "Forsinkede"
                      : "Denne uge"}
              </button>
            )
          )}
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-4 py-2 border border-border bg-card text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-10"
          >
            <option value="retur">Sorter efter returdato</option>
            <option value="navn">Sorter efter navn</option>
            <option value="dage">Sorter efter dage tilbage</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Loans List */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">Ingen udlån fundet</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-0">
          {filteredAndSorted.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              isExpanded={expandedAction === loan.id}
              onToggle={() =>
                setExpandedAction(expandedAction === loan.id ? null : loan.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LoanCard({
  loan,
  isExpanded,
  onToggle,
}: {
  loan: any;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Link href={`/inventory/${loan.itemId}`}>
      <div
        className={`bg-card rounded-lg shadow border p-4 md:p-6 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer ${getStatusColor(
          loan.daysLeft
        )}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
          {/* Billede & Navn */}
          <div className="flex items-start gap-3 md:col-span-1">
            <span className="text-4xl">{loan.billede}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground line-clamp-2">
                {loan.item}
              </h3>
              <p className="text-xs text-muted-foreground">{loan.kategori}</p>
            </div>
          </div>

          {/* Låner Info */}
          <div className="hidden md:block">
            <p className="font-medium text-foreground">{loan.medlem}</p>
            <p className="text-sm text-muted-foreground">{loan.telefon}</p>
          </div>

          {/* Datoer */}
          <div className="hidden lg:block text-sm">
            <p className="text-muted-foreground">
              Start: <span className="font-medium text-foreground">{loan.fra}</span>
            </p>
            <p className="text-muted-foreground">
              Retur: <span className="font-medium text-foreground">{loan.til}</span>
            </p>
          </div>

          {/* Dage tilbage */}
          <div className="text-center">
            <span
              className={`inline-block text-xs font-bold px-3 py-2 rounded-full ${getStatusBadgeColor(
                loan.daysLeft
              )}`}
            >
              {getStatusLabel(loan.daysLeft)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Flere handlinger"
            >
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Info (visible on mobile) */}
        <div className="md:hidden mt-4 pt-4 border-t border-border space-y-2 text-sm">
          <div>
            <p className="text-muted-foreground">Låner: {loan.medlem}</p>
            <p className="text-muted-foreground">Telefon: {loan.telefon}</p>
          </div>
          <div>
            <p className="text-muted-foreground">
              Startdato: <span className="font-medium text-foreground">{loan.fra}</span>
            </p>
            <p className="text-muted-foreground">
              Returdato: <span className="font-medium text-foreground">{loan.til}</span>
            </p>
          </div>
        </div>

        {/* Expanded Actions */}
        {isExpanded && (
          <div
            className="mt-4 pt-4 border-t border-border flex flex-col md:flex-row gap-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button className="flex-1 px-4 py-2 bg-primary/10 text-primary dark:text-primary/80 rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Se detaljer
            </button>
            <button className="flex-1 px-4 py-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Returner enhed
            </button>
            <button className="flex-1 px-4 py-2 bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Forlæng udlån
            </button>
          </div>
        )}
      </div>
    </Link>
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
    <div className={`${color} rounded-lg p-6 bg-card border border-border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}
