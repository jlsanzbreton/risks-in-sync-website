import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: fromRoot("index.html"),
        about: fromRoot("about/index.html"),
        review: fromRoot("review/index.html"),
        issueOne: fromRoot("review/year-1-nr-1/index.html"),
      },
    },
  },
});
