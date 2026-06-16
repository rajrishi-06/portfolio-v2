import {
  CreditCard,
  QrCode,
  Ghost,
  Zap,
  Puzzle,
  Car,
  Database,
  Keyboard,
  Stamp,
  type LucideIcon,
} from "lucide-react";

export type Project = {
  title: string;
  lang: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  icon: LucideIcon;
  /** thumbnail height ÷ width — varied so the masonry visibly reflows */
  ratio: number;
  /** gradient stops for the placeholder thumbnail */
  grad: [string, string];
  /** drop a real screenshot/video here later: e.g. `${BASE}images/projects/x.jpg` */
  image?: string;
  video?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Cp-Card",
    lang: "JavaScript",
    description:
      "Generate a sleek profile card that pulls your competitive-programming handles into one shareable snapshot.",
    tags: ["HTML", "CSS", "REST APIs"],
    github: "https://github.com/rajrishi-06/Cp-Card",
    icon: CreditCard,
    ratio: 0.62,
    grad: ["#1d4ed8", "#0ea5e9"],
    featured: true,
  },
  {
    title: "QR Code Generator",
    lang: "JavaScript",
    description:
      "A from-scratch QR generator that turns any URL into a clean, downloadable code — no third-party API.",
    tags: ["Canvas", "HTML", "CSS"],
    github: "https://github.com/rajrishi-06/QR.Code.Generator",
    icon: QrCode,
    ratio: 0.82,
    grad: ["#2563eb", "#7c3aed"],
  },
  {
    title: "GhostWrite",
    lang: "Python",
    description:
      "A ruthless focus-writing tool: hesitate, and your words start vanishing. Keep typing, or lose everything.",
    tags: ["Tkinter", "Desktop"],
    github: "https://github.com/rajrishi-06/GhostWrite",
    icon: Ghost,
    ratio: 0.55,
    grad: ["#0ea5e9", "#22d3ee"],
    featured: true,
  },
  {
    title: "Action",
    lang: "JavaScript",
    description:
      "An AI-powered task scheduler that turns plain-language plans into an organized, time-blocked day.",
    tags: ["AI / LLM", "Node"],
    github: "https://github.com/rajrishi-06/Action",
    icon: Zap,
    ratio: 0.7,
    grad: ["#3b82f6", "#06b6d4"],
    featured: true,
  },
  {
    title: "B2B Extension",
    lang: "JavaScript",
    description:
      "A browser extension that pulls POC contact data straight from internal sources, cutting B2B lookup time.",
    tags: ["Chrome Extension", "DOM"],
    github: "https://github.com/rajrishi-06/B2B---Extension",
    icon: Puzzle,
    ratio: 0.6,
    grad: ["#1e40af", "#3b82f6"],
  },
  {
    title: "Gol-Gol",
    lang: "JavaScript",
    description:
      "A ride-hailing app concept — an Ola/Uber-style booking flow with live maps and our own spin.",
    tags: ["Maps API", "Node"],
    github: "https://github.com/rajrishi-06/Gol-Gol",
    icon: Car,
    ratio: 0.82,
    grad: ["#0891b2", "#3b82f6"],
  },
  {
    title: "Prod_Qilo",
    lang: "C++",
    description:
      "The production engine behind QiloDB — a lightweight database built from the ground up in C++.",
    tags: ["Systems", "Database"],
    github: "https://github.com/rajrishi-06/Prod_Qilo",
    icon: Database,
    ratio: 0.55,
    grad: ["#4338ca", "#2563eb"],
  },
  {
    title: "Typing Speed Test",
    lang: "Python",
    description:
      "A polished desktop typing-speed tester with a vivid, fully customizable on-screen keyboard.",
    tags: ["Tkinter", "Desktop"],
    github: "https://github.com/rajrishi-06/Typing-Speed-Test",
    icon: Keyboard,
    ratio: 0.7,
    grad: ["#2563eb", "#38bdf8"],
  },
  {
    title: "WaterMark",
    lang: "Python",
    description:
      "A desktop app to drop a custom text or logo watermark onto any image in seconds.",
    tags: ["Pillow", "Tkinter"],
    github: "https://github.com/rajrishi-06/WaterMark",
    icon: Stamp,
    ratio: 0.62,
    grad: ["#0ea5e9", "#6366f1"],
  },
];
