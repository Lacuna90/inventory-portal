"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { mockReservations, mockInventoryItems, mockMembers } from "@/lib/mockData";
import { Search, ChevronDown, Plus, Edit2, X, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

type FilterType = "alle" | "kommende" | "aktive" | "udløbne";
type SortType = "navn" | "start" | "slut";
type ViewType = "liste" | "kalender";
type ModalType = "create" | "edit" | "delete" | null;

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

interface FormData {
  itemId: string;
  medlem: string;
  startdato: string;
  slutdato: string;
  noter: string;
}

export default function Reservations() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("alle");
  const [sort, setSort] = useState<SortType>("start");
  const [view, setView] = useState<ViewType>("liste");
  const [expandedAction, setExpandedAction] = useState<number | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<FormData>({
    itemId: "",
    medlem: "",
    startdato: "",
    slutdato: "",
    noter: "",
  });

  // Initialize reservations and calculate status
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTicks = today.getTime();

    const updated = mockReservations.map((res) => {
      const start = new Date(res.startdato);
      start.setHours(0, 0, 0, 0);
      const slut = new Date(res.slutdato);
      slut.setHours(0, 0, 0, 0);

      const startTicks = start.getTime();
      const endTicks = slut.getTime();

      let status = res.status;
      if (todayTicks >= startTicks && todayTicks <= endTicks) {
        status = "aktiv";
      } else if (todayTicks > endTicks) {
        status = "udløbet";
      } else {
        status = "kommende";
      }

      return {
        ...res,
        status,
        startDateTicks: startTicks,
        endDateTicks: endTicks,
      };
    });

    setReservations(updated);
    setIsLoaded(true);
  }, []);

  // Filter and sort based on reservations (useMemo only uses already-calculated numbers)
  const reservationsWithStatus = reservations;

  // Filter and sort
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
        return a.startDateTicks - b.startDateTicks;
      } else {
        return a.endDateTicks - b.endDateTicks;
      }
    });

    return result;
  }, [search, filter, sort, reservationsWithStatus, isLoaded]);

  // Check for conflicts
  const checkConflict = (itemId: string, startdato: string, slutdato: string, excludeId?: number): boolean => {
    const newStart = new Date(startdato);
    const newEnd = new Date(slutdato);

    return reservations.some((res) => {
      if (excludeId && res.id === excludeId) return false;
      if (res.itemId.toString() !== itemId) return false;
      if (res.status === "udløbet") return false;

      const resStart = new Date(res.startdato);
      const resEnd = new Date(res.slutdato);

      return !(newEnd < resStart || newStart > resEnd);
    });
  };

  const handleCreateClick = () => {
    setFormData({ itemId: "", medlem: "", startdato: "", slutdato: "", noter: "" });
    setErrorMessage("");
    setEditingId(null);
    setOpenModal("create");
  };

  const handleEditClick = (res: any) => {
    setFormData({
      itemId: res.itemId.toString(),
      medlem: res.medlem,
      startdato: res.startdato,
      slutdato: res.slutdato,
      noter: res.noter || "",
    });
    setErrorMessage("");
    setEditingId(res.id);
    setOpenModal("edit");
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
    setOpenModal("delete");
  };

  const handleSubmit = () => {
    setErrorMessage("");

    if (!formData.itemId || !formData.medlem || !formData.startdato || !formData.slutdato) {
      setErrorMessage("Alle felter er påkrævede");
      return;
    }

    if (new Date(formData.slutdato) < new Date(formData.startdato)) {
      setErrorMessage("Slutdato skal være efter startdato");
      return;
    }

    // Check for conflicts
    if (checkConflict(formData.itemId, formData.startdato, formData.slutdato, editingId || undefined)) {
      setErrorMessage("Enheden er allerede reserveret i denne periode");
      return;
    }

    const item = mockInventoryItems.find((i) => i.id === formData.itemId);
    if (!item) {
      setErrorMessage("Enhed ikke fundet");
      return;
    }

    if (editingId) {
      // Update existing
      setReservations((prev) =>
        prev.map((res) =>
          res.id === editingId
            ? {
                ...res,
                startdato: formData.startdato,
                slutdato: formData.slutdato,
                noter: formData.noter,
              }
            : res
        )
      );
    } else {
      // Create new
      const newId = Math.max(...reservations.map((r) => r.id), 0) + 1;
      setReservations((prev) => [
        ...prev,
        {
          id: newId,
          item: item.name,
          itemId: item.id,
          billede: item.billede,
          kategori: item.kategori,
          medlem: formData.medlem,
          startdato: formData.startdato,
          slutdato: formData.slutdato,
          status: "kommende",
          noter: formData.noter,
        },
      ]);
    }

    setOpenModal(null);
    setFormData({ itemId: "", medlem: "", startdato: "", slutdato: "", noter: "" });
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      setReservations((prev) => prev.filter((res) => res.id !== deleteConfirmId));
      setOpenModal(null);
      setDeleteConfirmId(null);
    }
  };

  const stats = {
    aktive: reservationsWithStatus.filter((r) => r.status === "aktiv").length,
    denneUge: reservationsWithStatus.filter(
      (r) => r.status === "aktiv" || r.status === "kommende"
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
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          Opret reservation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon="✅" title="Aktive" value={stats.aktive} color="bg-green-50" textColor="text-green-600" />
        <StatCard icon="📅" title="Denne uge" value={stats.denneUge} color="bg-orange-50" textColor="text-orange-600" />
        <StatCard icon="📋" title="Kommende" value={stats.kommende} color="bg-blue-50" textColor="text-blue-600" />
        <StatCard icon="❌" title="Udløbne" value={stats.udløbne} color="bg-gray-50" textColor="text-gray-600" />
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

      {/* Filters */}
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
                {f === "alle" ? "Alle" : f === "kommende" ? "Kommende" : f === "aktive" ? "Aktive" : "Udløbne"}
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
                view === "liste" ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setView("kalender")}
              className={`px-3 py-1 rounded transition-colors text-sm flex items-center gap-1 ${
                view === "kalender" ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-900"
              }`}
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
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      ) : (
        <KalenderView reservations={filteredAndSorted} />
      )}

      {/* Modals */}
      {openModal === "create" || openModal === "edit" ? (
        <ReservationModal
          isOpen={openModal === "create" || openModal === "edit"}
          title={editingId ? "Redigér reservation" : "Opret reservation"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => setOpenModal(null)}
          errorMessage={errorMessage}
          isEdit={!!editingId}
          items={mockInventoryItems}
          members={mockMembers}
        />
      ) : null}

      {openModal === "delete" ? (
        <DeleteConfirmDialog
          onConfirm={handleDelete}
          onCancel={() => {
            setOpenModal(null);
            setDeleteConfirmId(null);
          }}
          itemName={reservations.find((r) => r.id === deleteConfirmId)?.item || ""}
        />
      ) : null}
    </div>
  );
}

function StatCard({ icon, title, value, color, textColor }: any) {
  return (
    <div className={`${color} rounded-lg shadow p-4 border border-gray-200`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-xs text-gray-600 font-semibold uppercase">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function ListeView({ reservations, expandedAction, onToggleAction, onEdit, onDelete }: any) {
  return (
    <div className="space-y-3">
      {reservations.map((res: any) => (
        <Link key={res.id} href={`/inventory/${res.itemId}`}>
          <div
            className={`bg-white rounded-lg shadow border p-4 md:p-6 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer ${getStatusColor(
              res.status
            )}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
              {/* Billede & Navn */}
              <div className="flex items-start gap-3">
                <span className="text-4xl">{res.billede}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{res.item}</h3>
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
                <span className={`inline-block text-xs font-bold px-3 py-2 rounded-full ${getStatusBadgeColor(res.status)}`}>
                  {getStatusLabel(res.status)}
                </span>
              </div>

              {/* Action Toggle */}
              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleAction(expandedAction === res.id ? null : res.id);
                  }}
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
              {res.noter && (
                <div>
                  <p className="text-gray-600">Noter: {res.noter}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            {expandedAction === res.id && (
              <div
                className="mt-4 pt-4 border-t flex flex-col md:flex-row gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(res);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Redigér
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(res.id);
                  }}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Annullér
                </button>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function KalenderView({ reservations }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Kalendervisning kommer snart...</p>
    </div>
  );
}

function ReservationModal({ isOpen, title, formData, setFormData, onSubmit, onClose, errorMessage, isEdit, items, members }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enhed</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Vælg enhed...</option>
                  {items.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medlem</label>
                <select
                  value={formData.medlem}
                  onChange={(e) => setFormData({ ...formData, medlem: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Vælg medlem...</option>
                  {members.map((member: any) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Startdato</label>
            <input
              type="date"
              value={formData.startdato}
              onChange={(e) => setFormData({ ...formData, startdato: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slutdato</label>
            <input
              type="date"
              value={formData.slutdato}
              onChange={(e) => setFormData({ ...formData, slutdato: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Noter</label>
            <textarea
              value={formData.noter}
              onChange={(e) => setFormData({ ...formData, noter: e.target.value })}
              placeholder="Valgfrit"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Annullér
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isEdit ? "Gem ændringer" : "Opret"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmDialog({ onConfirm, onCancel, itemName }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Annullér reservation?</h2>
              <p className="text-sm text-gray-600 mt-1">
                Er du sikker på at du vil annullere reservationen for <strong>{itemName}</strong>? Denne handling kan ikke fortrydes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          <button onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Nej, behold
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Ja, annullér
          </button>
        </div>
      </div>
    </div>
  );
}
