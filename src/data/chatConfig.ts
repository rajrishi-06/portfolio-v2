/** Static copy + starter prompts for the AI assistant widget. */

export const assistantConfig = {
  /** Shown in the terminal title bar. */
  title: "raj.ai",
  prompt: "raj@portfolio:~$",
  /** Compact prefix for narrow screens, so more of the typed text is visible. */
  promptShort: "~$",

  /** First message the assistant "boots" with. */
  greeting:
    "Hey — I'm Raj's AI twin. Ask me about my stack, projects, or background. Or open **Role Fit**, drop a job description, and I'll match it to how I work and the tech I bring.",

  /** Three clickable starters (the brief asked for exactly these kinds). */
  starters: [
    "What is your tech stack?",
    "Summarize your latest project.",
    "Where did you study?",
  ],

  /** Role-Fit tab copy. */
  resume: {
    blurb:
      "Drop a job description (PDF, image, or .txt) — or paste it — and I'll match it against my skills: how I work, the tech I'd bring, and where I fit the role.",
    cta: "Match this role",
  },
} as const;
