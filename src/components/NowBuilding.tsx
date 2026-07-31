import { useState } from "react";
import { NPCI_LOGO, journey } from "@/data/site";
import { Section } from "@/components/Section";
import { StackTopology } from "@/components/StackTopology";

/**
 * §01 — the current engagement, then the block diagram it produces.
 *
 * Single column rather than text-beside-diagram: the diagram goes horizontal
 * above 1120px and needs the whole content column to do it.
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
        withdraw cash with a fingerprint instead of a card. Every block below is
        one an event actually passes through.
      </p>

      <div className="mt-12">
        <StackTopology />
      </div>
    </Section>
  );
}
