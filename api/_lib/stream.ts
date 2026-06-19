import type { ServerResponse } from "http";
import type { GenerateContentResponse } from "@google/genai";

/**
 * SSE helpers built on the Node response object (res.write / res.end). This is
 * the streaming model Vercel's Node runtime terminates reliably — when res.end()
 * is called the function invocation ends, so it never hangs past the timeout.
 */

/** Send a one-shot JSON response (validation errors etc.). */
export function sendJson(res: ServerResponse, status: number, data: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

/** Open the SSE stream. (No `Connection` header — Vercel manages the socket.) */
export function initSSE(res: ServerResponse): void {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  // Disable proxy buffering so chunks arrive in real time.
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
}

/** Write one JSON event over the SSE channel (no-op once the client is gone). */
export function sendEvent(res: ServerResponse, data: unknown): void {
  if (res.writableEnded) return;
  try {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  } catch {
    /* client disconnected mid-write — nothing to do */
  }
}

/**
 * Pipe a Gemini content stream to the client as SSE deltas, then end the
 * response. Emits {type:"delta",text} per chunk, then {type:"done"}, or
 * {type:"error",message} if generation fails — and always calls res.end() so
 * the serverless function terminates.
 */
export async function streamGemini(
  upstream: AsyncIterable<GenerateContentResponse>,
  res: ServerResponse,
): Promise<void> {
  try {
    for await (const chunk of upstream) {
      const text = chunk.text;
      if (text) sendEvent(res, { type: "delta", text });
    }
    sendEvent(res, { type: "done" });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Generation failed unexpectedly.";
    console.error("[portfolio-chat] stream error:", message);
    sendEvent(res, { type: "error", message });
  } finally {
    if (!res.writableEnded) res.end();
  }
}
