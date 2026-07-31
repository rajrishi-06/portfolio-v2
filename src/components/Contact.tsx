import { Mail, Github, Linkedin, ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the mailto button still works */
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-wide">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-overlay/10 bg-surface p-8 text-center sm:p-14">
            <div className="grid-backdrop pointer-events-none absolute inset-0" />
            <div className="glow-radial pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 opacity-60" />

            <div className="relative">
              <span className="eyebrow">Contact</span>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
                Got something you want <span className="text-gradient">built?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted">
                I'm looking for internships, and I'll take on freelance work if it's
                interesting. Email is the fastest way to reach me.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={`mailto:${site.email}`}>
                  <Button size="lg">
                    <Mail className="h-5 w-5" /> {site.email}
                  </Button>
                </a>
                <Button size="lg" variant="outline" onClick={copy} className="min-w-[150px]">
                  {/* The checkmark springs in and the label crossfades in place —
                      confirmation you can feel without the button jumping. */}
                  <span className="relative grid h-4 w-4 place-items-center">
                    <AnimatePresence initial={false} mode="wait">
                      {copied ? (
                        <motion.span
                          key="done"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 520, damping: 24 }}
                          className="absolute inset-0 grid place-items-center"
                        >
                          <Check className="h-4 w-4 text-accent-bright" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 520, damping: 24 }}
                          className="absolute inset-0 grid place-items-center"
                        >
                          <Copy className="h-4 w-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <AnimatePresence initial={false} mode="wait">
                    <motion.span
                      key={copied ? "copied" : "copy"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      {copied ? "Copied" : "Copy email"}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                {[
                  { href: site.socials.github, label: "GitHub", Icon: Github },
                  { href: site.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
                  { href: site.blog, label: "Blog", Icon: ArrowUpRight },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-12 w-12 place-items-center rounded-xl glass glass-hover text-ink"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
