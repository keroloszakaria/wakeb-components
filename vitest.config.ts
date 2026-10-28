import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
export default defineConfig({ plugins: [vue()], test: { environment: "jsdom", server: { deps: { inline: ["vuetify"] } }, include: ["tests/**/*.test.ts"], setupFiles: ["tests/setup.ts"] } });
