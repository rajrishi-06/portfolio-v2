import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Light/dark theme switch. The initial theme is resolved before first paint by
 * the inline script in index.html, which sets the `dark` class on <html>; this
 * just flips it and persists the choice.
 *
 * The visible mono label names the *target* theme, so it matches the
 * aria-label rather than contradicting it.
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
        "u-label inline-flex h-8 items-center gap-1.5 border border-overlay/[0.14] px-2 text-muted transition-colors duration-150 hover:border-overlay/40 hover:text-ink",
        className
      )}
    >
      {dark ? (
        <Sun className="h-3.5 w-3.5" />
      ) : (
        <Moon className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
