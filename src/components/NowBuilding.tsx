import { useState } from "react";
import { NPCI_LOGO, journey } from "@/data/site";
import { Section } from "@/components/Section";
import { StackTable } from "@/components/StackTable";

/**
 * §01 — the current engagement.
 *
 * The copy deliberately names the domain and the tools and stops there. It does
 * not describe how the system is built, and there is no diagram: an employer's
 * internal architecture is not the author's to publish, and a portfolio gains
 * nothing from it that the technology list does not already give.
 */
export function NowBuilding() {
  const [logoOk, setLogoOk] = useState(true);
  const role = journey[0];

  return (
    <Section id="experience" index={1} label="Currently">
      {/* Identification record */}
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5 border-b border-overlay/[0.28] pb-6">
        <div className="flex items-center gap-4">
          {logoOk ? (
            <img
              src={NPCI_LOGO}
              alt=""
              loading="lazy"
              onError={() => setLogoOk(false)}
              className="h-12 w-12 shrink-0 border border-overlay/[0.14] object-cover"
            />
          ) : (
            <span className="grid h-12 w-12 shrink-0 place-items-center border border-overlay/[0.14] bg-surface font-mono text-sm text-muted">
              N
            </span>
          )}
          <div>
            <h2 className="font-display text-2xl leading-none text-ink">
              NPCI <span className="text-faint">· India</span>
            </h2>
            <p className="u-data mt-1.5 text-muted">{role.title}</p>
          </div>
        </div>

        <p className="u-data text-muted">{role.period}</p>
      </div>

      <p className="mt-8 max-w-[62ch] text-muted">
        I work on the real-time data pipeline behind{" "}
        <span className="text-ink">AEPS</span>, the system that lets someone
        withdraw cash with a fingerprint instead of a card. Below is what I work
        in day to day.
      </p>

      <div className="mt-12">
        <StackTable />
      </div>
    </Section>
  );
}
