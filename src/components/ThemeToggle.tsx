import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Light/dark theme switch. The initial theme is applied before React mounts
 * (see main.tsx) by toggling the `dark` class on <html>; this just flips it
 * and persists the choice. The preloader is intentionally left untouched.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      const root = document.documentElement;
      root.classList.toggle("dark", next);
      root.style.colorScheme = next ? "dark" : "light";
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {
        /* storage blocked — toggle still works for the session */
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg text-ink/80 transition-colors hover:bg-overlay/10 hover:text-ink",
        className
      )}
    >
      {dark ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
