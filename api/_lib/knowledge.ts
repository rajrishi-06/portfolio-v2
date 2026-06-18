/**
 * Single source of truth for everything the assistant is allowed to talk about.
 * Mirrors the data in the frontend (src/data/site.ts + src/data/projects.ts).
 * If you update the portfolio, update this file too — it's what grounds the AI.
 */

export const profile = {
  name: "Raj Rishi Reddy",
  fullName: "Kotha Raj Rishi Reddy",
  role: "Software Engineer",
  location: "India (available remotely)",
  email: "rajrishireddyk@gmail.com",
  tagline:
    "Software engineer who turns rough ideas into shipped products — web apps, automation tools and AI-powered experiments.",
  blurb:
    "A CS undergrad who likes turning messy problems into clean, working software. From a database engine in C++ to AI task schedulers and browser extensions, he bounces across the stack and enjoys the parts most people avoid — caring about details, fast feedback loops, and shipping.",
  links: {
    github: "https://github.com/rajrishi-06",
    linkedin:
      "https://www.linkedin.com/in/kotha-raj-rishi-reddy-21b6562a1/",
    blog: "https://blog-pxvl.onrender.com/",
  },
  github: { handle: "rajrishi-06", note: "30+ repos, always pushing" },

  skills: {
    Languages: ["Python", "JavaScript", "TypeScript", "C++", "Java", "SQL"],
    Frameworks: ["React", "Node.js", "Flask", "Svelte", "Tailwind"],
    Tools: ["Git", "Docker", "Selenium", "Linux", "Figma"],
  },

  journey: [
    {
      period: "2025 — Present",
      title: "Software / Automation Intern",
      org: "NPCI (National Payments Corporation of India)",
      detail: "Building and automating internal tooling and data workflows.",
      kind: "work",
    },
    {
      period: "Oct 2025 — Present",
      title: "Training & Placement (T&P) Coordinator",
      org: "NIT Silchar",
      detail:
        "Bridging students and the corporate world — campus placements, corporate outreach, and student mentorship.",
      kind: "leadership",
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
  ],

  projects: [
    {
      title: "Cp-Card",
      lang: "JavaScript",
      blurb:
        "Generates a sleek profile card that pulls your competitive-programming handles into one shareable snapshot.",
      tags: ["HTML", "CSS", "REST APIs"],
      github: "https://github.com/rajrishi-06/Cp-Card",
      featured: true,
    },
    {
      title: "QR Code Generator",
      lang: "JavaScript",
      blurb:
        "A from-scratch QR generator that turns any URL into a clean, downloadable code — no third-party API.",
      tags: ["Canvas", "HTML", "CSS"],
      github: "https://github.com/rajrishi-06/QR.Code.Generator",
    },
    {
      title: "GhostWrite",
      lang: "Python",
      blurb:
        "A ruthless focus-writing tool: hesitate, and your words start vanishing. Keep typing, or lose everything.",
      tags: ["Tkinter", "Desktop"],
      github: "https://github.com/rajrishi-06/GhostWrite",
      featured: true,
    },
    {
      title: "Action",
      lang: "JavaScript",
      blurb:
        "An AI-powered task scheduler that turns plain-language plans into an organized, time-blocked day.",
      tags: ["AI / LLM", "Node"],
      github: "https://github.com/rajrishi-06/Action",
      featured: true,
    },
    {
      title: "B2B Extension",
      lang: "JavaScript",
      blurb:
        "A browser extension that pulls POC contact data straight from internal sources, cutting B2B lookup time.",
      tags: ["Chrome Extension", "DOM"],
      github: "https://github.com/rajrishi-06/B2B---Extension",
    },
    {
      title: "Gol-Gol",
      lang: "JavaScript",
      blurb:
        "A ride-hailing app concept — an Ola/Uber-style booking flow with live maps and our own spin.",
      tags: ["Maps API", "Node"],
      github: "https://github.com/rajrishi-06/Gol-Gol",
    },
    {
      title: "Prod_Qilo",
      lang: "C++",
      blurb:
        "The production engine behind QiloDB — a lightweight database built from the ground up in C++.",
      tags: ["Systems", "Database"],
      github: "https://github.com/rajrishi-06/Prod_Qilo",
    },
    {
      title: "Typing Speed Test",
      lang: "Python",
      blurb:
        "A polished desktop typing-speed tester with a vivid, fully customizable on-screen keyboard.",
      tags: ["Tkinter", "Desktop"],
      github: "https://github.com/rajrishi-06/Typing-Speed-Test",
    },
    {
      title: "WaterMark",
      lang: "Python",
      blurb:
        "A desktop app to drop a custom text or logo watermark onto any image in seconds.",
      tags: ["Pillow", "Tkinter"],
      github: "https://github.com/rajrishi-06/WaterMark",
    },
  ],
} as const;

/** Renders the profile into a compact markdown brief for the system prompt. */
export function profileBrief(): string {
  const skills = Object.entries(profile.skills)
    .map(([group, items]) => `- ${group}: ${items.join(", ")}`)
    .join("\n");

  const journey = profile.journey
    .map(
      (j) =>
        `- ${j.period} — ${j.title}, ${j.org} (${j.kind}). ${j.detail}`,
    )
    .join("\n");

  const projects = profile.projects
    .map(
      (p) =>
        `- ${p.title} (${p.lang}${"featured" in p && p.featured ? ", featured" : ""}) — ${p.blurb} Tech: ${p.tags.join(", ")}. Repo: ${p.github}`,
    )
    .join("\n");

  return `# Raj Rishi Reddy — profile

Full name: ${profile.fullName}
Role: ${profile.role}
Location: ${profile.location}
Contact email: ${profile.email}
GitHub: ${profile.links.github} (@${profile.github.handle}, ${profile.github.note})
LinkedIn: ${profile.links.linkedin}
Blog: ${profile.links.blog}

One-liner: ${profile.tagline}
About: ${profile.blurb}

## Skills
${skills}

## Journey (experience, leadership & education)
${journey}

## Projects
${projects}`;
}
