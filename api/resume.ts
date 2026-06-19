import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Part } from "@google/genai";
import busboy from "busboy";
import { genai, RESUME_MODEL } from "./_lib/genai.js";
import { jdSystemPrompt } from "./_lib/prompts.js";
import { initSSE, sendEvent, sendJson, streamGemini } from "./_lib/stream.js";

export const config = { maxDuration: 60 };

const MAX_TEXT_CHARS = 20000;
const MAX_FILE_BYTES = 4 * 1024 * 1024; // Vercel's request body cap is ~4.5 MB

// Image formats Gemini can read natively (note: no GIF, unlike some providers).
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const INSTRUCTION =
  "Here is the job description (JD) to match against Raj's profile. Follow your output format exactly (SCORE line, VERDICT line, then the Markdown sections).";

function partsFromText(text: string): Part[] {
  return [
    {
      text: `${INSTRUCTION}\n\n--- JOB DESCRIPTION ---\n${text.slice(0, MAX_TEXT_CHARS)}`,
    },
  ];
}

interface Upload {
  mime: string;
  buffer: Buffer;
}

// Parse a multipart/form-data upload (the stream is intact because Vercel only
// auto-parses json / urlencoded / text bodies, not multipart).
function parseMultipart(
  req: VercelRequest,
): Promise<{ file?: Upload; text?: string }> {
  return new Promise((resolve, reject) => {
    const bb = busboy({
      headers: req.headers,
      limits: { files: 1, fileSize: MAX_FILE_BYTES },
    });
    const chunks: Buffer[] = [];
    let mime = "";
    let hasFile = false;
    let tooLarge = false;
    let text = "";

    bb.on("file", (_name, stream, info) => {
      hasFile = true;
      mime = info.mimeType;
      stream.on("data", (d: Buffer) => chunks.push(d));
      stream.on("limit", () => {
        tooLarge = true;
      });
    });
    bb.on("field", (name, val) => {
      if (name === "text") text = val;
    });
    bb.on("error", reject);
    bb.on("close", () => {
      if (tooLarge) {
        reject(new Error("File too large (max 4 MB). Paste the text instead."));
        return;
      }
      resolve({
        file: hasFile ? { mime, buffer: Buffer.concat(chunks) } : undefined,
        text,
      });
    });

    req.pipe(bb);
  });
}

type BuildResult = Part[] | { error: string; status: number };

function buildParts(file: Upload | undefined, text: string | undefined): BuildResult {
  if (file && file.buffer.length > 0) {
    const { mime, buffer } = file;
    if (mime === "application/pdf") {
      return [
        { inlineData: { mimeType: "application/pdf", data: buffer.toString("base64") } },
        { text: INSTRUCTION },
      ];
    }
    if (SUPPORTED_IMAGE_TYPES.has(mime)) {
      return [
        { inlineData: { mimeType: mime, data: buffer.toString("base64") } },
        { text: INSTRUCTION },
      ];
    }
    if (mime === "text/plain" || mime === "text/markdown") {
      return partsFromText(buffer.toString("utf-8"));
    }
    return {
      error:
        "Unsupported file type. Please upload a PDF, an image (PNG/JPG/WebP), or a .txt file — or paste the text instead.",
      status: 415,
    };
  }
  if (text && text.trim()) return partsFromText(text.trim());
  return {
    error: "Drop a PDF, image, or .txt job description, or paste the text.",
    status: 400,
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed." });
    return;
  }

  let parts: BuildResult;
  try {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      const { file, text } = await parseMultipart(req);
      parts = buildParts(file, text);
    } else {
      const text = typeof req.body?.text === "string" ? req.body.text : "";
      parts = buildParts(undefined, text);
    }
  } catch (err) {
    sendJson(res, 400, {
      error: err instanceof Error ? err.message : "Could not read the upload.",
    });
    return;
  }

  if (!Array.isArray(parts)) {
    sendJson(res, parts.status, { error: parts.error });
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
        thinkingConfig: { thinkingBudget: 0 },
        abortSignal: controller.signal,
      },
    });
    await streamGemini(stream, res);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to analyze the role.";
    console.error("[portfolio-chat] resume error:", message);
    sendEvent(res, { type: "error", message });
    if (!res.writableEnded) res.end();
  }
}
