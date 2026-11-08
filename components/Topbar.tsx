"use client";

import { Package } from "lucide-react";

export function Topbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-50">
      <div className="flex items-center gap-3">
        <Package className="w-6 h-6 text-slate-900" />
        <h1 className="text-xl font-bold text-slate-900">Inventar Portal</h1>
      </div>
    </header>
  );
}
