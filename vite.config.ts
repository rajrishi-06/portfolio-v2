import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Served at the domain root on Vercel, with the /api functions on the same
// origin. Run the full stack locally with `vercel dev` (frontend + functions);
// plain `npm run dev` serves only the frontend.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
