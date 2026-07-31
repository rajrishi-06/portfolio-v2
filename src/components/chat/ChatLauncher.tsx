import { useState } from "react";
import { motion, type MotionValue } from "framer-motion";
import { RobotMascot } from "./RobotMascot";

/**
 * The quiet entry point: the assistant's robot, standing in the corner.
 *
 * No chip, no halo — the bot is the button. Affordance comes from the wave it
 * gives back and the fact that it has been watching the cursor the whole time.
 * Wrapped in a draggable container by ChatWidget, so it's movable; it fades out
 * while the panel is open, and the click handler is no-op'd mid-drag by the
 * parent.
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
      // The bot does its own reacting — the button carries no chrome of its
      // own, so nothing here fights the rig for the same transform. Focus is
      // the global square accent outline.
      className="group relative block h-16 w-16"
    >
      <RobotMascot
        vx={vx}
        vy={vy}
        dragging={dragging}
        hovered={hovered && !dragging}
        pressed={pressed && !dragging}
        className="relative h-16 w-16"
      />
    </motion.button>
  );
}
