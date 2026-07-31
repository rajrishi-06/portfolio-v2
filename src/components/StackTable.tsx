import { type CSSProperties } from "react";
import { TechIcon, techBrand } from "@/components/TechIcon";

/**
 * The NPCI stack, as a characteristics table.
 *
 * This deliberately does NOT depict how the system is put together — no order,
 * no flow, no stages. An earlier version drew the pipeline as a block diagram;
 * it was removed because a public portfolio is the wrong place to publish an
 * employer's internal architecture. The technologies themselves are ordinary
 * resume material, so they stay; the shape of the system does not.
 *
 * If you are tempted to re-add arrows here, that is the line being crossed.
 */

const groups: { label: string; tech: string[] }[] = [
  { label: "Streaming", tech: ["Apache Kafka"] },
  { label: "Storage", tech: ["Cassandra", "KeyDB"] },
  { label: "Services", tech: ["Java", "Nginx"] },
  {
    label: "Observability",
    tech: ["Prometheus", "Grafana", "Elasticsearch", "Logstash", "Kibana"],
  },
  { label: "Runtime", tech: ["Docker"] },
];

export function StackTable() {
  return (
    <div>
      <div className="grid gap-1 border-y border-overlay/[0.28] py-2 sm:grid-cols-[10rem_1fr] sm:gap-6">
        <span className="u-label">Area</span>
        <span className="u-label">Tools</span>
      </div>

      <dl>
        {groups.map((g) => (
          <div
            key={g.label}
            className="grid gap-2 border-b border-overlay/[0.14] py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
          >
            <dt className="u-label sm:pt-[7px]">{g.label}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {g.tech.map((t) => (
                <span
                  key={t}
                  style={{ "--brand": techBrand[t] ?? "currentColor" } as CSSProperties}
                  className="chip group/chip"
                >
                  <TechIcon
                    name={t}
                    className="h-3 w-3 shrink-0 text-faint transition-colors duration-150 group-hover/chip:text-[color:var(--brand)]"
                  />
                  {t}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
