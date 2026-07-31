import { useState } from "react";
import { ArrowUpRight, ChevronDown, Github } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Column template for the work selection table. The head row in Projects.tsx
 * uses the same string, so head and cells stay in one grid.
 *
 * Mobile drops to three columns (№ / name+lang / links); LANG moves under the
 * name and TAGS leave the row entirely — they live in the expanded panel.
 */
export const ROW_COLS =
  "grid grid-cols-[2.25rem_minmax(0,1fr)_4rem] items-center gap-x-3 gap-y-1 px-3 md:grid-cols-[2.75rem_minmax(0,1fr)_6.5rem_minmax(0,11rem)_4rem]";

/**
 * A project as a datasheet record: number, name, language, tags, links.
 *
 * Hover/focus is one of the site's three permitted motions — a flat surface
 * fill and a 2px accent bar, 150ms, no lift. On wide screens that also drives
 * the preview pane in the margin. Touch has no hover, so every row opens: the
 * name is a disclosure button revealing the description, the full tag set and
 * the screenshot where one exists.
 */
export function ProjectRow({
  project,
  no,
  onPreview,
  className,
}: {
  project: Project;
  /** Stable part number — position in projects.ts, not in the filtered view. */
  no: string;
  onPreview: (p: Project | null) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `work-${no}-detail`;

  return (
    <li className={className}>
      <div
        className="group relative border-b border-overlay/[0.14] transition-colors duration-150 hover:bg-surface focus-within:bg-surface"
        onMouseEnter={() => onPreview(project)}
        onMouseLeave={() => onPreview(null)}
        onFocus={() => onPreview(project)}
        // Tabbing name → links stays inside the row, so don't clear between them.
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) onPreview(null);
        }}
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-[2px] bg-accent opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100",
            open && "opacity-100"
          )}
        />

        <div className={cn(ROW_COLS, "py-3")}>
          <span className="u-data tnum col-start-1 row-start-1 text-faint">
            {no}
          </span>

          <h3 className="col-start-2 row-start-1 min-w-0">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              className="flex w-full items-center gap-2 text-left font-display text-base leading-snug text-ink md:text-[1.0625rem]"
            >
              <span className="truncate">{project.title}</span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-faint",
                  open && "rotate-180"
                )}
              />
            </button>
          </h3>

          <span className="u-data col-start-2 row-start-2 text-muted md:col-start-3 md:row-start-1">
            {project.lang}
          </span>

          <div className="col-start-4 row-start-1 hidden gap-1 md:flex">
            {project.tags.slice(0, 2).map((t) => (
              <span key={t} className="chip whitespace-nowrap">
                {t}
              </span>
            ))}
          </div>

          <div className="col-start-3 row-span-2 row-start-1 flex items-center justify-end gap-1 md:col-start-5 md:row-span-1">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code on GitHub`}
              title="Code"
              className="grid h-7 w-7 place-items-center text-muted transition-colors duration-150 hover:text-ink"
            >
              <Github className="h-4 w-4" />
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                title="Live"
                className="grid h-7 w-7 place-items-center text-accent transition-colors duration-150 hover:text-ink"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {open && (
          <div id={panelId} className="pb-5 pl-3 pr-3 md:pl-[4.25rem]">
            <p className="max-w-prose text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {project.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            {/* The margin pane already carries the screenshot from xl up. */}
            <ProjectPreview project={project} className="mt-4 max-w-sm xl:hidden" />
          </div>
        )}
      </div>
    </li>
  );
}

/**
 * Screenshot at its own aspect ratio inside a hairline box — never cropped.
 * Projects without an image fall back to their mark, so the preview pane keeps
 * a shape either way.
 */
export function ProjectPreview({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const Icon = project.icon;

  return (
    <div className={cn("border border-overlay/[0.14] bg-surface", className)}>
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          loading="lazy"
          className="block w-full"
        />
      ) : (
        <div className="grid aspect-[4/3] place-items-center">
          <Icon className="h-6 w-6 text-faint" strokeWidth={1.25} aria-hidden />
        </div>
      )}
    </div>
  );
}
