import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";
import { DrawnRule } from "@/components/Section";

/** The colophon. Same drawn rule that separates every other section, then the
 *  document's own metadata — nothing that isn't already true. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <DrawnRule />
      <div className="container-wide flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 py-10">
        <p className="u-data text-muted">
          © {year} {site.fullName}
        </p>
        <a
          href="#top"
          aria-label="Back to top"
          className="u-label inline-flex items-center gap-1.5 text-ink transition-colors duration-150 hover:text-accent"
        >
          Back to top
          <ArrowUp className="h-3 w-3" aria-hidden />
        </a>
      </div>
    </footer>
  );
}
