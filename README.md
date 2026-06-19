# Raj Rishi Reddy — Portfolio

Modern, project-first portfolio built with **Vite + React + TypeScript + Tailwind**, a
shadcn-style component layer, **Framer Motion**, and **react-masonry-css** for the
projects gallery. Theme: deep-dark + electric-blue, high contrast.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Edit content (no component code needed)

- **`src/data/site.ts`** — name, tagline, socials, skills, stats, and the `journey`
  (education + experience). ⚠️ Update the **NPCI** entry and the stat numbers — they were
  drafted and should be confirmed.
- **`src/data/projects.ts`** — the project cards.

### Add a real image / video thumbnail to a project

Each project shows a designed gradient placeholder until you give it media. Drop files in
`public/images/projects/` and set the field in `src/data/projects.ts`:

```ts
// image thumbnail
image: `${import.meta.env.BASE_URL}images/projects/cp-card.jpg`,

// OR a short clip that plays on hover (add a poster image too)
video: `${import.meta.env.BASE_URL}images/projects/action.mp4`,
image: `${import.meta.env.BASE_URL}images/projects/action-poster.jpg`,
```

`ratio` (height ÷ width) controls how tall the card is — vary it so the masonry reflows
nicely. Use webp/mp4 and keep clips short (a few seconds, muted).

## Deploy (Vercel)

The frontend and the AI assistant's backend (serverless functions under `api/`)
deploy together as one Vercel project.

1. Push to GitHub, then **Import** the repo at <https://vercel.com/new>
   (Vercel auto-detects Vite).
2. Add `GEMINI_API_KEY` under **Settings → Environment Variables**
   (and optionally `CHAT_MODEL` / `RESUME_MODEL`).
3. Deploy — every push then ships automatically.

Run the full stack locally with `vercel dev`. See [`CHAT_SETUP.md`](CHAT_SETUP.md)
for the assistant details.

## Notes

- The dragon preloader is inlined in `index.html` (instant paint, ~2.4s, then fades).
- The previous vanilla site is archived in `_legacy/` — safe to delete once you're happy.
