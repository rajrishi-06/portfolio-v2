import { useEffect, useState } from "react";
import { Menu, X, Github, Linkedin, FileText } from "lucide-react";
import { nav, site } from "@/data/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Running header: flush to the top edge, full width, one hairline beneath it.
 * No float, no radius, no shadow, no blur.
 *
 * Deliberately dumb — there is no scroll-spy indicator and no scroll listener.
 * Every section carries a sticky numbered rail that does the wayfinding
 * (DESIGN.md § Layout), so a second, fragile position readout in the nav would
 * only say the same thing twice.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-overlay/[0.14] bg-bg">
        <div className="container-wide flex h-14 items-center justify-between gap-4">
          {/* Wordmark: type, not a badge. The accent appears exactly once. */}
          <a
            href="#top"
            className="font-mono text-[0.8125rem] leading-none tracking-[0.18em] text-ink"
          >
            RAJ RISHI<span className="text-accent">.</span>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            <nav className="flex items-center gap-6">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="u-label border-b border-transparent pb-0.5 text-muted transition-colors duration-150 hover:border-accent hover:text-ink"
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <span aria-hidden className="h-4 w-px bg-overlay/[0.28]" />

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-8 w-8 place-items-center text-muted transition-colors duration-150 hover:bg-overlay/[0.06] hover:text-ink"
              >
                <Github className="h-4 w-4" />
              </a>
              <a href={site.resume} target="_blank" rel="noopener noreferrer">
                <Button className="h-8 px-3.5">
                  <FileText className="h-3.5 w-3.5" /> Resume
                </Button>
              </a>
            </div>
          </div>

          {/* Mobile: the theme toggle stays on the bar so it is always one tap
              away; only the links collapse into the sheet. */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center text-ink"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet — a flat continuation of the header, not a floating card. */}
      {open && (
        <div className="border-b border-overlay/[0.28] bg-bg md:hidden">
          <nav className="container-wide flex flex-col divide-y divide-overlay/[0.14]">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-3.5 font-mono text-sm uppercase tracking-label text-muted transition-colors duration-150 hover:text-ink"
              >
                {n.label}
              </a>
            ))}
            <div className="flex items-center gap-2 py-4">
              <a
                href={site.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                <Button className="w-full">
                  <FileText className="h-4 w-4" /> Resume
                </Button>
              </a>
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Button variant="outline" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
              </a>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Button variant="outline" size="icon">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
