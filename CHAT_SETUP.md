# AI assistant — setup

The portfolio ships with a custom AI assistant: a quiet terminal launcher in
the corner that opens a themed console with two tabs —

- **Chat** — a strict "digital twin" of Raj that only answers about his skills,
  education, experience and projects (and politely declines anything else).
- **Resume Fit** — upload or paste a résumé and get a candid, streamed analysis
  of how you and Raj fit together, with an animated fit score.

A static site can't safely hold an API key, so the Gemini key lives in **Vercel
serverless functions** under [`api/`](api/) — same project, same origin, one
deploy. The key is a server-side env var and never reaches the browser.

## Run it locally

```bash
npm install
cp .env.example .env.local        # add your GEMINI_API_KEY
npm i -g vercel                   # one-time: the Vercel CLI
vercel dev                        # → http://localhost:3000 (frontend + /api)
```

`vercel dev` runs the React frontend **and** the `api/` functions together on
one origin, so the widget's relative `/api/*` calls just work. (Plain
`npm run dev` serves only the frontend — the chat needs the functions.)

Get a Gemini key at <https://aistudio.google.com/apikey> (it starts with
`AIza…`).

## Deploy to Vercel

1. Push the repo to GitHub and **Import** it at <https://vercel.com/new>.
   Vercel auto-detects Vite — no build config needed (`vercel.json` pins it).
2. In **Project → Settings → Environment Variables**, add `GEMINI_API_KEY`
   (and optionally `CHAT_MODEL` / `RESUME_MODEL`).
3. Deploy. The frontend and the `/api/chat`, `/api/resume`, `/api/health`
   functions all serve from your `*.vercel.app` domain (add a custom domain in
   project settings if you like). No CORS, no separate backend host.

## Cost & limits

Both routes default to **Gemini 2.5 Flash** — fast, cheap, and plenty for
portfolio Q&A and the fit analysis. Tune per route with the `CHAT_MODEL` /
`RESUME_MODEL` env vars (e.g. `gemini-2.0-flash` for the cheapest chat,
`gemini-2.5-pro` for stronger résumé reasoning). The functions disable Gemini's
"thinking" so the token budget goes to the visible answer, and abort the
upstream call if the visitor leaves. Note Vercel's serverless request body limit
is ~4.5 MB, so very large résumé uploads may be rejected — paste the text
instead.

## Where things live

| Piece | Path |
| --- | --- |
| Serverless API (Gemini) | [`api/`](api/) |
| Shared backend logic | [`api/_lib/`](api/_lib/) |
| Persona / boundaries | [`api/_lib/prompts.ts`](api/_lib/prompts.ts) |
| What the AI knows about Raj | [`api/_lib/knowledge.ts`](api/_lib/knowledge.ts) |
| Widget UI | [`src/components/chat/`](src/components/chat/) |
| Starter prompts & copy | [`src/data/chatConfig.ts`](src/data/chatConfig.ts) |
| Frontend API client | [`src/lib/chatApi.ts`](src/lib/chatApi.ts) |
