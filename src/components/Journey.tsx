import { journey } from "@/data/site";
import { Reveal } from "@/components/Reveal";

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
          {journey.map((item, i) => {
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="glass glass-hover group flex gap-5 rounded-2xl p-5 sm:p-6">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-overlay/10 bg-overlay/[0.03] text-accent-bright">
                    <img
                    src={item.kind}
                    alt="NPCI"
                    loading="lazy"
                    className=" rounded-xl border-spacing-10 border-overlay/10 object-cover shadow-card"
                  />
                  </div>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
