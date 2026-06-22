import { useRef } from "react";
import { Github, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const Icon = project.icon;
  const videoRef = useRef<HTMLVideoElement>(null);

  const onEnter = () => videoRef.current?.play().catch(() => {});
  const onLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <article
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl glass glass-hover",
        className
      )}
    >
      {/* Thumbnail (image / hover-video / gradient placeholder) */}
      <a
        href={project.demo || project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full overflow-hidden"
        // A real screenshot drives its own height (intrinsic ratio, shown whole).
        // Video + the gradient placeholder have no intrinsic size, so they fall
        // back to the reserved `ratio` box.
        style={
          project.image && !project.video
            ? undefined
            : { paddingTop: `${project.ratio * 100}%` }
        }
        aria-label={`${project.title} preview`}
      >
        {project.video ? (
          <video
            ref={videoRef}
            src={project.video}
            poster={project.image}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : project.image ? (
          // No fixed box and no object-cover: the image keeps its own aspect
          // ratio, scaled to the column width — fit to size, never cropped or
          // stretched (like Shift-resizing in Word). The card height follows it
          // and the masonry reflows, so each card can differ in height.
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          // Designed placeholder — swap in real media via project.image / project.video
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(120% 120% at 0% 0%, ${project.grad[0]} 0%, ${project.grad[1]} 55%, #0b0e17 100%)`,
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />
            <Icon className="absolute -bottom-4 -right-3 h-32 w-32 text-white/15" strokeWidth={1.25} />
            <div className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-xl bg-black/30 backdrop-blur-sm ring-1 ring-white/20">
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-md bg-black/45 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm ring-1 ring-white/15">
          {project.lang}
        </span>
        <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-accent text-white opacity-0 shadow-glow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4.5 w-4.5" />
        </span>
      </a>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-4 pt-1">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <Github className="h-4 w-4" /> Code
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="accent-link text-sm font-medium"
            >
              Live <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
