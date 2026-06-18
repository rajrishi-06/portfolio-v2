import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn(
    "[portfolio-chat] GEMINI_API_KEY is not set — requests will fail. " +
      "Copy server/.env.example to server/.env and add your key.",
  );
}

// The Gemini Developer API client. The SDK can also pick the key up from the
// environment on its own, but we pass it explicitly so the source is obvious.
// (GOOGLE_API_KEY is accepted as a fallback name for convenience.)
export const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
});

/** Default to Gemini 2.5 Flash; override per deployment via env (see .env.example). */
export const CHAT_MODEL = process.env.CHAT_MODEL || "gemini-2.5-flash";
export const RESUME_MODEL = process.env.RESUME_MODEL || "gemini-2.5-flash";
