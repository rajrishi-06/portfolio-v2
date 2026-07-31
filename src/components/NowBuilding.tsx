import { useState } from "react";
import { NPCI_LOGO } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { StackTopology } from "@/components/StackTopology";

export function NowBuilding() {
  const [logoOk, setLogoOk] = useState(true);

  return (
    <section
      id="experience"
      className="relative scroll-mt-24 border-y border-overlay/[0.06] py-14 sm:py-16"
    >
      <div className="container-wide">
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            {/* NPCI feature */}
            <div>
              <span className="eyebrow">Currently building at</span>
              <div className="mt-5 flex items-center gap-4">
                {logoOk ? (
                  <img
                    src={NPCI_LOGO}
                    alt="NPCI"
                    loading="lazy"
                    onError={() => setLogoOk(false)}
                    className="h-14 w-14 shrink-0 rounded-2xl border border-overlay/10 object-cover shadow-card"
                  />
                ) : (
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-overlay/10 bg-overlay/[0.04] font-display text-2xl font-bold tracking-tight text-ink shadow-card">
                    N
                  </span>
                )}
                <div>
                  <div className="font-display text-2xl font-bold tracking-tight text-ink">
                    NPCI <span className="text-faint">· India</span>
                  </div>
                  <div className="text-sm text-muted">Software / Automation Intern</div>
                </div>
              </div>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
                I work on the real-time data pipeline behind{" "}
                <span className="font-medium text-ink">AEPS</span>, the system that
                lets someone withdraw cash with a fingerprint instead of a card.
                Every stage on the right is one an event actually passes through.
              </p>
            </div>

            {/* Stack, drawn as the pipeline it is */}
            <div className="min-w-0">
              <StackTopology />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
