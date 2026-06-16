import { type CSSProperties } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";
import { TechIcon, techBrand } from "@/components/TechIcon";
import me from "@/assets/me.webp";

const ease = [0.21, 0.47, 0.32, 0.98] as const;
const heroStack = ["React", "Python", "TypeScript"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-36">
      {/* Backdrops */}
      <div className="grid-backdrop pointer-events-none absolute inset-x-0 top-0 h-[640px]" />
      <div className="glow-radial pointer-events-none absolute -top-24 right-[-10%] h-[520px] w-[520px] opacity-60" />

      <div className="container-wide relative grid items-center gap-12 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pb-28">
        {/* Text */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="eyebrow"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-bright" />
            </span>
            Open to opportunities
          </motion.span>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {site.headline.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease }}
                className="block"
              >
                {i === site.headline.length - 1 ? (
                  <span className="text-gradient">{line}</span>
                ) : (
                  line
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a href="#work">
              <Button size="lg">
                View my work <ArrowUpRight className="h-5 w-5" />
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline">
                Get in touch
              </Button>
            </a>
            <div className="ml-1 flex items-center gap-1">
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-11 w-11 place-items-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-11 w-11 place-items-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="relative mx-auto w-full max-w-sm lg:max-w-md"
        >
          {/* Layered backdrop — rotating conic halo + soft radial glow */}
          <div aria-hidden className="pointer-events-none absolute -inset-8 -z-10">
            <div className="conic-halo animate-spin-slow absolute inset-0 rounded-[3rem] opacity-60 blur-2xl" />
            <div className="glow-radial absolute inset-6 scale-110 opacity-50" />
          </div>

          {/* Offset dotted panel for depth behind the frame */}
          <div
            aria-hidden
            className="absolute -right-4 -top-4 -z-10 hidden h-36 w-36 rounded-3xl border border-white/10 bg-white/[0.02] sm:block"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
              backgroundSize: "13px 13px",
            }}
          />

          {/* Gradient ring frame + portrait */}
          <div className="relative rounded-[2rem] bg-gradient-to-br from-accent/60 via-white/10 to-transparent p-px shadow-[0_40px_90px_-30px_rgba(29,111,255,0.55)]">
            <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-surface">
              <img
                src={me}
                alt={site.fullName}
                width={520}
                height={620}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 rounded-[calc(2rem-1px)] ring-1 ring-inset ring-white/10" />
            </div>
          </div>

          {/* Floating accent chip */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 bottom-10 flex items-center gap-2 rounded-2xl glass px-4 py-3 shadow-card sm:-left-8"
          >
            <Sparkles className="h-5 w-5 text-accent-bright" />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-ink">Always shipping</div>
              <div className="text-xs text-faint">web · automation · AI</div>
            </div>
          </motion.div>

          {/* Floating tech-stack chip */}
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -right-3 top-7 flex items-center gap-1.5 rounded-2xl glass px-2.5 py-2 shadow-card sm:-right-6"
          >
            {heroStack.map((t) => (
              <span
                key={t}
                style={{ "--brand": techBrand[t] ?? "#5b9dff" } as CSSProperties}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-white/10"
              >
                <TechIcon name={t} className="h-[18px] w-[18px] text-[color:var(--brand)]" />
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
