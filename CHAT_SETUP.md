# AI assistant — setup

The portfolio now ships with a custom AI assistant: a quiet terminal launcher in
the bottom-right that opens a themed console with two tabs —

- **Chat** — a strict "digital twin" of Raj that only answers about his skills,
  education, experience and projects (and politely declines anything else).
- **Resume Fit** — upload or paste a résumé and get a candid, streamed analysis
  of how you and Raj fit together, with an animated fit score.

Because a static site can't safely hold an API key, this is now a **client +
server** app: a small Node backend (`server/`) holds the Anthropic key and the
React frontend talks to it. The key never reaches the browser.

## Run it locally (two terminals)

**1. Backend**

```bash
cd server
cp .env.example .env          # add your ANTHROPIC_API_KEY
npm install
npm run dev                   # → http://localhost:8787
```

**2. Frontend** (repo root)

```bash
npm install
npm run dev                   # → http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend automatically, so there's
nothing else to configure for local use. Open the site and click the terminal
icon in the corner.

## Going to production

GitHub Pages only serves static files, so host the backend separately
(Render, Railway, Fly, a VPS — anything that runs Node):

1. Deploy the `server/` folder. Set `ANTHROPIC_API_KEY`, and add your site's
   origin (`https://rajrishi-06.github.io`) to `ALLOWED_ORIGINS`. See
   [`server/README.md`](server/README.md).
2. Build the frontend with the backend URL baked in:
   ```bash
   # .env (repo root) — see .env.example
   VITE_API_BASE=https://your-portfolio-api.example.com
   npm run build
   ```

## Cost note

Both routes default to **Claude Opus 4.8** for the best answers. For a public
widget, set cheaper models in `server/.env` — e.g. `CHAT_MODEL=claude-haiku-4-5`
keeps portfolio Q&A cheap and snappy. Built-in guardrails: per-IP rate limiting,
bounded history, an 8 MB upload cap, and aborting upstream calls when a visitor
closes the tab.

## Where things live

| Piece | Path |
| --- | --- |
| Backend (Express + Claude) | [`server/`](server/) |
| Persona / boundaries | [`server/src/prompts.ts`](server/src/prompts.ts) |
| What the AI knows about Raj | [`server/src/knowledge.ts`](server/src/knowledge.ts) |
| Widget UI | [`src/components/chat/`](src/components/chat/) |
| Starter prompts & copy | [`src/data/chatConfig.ts`](src/data/chatConfig.ts) |
| Frontend API client | [`src/lib/chatApi.ts`](src/lib/chatApi.ts) |
