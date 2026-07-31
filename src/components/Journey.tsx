import { useState } from "react";
import { journey, type JourneyItem } from "@/data/site";
import { Section } from "@/components/Section";

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
    <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden border border-overlay/[0.14] bg-surface">
      {ok && item.logo ? (
        <img
          src={item.logo}
          alt=""
          loading="lazy"
          onError={() => setOk(false)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="u-data text-muted">{initials}</span>
      )}
    </div>
  );
}

/**
 * §04 — the revision history. A dated log, newest first: period is the key
 * column and sits hard-left, the record sits beside it. Hairline rules, no
 * cards.
 */
export function Journey() {
  return (
    <Section id="journey" index={4} label="HISTORY" title="Where I've been">
      {/* Top edge: the head row's rule on md+, the container's own below it. */}
      <div className="border-b border-t border-b-overlay/[0.14] border-t-overlay/[0.28] md:border-t-0">
        <div className="hidden grid-cols-[9.5rem_1fr] gap-x-8 border-b border-overlay/[0.28] pb-2 md:grid">
          <span className="u-label">Period</span>
          <span className="u-label">Record</span>
        </div>

        <ol>
          {journey.map((item) => (
            <li
              key={item.title}
              className="grid gap-x-8 gap-y-3 border-t border-overlay/[0.14] py-6 first:border-t-0 md:grid-cols-[9.5rem_1fr]"
            >
              <div className="u-data text-ink">{item.period}</div>

              <div className="flex min-w-0 gap-4">
                <OrgMark item={item} />
                <div className="min-w-0">
                  <h3 className="font-display text-lg leading-snug text-ink">
                    {item.title}
                  </h3>
                  <div className="u-data mt-1 text-muted">{item.org}</div>
                  {item.detail && (
                    <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted">
                      {item.detail}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
