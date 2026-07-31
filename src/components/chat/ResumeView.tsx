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
          <div className="u-label mt-4 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-accent" />
            Reading the role and matching it to Raj's stack…
          </div>
        )}

        <div className="mt-5 flex justify-center">
          {status === "streaming" ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="chip gap-1.5 px-3 py-1.5"
            >
              <Square className="h-3.5 w-3.5" /> Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="chip gap-1.5 px-3 py-1.5"
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
      <p className="text-[13.5px] leading-relaxed text-muted">
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
          "mt-4 grid cursor-pointer place-items-center border border-dashed px-4 py-7 text-center transition-colors",
          dragging
            ? "border-accent bg-surface"
            : "border-overlay/[0.28] bg-surface hover:border-overlay/40",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,.heic,.heif,image/png,image/jpeg,image/webp,image/heic,image/heif"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <UploadCloud className="h-7 w-7 text-accent" />
        <p className="mt-2 text-sm font-medium text-ink">
          Drop the job description or click to browse
        </p>
        <p className="u-label mt-1.5">PDF, image, or .txt · up to 8 MB</p>
      </div>

      {/* Selected file */}
      {file && (
        <div className="mt-3 flex items-center gap-2 border border-overlay/[0.14] bg-surface px-3 py-2">
          <FileText className="h-4 w-4 shrink-0 text-accent" />
          <span className="flex-1 truncate font-mono text-[0.8125rem] text-ink">
            {file.name}
          </span>
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
        className="mt-3 self-start font-mono text-[0.8125rem] text-accent hover:text-ink"
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
          className="mt-2 w-full resize-none border border-overlay/[0.14] bg-surface px-3 py-2 text-base text-ink placeholder:text-faint sm:text-[13px]"
        />
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 border-l-2 border-red-500 bg-surface px-3 py-2.5 font-mono text-[0.8125rem] leading-snug text-ink">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
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
        className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-ink px-5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
      >
        <Sparkles className="h-4 w-4" />
        {assistantConfig.resume.cta}
      </button>

      <p className="u-label mt-3 text-center">
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
  // One signal colour, like the rest of the sheet: the arc is accent once
  // there's a score, faint while it's still being read.
  const color = score != null ? "rgb(var(--c-accent))" : "rgb(var(--c-faint))";

  return (
    <div className="flex items-center gap-4 border border-overlay/[0.14] bg-surface p-4">
      {/* Gauge */}
      <div className="relative grid h-[84px] w-[84px] shrink-0 place-items-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="rgb(var(--c-overlay) / 0.14)"
            strokeWidth="5"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.5s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center leading-none">
          <span className="tnum font-mono text-xl font-medium" style={{ color }}>
            {score != null ? score : "—"}
          </span>
          <span className="u-label mt-1">role fit</span>
        </div>
      </div>

      {/* Verdict */}
      <div className="min-w-0">
        <div className="u-label flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-accent" /> Role-fit verdict
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
