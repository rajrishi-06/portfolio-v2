import { useState } from "react";
import { motion, type MotionValue } from "framer-motion";
import { RobotMascot } from "./RobotMascot";

/**
 * The quiet entry point: the assistant's robot, standing in the corner.
 *
 * No glass chip around it — the bot is the button. Affordance comes from the
 * soft halo that blooms on hover, the wave it gives back, and the fact that it
 * has been watching the cursor the whole time. Wrapped in a draggable container
 * by ChatWidget, so it's movable; it fades out while the panel is open, and the
 * click handler is no-op'd mid-drag by the parent.
 */
export function ChatLauncher({
  onClick,
  vx,
  vy,
  dragging = false,
}: {
  onClick: () => void;
  /** Live velocity of the launcher — drives the bot's whole rig while dragged. */
  vx?: MotionValue<number>;
  vy?: MotionValue<number>;
  dragging?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Open Raj's AI assistant"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      // The bot does its own reacting — the button only handles focus styling,
      // so nothing here fights the rig for the same transform.
      className="group relative block h-16 w-16 rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
    >
      {/* Halo — the only "this is a control" chrome, and only on approach. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-full bg-accent-glow/0 blur-xl transition-colors duration-300 group-hover:bg-accent-glow/25 group-focus-visible:bg-accent-glow/25"
      />
      <RobotMascot
        vx={vx}
        vy={vy}
        dragging={dragging}
        hovered={hovered && !dragging}
        pressed={pressed && !dragging}
        // Cast a shadow on the light site; on the dark one there's nothing to
        // cast onto, so the same offset becomes a faint azure bloom instead.
        className="relative h-16 w-16 drop-shadow-[0_10px_18px_rgba(8,12,28,0.28)] dark:drop-shadow-[0_8px_22px_rgba(59,130,246,0.22)]"
      />
    </motion.button>
  );
}
