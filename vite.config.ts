import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

/**
 * GitHub Pages serves 404.html for unknown paths. Emitting it as a copy of the built
 * index.html (with correct hashed asset refs) makes SPA deep-links survive refresh/direct-load,
 * independent of any CI step.
 */
function spaFallback(): Plugin {
  return {
    name: "spa-404-fallback",
    apply: "build",
    closeBundle() {
      const out = path.resolve(__dirname, "dist");
      const index = path.join(out, "index.html");
      if (existsSync(index)) copyFileSync(index, path.join(out, "404.html"));
    },
  };
}

export default defineConfig({
  base: process.env.PAGES_BASE ?? "/",
  plugins: [react(), spaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
