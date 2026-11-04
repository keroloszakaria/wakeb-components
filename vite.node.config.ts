import { builtinModules } from "node:module";
import { defineConfig } from "vite";

/* Node-side build integration (`wakeb-components/vite`); runs inside the consumer's Vite. */
export default defineConfig({
  build: {
    ssr: true,
    emptyOutDir: false,
    target: "node22",
    rollupOptions: {
      input: { vite: "src/build/vite.ts" },
      external: [/^vite$/, /^node:/, ...builtinModules],
      output: { format: "es", entryFileNames: "[name].js" },
    },
  },
});
