import { useState, type CSSProperties } from "react";
import { Github, ArrowUpRight, Handshake } from "lucide-react";
import { skills, site, BASE } from "@/data/site";
import { Section } from "@/components/Section";
import { TechIcon, techBrand } from "@/components/TechIcon";

/**
 * §03 — Characteristics. Prose, then the stack as a real specification table
 * (one row per group), then the records: the T&P role and the GitHub handle.
 * Rule-separated throughout; no cards.
 */
export function About() {
  const [logoOk, setLogoOk] = useState(true);

  return (
    <Section
      id="about"
      index={3}
      label="About"
      title="I like the parts most people skip."
    >
      {/* Bio */}
      <p className="max-w-[62ch] text-ink">
        I'm {site.fullName.split(" ").slice(0, 3).join(" ")}, a CS undergrad who
        would rather read the spec than guess at it.
      </p>
      <p className="mt-4 max-w-[62ch] text-muted">
        I bounce across the stack: a database engine in C++, an AI task
        scheduler, browser extensions, and right now a payments pipeline held
        together by Kafka and Cassandra. The unglamorous middle of a system is
        usually where the interesting bugs live.
      </p>

      <dl className="mt-8 grid max-w-md grid-cols-[7rem_1fr] gap-x-6 gap-y-2">
        <dt className="u-label pt-[3px]">Location</dt>
        <dd className="u-data text-muted">{site.location}</dd>
        <dt className="u-label pt-[3px]">Availability</dt>
        <dd className="u-data text-muted">Available remotely</dd>
      </dl>

      {/* Characteristics — the stack as a spec table, one row per group */}
      <div className="mt-14 grid gap-1 border-y border-overlay/[0.28] py-2 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
        <span className="u-label">Group</span>
        <span className="u-label">Components</span>
      </div>

      <dl>
        {skills.map((s) => (
          <div
            key={s.group}
            className="grid gap-2 border-b border-overlay/[0.14] py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-6"
          >
            <dt className="u-label sm:pt-[7px]">{s.group}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {s.items.map((it) => (
                <span
                  key={it}
                  style={{ "--brand": techBrand[it] ?? "currentColor" } as CSSProperties}
                  className="chip group/chip"
                >
                  <TechIcon
                    name={it}
                    className="h-3 w-3 shrink-0 text-faint transition-colors duration-150 group-hover/chip:text-[color:var(--brand)]"
                  />
                  {it}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      {/* Records */}
      <div className="mt-14 border-t border-overlay/[0.28]">
        <div className="grid gap-3 border-b border-overlay/[0.14] py-6 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
          <span className="u-label sm:pt-[7px]">Role</span>
          <div className="flex items-start gap-4">
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center overflow-hidden border border-overlay/[0.14] ${
                logoOk ? "bg-white" : "bg-surface"
              }`}
            >
              {logoOk ? (
                <img
                  src={`${BASE}images/nit-silchar.jpg`}
                  alt="NIT Silchar"
                  onError={() => setLogoOk(false)}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Handshake className="h-5 w-5 text-faint" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0">
              <div className="font-display text-lg leading-tight text-ink">
                {"T&P Coordinator"}{" "}
                <span className="text-faint">· NIT Silchar</span>
              </div>
              <div className="u-data mt-1.5 text-faint">Oct 2025 — Present</div>
              <p className="mt-2 max-w-[52ch] text-sm text-muted">
                I put students in front of the companies hiring them, and chase
                the companies that haven't replied yet.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Campus placements", "Corporate outreach", "Student mentorship"].map(
                  (t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <a
          href={site.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group -mx-3 grid gap-2 border-b border-overlay/[0.14] px-3 py-5 transition-colors duration-150 hover:bg-surface sm:grid-cols-[8.5rem_1fr] sm:gap-6"
        >
          <span className="u-label sm:pt-[3px]">GitHub</span>
          <span className="flex items-center justify-between gap-4">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Github className="h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
              <span className="u-data text-ink">@rajrishi-06</span>
              <span className="u-data text-faint">30+ repos</span>
            </span>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-faint transition-colors duration-150 group-hover:text-accent"
              aria-hidden="true"
            />
          </span>
        </a>
      </div>
    </Section>
  );
}
