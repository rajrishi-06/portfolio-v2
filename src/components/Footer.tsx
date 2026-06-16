import { Github, Linkedin } from "lucide-react";
import { nav, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="container-wide flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-display text-sm font-bold text-white">
            R
          </span>
          <span className="text-sm text-muted">
            © {new Date().getFullYear()} {site.fullName}
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-ink"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-ink"
          >
            <Linkedin className="h-[18px] w-[18px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
