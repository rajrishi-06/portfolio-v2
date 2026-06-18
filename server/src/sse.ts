import type { Response } from "express";
import type { GenerateContentResponse } from "@google/genai";

/** Prepare an Express response for Server-Sent-Events streaming. */
export function initSSE(res: Response): void {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  // Disable proxy buffering (nginx etc.) so chunks arrive in real time.
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
}

/** Send one JSON event over the SSE channel (no-op once the client is gone). */
export function sendEvent(res: Response, data: unknown): void {
  if (res.writableEnded || res.destroyed) return;
  try {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  } catch {
    /* client disconnected mid-write — nothing to do */
  }
}

/**
 * Pipe a Gemini content stream to the client as SSE text deltas.
 * Emits { type: "delta", text } per chunk, then { type: "done" }, or
 * { type: "error", message } if generation fails. `chunk.text` is the
 * incremental text for that chunk (undefined for non-text parts).
 */
export async function pipeStream(
  stream: AsyncIterable<GenerateContentResponse>,
  res: Response,
): Promise<void> {
  try {
    for await (const chunk of stream) {
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
