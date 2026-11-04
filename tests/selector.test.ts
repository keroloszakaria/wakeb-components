// @vitest-environment node
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { readFramework } from "../src/build/selector";
import { wakebComponents } from "../src/build/vite";

const valid = (body: string, head = "import { createWakebComponents } from 'wakeb-components'\n") => `${head}${body}`;

describe("static framework selector (SPEC R09)", () => {
  it.each([
    ["plugin.js", valid("export default createWakebComponents({ framework: 'primevue', defaults: { WButton: { size: 'md' } } })"), "primevue"],
    ["plugin.js", valid("export default createWakebComponents({ 'framework': `vuetify`, locale: import.meta.env.VITE_LOCALE })"), "vuetify"],
    ["plugin.js", valid("export default make({ framework: 'vuetify' })", "import { createWakebComponents as make } from 'wakeb-components'\n"), "vuetify"],
    [
      "plugin.ts",
      valid(
        "const theme: string = 'light'\nexport default createWakebComponents({ framework: 'primevue' satisfies WakebFramework, locale: 'ar' as const })",
        "import { createWakebComponents, type WakebFramework } from 'wakeb-components'\n",
      ),
      "primevue",
    ],
  ])("reads %s without executing it", async (file, code, expected) => {
    expect(await readFramework(code, file)).toBe(expected);
  });

  it.each([
    ["an environment expression", valid("export default createWakebComponents({ framework: import.meta.env.VITE_UI })"), "environment expression"],
    ["process.env with a fallback", valid("export default createWakebComponents({ framework: process.env.UI ?? 'vuetify' })"), "environment expression"],
    [
      "an imported constant",
      valid("export default createWakebComponents({ framework: UI })", "import { createWakebComponents } from 'wakeb-components'\nimport { UI } from './ui'\n"),
      "imported constant 'UI'",
    ],
    ["a spread", valid("const base = { framework: 'vuetify' }\nexport default createWakebComponents({ ...base })"), "spread"],
    ["a duplicate", valid("export default createWakebComponents({ framework: 'vuetify', framework: 'primevue' })"), "more than once"],
    ["a computed key", valid("export default createWakebComponents({ ['framework']: 'vuetify' })"), "computed key"],
    ["a re-export", "export { default } from './real-plugin.js'", "re-exported from another module"],
    ["an export-all", "export * from './real-plugin.js'", "re-exports another module"],
    ["an indirect default", valid("const plugin = createWakebComponents({ framework: 'vuetify' })\nexport default plugin"), "direct createWakebComponents"],
    ["a missing import", "export default createWakebComponents({ framework: 'vuetify' })", "not imported by name"],
    ["an options variable", valid("const options = { framework: 'vuetify' }\nexport default createWakebComponents(options)"), "object literal"],
    ["an unknown framework", valid("export default createWakebComponents({ framework: 'react' })"), "framework 'react' is not supported"],
    ["a missing framework", valid("export default createWakebComponents({ locale: 'ar' })"), "framework is missing"],
    ["a template expression", valid("export default createWakebComponents({ framework: `${'vue'}tify` })"), "template literal with expressions"],
  ])("rejects %s with an actionable WAKEB_CONFIG_INVALID error", async (_case, code, message) => {
    const error = await readFramework(code, "plugins/wakeb-components.js").catch((reason) => reason);
    expect(error.code).toBe("WAKEB_CONFIG_INVALID");
    expect(error.message).toContain(message);
    expect(error.message).toContain("plugins/wakeb-components.js");
    expect(error.message).toContain("export default createWakebComponents({");
  });
});

describe("wakebComponents() Vite integration", () => {
  const project = (files: Record<string, string>, dependencies: string[] = []) => {
    const root = mkdtempSync(join(tmpdir(), "wakeb-selector-"));
    for (const [path, code] of Object.entries(files)) {
      mkdirSync(join(root, path, ".."), { recursive: true });
      writeFileSync(join(root, path), code);
    }
    for (const name of dependencies) {
      mkdirSync(join(root, "node_modules", name), { recursive: true });
      writeFileSync(join(root, "node_modules", name, "package.json"), JSON.stringify({ name, version: "0.0.0" }));
    }
    return root;
  };
  const configure = async (root: string, options = {}) => {
    const plugin = wakebComponents(options) as { config: (config: object) => Promise<Record<string, any>> };
    return plugin.config({ root });
  };
  const plugin = (framework: string) => valid(`export default createWakebComponents({ framework: '${framework}' })`);

  it("names every searched path when the plugin file is missing", async () => {
    const root = project({});
    const error = await configure(root).catch((reason) => reason);
    expect(error.code).toBe("WAKEB_CONFIG_INVALID");
    expect(error.message).toContain(join(root, "plugins/wakeb-components.js"));
    expect(error.message).toContain("configFile");
  });

  it("supports a TypeScript configFile in a monorepo package", async () => {
    const root = project({ "packages/web/src/setup/wakeb.ts": plugin("primevue") }, ["primevue", "@primeuix/themes"]);
    const config = await configure(join(root, "packages/web"), { configFile: "src/setup/wakeb.ts" });
    expect(config.ssr.noExternal).toEqual(["wakeb-components"]);
    expect(config.optimizeDeps.exclude).toContain("wakeb-components");
  });

  it("fails before resolution when the selected peers are absent, with the install command", async () => {
    const root = project({ "plugins/wakeb-components.js": plugin("primevue") }, ["primevue"]);
    const error = await configure(root).catch((reason) => reason);
    expect(error.code).toBe("WAKEB_PROVIDER_MISSING");
    expect(error.message).toContain("npm install @primeuix/themes");
  });

  it("does not require unselected providers", async () => {
    const root = project({ "plugins/wakeb-components.js": plugin("vuetify") }, ["vuetify"]);
    const config = await configure(root);
    expect(config.ssr.noExternal).toEqual(["wakeb-components", "vuetify"]);
  });

  it("reports the shadcn adapter as not available yet", async () => {
    const root = project({ "plugins/wakeb-components.js": plugin("shadcn") });
    expect((await configure(root).catch((reason) => reason)).code).toBe("WAKEB_CAPABILITY_UNSUPPORTED");
  });
});
