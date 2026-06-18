import type { Request, Response } from "express";
import type { Content } from "@google/genai";
import { genai, CHAT_MODEL } from "./genai.js";
import { chatSystemPrompt } from "./prompts.js";
import { initSSE, pipeStream, sendEvent } from "./sse.js";

type Role = "user" | "assistant";
interface IncomingMessage {
  role: Role;
  content: string;
}

const MAX_TURNS = 20; // keep history bounded
const MAX_CHARS = 4000; // per-message guard

// Convert the frontend's {role,content} history into Gemini `Content` turns.
// Gemini uses "model" (not "assistant") and a parts[] shape.
function sanitize(messages: unknown): Content[] | null {
  if (!Array.isArray(messages)) return null;
  const cleaned: Content[] = [];
  for (const m of messages as IncomingMessage[]) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) continue;
    const content = typeof m.content === "string" ? m.content.trim() : "";
    if (!content) continue;
    cleaned.push({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: content.slice(0, MAX_CHARS) }],
    });
  }
  // Trim to the most recent turns and ensure it starts with a user message.
  const tail = cleaned.slice(-MAX_TURNS);
  while (tail.length && tail[0].role !== "user") tail.shift();
  return tail.length ? tail : null;
}

export async function chatHandler(req: Request, res: Response): Promise<void> {
  const contents = sanitize(req.body?.messages);
  if (!contents) {
    res.status(400).json({ error: "Provide a non-empty 'messages' array." });
    return;
  }

  initSSE(res);

  // If the client disconnects, abort the upstream request to stop billing.
  const controller = new AbortController();
  req.on("close", () => controller.abort());

  try {
    const stream = await genai.models.generateContentStream({
      model: CHAT_MODEL,
      contents,
      config: {
        systemInstruction: chatSystemPrompt(),
        maxOutputTokens: 1024,
        // Disable "thinking" so the whole budget goes to the visible answer and
        // replies stay snappy. (Applies to 2.5 models; ignored otherwise.)
        thinkingConfig: { thinkingBudget: 0 },
        abortSignal: controller.signal,
      },
    });
    await pipeStream(stream, res);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to start the assistant.";
    console.error("[portfolio-chat] chat error:", message);
    sendEvent(res, { type: "error", message });
    res.end();
  }
}
