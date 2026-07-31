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
  /**
   * Reserved thumbnail height ÷ width, used ONLY for the gradient placeholder
   * and looping video (which have no intrinsic size). A real `image` ignores
   * this and is shown at its own aspect ratio, scaled to the column width.
   */
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
      "Pulls your competitive-programming handles from every judge into one shareable card.",
    tags: ["HTML", "CSS", "REST APIs"],
    github: "https://github.com/rajrishi-06/Cp-Card",
    icon: CreditCard,
    ratio: 0.62,
    image: "/images/projects/cp-card.png",
    grad: ["#1d4ed8", "#0ea5e9"],
    featured: true,
  },
  {
    title: "QR Code Generator",
    lang: "JavaScript",
    description:
      "A QR generator written from scratch. Any URL becomes a downloadable code without calling a third-party API.",
    tags: ["Canvas", "HTML", "CSS"],
    github: "https://github.com/rajrishi-06/QR.Code.Generator",
    icon: QrCode,
    ratio: 0.82,
    image: "/images/projects/qr-code.png",
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
      "A browser extension that pulls POC contact details out of internal sources so nobody has to look them up by hand.",
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
      "A ride-hailing concept: an Ola/Uber-style booking flow with live maps, built to see how far we could get.",
    tags: ["Maps API", "Node"],
    github: "https://github.com/rajrishi-06/Gol-Gol",
    icon: Car,
    ratio: 0.82,
    image: "/images/projects/gol-gol.png",
    grad: ["#0891b2", "#3b82f6"],
  },
  {
    title: "Prod_Qilo",
    lang: "C++",
    description:
      "The storage engine behind QiloDB. A small database written in C++, no libraries doing the hard part.",
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
      "A desktop typing test with an on-screen keyboard you can recolour key by key.",
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
