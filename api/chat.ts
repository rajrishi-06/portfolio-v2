import type { Content } from "@google/genai";
import { genai, CHAT_MODEL } from "./_lib/genai";
import { chatSystemPrompt } from "./_lib/prompts";
import { jsonResponse, sseResponse } from "./_lib/stream";

// Allow up to 60s for a streamed reply (Vercel default is 10s).
export const config = { maxDuration: 60 };

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

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST")
    return jsonResponse({ error: "Method not allowed." }, 405);

  let body: { messages?: unknown };
  try {
    body = (await req.json()) as { messages?: unknown };
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const contents = sanitize(body?.messages);
  if (!contents)
    return jsonResponse({ error: "Provide a non-empty 'messages' array." }, 400);

  return sseResponse(async (send) => {
    const stream = await genai.models.generateContentStream({
      model: CHAT_MODEL,
      contents,
      config: {
        systemInstruction: chatSystemPrompt(),
        maxOutputTokens: 1024,
        // Disable "thinking" so the budget goes to the visible answer and
        // replies stay snappy. (Applies to 2.5 models; ignored otherwise.)
        thinkingConfig: { thinkingBudget: 0 },
        // Aborts the upstream call if the visitor closes the tab.
        abortSignal: req.signal,
      },
    });
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) send({ type: "delta", text });
    }
  });
}
