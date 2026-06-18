/**
 * Geometry helpers for the floating assistant.
 *
 * The launcher's position (viewport coordinates of its top-left corner) is the
 * single source of truth: it's draggable, persisted across reloads, and clamped
 * back on-screen when the window resizes. The panel doesn't have a fixed corner
 * — it computes where to open from the launcher's current position, growing into
 * whichever side has the most room.
 */

export const LAUNCHER_SIZE = 56; // matches h-14 w-14 on the launcher button
export const VIEWPORT_MARGIN = 16; // min gap kept from every screen edge
const DEFAULT_INSET = 24; // resting distance from the corner (~bottom-6/right-6)
const PANEL_GAP = 12; // gap between the launcher and the opened panel
const PANEL_MAX_W = 400;
const PANEL_MAX_H = 620;
const STORAGE_KEY = "raj-assistant-launcher-pos";

export interface Point {
  x: number;
  y: number;
}

export interface PanelBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

/** Resting spot for a first-time visitor: the bottom-right corner. */
export function defaultLauncherPos(vw: number, vh: number): Point {
  return {
    x: vw - LAUNCHER_SIZE - DEFAULT_INSET,
    y: vh - LAUNCHER_SIZE - DEFAULT_INSET,
  };
}

/** Force a launcher position to sit fully within the viewport (with margin). */
export function clampLauncherPos(p: Point, vw: number, vh: number): Point {
  return {
    x: clamp(p.x, VIEWPORT_MARGIN, Math.max(VIEWPORT_MARGIN, vw - LAUNCHER_SIZE - VIEWPORT_MARGIN)),
    y: clamp(p.y, VIEWPORT_MARGIN, Math.max(VIEWPORT_MARGIN, vh - LAUNCHER_SIZE - VIEWPORT_MARGIN)),
  };
}

/**
 * Read the raw saved position WITHOUT clamping — the user's intended spot.
 * Returns null when nothing valid is stored. Callers clamp this for display so
 * the persisted intent survives a temporary shrink-then-grow of the window.
 */
export function readStoredPos(): Point | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Point>;
      if (typeof p?.x === "number" && typeof p?.y === "number") {
        return { x: p.x, y: p.y };
      }
    }
  } catch {
    /* localStorage unavailable / corrupt — treat as no stored position */
  }
  return null;
}

/** Saved launcher position clamped to the current viewport, or the default. */
export function loadLauncherPos(vw: number, vh: number): Point {
  const stored = readStoredPos();
  return stored ? clampLauncherPos(stored, vw, vh) : defaultLauncherPos(vw, vh);
}

export function saveLauncherPos(p: Point): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* private mode / quota — position simply won't persist */
  }
}

/**
 * Decide where the panel opens given the launcher's current position. It
 * anchors to the launcher's nearest edges and extends toward the open space
 * (up if the launcher sits low, down if high; left if it's on the right side,
 * right if on the left), then is clamped fully on-screen.
 */
export function placePanel(launcher: Point, vw: number, vh: number): PanelBox {
  const width = Math.min(PANEL_MAX_W, vw - VIEWPORT_MARGIN * 2);
  const height = Math.min(PANEL_MAX_H, vh - VIEWPORT_MARGIN * 2);

  const centerX = launcher.x + LAUNCHER_SIZE / 2;
  const centerY = launcher.y + LAUNCHER_SIZE / 2;

  // Horizontal: align to the launcher edge nearer the screen edge so the panel
  // grows into the wider gap.
  let left =
    centerX > vw / 2
      ? launcher.x + LAUNCHER_SIZE - width // launcher on the right → grow left
      : launcher.x; // launcher on the left → grow right

  // Vertical: open upward when the launcher is in the lower half, else downward.
  let top =
    centerY > vh / 2
      ? launcher.y - PANEL_GAP - height // grow up
      : launcher.y + LAUNCHER_SIZE + PANEL_GAP; // grow down

  left = clamp(left, VIEWPORT_MARGIN, vw - width - VIEWPORT_MARGIN);
  top = clamp(top, VIEWPORT_MARGIN, vh - height - VIEWPORT_MARGIN);

  return { left, top, width, height };
}
