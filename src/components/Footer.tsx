import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-overlay/[0.06]">
      <div className="container-wide flex flex-col items-center gap-4 py-12 text-center">
        {/* Brand mark doubles as a back-to-top */}
        <a
          href="#top"
          aria-label="Back to top"
          className="grid h-10 w-10 place-items-center rounded-xl bg-accent font-display text-lg font-bold text-white shadow-[0_6px_20px_-6px_rgb(var(--c-accent-glow)/0.6)] transition-transform hover:-translate-y-0.5"
        >
          R
        </a>

        {/* Slogan */}
        <p className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Build. Ship. <span className="text-gradient">Solve.</span>
        </p>

        {/* Trademark */}
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {site.fullName} · All rights reserved.
        </p>
      </div>
    </footer>
  );
}
