import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { wakebComponents } from "./src/build/vite";

/*
 * One project per provider. Each compiles the same root facades through wakebComponents(), so the
 * shared contract suite runs against exactly one selected renderer graph per project (SPEC R09).
 */
const project = (framework: "vuetify" | "primevue", include: string[], exclude: string[] = []) => ({
  extends: true as const,
  plugins: [vue(), wakebComponents({ configFile: `tests/fixtures/${framework}/plugins/wakeb-components.js` })],
  test: { name: framework, include, exclude },
});

export default defineConfig({
  test: {
    environment: "jsdom",
    server: { deps: { inline: ["vuetify", "primevue", /@primevue/, /@primeuix/] } },
    setupFiles: ["tests/setup.ts"],
    projects: [
      project("vuetify", ["tests/**/*.test.ts"], ["tests/primevue-adapter.test.ts"]),
      project("primevue", ["tests/contract.test.ts", "tests/defaults.test.ts", "tests/colors.test.ts", "tests/plugin.test.ts", "tests/primevue-adapter.test.ts"]),
    ],
  },
});
