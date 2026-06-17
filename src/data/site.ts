export const BASE = import.meta.env.BASE_URL;

export const site = {
  name: "Raj Rishi Reddy",
  fullName: "Kotha Raj Rishi Reddy",
  role: "Software Engineer",
  // Short, punchy positioning — not a resume summary
  headline: ["I build", "things that", "solve problems."],
  tagline:
    "Software engineer who turns rough ideas into shipped products — web apps, automation tools and AI-powered experiments.",
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
  kind: "work" | "education";
};

export const journey: JourneyItem[] = [
  {
    period: "2025 — Present",
    title: "Software / Automation Intern",
    org: "NPCI",
    detail: "Building and automating internal tooling and data workflows.",
    kind: "work",
  },
  {
    period: "2023 — 2027",
    title: "B.Tech, Computer Science & Engineering",
    org: "National Institute of Technology, Silchar",
    detail: "CGPA 8.21 / 10 · DSA, OOP, DBMS, Computer Organization.",
    kind: "education",
  },
  {
    period: "2021 — 2023",
    title: "Higher Secondary (Class XII)",
    org: "Sri Chaitanya Junior College, Madhapur",
    detail: "98.1% — Mathematics, Physics, Chemistry.",
    kind: "education",
  },
];
