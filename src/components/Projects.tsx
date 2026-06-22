import { useEffect, useMemo, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import {
  Github,
  ChevronDown,
  Search,
  X,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const breakpoints = {
  default: 3,
  1100: 3,
  900: 2,
  640: 1,
};

// How many projects stay visible on small screens before "Show more".
// Larger screens (sm+) always show everything — the collapse is mobile-only.
const MOBILE_VISIBLE = 4;

// Language chips are derived from the data, so any project added to
// projects.ts automatically gets its filter — no extra wiring needed.
const languages = ["All", ...Array.from(new Set(projects.map((p) => p.lang)))];

/**
 * Compact filter trigger + popover. Sits directly left of the search box so the
 * two controls read as one group instead of being pushed to opposite edges.
 */
function FilterMenu({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = value !== "All";

  // Close on outside click / Escape while the popover is open.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Filter projects by language"
        className={cn(
          "flex h-11 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors",
          active
            ? "border-accent-bright/50 bg-overlay/[0.05] text-ink"
            : "border-overlay/10 bg-overlay/[0.03] text-muted hover:border-overlay/25 hover:text-ink"
        )}
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="hidden sm:inline">{active ? value : "Filter"}</span>
        {active && (
          <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" aria-hidden />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+8px)] z-20 w-44 overflow-hidden rounded-xl glass-strong p-1.5 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.9)]"
        >
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wider text-faint">
            Language
          </p>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role="menuitemradio"
              aria-checked={value === o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors",
                value === o
                  ? "bg-overlay/[0.06] text-ink"
                  : "text-muted hover:bg-overlay/[0.04] hover:text-ink"
              )}
            >
              {o}
              {value === o && <Check className="h-4 w-4 text-accent-bright" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Projects() {
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("All");

  // Instant, case-insensitive match across title, description, language and
  // tags — memoised so it only recomputes when the inputs actually change.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const byLang = lang === "All" || p.lang === lang;
      const byQuery =
        !q ||
        [p.title, p.description, p.lang, ...p.tags]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return byLang && byQuery;
    });
  }, [query, lang]);

  // Each new result set starts collapsed on mobile, so "Show more" applies to
  // searches and filters just like the default browse.
  useEffect(() => {
    setShowAll(false);
  }, [query, lang]);

  const hiddenCount = filtered.length - MOBILE_VISIBLE;

  const clearAll = () => {
    setQuery("");
    setLang("All");
  };

  return (
    <section id="work" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-wide">
        <Reveal>
          <span className="eyebrow">Selected work</span>
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="section-title max-w-xl">
              Projects I've <span className="text-gradient">designed & built</span>
            </h2>
            <p className="max-w-sm text-muted">
              A mix of web apps, desktop tools and automation. Hover any card — they
              reflow to fit, just like a gallery should.
            </p>
          </div>
        </Reveal>

        {/* Filter (popover) + search, grouped together on the left so they stay
            close instead of being pushed to opposite edges on wide screens. */}
        <Reveal delay={0.05} className="mt-10">
          <div className="flex items-center gap-2">
            <FilterMenu options={languages} value={lang} onChange={setLang} />
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, tech, keywords…"
                aria-label="Search projects"
                aria-controls="project-grid"
                // 16px on mobile avoids the focus auto-zoom; text-sm from sm: up.
                className="h-11 w-full rounded-xl border border-overlay/10 bg-overlay/[0.03] pl-10 pr-10 text-base text-ink outline-none transition-colors placeholder:text-faint focus:border-accent-bright/60 focus:bg-overlay/[0.05] sm:text-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-faint transition-colors hover:bg-overlay/10 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"} found
          </p>
        </Reveal>

        <div id="project-grid" className="mt-8">
          {filtered.length > 0 ? (
            <Reveal delay={0.1}>
              <Masonry
                breakpointCols={breakpoints}
                className="masonry-grid"
                columnClassName="masonry-grid_column"
              >
                {filtered.map((p, i) => (
                  <ProjectCard
                    key={p.title}
                    project={p}
                    // On mobile, collapse everything past the first few behind
                    // "Show more" — for default browse, searches and filters
                    // alike. From sm: up everything is always shown.
                    className={cn(
                      i >= MOBILE_VISIBLE && !showAll && "hidden sm:block"
                    )}
                  />
                ))}
              </Masonry>
            </Reveal>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-overlay/15 bg-overlay/[0.02] px-6 py-16 text-center">
              <Search className="h-7 w-7 text-faint" />
              <p className="mt-4 text-base font-medium text-ink">
                No projects found
              </p>
              <p className="mt-1 max-w-xs text-sm text-muted">
                Nothing matched your search. Try a different keyword or language.
              </p>
              <Button variant="outline" className="mt-5" onClick={clearAll}>
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Mobile-only "Show more / less" — works for the default list, searches
            and filters; only appears when the current result set overflows. */}
        {hiddenCount > 0 && (
          <div className="mt-8 flex justify-center sm:hidden">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
            >
              {showAll ? "Show less" : `Show ${hiddenCount} more`}
              <ChevronDown
                className={cn(
                  "h-5 w-5 transition-transform",
                  showAll && "rotate-180"
                )}
              />
            </Button>
          </div>
        )}

        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <Github className="h-5 w-5" /> See everything on GitHub
              </Button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
