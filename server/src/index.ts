import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { chatHandler } from "./chat.js";
import { resumeHandler } from "./resume.js";

const PORT = Number(process.env.PORT) || 8787;

// ── CORS ─────────────────────────────────────────────────────────────────────
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173", // vite preview
  "https://rajrishi-06.github.io",
];
const envOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultOrigins, ...envOrigins]);

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    // Allow same-origin / curl / server-to-server (no Origin header).
    if (!origin || allowedOrigins.has(origin)) return cb(null, true);
    cb(new Error(`Origin not allowed by CORS: ${origin}`));
  },
};

// ── Tiny in-memory rate limiter (per IP) ─────────────────────────────────────
// Public AI endpoints cost money — this caps abuse. Swap for a real limiter
// (redis / express-rate-limit) if you scale beyond a single instance.
const WINDOW_MS = 60_000;
const MAX_REQ = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }
  if (rec.count >= MAX_REQ) {
    res.status(429).json({ error: "Too many requests — slow down a moment." });
    return;
  }
  rec.count += 1;
  next();
}

// Periodically clear stale buckets so the map doesn't grow forever.
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of hits) if (now > rec.resetAt) hits.delete(ip);
}, WINDOW_MS).unref();

// ── App ──────────────────────────────────────────────────────────────────────
const app = express();
app.set("trust proxy", 1); // correct req.ip behind a proxy/host platform
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, keyConfigured: Boolean(process.env.ANTHROPIC_API_KEY) });
});

app.post("/api/chat", rateLimit, chatHandler);
app.post("/api/resume", rateLimit, upload.single("file"), resumeHandler);

// Surface multer / CORS errors as clean JSON instead of HTML stack traces.
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const message = err instanceof Error ? err.message : "Server error.";
    console.error("[portfolio-chat]", message);
    if (!res.headersSent) res.status(400).json({ error: message });
  },
);

app.listen(PORT, () => {
  console.log(`[portfolio-chat] listening on http://localhost:${PORT}`);
});
