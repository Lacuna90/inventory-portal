"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockMembers, mockLoans, mockReservations } from "@/lib/mockData";
import { ChevronRight, Plus } from "lucide-react";

export default function Members() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("alle");
  const [sortBy, setSortBy] = useState("navn");
  const [stats, setStats] = useState({
    total: 0,
    aktive: 0,
    aktiveLån: 0,
    aktiveReservationer: 0,
    mestAktiv: "",
  });

  useEffect(() => {
    const aktive = mockMembers.filter((m) => m.status === "aktiv").length;
    const aktiveLån = mockLoans.length;
    const aktiveReservationer = mockReservations.length;
    const mestAktiv = mockMembers.reduce((max, m) =>
      m.aktiveLån + m.aktivtReservationer > max.aktiveLån + max.aktivtReservationer ? m : max
    );

    setStats({
      total: mockMembers.length,
      aktive,
      aktiveLån,
      aktiveReservationer,
      mestAktiv: mestAktiv.name,
    });
  }, []);

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = mockMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.telefon.includes(searchTerm);

      const matchesRole = roleFilter === "alle" || member.rolle === roleFilter;

      return matchesSearch && matchesRole;
    });

    filtered.sort((a, b) => {
      if (sortBy === "navn") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "tilmelding") {
        return new Date(b.tilmeldingsdato).getTime() - new Date(a.tilmeldingsdato).getTime();
      } else if (sortBy === "rolle") {
        return a.rolle.localeCompare(b.rolle);
      } else if (sortBy === "seneste") {
        return new Date(b.senessteAktivitet).getTime() - new Date(a.senessteAktivitet).getTime();
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, roleFilter, sortBy]);

  const getRoleBadgeColor = (rolle: string) => {
    switch (rolle) {
      case "Admin":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "Familie":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "Medlem":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Gæst":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "aktiv" ? "text-green-600 dark:text-green-400" : "text-muted-foreground";
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medlemmer</h1>
          <p className="text-muted-foreground mt-1">Administrer portal medlemmer</p>
        </div>
        <button
          onClick={() => router.push("/members/new")}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Opret medlem</span>
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total medlemmer</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.total}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Aktive lån</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{stats.aktiveLån}</p>
            </div>
            <div className="text-4xl">📤</div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Aktive reservationer</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{stats.aktiveReservationer}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Mest aktiv medlem</p>
              <p className="text-sm font-bold text-primary dark:text-primary/80 mt-2 truncate">{stats.mestAktiv}</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg shadow p-6 space-y-6 border border-border">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Søg medlem
            </label>
            <input
              type="text"
              placeholder="Navn, email eller telefon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Rolle
              </label>
              <div className="flex gap-2 flex-wrap">
                {["alle", "Admin", "Familie", "Medlem", "Gæst"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                      roleFilter === role
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {role === "alle" ? "Alle" : role}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Sorter efter
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="navn">Navn (A-Z)</option>
                <option value="tilmelding">Nyeste medlemmer</option>
                <option value="rolle">Rolle</option>
                <option value="seneste">Seneste aktivitet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          {filteredAndSortedMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Ingen medlemmer fundet</p>
            </div>
          ) : (
            filteredAndSortedMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => router.push(`/members/${member.id}`)}
                className="w-full text-left border border-border rounded-lg p-4 hover:bg-muted transition group bg-background"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="text-3xl flex-shrink-0">{member.avatar}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">{member.name}</p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(
                            member.rolle
                          )}`}
                        >
                          {member.rolle}
                        </span>
                        <span className={`text-xs font-medium ${getStatusColor(member.status)}`}>
                          {member.status === "aktiv" ? "✓ Aktiv" : "Inaktiv"}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground truncate">📧 {member.email}</p>
                        <p className="text-sm text-muted-foreground truncate">📞 {member.telefon}</p>
                        <p className="text-sm text-muted-foreground truncate">📍 {member.adresse}</p>
                      </div>
                      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                        <span>📤 {member.aktiveLån} lån</span>
                        <span>📋 {member.aktivtReservationer} res.</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4 text-muted-foreground group-hover:text-foreground transition">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
