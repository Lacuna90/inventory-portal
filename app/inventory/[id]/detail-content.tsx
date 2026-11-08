"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { mockInventoryItems } from "@/lib/mockData";

type Item = (typeof mockInventoryItems)[0];

const statusLabels: Record<string, { label: string; color: string }> = {
  hjemme: { label: "Hjemme", color: "bg-green-100 text-green-800" },
  udlånt: { label: "Udlånt", color: "bg-orange-100 text-orange-800" },
  reserveret: { label: "Reserveret", color: "bg-purple-100 text-purple-800" },
  til_salg: { label: "Til salg", color: "bg-blue-100 text-blue-800" },
  solgt: { label: "Solgt", color: "bg-gray-100 text-gray-800" },
  defekt: { label: "Defekt", color: "bg-red-100 text-red-800" },
};

export default function DetailContent({
  item,
}: {
  item: Item;
}) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<"lån" | "reservering" | "redigér" | null>(null);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/inventory"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Tilbage til inventar</span>
      </Link>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Image & Basic Info */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-12 text-center">
            <span className="text-8xl">{item.billede}</span>
          </div>

          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">Navn</p>
              <p className="text-xl font-bold text-gray-900">{item.name}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">Kategori</p>
              <p className="text-gray-900">{item.kategori}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">Status</p>
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-1 ${
                  statusLabels[item.status].color
                }`}
              >
                {statusLabels[item.status].label}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Details & Actions */}
        <div className="md:col-span-2 space-y-4">
          {/* Details Card */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Detaljer</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Beskrivelse</p>
                <p className="text-gray-900 mt-1">{item.beskrivelse}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Lokation</p>
                <p className="text-gray-900 font-semibold mt-1">{item.lokation}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Serienummer</p>
                <p className="text-gray-900 font-mono text-sm mt-1">{item.serienummer || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Købt pris</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{(item as any).købtPris?.toLocaleString("da-DK")} kr</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Salgspris</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{(item as any).salgsPris?.toLocaleString("da-DK")} kr</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Mængde i alt</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{item.mængde} stk</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Hjemme</p>
                <p className="text-lg font-semibold text-green-600">{item.mængdeHjemme} stk</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Udlånt</p>
                <p className="text-lg font-semibold text-orange-600">{item.mængdeUdlånt} stk</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveModal("lån")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Lån enhed
            </button>

            <button
              onClick={() => setActiveModal("reservering")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Reserver enhed
            </button>

            <button
              onClick={() => setActiveModal("redigér")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Redigér
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "lån" && (
        <Modal
          title="Lån enhed"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Medlem
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Vælg medlem...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Startdato
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Slutdato (forventet retur)
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => {
                alert("Lån registreret! (Mock)");
                setActiveModal(null);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Registrer lån
            </button>
          </div>
        </Modal>
      )}

      {activeModal === "reservering" && (
        <Modal
          title="Reserver enhed"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Medlem
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Vælg medlem...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Fra dato
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Til dato
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={() => {
                alert("Reservation oprettet! (Mock)");
                setActiveModal(null);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Opret reservation
            </button>
          </div>
        </Modal>
      )}

      {activeModal === "redigér" && (
        <Modal
          title="Redigér enhed"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Navn
              </label>
              <input
                type="text"
                defaultValue={item.name}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Lokation
              </label>
              <input
                type="text"
                defaultValue={item.lokation}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Mængde
              </label>
              <input
                type="number"
                defaultValue={item.mængde}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <button
              onClick={() => {
                alert("Enhed opdateret! (Mock)");
                setActiveModal(null);
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Gem ændringer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
