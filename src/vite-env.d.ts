/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the chat backend. Empty string = same origin (dev uses the Vite proxy). */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
