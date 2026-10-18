"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle({ label }: { label: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* chế độ riêng tư: bỏ qua */
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={theme === "dark"}
      className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-200 hover:bg-surface-2"
    >
      <Sun className="hidden size-5 dark:block" strokeWidth={1.8} aria-hidden="true" />
      <Moon className="size-5 dark:hidden" strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
