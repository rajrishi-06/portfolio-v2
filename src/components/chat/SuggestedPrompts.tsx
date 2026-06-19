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
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-faint">
        Try asking
      </span>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            disabled={disabled}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-overlay/10 bg-overlay/[0.03] px-3 py-1.5 text-left text-xs text-ink/90 transition-all hover:-translate-y-0.5 hover:border-accent-bright/50 hover:bg-overlay/[0.06] disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-accent-bright transition-transform group-hover:translate-x-0.5" />
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
