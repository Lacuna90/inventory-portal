"use client";

import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
