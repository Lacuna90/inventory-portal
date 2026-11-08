"use client";

import { Package, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 z-50 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
          <Package className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground hidden sm:block">Inventar Portal</h1>
      </div>

      {/* Theme Switcher */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setTheme("light")}
          className={`p-2 rounded transition-colors ${
            theme === "light"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Lyst tema"
        >
          <Sun className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`p-2 rounded transition-colors ${
            theme === "dark"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="Mørkt tema"
        >
          <Moon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`p-2 rounded transition-colors ${
            theme === "system"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title="System tema"
        >
          <Monitor className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
