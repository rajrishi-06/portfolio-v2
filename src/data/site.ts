export const BASE = import.meta.env.BASE_URL;

/** NPCI's channel avatar, used as the company mark in Journey and NowBuilding.
 *  Remote and therefore rot-prone — every consumer must render a fallback. */
export const NPCI_LOGO =
  "https://yt3.googleusercontent.com/ytc/AIdro_mDt7ITa64-4jAN3IPWpbaqYbtLtiDfComrYNxhxK0AWyE=s900-c-k-c0x00ffffff-no-rj";

export const site = {
  name: "Raj Rishi Reddy",
  fullName: "Kotha Raj Rishi Reddy",
  role: "Software Engineer",
  // Short, punchy positioning, not a resume summary. Every line here should be
  // something only he could write: no "solves problems", no "ships products".
  // Three lines, each short enough to survive at text-7xl without wrapping.
  headline: ["Systems, tools,", "and a database", "engine or two."],
  tagline:
    "CS undergrad at NIT Silchar, currently building the real-time data pipeline behind AEPS at NPCI. Outside that: a database engine in C++, an AI task scheduler, and a pile of desktop tools.",
  location: "India",
  email: "rajrishireddyk@gmail.com",
  resume: `${BASE}resume.pdf`,
  socials: {
    github: "https://github.com/rajrishi-06",
    linkedin: "https://www.linkedin.com/in/kotha-raj-rishi-reddy-21b6562a1/",
    facebook: "https://www.facebook.com/share/14uwfQqH9G/?mibextid=wwXIfr",
  },
  blog: "https://blog-pxvl.onrender.com/",
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "JavaScript", "TypeScript", "C++", "Java", "SQL"] },
  { group: "Frameworks", items: ["React", "Node.js", "Flask", "Svelte", "Tailwind"] },
  { group: "Tools", items: ["Git", "Docker", "Selenium", "Linux", "Figma"] },
];

// Education + experience as one "journey" (anti-resume: a story, not stacked boxes)
export type JourneyItem = {
  period: string;
  title: string;
  org: string;
  detail?: string;
  /** Org logo. Optional — the card falls back to a monogram if absent or if the
   *  image fails to load, so a dead remote URL never shows a broken icon. */
  logo?: string;
};

export const journey: JourneyItem[] = [
  {
    period: "2025 — Present",
    title: "Software / Automation Intern",
    org: "NPCI",
    detail: "Building and automating internal tooling and data workflows.",
    logo: NPCI_LOGO,
  },
  {
    period: "2023 — 2027",
    title: "B.Tech, Computer Science & Engineering",
    org: "National Institute of Technology, Silchar",
    detail: "CGPA 8.45 / 10. Coursework: DSA, OOP, DBMS, Computer Organization.",
    logo: `${BASE}images/nit-silchar.jpg`,
  },
  {
    period: "2021 — 2023",
    title: "Higher Secondary (Class XII)",
    org: "Sri Chaitanya Junior College, Madhapur",
    detail: "98.1% in Mathematics, Physics and Chemistry.",
    // No logo: the only image available was a third-party listing photo we have
    // no licence to serve. The card renders a monogram instead.
  },
];
