import { useState } from "react";
import { journey, type JourneyItem } from "@/data/site";
import { Reveal } from "@/components/Reveal";

/** Org mark: the logo when it loads, the org's initials when it doesn't. Remote
 *  logos rot, so the fallback is the default state rather than an error path. */
function OrgMark({ item }: { item: JourneyItem }) {
  const [ok, setOk] = useState(Boolean(item.logo));

  const initials = item.org
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-overlay/10 bg-overlay/[0.03]">
      {ok && item.logo ? (
        <img
          src={item.logo}
          alt=""
          loading="lazy"
          onError={() => setOk(false)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-display text-sm font-bold tracking-tight text-accent-bright">
          {initials}
        </span>
      )}
    </div>
  );
}

export function Journey() {
  return (
    <section
      id="journey"
      className="relative scroll-mt-24 border-y border-overlay/[0.06] py-20 sm:py-28"
    >
      <div className="container-wide max-w-4xl">
        <Reveal>
          <span className="eyebrow">Journey</span>
          <h2 className="section-title mt-4">Where I've been</h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {journey.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="glass glass-hover group flex gap-5 rounded-2xl p-5 sm:p-6">
                <OrgMark item={item} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {item.title}
                    </h3>
                    <span className="shrink-0 text-sm font-medium text-faint">
                      {item.period}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[15px] font-medium text-accent-bright/90">
                    {item.org}
                  </div>
                  {item.detail && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.detail}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
