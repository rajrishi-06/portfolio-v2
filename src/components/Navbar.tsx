import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Github, Linkedin, FileText } from "lucide-react";
import { nav, site } from "@/data/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5">
      <div
        className={cn(
          "relative mx-auto mt-3 flex h-16 max-w-[1200px] items-center justify-between rounded-2xl px-4 transition-all duration-300 sm:px-5",
          scrolled
            ? "glass-strong shadow-[0_18px_50px_-22px_rgba(0,0,0,0.95)]"
            : "border border-transparent bg-transparent"
        )}
      >
        {/* Logo */}
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-display text-lg font-bold text-white shadow-[0_6px_20px_-6px_rgb(var(--c-accent-glow)/0.6)]">
            R
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Raj <span className="text-accent-bright">Rishi</span>
          </span>
        </a>

        {/* Desktop links — absolutely centered so they stay dead-center
            regardless of the logo / action widths on either side */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-overlay/10 hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <a
            href={site.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink/80 transition-colors hover:bg-overlay/10 hover:text-ink"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          <a href={site.resume} target="_blank" rel="noopener noreferrer">
            <Button size="default" className="h-9 px-4">
              <FileText className="h-4 w-4" /> Resume
            </Button>
          </a>
        </div>

        {/* Mobile actions — the theme toggle stays permanently on the bar so it's
            always visible and one tap away; only the nav links collapse into the sheet */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle className="h-10 w-10 rounded-xl glass-strong" />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl glass-strong text-ink"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-2 overflow-hidden rounded-2xl glass-strong p-2 md:hidden"
          >
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-medium text-ink/90 hover:bg-overlay/10 hover:text-ink"
              >
                {n.label}
              </a>
            ))}
            <div className="mt-1 flex items-center gap-2 px-2 pb-1 pt-2">
              <a href={site.resume} target="_blank" rel="noopener noreferrer" className="flex-1" onClick={() => setOpen(false)}>
                <Button className="w-full">
                  <FileText className="h-4 w-4" /> Resume
                </Button>
              </a>
              <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
              </a>
              <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
