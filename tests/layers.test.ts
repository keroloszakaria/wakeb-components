// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

/*
 * Layer boundaries (SPEC R08, R10): core, composables, icons, styles, the build integration and the
 * portable types never import a provider; each adapter imports only its own provider.
 */
const root = join(__dirname, "..");
const files = (dir: string): string[] =>
  readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : /\.(ts|vue|scss|css)$/.test(entry.name) ? [join(dir, entry.name)] : [],
  );
const PROVIDERS = { vuetify: /^vuetify(\/|$)/, primevue: /^(primevue|@primevue|@primeuix)(\/|$)/, shadcn: /^(reka-ui|radix-vue|@?shadcn)/ };
const imports = (file: string) =>
  [...readFileSync(join(root, file), "utf8").matchAll(/(?:import|export)\s[^"']*?from\s*["']([^"']+)["']|import\s*\(?\s*["']([^"']+)["']|@use\s+["']([^"']+)["']/g)].map(
    (match) => match[1] ?? match[2] ?? match[3],
  );
const offenders = (dirs: string[], forbidden: (keyof typeof PROVIDERS)[]) =>
  dirs
    .flatMap((dir) => (dir.includes(".") ? [dir] : files(dir)))
    .flatMap((file) =>
      imports(file)
        .filter((specifier) => forbidden.some((provider) => PROVIDERS[provider].test(specifier)))
        .map((specifier) => `${relative(root, join(root, file))} -> ${specifier}`),
    );

describe("layer boundaries", () => {
  it("keeps provider imports out of portable layers", () => {
    expect(offenders(["src/core", "src/composables", "src/icons", "src/styles", "src/build", "src/types.ts", "src/index.ts"], ["vuetify", "primevue", "shadcn"])).toEqual([]);
  });

  it("keeps each adapter on its own provider", () => {
    expect(offenders(["src/components", "src/adapters/vuetify"], ["primevue", "shadcn"])).toEqual([]);
    expect(offenders(["src/adapters/primevue"], ["vuetify", "shadcn"])).toEqual([]);
  });

  it("finds imports at all", () => {
    expect(imports("src/adapters/primevue/WModal.vue")).toContain("primevue/dialog");
  });
});
