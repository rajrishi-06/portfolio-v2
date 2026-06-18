import type { Request, Response } from "express";
import type { Part } from "@google/genai";
import { genai, RESUME_MODEL } from "./genai.js";
import { jdSystemPrompt } from "./prompts.js";
import { initSSE, pipeStream, sendEvent } from "./sse.js";

const MAX_TEXT_CHARS = 20000;

// Image formats Gemini can read natively (note: no GIF, unlike some providers).
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
]);

/**
 * Build the user-turn parts from whatever the visitor sent:
 *  - a PDF file        -> inlineData part (Gemini reads PDFs natively)
 *  - an image file     -> inlineData part (Gemini vision)
 *  - a .txt file       -> text part
 *  - pasted plain text -> text part
 */
function buildContent(req: Request): Part[] | "EMPTY" | "UNSUPPORTED" {
  const instruction =
    "Here is the job description (JD) to match against Raj's profile. Follow your output format exactly (SCORE line, VERDICT line, then the Markdown sections).";

  const file = req.file;
  if (file) {
    const mime = file.mimetype;
    const data = file.buffer.toString("base64");

    if (mime === "application/pdf") {
      return [
        { inlineData: { mimeType: "application/pdf", data } },
        { text: instruction },
      ];
    }
    if (SUPPORTED_IMAGE_TYPES.has(mime)) {
      return [{ inlineData: { mimeType: mime, data } }, { text: instruction }];
    }
    if (mime === "text/plain" || mime === "text/markdown") {
      const text = file.buffer.toString("utf-8").slice(0, MAX_TEXT_CHARS);
      return [
        { text: `${instruction}\n\n--- JOB DESCRIPTION ---\n${text}` },
      ];
    }
    return "UNSUPPORTED";
  }

  const pasted =
    typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (pasted) {
    return [
      {
        text: `${instruction}\n\n--- JOB DESCRIPTION ---\n${pasted.slice(0, MAX_TEXT_CHARS)}`,
      },
    ];
  }
  return "EMPTY";
}

export async function resumeHandler(req: Request, res: Response): Promise<void> {
  const parts = buildContent(req);

  if (parts === "EMPTY") {
    res.status(400).json({
      error: "Drop a PDF, image, or .txt job description, or paste the text.",
    });
    return;
  }
  if (parts === "UNSUPPORTED") {
    res.status(415).json({
      error:
        "Unsupported file type. Please upload a PDF, an image (PNG/JPG/WebP), or a .txt file — or paste the text instead.",
    });
    return;
  }

  initSSE(res);

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  try {
    const stream = await genai.models.generateContentStream({
      model: RESUME_MODEL,
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: jdSystemPrompt(),
        maxOutputTokens: 2048,
        // Disable "thinking" so the full budget produces the visible analysis
        // and the strict SCORE/VERDICT format isn't crowded out.
        thinkingConfig: { thinkingBudget: 0 },
        abortSignal: controller.signal,
      },
    });
    await pipeStream(stream, res);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to analyze the role.";
    console.error("[portfolio-chat] resume error:", message);
    sendEvent(res, { type: "error", message });
    res.end();
  }
}
