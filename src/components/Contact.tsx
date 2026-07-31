import { Mail, Github, Linkedin, MapPin, Rss, ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";
import { Section } from "@/components/Section";

/** Display form of a URL: no scheme, no www., no trailing slash. Derived so the
 *  row can never disagree with the href it links to. */
const short = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const channels = [
  { label: "GitHub", href: site.socials.github, Icon: Github },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: Linkedin },
  { label: "Blog", href: site.blog, Icon: Rss },
];

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
    <Section
      id="contact"
      index={5}
      label="CONTACT"
      title="Got something you want built?"
      aside={
        <>
          I'm looking for internships, and I'll take on freelance work if it's
          interesting. Email is the fastest way to reach me.
        </>
      }
    >
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary: solid ink fill, paper text. The label is the address
              itself, so it stays in its literal case rather than uppercased. */}
          <a
            href={`mailto:${site.email}`}
            className="inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-5 font-mono text-[0.8125rem] tracking-[0.02em] text-bg transition-colors duration-150 hover:bg-accent"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {site.email}
          </a>

          <button
            type="button"
            onClick={copy}
            className="inline-flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-sm border border-overlay/[0.28] px-5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink transition-colors duration-150 hover:bg-overlay/[0.04]"
          >
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
                    <Check className="h-4 w-4 text-accent" />
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
          </button>
        </div>

        {/* Ordering information: the rest of the channels, as ruled rows. */}
        <div className="mt-12 border-t border-overlay/[0.14]">
          {channels.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 border-b border-overlay/[0.14] py-3 transition-colors duration-150 hover:bg-overlay/[0.03]"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-faint" aria-hidden />
              <span className="u-label w-20 shrink-0 text-ink">{label}</span>
              <span className="u-data min-w-0 flex-1 truncate text-muted">
                {short(href)}
              </span>
              <ArrowUpRight
                className="h-3.5 w-3.5 shrink-0 text-faint transition-colors duration-150 group-hover:text-accent"
                aria-hidden
              />
            </a>
          ))}

          <div className="flex items-center gap-4 border-b border-overlay/[0.14] py-3">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-faint" aria-hidden />
            <span className="u-label w-20 shrink-0 text-ink">Location</span>
            <span className="u-data min-w-0 flex-1 truncate text-muted">
              {site.location}
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
