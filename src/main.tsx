import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Self-hosted fonts (no render-blocking external requests).
// Three faces, three jobs — see DESIGN.md: Spectral sets the display type,
// Inter carries prose, IBM Plex Mono is the datasheet voice for every label,
// number and spec.
import "@fontsource/spectral/400.css";
import "@fontsource/spectral/600.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

// Theme is resolved by an inline script in index.html so it lands before first
// paint. ThemeToggle owns it from here.

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
