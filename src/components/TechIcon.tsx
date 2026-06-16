import { techPaths } from "@/data/techPaths";

/** Map a human-readable skill label → simple-icons slug in techPaths. */
const slugFor: Record<string, string> = {
  Python: "python",
  JavaScript: "javascript",
  TypeScript: "typescript",
  "C++": "cplusplus",
  Java: "openjdk",
  React: "react",
  "Node.js": "nodedotjs",
  Flask: "flask",
  Svelte: "svelte",
  Tailwind: "tailwindcss",
  Git: "git",
  Docker: "docker",
  Selenium: "selenium",
  Linux: "linux",
  Figma: "figma",
  // Stack for the "Currently building at NPCI" marquee
  "Apache Kafka": "apachekafka",
  Kafka: "apachekafka",
  Cassandra: "apachecassandra",
  KeyDB: "redis",
  Redis: "redis",
  Nginx: "nginx",
  Elasticsearch: "elasticsearch",
  Kibana: "kibana",
  Logstash: "logstash",
  Grafana: "grafana",
  Prometheus: "prometheus",
};

/** Brand colour used for the hover tint (CSS var --brand on the chip). */
export const techBrand: Record<string, string> = {
  Python: "#3776AB",
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  "C++": "#00599C",
  Java: "#E76F00",
  SQL: "#38BDF8",
  React: "#61DAFB",
  "Node.js": "#5FA04E",
  Flask: "#E8E8E8",
  Svelte: "#FF3E00",
  Tailwind: "#38BDF8",
  Git: "#F05032",
  Docker: "#2496ED",
  Selenium: "#43B02A",
  Linux: "#FCC624",
  Figma: "#F24E1E",
};

/**
 * Renders a crisp, tintable brand logo for a tech-stack label.
 * Brand marks are vendored locally (no runtime CDN). SQL has no brand, so it
 * gets a hand-drawn database glyph that matches the stroke style of the set.
 */
export function TechIcon({ name, className }: { name: string; className?: string }) {
  if (name === "SQL") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      </svg>
    );
  }

  const d = techPaths[slugFor[name]];
  if (!d) return null;

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
