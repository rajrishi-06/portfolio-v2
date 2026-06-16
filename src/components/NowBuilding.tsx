import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";

// The real stack behind the NPCI engagement — drives the auto-scroll marquee.
const stack = [
  "Java",
  "Apache Kafka",
  "Cassandra",
  "KeyDB",
  "Nginx",
  "Elasticsearch",
  "Logstash",
  "Kibana",
  "Grafana",
  "Prometheus",
  "Docker",
];

export function NowBuilding() {
  return (
    <section
      id="experience"
      className="relative scroll-mt-24 border-y border-white/[0.06] py-14 sm:py-16"
    >
      <div className="container-wide">
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            {/* NPCI feature */}
            <div>
              <span className="eyebrow">Currently building at</span>
              <div className="mt-5 flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] font-display text-2xl font-bold tracking-tight text-ink shadow-card">
                  N
                </span>
                <div>
                  <div className="font-display text-2xl font-bold tracking-tight text-ink">
                    NPCI <span className="text-faint">· India</span>
                  </div>
                  <div className="text-sm text-muted">Software / Automation Intern</div>
                </div>
              </div>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
                Building a production-grade, real-time data pipeline for{" "}
                <span className="font-medium text-ink">AEPS</span> — high-throughput
                streaming, in-memory caching, distributed storage and full-stack
                observability.
              </p>
            </div>

            {/* Stack marquee */}
            <div className="min-w-0">
              <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-faint">
                The stack I&rsquo;m working with
              </div>
              <div className="marquee relative">
                <div className="marquee-track py-1">
                  {[...stack, ...stack].map((t, i) => (
                    <div
                      key={`${t}-${i}`}
                      className="group/logo flex shrink-0 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5 transition-colors hover:border-white/15 hover:bg-white/[0.05]"
                    >
                      <TechIcon
                        name={t}
                        className="h-5 w-5 shrink-0 text-faint transition-colors group-hover/logo:text-ink"
                      />
                      <span className="whitespace-nowrap text-sm font-medium text-muted transition-colors group-hover/logo:text-ink">
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
