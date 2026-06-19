/**
 * Thin client for the chat backend. Both endpoints stream Server-Sent-Events;
 * `consumeSSE` turns that into onDelta(text) callbacks.
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export type ChatRole = "user" | "assistant";
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface StreamCallbacks {
  onDelta: (text: string) => void;
  signal?: AbortSignal;
}

class StreamError extends Error {}

async function consumeSSE(res: Response, onDelta: (t: string) => void) {
  if (!res.ok || !res.body) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      /* not JSON — keep the status message */
    }
    throw new StreamError(msg);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line.
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const line = frame.trim();
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json) continue;
      let evt: { type: string; text?: string; message?: string };
      try {
        evt = JSON.parse(json);
      } catch {
        continue;
      }
      if (evt.type === "delta" && evt.text) onDelta(evt.text);
      else if (evt.type === "error")
        throw new StreamError(evt.message || "The assistant hit an error.");
      // "done" → loop ends naturally when the stream closes
    }
  }
}

/** Stream a chat completion. Sends the full short history each call. */
export async function streamChat(
  messages: ChatMessage[],
  { onDelta, signal }: StreamCallbacks,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });
  await consumeSSE(res, onDelta);
}

/** Stream a résumé fit analysis from an uploaded file or pasted text. */
export async function streamResume(
  input: { file?: File; text?: string },
  { onDelta, signal }: StreamCallbacks,
): Promise<void> {
  let res: Response;
  if (input.file) {
    const form = new FormData();
    form.append("file", input.file);
    res = await fetch(`${API_BASE}/api/resume`, {
      method: "POST",
      body: form,
      signal,
    });
  } else {
    res = await fetch(`${API_BASE}/api/resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input.text ?? "" }),
      signal,
    });
  }
  await consumeSSE(res, onDelta);
}

export { StreamError };
