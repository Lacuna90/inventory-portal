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
  if (status === "kommende") return "bg-blue-500/5 border-blue-500/20";
  if (status === "aktiv") return "bg-green-500/5 border-green-500/20";
  return "bg-muted/30 border-border";
}

function getStatusBadgeColor(status: string): string {
  if (status === "kommende") return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
  if (status === "aktiv") return "bg-green-500/10 text-green-700 dark:text-green-400";
  return "bg-muted text-muted-foreground";
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
          <h1 className="text-3xl font-bold text-foreground">Reservationer</h1>
          <p className="text-muted-foreground mt-1">Administrer enhedsreservationer</p>
        </div>
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          Opret reservation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon="✅" title="Aktive" value={stats.aktive} color="bg-green-500/10" textColor="text-green-600 dark:text-green-400" />
        <StatCard icon="📅" title="Denne uge" value={stats.denneUge} color="bg-orange-500/10" textColor="text-orange-600 dark:text-orange-400" />
        <StatCard icon="📋" title="Kommende" value={stats.kommende} color="bg-blue-500/10" textColor="text-blue-600 dark:text-blue-400" />
        <StatCard icon="❌" title="Udløbne" value={stats.udløbne} color="bg-muted" textColor="text-muted-foreground" />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Søg efter enhed, medlem eller kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border bg-card text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
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
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
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
              className="px-4 py-2 border border-border bg-card text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-10 text-sm"
            >
              <option value="start">Sorter efter startdato</option>
              <option value="slut">Sorter efter slutdato</option>
              <option value="navn">Sorter efter navn</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setView("liste")}
              className={`px-3 py-1 rounded transition-colors text-sm ${
                view === "liste" ? "bg-card text-primary shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setView("kalender")}
              className={`px-3 py-1 rounded transition-colors text-sm flex items-center gap-1 ${
                view === "kalender" ? "bg-card text-primary shadow" : "text-muted-foreground hover:text-foreground"
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
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">Ingen reservationer fundet</p>
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
    <div className={`${color} rounded-lg shadow p-4 border border-border bg-card`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase">{title}</p>
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
            className={`bg-card rounded-lg shadow border p-4 md:p-6 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer ${getStatusColor(
              res.status
            )}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
              {/* Billede & Navn */}
              <div className="flex items-start gap-3">
                <span className="text-4xl">{res.billede}</span>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground line-clamp-2">{res.item}</h3>
                    <p className="text-xs text-muted-foreground">{res.kategori}</p>
                </div>
              </div>

              {/* Medlem */}
              <div className="hidden md:block">
                  <p className="font-medium text-foreground">{res.medlem}</p>
              </div>

              {/* Datoer */}
              <div className="hidden lg:block text-sm">
                  <p className="text-muted-foreground">
                    Start: <span className="font-medium text-foreground">{res.startdato}</span>
                </p>
                  <p className="text-muted-foreground">
                    Slut: <span className="font-medium text-foreground">{res.slutdato}</span>
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
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedAction === res.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Mobile Info */}
            <div className="md:hidden mt-4 pt-4 border-t border-border space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Medlem: {res.medlem}</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  Start: <span className="font-medium text-foreground">{res.startdato}</span>
                </p>
                <p className="text-muted-foreground">
                  Slut: <span className="font-medium text-foreground">{res.slutdato}</span>
                </p>
              </div>
              {res.noter && (
                <div>
                  <p className="text-muted-foreground">Noter: {res.noter}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            {expandedAction === res.id && (
              <div
                className="mt-4 pt-4 border-t border-border flex flex-col md:flex-row gap-2"
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
                  className="flex-1 px-4 py-2 bg-primary/10 text-primary dark:text-primary/80 rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
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
                  className="flex-1 px-4 py-2 bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
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
    <div className="bg-card rounded-lg shadow p-6 border border-border">
      <p className="text-muted-foreground">Kalendervisning kommer snart...</p>
    </div>
  );
}

function ReservationModal({ isOpen, title, formData, setFormData, onSubmit, onClose, errorMessage, isEdit, items, members }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-card flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
            </div>
          )}

          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Enhed</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  className="w-full px-4 py-2 border border-border bg-card text-foreground rounded-lg focus:ring-2 focus:ring-primary"
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
                <label className="block text-sm font-medium text-foreground mb-2">Medlem</label>
                <select
                  value={formData.medlem}
                  onChange={(e) => setFormData({ ...formData, medlem: e.target.value })}
                  className="w-full px-4 py-2 border border-border bg-card text-foreground rounded-lg focus:ring-2 focus:ring-primary"
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
            <label className="block text-sm font-medium text-foreground mb-2">Startdato</label>
            <input
              type="date"
              value={formData.startdato}
              onChange={(e) => setFormData({ ...formData, startdato: e.target.value })}
              className="w-full px-4 py-2 border border-border bg-card text-foreground rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Slutdato</label>
            <input
              type="date"
              value={formData.slutdato}
              onChange={(e) => setFormData({ ...formData, slutdato: e.target.value })}
              className="w-full px-4 py-2 border border-border bg-card text-foreground rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Noter</label>
            <textarea
              value={formData.noter}
              onChange={(e) => setFormData({ ...formData, noter: e.target.value })}
              placeholder="Valgfrit"
              rows={3}
              className="w-full px-4 py-2 border border-border bg-card text-foreground rounded-lg focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
            Annullér
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-sm w-full border border-border">
        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Annullér reservation?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Er du sikker på at du vil annullere reservationen for <strong>{itemName}</strong>? Denne handling kan ikke fortrydes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border">
          <button onClick={onCancel} className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
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
