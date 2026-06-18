import type { Response } from "express";
import type Anthropic from "@anthropic-ai/sdk";

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
 * Pipe an Anthropic message stream to the client as SSE text deltas.
 * Emits { type: "delta", text } per token, then { type: "done" }, or
 * { type: "error", message } if generation fails.
 */
export async function pipeStream(
  stream: AsyncIterable<Anthropic.MessageStreamEvent>,
  res: Response,
): Promise<void> {
  try {
    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        sendEvent(res, { type: "delta", text: event.delta.text });
      }
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
