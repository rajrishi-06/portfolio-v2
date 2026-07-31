/**
 * The identification plate: a Lissajous figure, plotted live.
 *
 * Datasheets carry plots, and an XY figure is what a scope draws when you feed
 * it two related signals — instrument vernacular rather than ornament. It makes
 * no claim: there are no numbers and no axis labels, so it states nothing that
 * would need to be true.
 *
 * Everything animating here is CSS on `stroke-dashoffset` and `offset-distance`,
 * so it composites without touching the main thread, and it stops dead under
 * `prefers-reduced-motion` (see index.css) leaving the completed figure.
 */

const SIZE = 200;
const R = 78;
/** 5:4 frequency ratio — closes on itself, and is busy enough to read as a
 *  signal rather than as a circle. */
const FX = 5;
const FY = 4;
const STEPS = 720;
/** Fraction of the figure lit by the sweeping arc. Also the head's phase — the
 *  head sits at the arc's leading edge, which is ARC ahead of the dash origin. */
const ARC = 0.18;

/** The figure, and its length, computed once at module load. */
const { d, length } = (() => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * Math.PI * 2;
    pts.push([
      SIZE / 2 + R * Math.sin(FX * t + Math.PI / 2),
      SIZE / 2 + R * Math.sin(FY * t),
    ]);
  }

  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }

  const path =
    pts
      .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`)
      .join("") + "Z";

  return { d: path, length: len };
})();

export function HeroFigure() {
  return (
    <figure className="m-0 w-full max-w-[320px]">
      <div className="relative border border-overlay/[0.28] bg-bg">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block h-auto w-full"
          role="img"
          aria-label="A Lissajous figure being plotted, drawn as a decorative instrument readout"
        >
          {/* Plot grid — finer than the page's graph paper, and clipped to the
              plate so it reads as the instrument's own scale. */}
          <g stroke="currentColor" className="text-overlay/[0.14]">
            {Array.from({ length: 9 }, (_, i) => {
              const p = ((i + 1) * SIZE) / 10;
              return (
                <g key={p}>
                  <line x1={p} y1="0" x2={p} y2={SIZE} strokeWidth="0.5" />
                  <line x1="0" y1={p} x2={SIZE} y2={p} strokeWidth="0.5" />
                </g>
              );
            })}
            {/* Centre cross, drawn heavier */}
            <line x1={SIZE / 2} y1="0" x2={SIZE / 2} y2={SIZE} strokeWidth="1" />
            <line x1="0" y1={SIZE / 2} x2={SIZE} y2={SIZE / 2} strokeWidth="1" />
          </g>

          {/* The completed figure, held faint — the plot's own ghost. */}
          <path
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-overlay/[0.28]"
          />

          {/* The live trace: one bright arc sweeping the figure. */}
          <path
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="hero-trace text-accent"
            style={{
              // Dash + gap sum to exactly one path length, so the pattern wraps
              // seamlessly and the arc's leading edge advances by 1.0 of the
              // path per cycle. That is what lets the head below stay locked to
              // it with a plain linear animation instead of a JS ticker.
              strokeDasharray: `${length * ARC} ${length * (1 - ARC)}`,
              // Custom property drives the keyframe, so the path length stays
              // in one place instead of being duplicated into the CSS.
              ["--trace-len" as string]: `${length}`,
            }}
          />

          {/* The plotting head, riding the same path at the same rate. */}
          <circle
            r="3"
            className="hero-head fill-accent"
            style={{
              ["--trace-path" as string]: `path("${d}")`,
              ["--trace-from" as string]: `${ARC * 100}%`,
              ["--trace-to" as string]: `${(ARC + 1) * 100}%`,
            }}
          />
        </svg>

        {/* Corner ticks — the plate's registration marks. */}
        {[
          "left-0 top-0 border-l border-t",
          "right-0 top-0 border-r border-t",
          "left-0 bottom-0 border-b border-l",
          "right-0 bottom-0 border-b border-r",
        ].map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`pointer-events-none absolute h-2.5 w-2.5 border-ink ${pos}`}
          />
        ))}
      </div>

      <figcaption className="u-label mt-3 flex items-baseline justify-between gap-3">
        <span>Fig. 1</span>
        <span>
          Lissajous {FX}:{FY}
        </span>
      </figcaption>
    </figure>
  );
}
