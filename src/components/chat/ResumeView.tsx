import { useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Sparkles,
  RefreshCw,
  AlertCircle,
  X,
  Square,
} from "lucide-react";
import { assistantConfig } from "@/data/chatConfig";
import { streamResume } from "@/lib/chatApi";
import { cn } from "@/lib/utils";
import { Markdown } from "./Markdown";

type Status = "idle" | "streaming" | "done" | "error";

/** Pull the SCORE / VERDICT header lines out and return the clean body. */
function parseAnalysis(raw: string) {
  const score = /^\s*SCORE:\s*(\d{1,3})/im.exec(raw)?.[1];
  const verdict = /^\s*VERDICT:\s*(.+)$/im.exec(raw)?.[1];
  const body = raw
    .split("\n")
    .filter((l) => !/^\s*(SCORE|VERDICT):/i.test(l))
    .join("\n")
    .trim();
  return {
    score: score ? Math.min(100, Math.max(0, parseInt(score, 10))) : null,
    verdict: verdict?.trim() || null,
    body,
  };
}

function scoreColor(score: number) {
  if (score >= 70) return "rgb(var(--c-accent-bright))";
  if (score >= 45) return "#f59e0b";
  return "#f87171";
}

export function ResumeView({
  active,
  onActivity,
}: {
  active: boolean;
  /** Called when an analysis starts, so the panel knows there's work to warn about before a destructive close. */
  onActivity?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "streaming")
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [raw, status]);

  // Abort an in-flight analysis if the tab is left.
  useEffect(() => {
    if (!active && status === "streaming") abortRef.current?.abort();
  }, [active, status]);

  async function analyze(input: { file?: File; text?: string }) {
    onActivity?.();
    setStatus("streaming");
    setRaw("");
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamResume(input, {
        signal: controller.signal,
        onDelta: (delta) => setRaw((prev) => prev + delta),
      });
      setStatus("done");
    } catch (err) {
      if (controller.signal.aborted) {
        setStatus(raw ? "done" : "idle");
      } else {
        setError(err instanceof Error ? err.message : "Analysis failed.");
        setStatus("error");
      }
    } finally {
      abortRef.current = null;
    }
  }

  function onFiles(files: FileList | null) {
    const f = files?.[0];
    if (f) {
      setFile(f);
      setPasteOpen(false);
    }
  }

  function reset() {
    setStatus("idle");
    setRaw("");
    setError(null);
    setFile(null);
    setPasteText("");
    setPasteOpen(false);
  }

  // ── Result / streaming view ────────────────────────────────────────────────
  if (status === "streaming" || status === "done") {
    const { score, verdict, body } = parseAnalysis(raw);
    return (
      <div ref={scrollRef} className="h-full touch-pan-y overflow-y-auto px-4 py-4">
        <Scorecard
          score={score}
          verdict={verdict}
          streaming={status === "streaming"}
        />

        {body ? (
          <div className="mt-4">
            <Markdown text={body} />
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 text-xs text-faint">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-accent-bright" />
            Reading the role and matching it to Raj's stack…
          </div>
        )}

        <div className="mt-5 flex justify-center">
          {status === "streaming" ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-overlay/10 bg-overlay/[0.03] px-3 py-1.5 text-xs text-muted hover:text-ink"
            >
              <Square className="h-3.5 w-3.5" /> Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-overlay/10 bg-overlay/[0.03] px-3 py-1.5 text-xs text-muted hover:-translate-y-0.5 hover:border-accent-bright/50 hover:text-ink"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Analyze another
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Upload / idle / error view ─────────────────────────────────────────────
  return (
    <div className="flex h-full touch-pan-y flex-col overflow-y-auto px-4 py-4">
      <p className="text-[13px] leading-relaxed text-muted">
        {assistantConfig.resume.blurb}
      </p>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()
        }
        className={cn(
          "mt-4 grid cursor-pointer place-items-center rounded-2xl border border-dashed px-4 py-7 text-center transition-colors",
          dragging
            ? "border-accent-bright bg-accent/[0.06]"
            : "border-overlay/15 bg-overlay/[0.02] hover:border-accent-bright/50 hover:bg-overlay/[0.04]",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,.heic,.heif,image/png,image/jpeg,image/webp,image/heic,image/heif"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <UploadCloud className="h-7 w-7 text-accent-bright" />
        <p className="mt-2 text-sm font-medium text-ink">
          Drop the job description or click to browse
        </p>
        <p className="mt-0.5 text-[11px] text-faint">PDF, image, or .txt · up to 8 MB</p>
      </div>

      {/* Selected file */}
      {file && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-overlay/10 bg-overlay/[0.03] px-3 py-2">
          <FileText className="h-4 w-4 shrink-0 text-accent-bright" />
          <span className="flex-1 truncate text-xs text-ink">{file.name}</span>
          <button
            type="button"
            onClick={() => setFile(null)}
            aria-label="Remove file"
            className="text-faint hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Paste alternative */}
      <button
        type="button"
        onClick={() => setPasteOpen((v) => !v)}
        className="mt-3 self-start text-xs text-accent-bright hover:text-ink"
      >
        {pasteOpen ? "− Hide paste box" : "+ Or paste the JD text instead"}
      </button>
      {pasteOpen && (
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          rows={5}
          placeholder="Paste the job description here…"
          // 16px on mobile prevents the browser's focus auto-zoom; the smaller
          // designed size returns from sm: up.
          className="mt-2 w-full resize-none rounded-xl border border-overlay/10 bg-overlay/[0.03] px-3 py-2 text-base text-ink placeholder:text-faint focus:border-accent-bright/50 focus:outline-none sm:text-[13px]"
        />
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-xs text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        disabled={!file && !pasteText.trim()}
        onClick={() =>
          file ? analyze({ file }) : analyze({ text: pasteText })
        }
        className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgb(var(--c-accent-glow)/0.5)] transition-all hover:-translate-y-0.5 hover:bg-accent-glow disabled:pointer-events-none disabled:opacity-40"
      >
        <Sparkles className="h-4 w-4" />
        {assistantConfig.resume.cta}
      </button>

      <p className="mt-3 text-center text-[10px] text-faint">
        The JD is sent only to run the match — it isn't stored.
      </p>
    </div>
  );
}

// ── Animated scorecard ────────────────────────────────────────────────────────
function Scorecard({
  score,
  verdict,
  streaming,
}: {
  score: number | null;
  verdict: string | null;
  streaming: boolean;
}) {
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const pct = score ?? 0;
  const offset = circumference * (1 - pct / 100);
  const color = score != null ? scoreColor(score) : "rgb(var(--c-faint))";

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-overlay/10 bg-overlay/[0.03] p-4">
      {/* Gauge */}
      <div className="relative grid h-[84px] w-[84px] shrink-0 place-items-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="rgb(var(--c-overlay) / 0.1)"
            strokeWidth="7"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.5s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center leading-none">
          <span
            className="font-display text-xl font-bold"
            style={{ color }}
          >
            {score != null ? score : "—"}
          </span>
          <span className="mt-0.5 text-[9px] uppercase tracking-wider text-faint">
            role fit
          </span>
        </div>
      </div>

      {/* Verdict */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-faint">
          <Sparkles className="h-3 w-3 text-accent-bright" /> Role-fit verdict
        </div>
        <p className="mt-1 text-sm font-medium leading-snug text-ink">
          {verdict ?? (
            <span className="text-faint">
              {streaming ? "Calibrating…" : ""}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
