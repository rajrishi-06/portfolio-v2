import type { Part } from "@google/genai";
import { genai, RESUME_MODEL } from "./_lib/genai";
import { jdSystemPrompt } from "./_lib/prompts";
import { jsonResponse, sseResponse } from "./_lib/stream";

export const config = { maxDuration: 60 };

const MAX_TEXT_CHARS = 20000;

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

/**
 * Build the Gemini user-turn parts from the upload:
 *  - PDF / image -> inlineData part (Gemini reads PDFs + images natively)
 *  - .txt / .md  -> text part
 *  - pasted text -> text part
 * Returns a Response (error) instead of parts when the input is bad.
 */
async function buildParts(req: Request): Promise<Part[] | Response> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    const pasted = form.get("text");

    if (file instanceof File && file.size > 0) {
      const mime = file.type;
      const bytes = Buffer.from(await file.arrayBuffer());

      if (mime === "application/pdf") {
        return [
          { inlineData: { mimeType: "application/pdf", data: bytes.toString("base64") } },
          { text: INSTRUCTION },
        ];
      }
      if (SUPPORTED_IMAGE_TYPES.has(mime)) {
        return [
          { inlineData: { mimeType: mime, data: bytes.toString("base64") } },
          { text: INSTRUCTION },
        ];
      }
      if (mime === "text/plain" || mime === "text/markdown") {
        return partsFromText(bytes.toString("utf-8"));
      }
      return jsonResponse(
        {
          error:
            "Unsupported file type. Please upload a PDF, an image (PNG/JPG/WebP), or a .txt file — or paste the text instead.",
        },
        415,
      );
    }

    if (typeof pasted === "string" && pasted.trim()) {
      return partsFromText(pasted.trim());
    }
  } else {
    const body = (await req.json().catch(() => ({}))) as { text?: string };
    const pasted = typeof body?.text === "string" ? body.text.trim() : "";
    if (pasted) return partsFromText(pasted);
  }

  return jsonResponse(
    { error: "Drop a PDF, image, or .txt job description, or paste the text." },
    400,
  );
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST")
    return jsonResponse({ error: "Method not allowed." }, 405);

  const parts = await buildParts(req);
  if (parts instanceof Response) return parts;

  return sseResponse(async (send) => {
    const stream = await genai.models.generateContentStream({
      model: RESUME_MODEL,
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: jdSystemPrompt(),
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingBudget: 0 },
        abortSignal: req.signal,
      },
    });
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) send({ type: "delta", text });
    }
  });
}
