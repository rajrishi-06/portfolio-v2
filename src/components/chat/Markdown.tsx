import { type ReactNode } from "react";

/**
 * A deliberately tiny Markdown renderer — just enough for assistant replies
 * and the résumé analysis (headings, bold, inline code, bullet/number lists,
 * paragraphs). Builds React nodes directly, so there's no dangerouslySetInnerHTML
 * and no extra dependency. Not a full CommonMark parser by design.
 */

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Split on **bold** and `code`, keeping the delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  parts.forEach((part, i) => {
    if (!part) return;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={`${keyBase}-b${i}`} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>,
      );
    } else if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={`${keyBase}-c${i}`}
          className="rounded bg-overlay/10 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-bright"
        >
          {part.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(part);
    }
  });
  return nodes;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((it, i) => (
      <li key={i} className="leading-relaxed">
        {renderInline(it, `li-${key}-${i}`)}
      </li>
    ));
    blocks.push(
      list.ordered ? (
        <ol key={key++} className="my-1.5 list-decimal space-y-1 pl-5 marker:text-faint">
          {items}
        </ol>
      ) : (
        <ul key={key++} className="my-1.5 list-disc space-y-1 pl-5 marker:text-accent-bright/70">
          {items}
        </ul>
      ),
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) {
      flushList();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushList();
      const level = heading[1].length;
      const content = renderInline(heading[2], `h-${key}`);
      blocks.push(
        <p
          key={key++}
          className={
            level <= 2
              ? "mt-3 mb-1 font-display text-[15px] font-semibold text-ink"
              : "mt-2.5 mb-0.5 text-sm font-semibold text-ink/90"
          }
        >
          {content}
        </p>,
      );
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }

    const ordered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (ordered) {
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }

    flushList();
    blocks.push(
      <p key={key++} className="leading-relaxed">
        {renderInline(line, `p-${key}`)}
      </p>,
    );
  }
  flushList();

  return <div className="space-y-1.5 text-[13.5px] text-muted">{blocks}</div>;
}
