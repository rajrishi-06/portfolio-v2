import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatLauncher } from "./ChatLauncher";
import { ChatPanel } from "./ChatPanel";

/**
 * The whole assistant: a quiet, draggable terminal launcher + a floating,
 * draggable panel with the strict chat twin and the JD Role-Fit analyzer.
 *
 * The panel and launcher both stay mounted (hidden + inert when not in use) so
 * the dragged positions and the chat/analysis state survive open/close. The
 * panel's traffic-lights are the controls: yellow minimizes (keeps state), red
 * closes (wipes state, after a confirm). The launcher reopens it.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const launcherBoundsRef = useRef<HTMLDivElement>(null);
  const launcherWrapRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  // Keep the launcher out of the tab order / AT while the panel is open.
  useEffect(() => {
    launcherWrapRef.current?.toggleAttribute("inert", open);
  }, [open]);

  // Yellow dot → keep everything; Red dot (confirmed) → wipe the views.
  const minimize = () => setOpen(false);
  const close = () => {
    setOpen(false);
    setSessionKey((k) => k + 1); // remounts the views → clears chat + analysis
    setDirty(false);
  };

  return (
    <>
      <ChatPanel
        open={open}
        dirty={dirty}
        sessionKey={sessionKey}
        onMinimize={minimize}
        onClose={close}
        onActivity={() => setDirty(true)}
      />

      {/* Movable launcher (the initial state). Full-viewport boundary keeps the
          page clickable; the launcher itself is the only interactive bit. */}
      <div ref={launcherBoundsRef} className="pointer-events-none fixed inset-0 z-[61]">
        <motion.div
          ref={launcherWrapRef}
          drag
          dragConstraints={launcherBoundsRef}
          dragMomentum={false}
          dragElastic={0.12}
          onDragStart={() => {
            draggedRef.current = true;
          }}
          onDragEnd={() => {
            // Cleared after the click that follows pointer-up, so finishing a
            // drag doesn't also fire "open".
            requestAnimationFrame(() => {
              draggedRef.current = false;
            });
          }}
          initial={false}
          animate={open ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          className={cn(
            "absolute bottom-6 right-4 cursor-grab active:cursor-grabbing sm:right-6",
            open ? "pointer-events-none" : "pointer-events-auto",
          )}
        >
          <ChatLauncher
            onClick={() => {
              if (!draggedRef.current) setOpen(true);
            }}
          />
        </motion.div>
      </div>
    </>
  );
}
