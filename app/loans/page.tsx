"use client";

import { useState, useEffect } from "react";
import { mockLoans } from "@/lib/mockData";

function LoanRow({ loan }: { loan: (typeof mockLoans)[0] }) {
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const tilDate = new Date(loan.til);
    const today = new Date();
    setIsOverdue(tilDate < today);
  }, [loan.til]);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {loan.item}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {loan.medlem}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {loan.fra}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {loan.til}
      </td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isOverdue
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {isOverdue ? "Forfalden" : "Aktiv"}
        </span>
      </td>
    </tr>
  );
}

export default function Loans() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Udlån</h1>
        <p className="text-gray-600 mt-1">Administrer udlånte genstande</p>
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
                  Fra dato
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Til dato
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockLoans.map((loan) => (
                <LoanRow key={loan.id} loan={loan} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
