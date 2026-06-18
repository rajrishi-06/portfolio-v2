import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn(
    "[portfolio-chat] GEMINI_API_KEY is not set — requests will fail. " +
      "Set it in the Vercel dashboard (Project → Settings → Environment " +
      "Variables), or in .env.local for `vercel dev`.",
  );
}

// Gemini Developer API client. The key lives only on the server (Vercel env),
// never in the browser bundle. GOOGLE_API_KEY is accepted as a fallback name.
export const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
});

/** Default to Gemini 2.5 Flash; override per deployment via env. */
export const CHAT_MODEL = process.env.CHAT_MODEL || "gemini-2.5-flash";
export const RESUME_MODEL = process.env.RESUME_MODEL || "gemini-2.5-flash";
