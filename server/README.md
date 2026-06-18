# Portfolio chat server

A tiny Node/Express backend that powers two features on the portfolio:

- `POST /api/chat` — the **strict** portfolio assistant (Raj's digital twin). Streams answers token-by-token over SSE.
- `POST /api/resume` — the **unrestricted** resume *fit analyzer*. Accepts a PDF / image / `.txt` upload or pasted text and streams back a candid two-way fit read.

The Gemini API key lives **only here**, so it's never exposed to the browser — which is the whole reason the static site grew a server.

## Setup

```bash
cd server
cp .env.example .env        # then put your real GEMINI_API_KEY in .env
npm install
npm run dev                 # starts on http://localhost:8787
```

That's it — no build step (it runs the TypeScript directly with `tsx`).

Check it's alive: open <http://localhost:8787/api/health> → `{"ok":true,"keyConfigured":true}`.

## Models & cost

Both routes default to **`gemini-2.5-flash`** — fast, cheap, and plenty for
portfolio Q&A and the fit analysis. You can tune per route in `.env`:

```env
CHAT_MODEL=gemini-2.0-flash      # lowest cost for portfolio Q&A
RESUME_MODEL=gemini-2.5-pro      # stronger reasoning for the fit analysis
```

The chat and resume routes disable Gemini's "thinking" by default so the token
budget goes straight to the visible answer; tune that in `chat.ts` / `resume.ts`
if you switch to a model that benefits from it.

Other guardrails already built in: a per-IP rate limit (20 req/min), bounded
chat history, an 8 MB upload cap, and upstream requests are aborted if the
visitor closes the tab (so you don't pay for tokens nobody reads).

## Deploying

GitHub Pages can't run a server, so host this anywhere that runs Node
(Render, Railway, Fly, a small VPS, etc.):

1. Deploy this `server/` folder; set `GEMINI_API_KEY` (and optionally
   `CHAT_MODEL` / `RESUME_MODEL`) as environment variables.
2. Add your portfolio's public origin to `ALLOWED_ORIGINS`
   (e.g. `https://rajrishi-06.github.io`).
3. Point the frontend at the deployed URL by setting `VITE_API_BASE` when you
   build the site (see the root `CHAT_SETUP.md`).

## API shape

Both endpoints stream Server-Sent-Events. Each line is `data: <json>`:

```
data: {"type":"delta","text":"Hi"}
data: {"type":"delta","text":" there"}
data: {"type":"done"}
```

On failure you get `{"type":"error","message":"..."}`. The frontend
(`src/lib/chatApi.ts`) already parses this.

`POST /api/chat` body: `{ "messages": [{ "role": "user", "content": "..." }] }`

`POST /api/resume`: either `multipart/form-data` with a `file` field, or JSON
`{ "text": "...pasted resume..." }`.
