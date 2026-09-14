import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const generatedEntriesPath = fromRoot("review/.generated-entries.json");

if (!existsSync(generatedEntriesPath)) {
  throw new Error("Missing generated review entries. Run `npm run generate:reviews` first.");
}

const reviewEntries = JSON.parse(readFileSync(generatedEntriesPath, "utf8")) as Record<string, string>;

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: fromRoot("index.html"),
        about: fromRoot("about/index.html"),
        privacy: fromRoot("privacy/index.html"),
        review: fromRoot("review/index.html"),
        ...Object.fromEntries(Object.entries(reviewEntries).map(([name, path]) => [name, fromRoot(path)])),
      },
    },
  },
});
