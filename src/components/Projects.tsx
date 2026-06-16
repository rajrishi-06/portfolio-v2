import Masonry from "react-masonry-css";
import { Github } from "lucide-react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

const breakpoints = {
  default: 3,
  1100: 3,
  900: 2,
  640: 1,
};

export function Projects() {
  return (
    <section id="work" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-wide">
        <Reveal>
          <span className="eyebrow">Selected work</span>
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="section-title max-w-xl">
              Projects I've <span className="text-gradient">designed & built</span>
            </h2>
            <p className="max-w-sm text-muted">
              A mix of web apps, desktop tools and automation. Hover any card — they
              reflow to fit, just like a gallery should.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Masonry
            breakpointCols={breakpoints}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </Masonry>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <Github className="h-5 w-5" /> See everything on GitHub
              </Button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
