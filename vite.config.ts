import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import { COMPONENTS, SUPPORTED } from "./src/adapters/manifest";

/*
 * Library graph (SPEC R09): the root facades import `wakeb-components/_internal/selected/*`, which
 * the consumer's wakebComponents() points at one provider. Without it, package exports resolve
 * those specifiers to the unconfigured stubs below, which fail with WAKEB_BUILD_PLUGIN_MISSING.
 */
const STUB = "virtual:wakeb-stub:";
const stubs: Plugin = {
  name: "wakeb-unconfigured-stubs",
  enforce: "pre",
  // Vite resolves lib entries against the root, so the marker can arrive behind a path prefix.
  resolveId: (id) => (id.includes(STUB) ? `\0${id.slice(id.indexOf(STUB))}` : undefined),
  load(id) {
    if (!id.startsWith(`\0${STUB}`)) return;
    const name = id.slice(STUB.length + 1);
    const runtime = JSON.stringify(fileURLToPath(new URL("./src/core/runtime.ts", import.meta.url)).replaceAll("\\", "/"));
    return name === "services"
      ? `export { unconfiguredServices as default } from ${runtime};`
      : `import { createUnconfiguredComponent } from ${runtime};\nexport default createUnconfiguredComponent(${JSON.stringify(name)});`;
  },
};

const entries: Record<string, string> = {
  index: "src/index.ts",
  "_internal/core": "src/core/runtime.ts",
  "_internal/adapters/vuetify/services": "src/adapters/vuetify/services.ts",
  "_internal/adapters/primevue/services": "src/adapters/primevue/services.ts",
  "_internal/adapters/shadcn/services": "src/adapters/shadcn/services.ts",
  "_internal/selected/services": `${STUB}services`,
};
for (const name of COMPONENTS) {
  entries[`_internal/selected/${name}`] = `${STUB}${name}`;
  entries[`_internal/adapters/vuetify/${name}`] = `src/components/${name}.vue`;
}
for (const name of SUPPORTED.primevue) entries[`_internal/adapters/primevue/${name}`] = `src/adapters/primevue/${name}.vue`;
for (const name of SUPPORTED.shadcn) entries[`_internal/adapters/shadcn/${name}`] = `src/adapters/shadcn/${name}.vue`;

export default defineConfig({
  plugins: [vue(), stubs],
  build: {
    lib: { entry: entries, formats: ["es"], cssFileName: "wakeb-components" },
    rollupOptions: {
      external: (id) => /^(vue|vuetify|primevue|@primeuix|reka-ui|wakeb-utils|wakeb-components)(\/|$)/.test(id),
      output: { entryFileNames: "[name].js", chunkFileNames: "_internal/chunks/[name]-[hash].js" },
    },
  },
});
