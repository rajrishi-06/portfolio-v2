/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1160px" },
    },
    extend: {
      colors: {
        // Theme-aware tokens — values come from CSS vars in index.css.
        // See DESIGN.md for what each one is for.
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        faint: "rgb(var(--c-faint) / <alpha-value>)",
        // Adaptive overlay: black in light mode, white in dark. Every rule and
        // hover fill is built from this so it flips with the theme.
        overlay: "rgb(var(--c-overlay) / <alpha-value>)",
        // One accent. There is deliberately no accent-bright / accent-glow —
        // this design has no glow to tint.
        accent: "rgb(var(--c-accent) / <alpha-value>)",
      },
      fontFamily: {
        display: ['"Spectral"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      borderColor: {
        DEFAULT: "rgb(var(--c-overlay) / 0.14)",
      },
      // Squaring the whole scale rather than hand-editing every call site:
      // any leftover rounded-2xl from the old design flattens on its own.
      // rounded-full is left alone — the portrait and status dots need it.
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "0",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "0",
        "3xl": "0",
      },
      letterSpacing: {
        label: "0.14em",
      },
    },
  },
  plugins: [],
};
