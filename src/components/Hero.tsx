import { Github, Linkedin } from "lucide-react";
import { journey, site } from "@/data/site";
import { Button } from "@/components/ui/button";
import me from "@/assets/me.webp";

/**
 * Part identification — the header of the datasheet. Left-aligned, no card, no
 * halo: a mono identification strip, the headline, the specimen portrait and a
 * spec block. The graph-paper ground is used here and nowhere else on the page.
 *
 * Nothing animates. The only accent on the sheet is the status dot and the
 * links; the headline stays flat ink (see DESIGN.md § Motion, § Color).
 */
export function Hero() {
  const current = journey[0];

  return (
    <section id="top" className="relative">
      <div aria-hidden className="grid-paper pointer-events-none absolute inset-0" />

      <div className="container-wide relative pb-20 pt-28 lg:pb-28 lg:pt-36">
        {/* Identification strip */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-overlay/[0.28] pb-3">
          <span className="u-label text-ink">{site.fullName}</span>
          <span className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="u-label">{site.role}</span>
            <span className="u-label inline-flex items-center gap-2 text-ink">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              Open to opportunities
            </span>
          </span>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <h1 className="u-hero text-balance">
              {site.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="u-sub mt-8 max-w-xl">{site.tagline}</p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#work">
                <Button>View work</Button>
              </a>
              <a href="#contact">
                <Button variant="outline">Get in touch</Button>
              </a>
              <div className="flex items-center gap-2">
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="grid h-11 w-11 place-items-center rounded-sm border border-overlay/[0.14] text-muted transition-colors duration-150 hover:border-overlay/40 hover:text-ink"
                >
                  <Github className="h-[18px] w-[18px]" />
                </a>
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="grid h-11 w-11 place-items-center rounded-sm border border-overlay/[0.14] text-muted transition-colors duration-150 hover:border-overlay/40 hover:text-ink"
                >
                  <Linkedin className="h-[18px] w-[18px]" />
                </a>
              </div>
            </div>
          </div>

          {/* Specimen. The asset is an 886x886 circular cutout on transparency,
              so the plate is round and filled — a square frame would leave the
              circle floating on the graph paper. */}
          <figure className="w-full max-w-[240px] lg:max-w-none">
            <img
              src={me}
              alt={`Portrait of ${site.fullName}`}
              width={886}
              height={886}
              className="aspect-square w-full rounded-full border border-overlay/[0.28] bg-surface object-cover"
            />
            <figcaption className="u-label mt-3">
              {site.name} — {site.location}
            </figcaption>
          </figure>
        </div>

        {/* Spec block */}
        <dl className="mt-16 grid gap-6 border-t border-overlay/[0.14] pt-5 sm:grid-cols-3 sm:gap-8 lg:mt-20">
          <div>
            <dt className="u-label">Location</dt>
            <dd className="u-data mt-2 text-muted">{site.location}</dd>
          </div>
          <div>
            <dt className="u-label">Currently</dt>
            <dd className="u-data mt-2 text-muted">
              {current.org} — {current.title}
            </dd>
          </div>
          <div>
            <dt className="u-label">Email</dt>
            <dd className="u-data mt-2 min-w-0 break-all">
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
