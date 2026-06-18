import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

/**
 * The quiet entry point: a stylized terminal button in the corner.
 * No auto-open, no sound — the visitor chooses to click it. Wrapped in a
 * draggable container by ChatWidget, so it's movable; it fades out while the
 * panel is open. The click handler is no-op'd mid-drag by the parent.
 */
export function ChatLauncher({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Open Raj's AI assistant"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      className="group relative grid h-14 w-14 place-items-center rounded-2xl glass-strong text-ink shadow-[0_18px_50px_-22px_rgba(0,0,0,0.9)] transition-colors hover:border-accent-bright/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-accent/0 transition-colors duration-300 group-hover:bg-accent/[0.06]" />
      <Terminal className="relative h-6 w-6 text-accent-bright" />

      {/* Tiny "online" dot — present, not noisy. */}
      <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-bright" />
      </span>
    </motion.button>
  );
}
