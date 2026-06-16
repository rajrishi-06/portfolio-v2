import { Mail, Github, Linkedin, ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";
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
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-8 text-center sm:p-14">
            <div className="grid-backdrop pointer-events-none absolute inset-0" />
            <div className="glow-radial pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 opacity-60" />

            <div className="relative">
              <span className="eyebrow">Contact</span>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
                Let's build something <span className="text-gradient">worth shipping.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted">
                Open to internships, freelance work and collaborations. Drop a line — I
                reply fast.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={`mailto:${site.email}`}>
                  <Button size="lg">
                    <Mail className="h-5 w-5" /> {site.email}
                  </Button>
                </a>
                <Button size="lg" variant="outline" onClick={copy} className="min-w-[150px]">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-accent-bright" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy email
                    </>
                  )}
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
