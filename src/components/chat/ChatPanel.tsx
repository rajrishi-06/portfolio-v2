import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { MessageSquare, FileSearch, Trash2 } from "lucide-react";
import { assistantConfig } from "@/data/chatConfig";
import { cn } from "@/lib/utils";
import { ChatView } from "./ChatView";
import { ResumeView } from "./ResumeView";
import type { PanelBox } from "./position";

type Mode = "chat" | "resume";

export function ChatPanel({
  open,
  box,
  dirty,
  sessionKey,
  onMinimize,
  onClose,
  onActivity,
}: {
  open: boolean;
  /** Where the panel should sit + how big it is (computed from the launcher). */
  box: PanelBox;
  /** True once the visitor has a conversation / analysis worth warning about. */
  dirty: boolean;
  /** Bumping this remounts the views, wiping their state (used by a confirmed close). */
  sessionKey: number;
  /** Yellow dot: hide back to the launcher, keeping all state. */
  onMinimize: () => void;
  /** Red dot (confirmed): hide back to the launcher AND wipe the conversation. */
  onClose: () => void;
  /** Children report activity so we know whether to confirm before a destructive close. */
  onActivity: () => void;
}) {
  const [mode, setMode] = useState<Mode>("chat");
  const [confirmingClose, setConfirmingClose] = useState(false);

  // Drag: the panel floats freely; the title bar is the handle.
  const boundsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Esc cancels a pending confirm, otherwise minimizes (never destructive).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmingClose) setConfirmingClose(false);
      else onMinimize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, confirmingClose, onMinimize]);

  // Reset float position + any pending confirm whenever it leaves the screen.
  useEffect(() => {
    if (!open) {
      setConfirmingClose(false);
      x.set(0);
      y.set(0);
    }
  }, [open, x, y]);

  // The panel stays mounted (to preserve chat + analysis) but must leave the
  // tab order + accessibility tree while closed. `inert` does all three
  // (focus, AT, pointer). React 18 has no typed `inert` prop, so toggle it
  // imperatively on the boundary wrapper.
  useEffect(() => {
    boundsRef.current?.toggleAttribute("inert", !open);
  }, [open]);

  function startDrag(e: ReactPointerEvent<HTMLDivElement>) {
    // Don't begin a drag when a traffic-light button is the target.
    if ((e.target as HTMLElement).closest("button")) return;
    dragControls.start(e);
  }

  // Red dot: warn before deleting an in-progress conversation; otherwise just go.
  function handleRed() {
    if (dirty) setConfirmingClose(true);
    else onClose();
  }

  return (
    // Full-viewport drag boundary. pointer-events-none so the page stays usable;
    // only the panel itself re-enables pointer events.
    <div ref={boundsRef} className="pointer-events-none fixed inset-0 z-[60]">
      <motion.div
        drag
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={boundsRef}
        dragMomentum={false}
        dragElastic={0.06}
        style={{ x, y, left: box.left, top: box.top, width: box.width, height: box.height }}
        initial={false}
        animate={open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.26, ease: [0.21, 0.47, 0.32, 0.98] }}
        role="dialog"
        aria-label="Raj's AI assistant"
        className={cn(
          "absolute flex flex-col overflow-hidden rounded-2xl glass-strong shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)]",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* Terminal title bar — drag handle + macOS controls */}
        <div
          onPointerDown={startDrag}
          className="flex touch-none cursor-grab select-none items-center justify-between gap-2 border-b border-overlay/10 px-3.5 py-2.5 active:cursor-grabbing"
        >
          <div className="group flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <TrafficLight
                color="#ff5f57"
                label="Close (clears the conversation)"
                onClick={handleRed}
                glyph={<Glyph d="M3 3l4 4M7 3l-4 4" />}
              />
              <TrafficLight
                color="#febc2e"
                label="Minimize (keeps the conversation)"
                onClick={onMinimize}
                glyph={<Glyph d="M2.5 5h5" />}
              />
              {/* Green is intentionally inert — kept for the macOS look. */}
              <span
                aria-hidden
                title="Unavailable"
                className="h-3.5 w-3.5 cursor-default rounded-full opacity-40"
                style={{ backgroundColor: "#28c840" }}
              />
            </div>
            <span className="ml-0.5 font-mono text-xs text-faint">
              {assistantConfig.title}
            </span>
          </div>
          <span className="hidden font-mono text-[10px] text-faint/60 sm:inline">
            ⠿ drag
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mode tabs */}
          <div className="flex gap-1 border-b border-overlay/10 px-2 py-2">
            <TabButton
              active={mode === "chat"}
              onClick={() => setMode("chat")}
              icon={<MessageSquare className="h-3.5 w-3.5" />}
              label="Chat"
            />
            <TabButton
              active={mode === "resume"}
              onClick={() => setMode("resume")}
              icon={<FileSearch className="h-3.5 w-3.5" />}
              label="Role Fit"
              badge="new"
            />
          </div>

          {/* Both views stay mounted to preserve their state across tabs.
              `key={sessionKey}` lets a confirmed close wipe them by remounting. */}
          <div className="relative flex-1 overflow-hidden">
            <div className={cn("absolute inset-0", mode !== "chat" && "hidden")}>
              <ChatView
                key={`chat-${sessionKey}`}
                active={open && mode === "chat"}
                onActivity={onActivity}
              />
            </div>
            <div className={cn("absolute inset-0", mode !== "resume" && "hidden")}>
              <ResumeView
                key={`resume-${sessionKey}`}
                active={open && mode === "resume"}
                onActivity={onActivity}
              />
            </div>
          </div>
        </div>

        {/* Delete-confirm overlay (red dot, only when there's something to lose) */}
        {confirmingClose && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-bg/80 p-5 backdrop-blur-sm"
            onClick={() => setConfirmingClose(false)}
          >
            <div
              role="alertdialog"
              aria-label="Confirm close"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[280px] rounded-2xl border border-overlay/10 bg-surface p-5 text-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
            >
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-red-500/15 text-red-400">
                <Trash2 className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">
                Delete this conversation?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Closing clears your chat and analysis. Use the yellow dot to
                minimize and keep them instead.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingClose(false)}
                  className="flex-1 rounded-xl border border-overlay/15 bg-overlay/[0.03] px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-overlay/[0.07]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmingClose(false);
                    onClose();
                  }}
                  className="flex-1 rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-600"
                >
                  Delete &amp; close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/** A small SVG glyph that fades in on hover (and shows on touch), like macOS. */
function Glyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      className="h-2.5 w-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      fill="none"
      stroke="rgba(0,0,0,0.6)"
      strokeWidth={1.4}
      strokeLinecap="round"
    >
      <path d={d} />
    </svg>
  );
}

function TrafficLight({
  color,
  label,
  onClick,
  glyph,
}: {
  color: string;
  label: string;
  onClick: () => void;
  glyph: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      // Stop the title-bar drag from starting when a control is pressed.
      onPointerDown={(e) => e.stopPropagation()}
      // 14px dot, with a transparent ::before pad extending the hit target to
      // ~30px (WCAG 2.5.8) without changing the visual or the row layout.
      className="relative grid h-3.5 w-3.5 place-items-center rounded-full transition before:absolute before:-inset-2 before:content-[''] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright focus-visible:ring-offset-1 focus-visible:ring-offset-bg"
      style={{ backgroundColor: color }}
    >
      {glyph}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-overlay/10 text-ink"
          : "text-faint hover:bg-overlay/[0.05] hover:text-ink",
      )}
    >
      {icon}
      {label}
      {badge && (
        <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent-bright">
          {badge}
        </span>
      )}
    </button>
  );
}
