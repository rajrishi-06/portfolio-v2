import { jsonResponse } from "./_lib/stream";

export default async function handler(_req: Request): Promise<Response> {
  return jsonResponse({
    ok: true,
    keyConfigured: Boolean(
      process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    ),
  });
}
