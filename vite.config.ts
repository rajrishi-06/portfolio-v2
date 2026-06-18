import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Project site served at https://rajrishi-06.github.io/portfolio-v2/
// Use the subpath only for production builds; serve at "/" during dev.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/portfolio-v2/" : "/",
  server: {
    port: 5173,
    // Proxy API calls to the local chat backend during development so the
    // frontend can use relative /api paths. The backend runs on :8787.
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
