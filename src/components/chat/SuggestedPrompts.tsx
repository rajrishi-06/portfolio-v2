import { ChevronRight } from "lucide-react";

export function SuggestedPrompts({
  prompts,
  onPick,
  disabled,
}: {
  prompts: readonly string[];
  onPick: (prompt: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="u-label">Try asking</span>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            disabled={disabled}
            className="group inline-flex items-center gap-1.5 rounded-sm border border-overlay/[0.14] bg-surface px-3 py-1.5 text-left font-mono text-[0.8125rem] leading-snug text-ink transition-colors duration-150 hover:border-overlay/40 disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-accent" />
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
