import { type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TechIcon, techBrand } from "@/components/TechIcon";

/**
 * §01's block diagram — the signature of the whole page (DESIGN.md § Signature).
 *
 * The NPCI stack drawn the way a datasheet draws one: labelled blocks, hairline
 * wires, directed arrowheads, and a single signal pulse walking the wires stage
 * to stage. It is the only looping animation on the site, and it earns that by
 * being the literal subject — a real event moving through a real system.
 *
 * Two implementation notes worth keeping:
 *
 * 1. Orientation. Top-to-bottom on narrow viewports, left-to-right once the
 *    five blocks + four wires fit unshrunk. That width is ~1120px, not `lg`:
 *    the blocks measure ~806px together (widest cell is "Elasticsearch") and
 *    the content column is `viewport − 48 − 200 rail − 40 gap`. Hence the
 *    `min-[1120px]:` variant rather than `lg:`.
 *
 * 2. One pulse animation for both orientations. Each wire is 0px on its cross
 *    axis (`h-9 w-0` vertical, `h-0 w-10` horizontal), so the pulse can animate
 *    BOTH `left` and `top` from 0% to 100% and the unused axis contributes
 *    exactly nothing. No media-query hook, no second code path.
 *
 * Opacity modifiers are bracketed (`/[0.28]`, not `/28`) — Tailwind's scale has
 * no 28 and a bare `/28` silently generates nothing.
 */

type Stage = {
  label: string;
  /** What the stage does, in the author's own terms. */
  note: string;
  tech: string[];
};

const stages: Stage[] = [
  { label: "Ingest", note: "Edge + routing", tech: ["Nginx"] },
  { label: "Stream", note: "Event backbone", tech: ["Apache Kafka"] },
  { label: "Store", note: "Durable + hot", tech: ["Cassandra", "KeyDB"] },
  { label: "Serve", note: "Services", tech: ["Java"] },
  {
    label: "Observe",
    note: "Metrics + logs",
    tech: ["Prometheus", "Grafana", "Elasticsearch", "Logstash", "Kibana"],
  },
];

/* Seconds. Exactly one pulse is in flight: wire i departs at i*STEP, the chain
   rests for REST at the end, then the whole cycle repeats. */
const TRAVEL = 0.8;
const STEP = 0.9;
const REST = 1.3;
const CYCLE = (stages.length - 1) * STEP + REST;

/** One labelled block. A row on narrow screens, a column in the wide diagram. */
function Block({ stage, n }: { stage: Stage; n: number }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-5 border border-overlay/[0.28] bg-surface px-4 py-3.5 min-[1120px]:flex-1 min-[1120px]:flex-col min-[1120px]:items-stretch min-[1120px]:justify-start min-[1120px]:gap-4">
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="u-label tnum">{String(n).padStart(2, "0")}</span>
          <span className="u-label text-ink">{stage.label}</span>
        </div>
        <p className="mt-1.5 font-mono text-[0.6875rem] leading-tight text-muted">
          {stage.note}
        </p>
      </div>

      <ul className="flex shrink-0 flex-col gap-1.5">
        {stage.tech.map((t) => (
          <li
            key={t}
            style={{ "--brand": techBrand[t] ?? "currentColor" } as CSSProperties}
            className="group/t flex items-center gap-2 whitespace-nowrap"
          >
            <TechIcon
              name={t}
              className="h-[13px] w-[13px] shrink-0 text-faint transition-colors duration-150 group-hover/t:text-[color:var(--brand)]"
            />
            <span className="u-data text-muted">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Hairline wire + arrowhead + the travelling pulse. Purely graphic. */
function Wire({ delay, still }: { delay: number; still: boolean }) {
  return (
    <div
      aria-hidden
      className="relative h-9 w-0 self-center min-[1120px]:h-0 min-[1120px]:w-10"
    >
      {/* The wire. 1px on its cross axis, nudged half a pixel so it sits
          centred on the arrowhead and the pulse. */}
      <span className="absolute left-0 top-0 -ml-[0.5px] h-full w-px bg-overlay/[0.28] min-[1120px]:ml-0 min-[1120px]:-mt-[0.5px] min-[1120px]:h-px min-[1120px]:w-full" />

      {/* Arrowhead at the far end. One triangle, rotated for the vertical flow.
          left-full/top-full lands on the end point in either orientation. */}
      <svg
        viewBox="0 0 6 6"
        fill="currentColor"
        className="absolute left-full top-full h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rotate-90 text-overlay/[0.28] min-[1120px]:rotate-0"
      >
        <path d="M0 0L6 3L0 6Z" />
      </svg>

      {/* The event in transit. Nothing else on this site loops. */}
      {!still && (
        <motion.span
          className="absolute -m-[3.5px] h-[7px] w-[7px] bg-accent"
          initial={{ left: "0%", top: "0%" }}
          animate={{ left: "100%", top: "100%" }}
          transition={{
            duration: TRAVEL,
            ease: [0.6, 0, 0.4, 1],
            repeat: Infinity,
            repeatDelay: CYCLE - TRAVEL,
            delay,
          }}
        />
      )}
    </div>
  );
}

export function StackTopology() {
  const reduce = useReducedMotion();

  return (
    <figure>
      <figcaption className="u-label mb-5">How an AEPS event moves</figcaption>

      <ol className="flex flex-col min-[1120px]:flex-row min-[1120px]:items-stretch">
        {stages.map((stage, i) => (
          <li
            key={stage.label}
            className="flex min-w-0 flex-col min-[1120px]:flex-auto min-[1120px]:flex-row min-[1120px]:items-stretch"
          >
            <Block stage={stage} n={i + 1} />
            {i < stages.length - 1 && (
              <Wire delay={i * STEP} still={Boolean(reduce)} />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-overlay/[0.14] pt-4">
        <span className="u-label flex items-center gap-2 text-muted">
          <TechIcon name="Docker" className="h-3.5 w-3.5 shrink-0" />
          Every stage containerised
        </span>
        {!reduce && (
          <span className="u-label flex items-center gap-2 text-muted">
            <span aria-hidden className="h-[7px] w-[7px] shrink-0 bg-accent" />
            Pulse = one event in transit
          </span>
        )}
      </div>
    </figure>
  );
}
