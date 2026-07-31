import { type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TechIcon, techBrand } from "@/components/TechIcon";

/**
 * The NPCI stack, arranged as the pipeline it actually is rather than as an
 * anonymous logo strip. Each stage is a step a payment event passes through;
 * the pulse travelling the connector is the event moving between them.
 *
 * This is the section's whole idea: motion here means something moved, so the
 * only thing that animates is the thing in transit.
 */
type Stage = {
  label: string;
  /** What this stage does, in the author's own terms. */
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

function Chip({ name }: { name: string }) {
  return (
    <span
      style={{ "--brand": techBrand[name] ?? "#5b9dff" } as CSSProperties}
      className="group/chip inline-flex items-center gap-2 rounded-lg border border-overlay/10 bg-overlay/[0.03] px-2.5 py-1.5 text-[13px] text-ink/90 transition-colors duration-200 hover:border-overlay/20 hover:bg-overlay/[0.06]"
    >
      <TechIcon
        name={name}
        className="h-[15px] w-[15px] shrink-0 text-faint transition-colors duration-200 group-hover/chip:text-[color:var(--brand)]"
      />
      {name}
    </span>
  );
}

export function StackTopology() {
  const reduce = useReducedMotion();

  return (
    <div>
      <div className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-faint">
        How an AEPS event moves
      </div>

      <ol className="relative flex flex-col gap-3">
        {stages.map((stage, i) => (
          <li key={stage.label} className="relative flex gap-4">
            {/* Rail: node + connector down to the next stage */}
            <div
              aria-hidden
              className="relative flex w-4 shrink-0 flex-col items-center pt-2"
            >
              <span className="relative z-10 h-2 w-2 rounded-full bg-accent-bright ring-4 ring-bg" />
              {/* Rail opacity is /[0.14], not /14: Tailwind's default opacity scale
                  has no 14, so a bare /14 generates no rule and the rail vanishes. */}
              {i < stages.length - 1 && (
                <span className="relative mt-1 w-px flex-1 overflow-hidden bg-overlay/[0.14]">
                  {/* The event in transit. Nothing else on this page loops. */}
                  {!reduce && (
                    <motion.span
                      className="absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-accent-bright to-transparent"
                      initial={{ top: "-24px" }}
                      animate={{ top: "100%" }}
                      transition={{
                        duration: 1.1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: stages.length * 0.55,
                        delay: i * 0.55,
                      }}
                    />
                  )}
                </span>
              )}
            </div>

            {/* Stage */}
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
                  {stage.label}
                </span>
                <span className="text-xs text-faint">{stage.note}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {stage.tech.map((t) => (
                  <Chip key={t} name={t} />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-center gap-2 border-t border-overlay/[0.07] pt-4 text-xs text-faint">
        <TechIcon name="Docker" className="h-4 w-4" />
        Every stage containerised
      </div>
    </div>
  );
}
