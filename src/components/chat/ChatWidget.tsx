import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatLauncher } from "./ChatLauncher";
import { ChatPanel } from "./ChatPanel";
import {
  clampLauncherPos,
  loadLauncherPos,
  placePanel,
  readStoredPos,
  saveLauncherPos,
  type PanelBox,
  type Point,
} from "./position";

/**
 * The whole assistant: a quiet, draggable terminal launcher + a floating,
 * draggable panel with the strict chat twin and the JD Role-Fit analyzer.
 *
 * The launcher's position is the single source of truth — it's draggable,
 * persisted across reloads (localStorage), and clamped back on-screen on resize.
 * The panel has no fixed corner: each time it opens it positions itself next to
 * the launcher, growing into whichever side has the most room. Both stay mounted
 * (hidden + inert when not in use) so chat/analysis state survives open/close.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const launcherBoundsRef = useRef<HTMLDivElement>(null);
  const launcherWrapRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  // Launcher position in viewport coordinates (top-left of the button), seeded
  // from the saved spot (or the bottom-right corner for a first visit).
  const initial = useRef(
    loadLauncherPos(window.innerWidth, window.innerHeight),
  ).current;
  const x = useMotionValue(initial.x);
  const y = useMotionValue(initial.y);

  // The unclamped spot the user dragged to — the persisted intent. The shown
  // position is clamped to the viewport, but this survives a temporary window
  // shrink so growing it back restores the original spot. Seeded from the RAW
  // stored value (not the clamped `initial`) for that same reason.
  const desiredRef = useRef<Point>(readStoredPos() ?? initial);

  // Where the panel should open — recomputed from the launcher's live position.
  const [panelBox, setPanelBox] = useState<PanelBox>(() =>
    placePanel(initial, window.innerWidth, window.innerHeight),
  );

  const reposition = useCallback(() => {
    setPanelBox(
      placePanel({ x: x.get(), y: y.get() }, window.innerWidth, window.innerHeight),
    );
  }, [x, y]);

  // The panel was dragged: slide the launcher by the same amount (clamped) and
  // persist it. The launcher is the single source of truth, so moving it makes
  // the minimized icon reappear beside where the panel was left, and the next
  // open (placed from the launcher) opens there too — instead of snapping back
  // to the launcher's old corner. The panel keeps its current visual spot; its
  // offset is reset on the next open, after `box` is recomputed from here.
  const commitPanelDrag = useCallback(
    (delta: Point) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const moved = clampLauncherPos(
        { x: x.get() + delta.x, y: y.get() + delta.y },
        vw,
        vh,
      );
      x.set(moved.x);
      y.set(moved.y);
      desiredRef.current = moved;
      saveLauncherPos(moved);
    },
    [x, y],
  );

  // Keep the launcher out of the tab order / AT while the panel is open.
  useEffect(() => {
    launcherWrapRef.current?.toggleAttribute("inert", open);
  }, [open]);

  // On resize: keep the launcher on-screen, persist it, and re-place the panel
  // so it always opens (and stays) within the new viewport.
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Clamp the persisted intent for display only — never re-save it here, or
      // a shrink would overwrite the user's dragged spot and a later grow
      // couldn't restore it.
      const shown = clampLauncherPos(desiredRef.current, vw, vh);
      x.set(shown.x);
      y.set(shown.y);
      setPanelBox(placePanel(shown, vw, vh));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [x, y]);

  // While open, keep the panel inside the *visual* viewport. When the mobile
  // keyboard appears, iOS shrinks visualViewport (not window) and would scroll
  // our fixed panel up off the top to reveal the focused input. Re-placing the
  // panel to fit the space above the keyboard keeps the input visible, so the
  // panel stays put instead of jumping to the top.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !open) return;
    const fit = () => {
      const box = placePanel({ x: x.get(), y: y.get() }, vv.width, vv.height);
      const left = box.left + vv.offsetLeft;
      const top = box.top + vv.offsetTop;
      setPanelBox((prev) =>
        prev.left === left &&
        prev.top === top &&
        prev.width === box.width &&
        prev.height === box.height
          ? prev // unchanged — let React bail out of the re-render
          : { left, top, width: box.width, height: box.height },
      );
    };
    fit();
    vv.addEventListener("resize", fit);
    vv.addEventListener("scroll", fit);
    return () => {
      vv.removeEventListener("resize", fit);
      vv.removeEventListener("scroll", fit);
    };
  }, [open, x, y]);

  const openPanel = () => {
    reposition(); // open toward whatever space the launcher currently has
    setOpen(true);
  };

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
        box={panelBox}
        dirty={dirty}
        sessionKey={sessionKey}
        onMinimize={minimize}
        onClose={close}
        onActivity={() => setDirty(true)}
        onDragCommit={commitPanelDrag}
      />

      {/* Movable launcher. Full-viewport boundary keeps the page clickable and
          constrains the drag; the launcher button is the only interactive bit. */}
      <div ref={launcherBoundsRef} className="pointer-events-none fixed inset-0 z-[61]">
        <motion.div
          ref={launcherWrapRef}
          drag
          dragConstraints={launcherBoundsRef}
          dragMomentum={false}
          dragElastic={0}
          style={{ x, y }}
          onDragStart={() => {
            draggedRef.current = true;
          }}
          onDragEnd={() => {
            // The drop point is the new persisted intent (it's already within
            // the viewport thanks to dragConstraints).
            const dropped = { x: x.get(), y: y.get() };
            desiredRef.current = dropped;
            saveLauncherPos(dropped);
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
            "absolute left-0 top-0 cursor-grab active:cursor-grabbing",
            open ? "pointer-events-none" : "pointer-events-auto",
          )}
        >
          <ChatLauncher
            onClick={() => {
              if (!draggedRef.current) openPanel();
            }}
          />
        </motion.div>
      </div>
    </>
  );
}
