"use client";

import { useState, useEffect } from "react";
import { mockReservations } from "@/lib/mockData";

function ReservationRow({
  reservation,
}: {
  reservation: (typeof mockReservations)[0];
}) {
  const [daysUntil, setDaysUntil] = useState(0);

  useEffect(() => {
    const reservationDate = new Date(reservation.dato);
    const today = new Date();
    const days = Math.ceil(
      (reservationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDaysUntil(days);
  }, [reservation.dato]);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {reservation.item}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {reservation.medlem}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {reservation.dato}
      </td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            daysUntil <= 3
              ? "bg-red-100 text-red-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {daysUntil} dage
        </span>
      </td>
    </tr>
  );
}

export default function Reservations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reservationer</h1>
        <p className="text-gray-600 mt-1">Oversigt over reserverede genstande</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Genstand
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Medlem
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Reserveringsdag
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Dage til
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockReservations.map((reservation) => (
                <ReservationRow
                  key={reservation.id}
                  reservation={reservation}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
