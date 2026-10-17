import { defineConfig } from "vite";

export default defineConfig({
  root: import.meta.dirname,
  server: {
    port: 5180,
  },
  build: {
    outDir: "../dev-dist",
    emptyOutDir: true,
  },
});
