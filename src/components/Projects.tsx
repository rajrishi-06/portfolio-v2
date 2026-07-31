import { useEffect, useMemo, useRef, useState } from "react";
import {
  Github,
  ChevronDown,
  Search,
  X,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { site } from "@/data/site";
import { Section } from "@/components/Section";
import { ProjectRow, ProjectPreview, ROW_COLS } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

// How many projects stay visible on small screens before "Show more".
// Larger screens (sm+) always show everything — the collapse is mobile-only.
const MOBILE_VISIBLE = 4;

// Language chips are derived from the data, so any project added to
// projects.ts automatically gets its filter — no extra wiring needed.
const languages = ["All", ...Array.from(new Set(projects.map((p) => p.lang)))];

// Part numbers are positions in projects.ts, not in the filtered view: 07 is
// always Prod_Qilo, so a search doesn't renumber the table under you.
const partNo = new Map(
  projects.map((p, i) => [p.title, String(i + 1).padStart(2, "0")])
);

// Square, mono, 1px rule. See DESIGN.md § Component rules.
const btn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-overlay/[0.28] px-4 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink transition-colors duration-150 hover:bg-surface";

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
          "flex h-10 items-center gap-2 rounded-sm border px-3 font-mono text-[0.6875rem] uppercase tracking-[0.08em] transition-colors duration-150",
          active
            ? "border-overlay/[0.28] bg-surface text-ink"
            : "border-overlay/[0.14] text-muted hover:border-overlay/40 hover:text-ink"
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{active ? value : "Filter"}</span>
        {active && (
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        )}
      </button>

      {open && (
        // Flat paper panel on a structural rule — no glass, no shadow.
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+6px)] z-20 w-48 border border-overlay/[0.28] bg-bg p-1"
        >
          <p className="u-label px-2 py-1.5">Language</p>
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
                "flex w-full items-center justify-between px-2 py-1.5 font-mono text-[0.8125rem] transition-colors duration-150",
                value === o
                  ? "bg-surface text-ink"
                  : "text-muted hover:bg-overlay/[0.05] hover:text-ink"
              )}
            >
              {o}
              {value === o && <Check className="h-3.5 w-3.5 text-accent" />}
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
  // The hovered/focused row, mirrored into the margin pane on wide screens.
  const [preview, setPreview] = useState<Project | null>(null);

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
    <Section
      id="work"
      index={2}
      label="WORK"
      title="Selected work"
      aside="A storage engine, an AI scheduler, browser and desktop tools. Open any row for the description and a screenshot where there is one."
    >
      <div className="flex items-center gap-2">
        <FilterMenu options={languages} value={lang} onChange={setLang} />
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tech, keywords…"
            aria-label="Search projects"
            aria-controls="project-index"
            // 16px on mobile avoids the focus auto-zoom; mono data size from sm: up.
            className="h-10 w-full rounded-sm border border-overlay/[0.14] bg-transparent pl-9 pr-9 font-mono text-base text-ink outline-none transition-colors duration-150 placeholder:text-faint hover:border-overlay/40 focus:border-overlay/40 sm:text-[0.8125rem]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-faint transition-colors duration-150 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"} found
      </p>

      <div className="mt-8 grid gap-x-8 gap-y-10 xl:grid-cols-[minmax(0,1fr)_200px]">
        <div id="project-index" className="min-w-0">
          {filtered.length > 0 ? (
            <>
              <div
                aria-hidden
                className={cn(ROW_COLS, "border-b border-overlay/[0.28] pb-2")}
              >
                <span className="u-label col-start-1">№</span>
                <span className="u-label col-start-2">Name</span>
                <span className="u-label col-start-3 hidden md:block">Lang</span>
                <span className="u-label col-start-4 hidden md:block">Tags</span>
                <span className="u-label col-start-3 text-right md:col-start-5">
                  Links
                </span>
              </div>

              <ul>
                {filtered.map((p, i) => (
                  <ProjectRow
                    key={p.title}
                    project={p}
                    no={partNo.get(p.title) ?? "--"}
                    onPreview={setPreview}
                    // On mobile, collapse everything past the first few behind
                    // "Show more" — for default browse, searches and filters
                    // alike. From sm: up everything is always shown.
                    className={cn(
                      i >= MOBILE_VISIBLE && !showAll && "hidden sm:block"
                    )}
                  />
                ))}
              </ul>
            </>
          ) : (
            <div className="border border-overlay/[0.14] px-6 py-14 text-center">
              <p className="u-label">No results</p>
              <p className="mx-auto mt-3 max-w-xs text-sm text-muted">
                Nothing matched your search. Try a different keyword or language.
              </p>
              <button type="button" className={cn(btn, "mt-6")} onClick={clearAll}>
                Clear filters
              </button>
            </div>
          )}

          {/* Mobile-only "Show more / less" — works for the default list,
              searches and filters; only appears when the set overflows. */}
          {hiddenCount > 0 && (
            <div className="mt-6 sm:hidden">
              <button
                type="button"
                className={cn(btn, "w-full")}
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
                aria-controls="project-index"
              >
                {showAll ? "Show less" : `Show ${hiddenCount} more`}
                <ChevronDown
                  aria-hidden
                  className={cn("h-4 w-4", showAll && "rotate-180")}
                />
              </button>
            </div>
          )}

          <div className="mt-8">
            <a
              href={site.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className={btn}
            >
              <Github className="h-4 w-4" /> See everything on GitHub
            </a>
          </div>
        </div>

        {/* Margin preview. Hover-only and duplicates the row's own content, so
            it is hidden from assistive tech; the expanded row carries the same
            screenshot and description everywhere else. */}
        <aside aria-hidden className="hidden xl:block">
          <div className="sticky top-28">
            <p className="u-label border-b border-overlay/[0.14] pb-2">Preview</p>
            {preview ? (
              <>
                <ProjectPreview project={preview} className="mt-4" />
                <p className="u-data mt-3 text-ink">{preview.title}</p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
                  {preview.description}
                </p>
              </>
            ) : (
              <p className="u-data mt-4 text-faint">Hover a row.</p>
            )}
          </div>
        </aside>
      </div>
    </Section>
  );
}
