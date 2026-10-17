"use client";

import { useEffect, useState } from "react";
import type { Messages } from "@/lib/i18n";

type Theme = "light" | "dark";

export function ThemeToggle({ messages }: { messages: Messages }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);

    try {
      localStorage.setItem("pulse-theme", next);
    } catch {
      // Penyimpanan bisa diblokir. Tema tetap berlaku untuk sesi ini.
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? messages.theme.lightLabel : messages.theme.darkLabel}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[4px] border border-control px-3 text-sm text-ink transition-colors hover:border-ink"
    >
      {isDark ? messages.theme.toLight : messages.theme.toDark}
    </button>
  );
}
