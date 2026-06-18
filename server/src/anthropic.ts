import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "[portfolio-chat] ANTHROPIC_API_KEY is not set — requests will fail. " +
      "Copy server/.env.example to server/.env and add your key.",
  );
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/** Default to Opus 4.8; override per deployment via env (see .env.example). */
export const CHAT_MODEL = process.env.CHAT_MODEL || "claude-opus-4-8";
export const RESUME_MODEL = process.env.RESUME_MODEL || "claude-opus-4-8";
