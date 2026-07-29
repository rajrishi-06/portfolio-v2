import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * The assistant's mascot — a small terminal robot.
 *
 * It replaces the old lucide `Terminal` glyph but keeps the terminal identity:
 * the prompt moved from an icon onto the bot's chest plate, where the cursor
 * still blinks. Everything is one 72×72 SVG so it stays crisp at 24px (chat
 * avatar) and at 64px (launcher).
 *
 * ── Rigging ──────────────────────────────────────────────────────────────
 * The bot is a jointed puppet, not a picture that tilts. Drag velocity feeds a
 * chain of springs that get progressively softer down the body, which is what
 * produces follow-through: the torso settles first, then the head, then the
 * arms, and the antenna is still whipping after everything else has stopped.
 *
 *   core  (stiff) → whole-body swing from where it's held
 *   torso (soft)  → extra sway, arriving late
 *   head  (soft)  → tips back, then catches up
 *   limb  (softer)→ arms and legs trail
 *   whip  (loose) → antenna, last to settle
 *   lead  (snappy)→ gaze, the only part that LEADS the motion (you look where
 *                   you're going) — the anticipation that sells the rest
 *
 * Rotations are written straight to the SVG `transform` attribute via `Rig`,
 * using `rotate(deg cx cy)` so every joint pivots exactly where a joint should
 * (shoulder, neck, hips) instead of at a CSS transform-origin we'd have to
 * guess at. Nothing here re-renders React per frame.
 */

/** Drag speed (px/s) at which lean, trail and squash reach full deflection. */
const FULL_TILT_SPEED = 900;
/** Quiet time before the bot dozes off. Any pointer movement wakes it. */
const DOZE_AFTER_MS = 15_000;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/* ── The shared palette ──────────────────────────────────────────────────────
   Deliberately NOT theme tokens. The bot floats over the page (and over the
   inverted chat surface), so it carries its own light: a periwinkle shell that
   holds contrast on both white and near-black, with the site's azure as the
   only lit colour. */
const SHELL_HI = "#C3CDFB";
const SHELL_LO = "#6376DD";
const PLATE_HI = "#8493EA";
const PLATE_LO = "#4B5CC6";
const VISOR_HI = "#1A2242";
const VISOR_LO = "#070B1A";
const LIT = "#7FC0FF";

/**
 * A joint. Binds a live transform string to a `<g>` imperatively, so the whole
 * rig animates without a single React render.
 */
function Rig({
  transform,
  children,
}: {
  transform: MotionValue<string>;
  children: ReactNode;
}) {
  const ref = useRef<SVGGElement>(null);
  useLayoutEffect(() => {
    const apply = (v: string) => ref.current?.setAttribute("transform", v);
    apply(transform.get());
    return transform.on("change", apply);
  }, [transform]);
  return <g ref={ref}>{children}</g>;
}

/** Gradients + clip shared by both the full bot and the head-only variant. */
function RobotDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`${uid}-shell`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={SHELL_HI} />
        <stop offset="1" stopColor={SHELL_LO} />
      </linearGradient>
      <linearGradient id={`${uid}-plate`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={PLATE_HI} />
        <stop offset="1" stopColor={PLATE_LO} />
      </linearGradient>
      <linearGradient id={`${uid}-visor`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor={VISOR_HI} />
        <stop offset="1" stopColor={VISOR_LO} />
      </linearGradient>
      <radialGradient id={`${uid}-lit`}>
        <stop offset="0" stopColor={LIT} stopOpacity="0.85" />
        <stop offset="1" stopColor={LIT} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${uid}-bulb`}>
        <stop offset="0" stopColor="#EAF6FF" />
        <stop offset="0.55" stopColor={LIT} />
        <stop offset="1" stopColor="#3D8FE8" />
      </radialGradient>
      <radialGradient id={`${uid}-shadow`}>
        <stop offset="0" stopColor="#0A0E1E" stopOpacity="0.5" />
        <stop offset="1" stopColor="#0A0E1E" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

type Mood = "open" | "closed" | "arc";

/** One eye, drawn three ways and cross-faded — cheaper and steadier than
 *  morphing a path, and it lets a 70ms blink coexist with a 200ms smile. */
function Eye({ cx, mood, lit }: { cx: number; mood: Mood; lit: string }) {
  return (
    <g>
      <circle cx={cx} cy={26.6} r={5.6} fill={lit} opacity={mood === "open" ? 0.5 : 0.28} />
      <motion.rect
        x={cx - 2.6}
        y={22.2}
        width={5.2}
        height={8.8}
        rx={2.6}
        fill={LIT}
        initial={false}
        animate={{ opacity: mood === "open" ? 1 : 0 }}
        transition={{ duration: 0.07 }}
      />
      <motion.rect
        x={cx - 2.9}
        y={25.8}
        width={5.8}
        height={1.7}
        rx={0.85}
        fill={LIT}
        initial={false}
        animate={{ opacity: mood === "closed" ? 1 : 0 }}
        transition={{ duration: 0.07 }}
      />
      <motion.path
        d={`M${cx - 3.1} 24.9 q3.1 4 6.2 0`}
        stroke={LIT}
        strokeWidth={1.9}
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={{ opacity: mood === "arc" ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </g>
  );
}

export interface RobotMascotProps {
  /** Live velocity of the thing carrying the bot, px/s. Drives the whole rig. */
  vx?: MotionValue<number>;
  vy?: MotionValue<number>;
  /** True while the visitor is dragging the bot around. */
  dragging?: boolean;
  /** True while the pointer is over the bot (or it's keyboard-focused). */
  hovered?: boolean;
  /** True while the bot is held down. */
  pressed?: boolean;
  className?: string;
}

export function RobotMascot({
  vx,
  vy,
  dragging = false,
  hovered = false,
  pressed = false,
  className,
}: RobotMascotProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduce = useReducedMotion() ?? false;
  const svgRef = useRef<SVGSVGElement>(null);

  // Velocity is optional so the bot can also be used as a static glyph.
  const idleX = useMotionValue(0);
  const idleY = useMotionValue(0);
  const rawX = vx ?? idleX;
  const rawY = vy ?? idleY;

  // −1…1 drag speed. Everything below is a differently-tuned spring on these,
  // so pinning them at 0 for prefers-reduced-motion freezes the entire rig in
  // one place: the bot still travels with the pointer, it just stops swinging.
  // Read through a ref because the transformer outlives the render that made it.
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;
  const nx = useTransform(rawX, (v) =>
    reduceRef.current ? 0 : clamp(v / FULL_TILT_SPEED, -1, 1),
  );
  const ny = useTransform(rawY, (v) =>
    reduceRef.current ? 0 : clamp(v / FULL_TILT_SPEED, -1, 1),
  );

  const lead = useSpring(nx, { stiffness: 460, damping: 32, mass: 0.35 });
  const leadY = useSpring(ny, { stiffness: 460, damping: 32, mass: 0.35 });
  const core = useSpring(nx, { stiffness: 230, damping: 24, mass: 0.6 });
  const coreY = useSpring(ny, { stiffness: 230, damping: 24, mass: 0.6 });
  const torso = useSpring(nx, { stiffness: 150, damping: 16, mass: 0.8 });
  const head = useSpring(nx, { stiffness: 120, damping: 13, mass: 0.9 });
  const limb = useSpring(nx, { stiffness: 92, damping: 11, mass: 1 });
  const limbY = useSpring(ny, { stiffness: 92, damping: 11, mass: 1 });
  const whip = useSpring(nx, { stiffness: 62, damping: 7.5, mass: 1.1 });
  const whipY = useSpring(ny, { stiffness: 62, damping: 7.5, mass: 1.1 });

  // Lift: the bot rises off its shadow when picked up, and perks up on hover.
  const liftTo = useMotionValue(0);
  const lift = useSpring(liftTo, { stiffness: 320, damping: 26, mass: 0.6 });
  useEffect(() => {
    liftTo.set(dragging ? 1 : hovered ? 0.42 : 0);
  }, [dragging, hovered, liftTo]);

  // Landing: a one-shot squash the moment the bot is set down.
  const land = useMotionValue(0);
  const wasDragging = useRef(false);
  useEffect(() => {
    if (wasDragging.current && !dragging && !reduce) {
      animate(land, [0, 1, 0], { duration: 0.44, ease: [0.2, 0.9, 0.3, 1] });
    }
    wasDragging.current = dragging;
  }, [dragging, reduce, land]);

  // Wave: one-shot, fired on hover.
  const wave = useMotionValue(0);
  useEffect(() => {
    if (!hovered || dragging || reduce) return;
    const controls = animate(wave, [0, 1, 0.45, 1, 0], {
      duration: 1.15,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [hovered, dragging, reduce, wave]);

  /* ── Face ───────────────────────────────────────────────────────────────── */
  const [blinking, setBlinking] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [asleep, setAsleep] = useState(false);
  const dozeTimer = useRef<number>();

  const rouse = useCallback(() => {
    setAsleep((s) => (s ? false : s)); // same value → React skips the render
    window.clearTimeout(dozeTimer.current);
    dozeTimer.current = window.setTimeout(() => setAsleep(true), DOZE_AFTER_MS);
  }, []);

  useEffect(() => {
    if (!reduce) rouse(); // no dozing when motion is unwelcome
    return () => window.clearTimeout(dozeTimer.current);
  }, [reduce, rouse]);

  useEffect(() => {
    if (!reduce && (hovered || dragging)) rouse();
  }, [reduce, hovered, dragging, rouse]);

  // A short "oh, hello" the moment you arrive, then straight back to watching.
  useEffect(() => {
    if (!hovered || dragging) return;
    setGreeting(true);
    const t = window.setTimeout(() => setGreeting(false), 460);
    return () => {
      window.clearTimeout(t);
      setGreeting(false);
    };
  }, [hovered, dragging]);

  useEffect(() => {
    if (reduce || asleep) return;
    let toClose = 0;
    let toOpen = 0;
    const loop = () => {
      toClose = window.setTimeout(() => {
        setBlinking(true);
        toOpen = window.setTimeout(() => {
          setBlinking(false);
          loop();
        }, 130);
      }, 2400 + Math.random() * 4200);
    };
    loop();
    return () => {
      window.clearTimeout(toClose);
      window.clearTimeout(toOpen);
    };
  }, [reduce, asleep]);

  // Gaze: on pointer devices the eyes follow the cursor across the page, so the
  // bot is alive even while completely still. Summed with the drag look-ahead
  // below — during a drag the pointer sits on the bot, so gaze reads ~0 anyway.
  const gazeXTo = useMotionValue(0);
  const gazeYTo = useMotionValue(0);
  const gazeX = useSpring(gazeXTo, { stiffness: 170, damping: 22, mass: 0.6 });
  const gazeY = useSpring(gazeYTo, { stiffness: 170, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return; // one sample per frame is plenty for a 3px eye travel
      frame = requestAnimationFrame(() => {
        frame = 0;
        const box = svgRef.current?.getBoundingClientRect();
        if (!box || !box.width) return;
        gazeXTo.set(
          clamp((e.clientX - (box.left + box.width / 2)) / (box.width * 2), -1, 1),
        );
        gazeYTo.set(
          clamp((e.clientY - (box.top + box.height * 0.36)) / (box.height * 2), -1, 1),
        );
        rouse();
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduce, gazeXTo, gazeYTo, rouse]);

  // Open is the resting face on purpose: open eyes are the ones that track the
  // cursor, and that's what makes the bot feel present. The smile is a beat,
  // not a state — it fires on approach and then hands the eyes back.
  const mood: Mood = dragging
    ? "open"
    : blinking
      ? "closed"
      : asleep || greeting
        ? "arc"
        : "open";

  /* ── Joint transforms ───────────────────────────────────────────────────────
     Sign convention (SVG, y down): a POSITIVE angle is clockwise, which swings
     anything BELOW the pivot to the left. So for rightward travel every
     trailing part below its pivot rotates positive, and parts above it (the
     antenna) rotate negative. */
  // Whole body: rises when held, swings from the point it's held by, then
  // squashes along the axis it's travelling (and again, harder, when it lands).
  const rootRise = useTransform([lift, land], ([l, d]: number[]) => -l * 2.4 - d * 0.8);
  const rootSwing = useTransform(core, (v) => v * 11);
  const rootScaleX = useTransform(
    [coreY, land],
    ([v, d]: number[]) => 1 - Math.abs(v) * 0.05 + d * 0.09,
  );
  const rootScaleY = useTransform(
    [coreY, land],
    ([v, d]: number[]) => 1 + Math.abs(v) * 0.075 - d * 0.11,
  );
  const rootT = useMotionTemplate`translate(0 ${rootRise}) rotate(${rootSwing} 36 20) translate(36 68) scale(${rootScaleX} ${rootScaleY}) translate(-36 -68)`;

  // Antenna: pivots at the skull, so it whips the OTHER way (it's above the joint).
  const antennaSwing = useTransform(whip, (v) => -v * 26);
  const antennaDip = useTransform(whipY, (v) => -v * 1.6);
  const antennaT = useMotionTemplate`rotate(${antennaSwing} 36 12) translate(0 ${antennaDip})`;

  const headSwing = useTransform(head, (v) => -v * 5); // tips back, then catches up
  const headT = useMotionTemplate`rotate(${headSwing} 36 41)`;

  const torsoSwing = useTransform(torso, (v) => v * 6);
  const torsoT = useMotionTemplate`rotate(${torsoSwing} 36 43)`;

  const feetSwing = useTransform(limb, (v) => v * 11); // legs dangle behind
  const feetT = useMotionTemplate`rotate(${feetSwing} 36 60)`;

  // Arms trail horizontally, splay outward when dropped, and the right one waves.
  const armLSwing = useTransform(
    [limb, limbY, wave],
    ([h, v, w]: number[]) => h * 23 + v * 11 - w * 4,
  );
  const armRSwing = useTransform(
    [limb, limbY, wave],
    ([h, v, w]: number[]) => h * 26 - v * 11 - w * 54,
  );
  const armLT = useMotionTemplate`rotate(${armLSwing} 17.5 48)`;
  const armRT = useMotionTemplate`rotate(${armRSwing} 54.5 48)`;

  // The gaze leads the drag; the pointer-follow rides along on top of it.
  const gazeShiftX = useTransform([lead, gazeX], ([l, p]: number[]) =>
    clamp(l * 2.5 + p * 2.6, -3.2, 3.2),
  );
  const gazeShiftY = useTransform([leadY, gazeY], ([l, p]: number[]) =>
    clamp(l * 1.6 + p * 1.8, -2.2, 2.2),
  );
  const gazeT = useMotionTemplate`translate(${gazeShiftX} ${gazeShiftY})`;

  // The shadow tightens and fades as the bot leaves the ground.
  const shadowScale = useTransform([lift, land], ([l, d]: number[]) => 1 - l * 0.3 + d * 0.1);
  const shadowT = useMotionTemplate`translate(36 70.5) scale(${shadowScale} 1) translate(-36 -70.5)`;
  const shadowO = useTransform([lift, land], ([l, d]: number[]) => 0.9 - l * 0.5 + d * 0.1);

  const g = (n: string) => `url(#${uid}-${n})`;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden
      className={className}
      style={{ overflow: "visible" }}
    >
      <RobotDefs uid={uid} />

      {/* Contact shadow — outside the float, so the bot moves and it doesn't. */}
      <Rig transform={shadowT}>
        <motion.ellipse cx={36} cy={70.5} rx={16} ry={3} fill={g("shadow")} style={{ opacity: shadowO }} />
      </Rig>

      {/* Breathing. A translate, so it composes with every rotation below. */}
      <motion.g
        initial={false}
        animate={
          reduce
            ? { y: 0 }
            : { y: dragging ? 0 : asleep ? [0, -1, 0] : [0, -1.9, 0] }
        }
        transition={
          reduce || dragging
            ? { duration: 0.2 }
            : {
                duration: asleep ? 5.2 : 3.4,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <Rig transform={rootT}>
          {/* Sleeping "z" — the only thing that appears rather than moves. */}
          {asleep && !reduce && (
            <motion.path
              d="M52 3 h5 l-5 6.4 h5"
              stroke={LIT}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0], y: [1, -6, -11] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          <Rig transform={antennaT}>
            <path d="M36 13V6.6" stroke={PLATE_LO} strokeWidth={2.4} strokeLinecap="round" />
            <motion.circle
              cx={36}
              cy={4.6}
              r={7}
              fill={g("lit")}
              initial={false}
              animate={reduce ? { opacity: 0.4 } : { opacity: asleep ? [0.18, 0.4, 0.18] : [0.34, 0.72, 0.34] }}
              transition={
                reduce
                  ? { duration: 0.2 }
                  : { duration: asleep ? 4.4 : 2.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <circle cx={36} cy={4.6} r={3.1} fill={g("bulb")} />
            <circle cx={34.9} cy={3.5} r={1} fill="#FFFFFF" opacity={0.8} />
          </Rig>

          {/* Arms and legs are drawn before the torso and tucked under its edge,
              so a swinging joint never opens a gap where the shoulder/hip is. */}
          <Rig transform={armLT}>
            <rect x={14.4} y={45.5} width={6.2} height={13.5} rx={3.1} fill={g("plate")} />
          </Rig>
          <Rig transform={armRT}>
            <rect x={51.4} y={45.5} width={6.2} height={13.5} rx={3.1} fill={g("plate")} />
          </Rig>

          <Rig transform={feetT}>
            <rect x={22} y={61} width={11.5} height={8} rx={3.4} fill={g("plate")} />
            <rect x={38.5} y={61} width={11.5} height={8} rx={3.4} fill={g("plate")} />
          </Rig>

          <Rig transform={torsoT}>
            <rect x={31} y={39} width={10} height={6} rx={2.4} fill={PLATE_LO} />
            <rect x={18} y={43} width={36} height={22} rx={9.5} fill={g("shell")} />
            <rect
              x={19.5}
              y={44.4}
              width={33}
              height={19.2}
              rx={8.4}
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity={0.22}
              strokeWidth={1.1}
            />
            {/* The terminal, relocated: prompt on the chest, cursor still blinking. */}
            <rect x={25.5} y={48} width={21} height={11.4} rx={3.8} fill={g("visor")} />
            <path
              d="M30 51.2 L33 53.7 L30 56.2"
              stroke={LIT}
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.rect
              x={35}
              y={54.6}
              width={6}
              height={1.8}
              rx={0.9}
              fill={LIT}
              initial={false}
              animate={reduce || asleep ? { opacity: 0.35 } : { opacity: [1, 1, 0, 0] }}
              transition={
                reduce || asleep
                  ? { duration: 0.3 }
                  : { duration: 1.1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }
              }
            />
          </Rig>

          <Rig transform={headT}>
            <rect x={5} y={25.5} width={6} height={11} rx={3} fill={g("plate")} />
            <rect x={61} y={25.5} width={6} height={11} rx={3} fill={g("plate")} />
            <circle cx={8} cy={31} r={1.1} fill={LIT} opacity={0.75} />
            <circle cx={64} cy={31} r={1.1} fill={LIT} opacity={0.75} />

            <rect x={10} y={11} width={52} height={31} rx={12.5} fill={g("shell")} />
            <rect
              x={11.6}
              y={12.5}
              width={48.8}
              height={28}
              rx={11}
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity={0.24}
              strokeWidth={1.2}
            />

            <clipPath id={`${uid}-visorclip`}>
              <rect x={16} y={16.4} width={40} height={20.6} rx={9} />
            </clipPath>
            <rect x={16} y={16.4} width={40} height={20.6} rx={9} fill={g("visor")} />
            <g clipPath={g("visorclip")}>
              <path d="M14 34 L27 15 L34 15 L21 39 Z" fill="#FFFFFF" opacity={0.055} />
              <Rig transform={gazeT}>
                <Eye cx={27.6} mood={mood} lit={g("lit")} />
                <Eye cx={44.4} mood={mood} lit={g("lit")} />
              </Rig>
            </g>
            {/* Squint on press — the bot bracing as it's grabbed. */}
            <motion.rect
              x={16}
              y={16.4}
              width={40}
              height={20.6}
              rx={9}
              fill={VISOR_LO}
              initial={false}
              animate={{ opacity: pressed ? 0.45 : 0 }}
              transition={{ duration: 0.12 }}
            />
          </Rig>
        </Rig>
      </motion.g>
    </svg>
  );
}

/**
 * Head-only variant for the small, static spots (chat avatars, the panel title
 * bar). Not a scaled-down copy of the full bot — at 20-24px the arms, the ear
 * detail and the visor sheen all collapse into mush, so this is redrawn to the
 * three things that still read at that size: antenna, visor, two lit eyes.
 */
export function RobotHead({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = (n: string) => `url(#${uid}-${n})`;

  return (
    <svg viewBox="0 0 32 30" fill="none" aria-hidden className={className}>
      <RobotDefs uid={uid} />
      <path d="M16 7V3.6" stroke={PLATE_LO} strokeWidth={1.9} strokeLinecap="round" />
      <circle cx={16} cy={2.3} r={2.2} fill={g("bulb")} />
      <rect x={0} y={13.4} width={2.4} height={7.4} rx={1.2} fill={g("plate")} />
      <rect x={29.6} y={13.4} width={2.4} height={7.4} rx={1.2} fill={g("plate")} />
      <rect x={1.8} y={6} width={28.4} height={22} rx={8} fill={g("shell")} />
      <rect
        x={2.9}
        y={7}
        width={26.2}
        height={20}
        rx={7.1}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity={0.26}
        strokeWidth={0.9}
      />
      <rect x={5} y={9.4} width={22} height={15.2} rx={6.4} fill={g("visor")} />
      <circle cx={11.7} cy={17} r={4} fill={g("lit")} opacity={0.55} />
      <circle cx={20.3} cy={17} r={4} fill={g("lit")} opacity={0.55} />
      <rect x={9.8} y={13.4} width={3.8} height={7.2} rx={1.9} fill={LIT} />
      <rect x={18.4} y={13.4} width={3.8} height={7.2} rx={1.9} fill={LIT} />
    </svg>
  );
}
