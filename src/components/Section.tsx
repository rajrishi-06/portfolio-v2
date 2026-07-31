import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The page's spine. Every section is a numbered two-column record: a sticky
 * mono rail carrying the section number and label, and the content column.
 *
 * The rail is the wayfinding — it is why the nav carries no scroll-spy
 * indicator. See DESIGN.md § Layout.
 */
export function Section({
  id,
  index,
  label,
  title,
  aside,
  children,
}: {
  id: string;
  /** Section number. Real, sequential, and shown — a datasheet is numbered. */
  index: number;
  /** Rail label, e.g. "CURRENTLY". Rendered uppercase mono. */
  label: string;
  title?: ReactNode;
  /** Optional lead paragraph, set beside the title. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <DrawnRule />
      <div className="container-wide grid gap-x-10 gap-y-8 py-20 lg:grid-cols-[200px_1fr] lg:py-28">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-baseline gap-3 lg:flex-col lg:gap-1">
            <span className="u-label text-ink">
              §{String(index).padStart(2, "0")}
            </span>
            <span className="u-label">{label}</span>
          </div>
        </div>

        <div className="min-w-0">
          {title && (
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
              <h2 className="u-title max-w-xl text-balance">{title}</h2>
              {aside && (
                <p className="max-w-xs text-sm leading-relaxed text-muted">
                  {aside}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * Full-bleed hairline that draws left-to-right as the section arrives. The only
 * entrance animation on the site — content itself is present on load, so a
 * failed observer or a reduced-motion preference costs nothing but the line.
 */
export function DrawnRule({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "-10% 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-in={seen}
      aria-hidden
      // /[0.28] not /28 — 28 is off Tailwind's opacity scale, so a bare /28
      // generates no rule at all and the line silently disappears.
      className={`rule-draw h-px bg-overlay/[0.28] ${className}`}
    />
  );
}
