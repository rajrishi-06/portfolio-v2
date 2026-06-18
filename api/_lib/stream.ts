/**
 * Helpers for the serverless functions: JSON responses and an SSE stream that
 * mirrors the frontend's contract ({type:"delta"|"error"|"done"}). Built on the
 * Web ReadableStream API so it works as a streamed `Response` on Vercel.
 */

const encoder = new TextEncoder();

const SSE_HEADERS: Record<string, string> = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  // Disable proxy buffering so chunks reach the client in real time.
  "X-Accel-Buffering": "no",
};

export type Send = (data: unknown) => void;

/** A plain JSON response (used for validation errors). */
export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Run `producer`, forwarding each `send({type:"delta",text})` to the client as
 * an SSE frame. Emits {type:"done"} when it resolves, or {type:"error",message}
 * if it throws (including upstream Gemini errors) — so failures surface to the
 * client instead of crashing the function.
 */
export function sseResponse(
  producer: (send: Send) => Promise<void>,
): Response {
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send: Send = (data) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      try {
        await producer(send);
        send({ type: "done" });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Generation failed unexpectedly.";
        console.error("[portfolio-chat] stream error:", message);
        try {
          send({ type: "error", message });
        } catch {
          /* controller already closed (client gone) */
        }
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });
  return new Response(body, { headers: SSE_HEADERS });
}
