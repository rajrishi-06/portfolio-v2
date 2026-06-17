import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Self-hosted fonts (no render-blocking external requests)
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

// Apply the saved / system colour theme before first paint. Default = system
// preference; an explicit choice is persisted in localStorage. The dragon
// preloader keeps its own dark styling regardless of the active theme.
(() => {
  try {
    const stored = localStorage.getItem("theme");
    const dark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch {
    document.documentElement.classList.add("dark");
  }
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Tell the preloader the app has painted.
requestAnimationFrame(() => {
  requestAnimationFrame(() => window.dispatchEvent(new Event("app-ready")));
});
