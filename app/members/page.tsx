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
        return "bg-red-100 text-red-800";
      case "Familie":
        return "bg-blue-100 text-blue-800";
      case "Medlem":
        return "bg-green-100 text-green-800";
      case "Gæst":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "aktiv" ? "text-green-600" : "text-gray-500";
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medlemmer</h1>
          <p className="text-gray-600 mt-1">Administrer portal medlemmer</p>
        </div>
        <button
          onClick={() => router.push("/members/new")}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Opret medlem</span>
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total medlemmer</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Aktive lån</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.aktiveLån}</p>
            </div>
            <div className="text-4xl">📤</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Aktive reservationer</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.aktiveReservationer}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Mest aktiv medlem</p>
              <p className="text-sm font-bold text-blue-600 mt-2 truncate">{stats.mestAktiv}</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Søg medlem
            </label>
            <input
              type="text"
              placeholder="Navn, email eller telefon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rolle
              </label>
              <div className="flex gap-2 flex-wrap">
                {["alle", "Admin", "Familie", "Medlem", "Gæst"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                      roleFilter === role
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {role === "alle" ? "Alle" : role}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sorter efter
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <p className="text-gray-600">Ingen medlemmer fundet</p>
            </div>
          ) : (
            filteredAndSortedMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => router.push(`/members/${member.id}`)}
                className="w-full text-left border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="text-3xl flex-shrink-0">{member.avatar}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900">{member.name}</p>
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
                        <p className="text-sm text-gray-600 truncate">📧 {member.email}</p>
                        <p className="text-sm text-gray-600 truncate">📞 {member.telefon}</p>
                        <p className="text-sm text-gray-600 truncate">📍 {member.adresse}</p>
                      </div>
                      <div className="mt-2 flex gap-4 text-xs text-gray-500">
                        <span>📤 {member.aktiveLån} lån</span>
                        <span>📋 {member.aktivtReservationer} res.</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4 text-gray-400 group-hover:text-gray-600 transition">
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
