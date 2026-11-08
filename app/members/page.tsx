"use client";

import { useState, useMemo, useEffect } from "react";
import { mockMembers } from "@/lib/mockData";
import { ChevronDown } from "lucide-react";

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [sortBy, setSortBy] = useState("navn");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    aktive: 0,
    inaktive: 0,
    nye: 0,
  });

  useEffect(() => {
    const aktive = mockMembers.filter((m) => m.status === "aktiv").length;
    const inaktive = mockMembers.filter((m) => m.status === "inaktiv").length;
    const nye = mockMembers.filter(
      (m) =>
        new Date(m.tilmeldingsdato) >
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ).length;

    setStats({
      total: mockMembers.length,
      aktive,
      inaktive,
      nye,
    });
  }, []);

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = mockMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.telefon.includes(searchTerm);

      const matchesStatus =
        statusFilter === "alle" || member.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      if (sortBy === "navn") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "tilmelding") {
        return new Date(b.tilmeldingsdato).getTime() - new Date(a.tilmeldingsdato).getTime();
      } else if (sortBy === "seneste") {
        return new Date(b.senessteAktivitet).getTime() - new Date(a.senessteAktivitet).getTime();
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy]);

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Medlemmer</h1>
        <p className="text-gray-600 mt-1">Administrer portal medlemmer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Samtlige medlemmer</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Aktive medlemmer</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.aktive}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Inaktive medlemmer</p>
              <p className="text-3xl font-bold text-gray-600 mt-2">{stats.inaktive}</p>
            </div>
            <div className="text-4xl">⏸️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Nye denne måned</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.nye}</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>

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
                Status
              </label>
              <div className="flex gap-2">
                {["alle", "aktiv", "inaktiv"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                      statusFilter === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "alle" && "Alle"}
                    {status === "aktiv" && "Aktive"}
                    {status === "inaktiv" && "Inaktive"}
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
                <option value="seneste">Seneste aktivitet</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAndSortedMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Ingen medlemmer fundet</p>
            </div>
          ) : (
            filteredAndSortedMembers.map((member) => (
              <div
                key={member.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === member.id ? null : member.id)
                  }
                  className="w-full text-left flex items-start justify-between"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="text-3xl flex-shrink-0">{member.avatar}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {member.email}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            member.status === "aktiv"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.status === "aktiv" ? "Aktiv" : "Inaktiv"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {member.udlån} udlån
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 ml-4 transition transform ${
                    expandedId === member.id ? "rotate-180" : ""
                  }`}>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                {expandedId === member.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Telefon
                        </p>
                        <p className="text-sm text-gray-900 mt-1">{member.telefon}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Tilmeldingsdato
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(member.tilmeldingsdato).toLocaleDateString("da-DK")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Seneste aktivitet
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(member.senessteAktivitet).toLocaleDateString("da-DK")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Aktive udlån
                        </p>
                        <p className="text-sm text-gray-900 mt-1">{member.udlån}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                        Se detaljer
                      </button>
                      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition">
                        Redigér
                      </button>
                      <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition">
                        Deaktivér
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
