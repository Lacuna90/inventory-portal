"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import {
  dashboardStats,
  dashboardPreferences,
  mockLoans,
  mockActivity,
  topBorrowedItems,
} from "@/lib/mockData";

export default function Dashboard() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [widgets, setWidgets] = useState(dashboardPreferences.widgets);
  const loansExpiringSoon = mockLoans.filter((l) => l.status === "snartForfalden");

  const toggleWidget = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const getWidgetStatus = (widgetId: string) => {
    return widgets.find((w) => w.id === widgetId)?.enabled ?? false;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Velkommen til Inventar Portal</p>
        </div>
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-lg font-medium transition-opacity w-full sm:w-auto"
        >
          <Settings className="w-5 h-5" />
          <span>Tilpas dashboard</span>
        </button>
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Vælg widgets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dashboardPreferences.widgets.map((widget) => (
              <label key={widget.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={getWidgetStatus(widget.id)}
                  onChange={() => toggleWidget(widget.id)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-foreground">{widget.label}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() => setShowPreferences(false)}
            className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
          >
            Lukk
          </button>
        </div>
      )}

      {/* Statistics Cards - 5 items mobile, responsive */}
      {(getWidgetStatus("totalInventar") ||
        getWidgetStatus("hjemme") ||
        getWidgetStatus("udlånt") ||
        getWidgetStatus("reserveret") ||
        getWidgetStatus("tilSalg")) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {getWidgetStatus("totalInventar") && (
            <StatCard
              title="I alt"
              value={dashboardStats.totalItems}
              icon="📦"
            />
          )}
          {getWidgetStatus("hjemme") && (
            <StatCard
              title="Hjemme"
              value={dashboardStats.itemsHome}
              icon="🏠"
            />
          )}
          {getWidgetStatus("udlånt") && (
            <StatCard
              title="Udlånt"
              value={dashboardStats.itemsLoaned}
              icon="📤"
            />
          )}
          {getWidgetStatus("reserveret") && (
            <StatCard
              title="Reserveret"
              value={dashboardStats.itemsReserved}
              icon="📋"
            />
          )}
          {getWidgetStatus("tilSalg") && (
            <StatCard
              title="Til salg"
              value={dashboardStats.itemsForSale}
              icon="💰"
            />
          )}
        </div>
      )}

      {/* Main content grid - 1 col on mobile, 2 on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - full width on mobile, 2 cols on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Udlånt lige nu - always shown */}
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Udlånt lige nu
            </h2>
            <div className="space-y-2">
              {mockLoans.length > 0 ? (
                mockLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex justify-between items-start p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{loan.item}</p>
                      <p className="text-sm text-muted-foreground">{loan.medlem}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Retur: {loan.til}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ml-2 ${
                        loan.status === "forfalden"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : loan.status === "snartForfalden"
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                            : "bg-primary/20 text-primary"
                      }`}
                    >
                      {loan.status === "forfalden"
                        ? "Forfalden"
                        : loan.status === "snartForfalden"
                          ? "Snart"
                          : "OK"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm py-4">Ingen aktive udlån</p>
              )}
            </div>
          </div>

          {/* Skal snart retur */}
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Skal snart retur
            </h2>
            <div className="space-y-2">
              {loansExpiringSoon.length > 0 ? (
                loansExpiringSoon.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex justify-between items-center p-4 bg-secondary/10 rounded-lg border border-secondary/20"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{loan.item}</p>
                      <p className="text-sm text-muted-foreground">{loan.medlem}</p>
                    </div>
                    <span className="text-xs font-bold bg-secondary/20 text-secondary px-3 py-1 rounded-full">
                      {loan.til}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm py-4">Ingen items der snart forfalde</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Seneste aktivitet */}
        {getWidgetStatus("senessteAktivitet") && (
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Seneste aktivitet
            </h2>
            <div className="space-y-3">
              {mockActivity.map((activity) => (
                <div key={activity.id} className="border-l-2 border-primary/30 pl-4 py-2">
                  <p className="text-sm font-medium text-foreground">{activity.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.tidspunkt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top Borrowed Items */}
      {getWidgetStatus("topUdlånte") && (
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Top udlånte enheder
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topBorrowedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
              >
                <span className="text-3xl">{item.billede}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.lånCount} gange lånt</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-card rounded-lg shadow p-6 border border-border hover:shadow-lg transition-shadow">
      <div className="space-y-2">
        <div className="text-4xl">{icon}</div>
        <p className="text-sm text-muted-foreground font-medium uppercase">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
