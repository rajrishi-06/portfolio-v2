import type { Request, Response } from "express";
import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, RESUME_MODEL } from "./anthropic.js";
import { jdSystemPrompt } from "./prompts.js";
import { initSSE, pipeStream, sendEvent } from "./sse.js";

const MAX_TEXT_CHARS = 20000;

/**
 * Build the user-turn content from whatever the visitor sent:
 *  - a PDF file        -> document block (Claude reads PDFs natively)
 *  - an image file     -> image block (Claude vision)
 *  - a .txt file       -> text block
 *  - pasted plain text -> text block
 */
function buildContent(req: Request): Anthropic.ContentBlockParam[] | string {
  const instruction =
    "Here is the job description (JD) to match against Raj's profile. Follow your output format exactly (SCORE line, VERDICT line, then the Markdown sections).";

  const file = req.file;
  if (file) {
    const mime = file.mimetype;
    const data = file.buffer.toString("base64");

    if (mime === "application/pdf") {
      return [
        {
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data },
        },
        { type: "text", text: instruction },
      ];
    }
    if (
      mime === "image/png" ||
      mime === "image/jpeg" ||
      mime === "image/webp" ||
      mime === "image/gif"
    ) {
      return [
        { type: "image", source: { type: "base64", media_type: mime, data } },
        { type: "text", text: instruction },
      ];
    }
    if (mime === "text/plain" || mime === "text/markdown") {
      const text = file.buffer.toString("utf-8").slice(0, MAX_TEXT_CHARS);
      return `${instruction}\n\n--- JOB DESCRIPTION ---\n${text}`;
    }
    return "UNSUPPORTED";
  }

  const pasted =
    typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (pasted) {
    return `${instruction}\n\n--- JOB DESCRIPTION ---\n${pasted.slice(0, MAX_TEXT_CHARS)}`;
  }
  return "EMPTY";
}

export async function resumeHandler(req: Request, res: Response): Promise<void> {
  const content = buildContent(req);

  if (content === "EMPTY") {
    res.status(400).json({
      error: "Drop a PDF, image, or .txt job description, or paste the text.",
    });
    return;
  }
  if (content === "UNSUPPORTED") {
    res.status(415).json({
      error:
        "Unsupported file type. Please upload a PDF, an image (PNG/JPG), or a .txt file — or paste the text instead.",
    });
    return;
  }

  initSSE(res);

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  try {
    const stream = anthropic.messages.stream(
      {
        model: RESUME_MODEL,
        max_tokens: 2048,
        system: jdSystemPrompt(),
        messages: [{ role: "user", content }],
      },
      { signal: controller.signal },
    );
    await pipeStream(stream, res);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to analyze the role.";
    console.error("[portfolio-chat] resume error:", message);
    sendEvent(res, { type: "error", message });
    res.end();
  }
}
