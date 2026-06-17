import { type CSSProperties } from "react";
import { Github, MapPin, Sparkles, Code2, ArrowUpRight } from "lucide-react";
import { skills, stats, site } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { TechIcon, techBrand } from "@/components/TechIcon";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-wide">
        <Reveal>
          <span className="eyebrow">About</span>
          <h2 className="section-title mt-4 max-w-2xl">
            A builder at heart, <span className="text-gradient">curious by default</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[210px] lg:grid-cols-4">
            {/* Bio */}
            <div className="glass flex flex-col rounded-2xl p-7 md:col-span-2 lg:col-span-2 lg:row-span-2">
              <Sparkles className="h-7 w-7 text-accent-bright" />
              <p className="mt-5 text-balance text-xl font-medium leading-relaxed text-ink/95">
                I'm {site.fullName.split(" ").slice(0, 3).join(" ")} — a CS undergrad
                who likes turning messy problems into clean, working software.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                From a database engine in C++ to AI task schedulers and browser
                extensions, I bounce across the stack and enjoy the parts most people
                avoid. I care about details, fast feedback loops, and shipping.
              </p>
              <div className="mt-auto flex items-center gap-2 pt-6 text-sm text-faint">
                <MapPin className="h-4 w-4" /> {site.location} · available remotely
              </div>
            </div>

            {/* Tech stack */}
            <div className="glass flex flex-col rounded-2xl p-7 md:col-span-2 lg:col-span-2 lg:row-span-2">
              <div className="flex items-center gap-2 text-muted">
                <Code2 className="h-5 w-5 text-accent-bright" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Tech I reach for
                </span>
              </div>
              <div className="mt-5 flex flex-col gap-5">
                {skills.map((s) => (
                  <div key={s.group}>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-faint">
                      {s.group}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.items.map((it) => (
                        <span
                          key={it}
                          style={{ "--brand": techBrand[it] ?? "#5b9dff" } as CSSProperties}
                          className="group/chip inline-flex items-center gap-2 rounded-lg border border-overlay/10 bg-overlay/[0.04] px-3 py-1.5 text-sm text-ink/90 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-bright/50 hover:bg-overlay/[0.06] hover:text-ink"
                        >
                          <TechIcon
                            name={it}
                            className="h-[15px] w-[15px] shrink-0 text-faint transition-colors duration-200 group-hover/chip:text-[color:var(--brand)]"
                          />
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="glass grid grid-cols-3 gap-2 rounded-2xl p-6 md:col-span-2 lg:col-span-2">
              {stats.map((st) => (
                <div key={st.label} className="flex flex-col justify-center">
                  <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                    {st.value}
                  </div>
                  <div className="mt-1 text-xs leading-tight text-muted">{st.label}</div>
                </div>
              ))}
            </div>

            {/* Currently */}
            <div className="glass flex flex-col justify-between rounded-2xl p-6 md:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-faint">
                Currently
              </span>
              <div>
                <div className="text-lg font-semibold text-ink">Interning @ NPCI</div>
                <div className="mt-1 text-sm text-muted">Automating internal tooling</div>
              </div>
            </div>

            {/* GitHub */}
            <a
              href={site.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-hover group flex flex-col justify-between rounded-2xl p-6 md:col-span-1"
            >
              <div className="flex items-center justify-between">
                <Github className="h-7 w-7 text-ink" />
                <ArrowUpRight className="h-5 w-5 text-faint transition-colors group-hover:text-accent-bright" />
              </div>
              <div>
                <div className="text-lg font-semibold text-ink">@rajrishi-06</div>
                <div className="mt-1 text-sm text-muted">30+ repos, always pushing</div>
              </div>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
