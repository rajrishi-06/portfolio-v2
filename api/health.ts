import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendJson } from "./_lib/stream";

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  sendJson(res, 200, {
    ok: true,
    keyConfigured: Boolean(
      process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    ),
  });
}
