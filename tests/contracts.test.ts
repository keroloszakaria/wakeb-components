// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { COMPONENTS } from "../src/adapters/manifest";

/*
 * Neutral contracts (SPEC R01, R14): facade types come from src/contracts.ts, and the vue-tsc
 * conformance file covers every renderer, so a new renderer cannot skip the type-level check.
 */
const root = join(__dirname, "..");
const read = (file: string) => readFileSync(join(root, file), "utf8");
const renderers = (dir: string) =>
  readdirSync(join(root, dir))
    // Internal helpers (files not named W*) are private parts of a renderer, not renderers.
    .filter((file) => /^W\w+\.vue$/.test(file))
    .map((file) => `${dir}/${file}`);

describe("neutral contracts", () => {
  it("types every facade from its contract, never from a renderer", () => {
    const index = read("src/index.ts");
    expect(index).not.toMatch(/from "\.\/(components|adapters)\//);
    for (const name of COMPONENTS) expect(index).toContain(`as unknown as WakebComponent<"${name}">;`);
  });

  it("declares emits and slots for every public component", () => {
    const contracts = read("src/contracts.ts");
    for (const map of ["WakebComponentEmits", "WakebComponentSlots"]) {
      const body = contracts.slice(contracts.indexOf(`export interface ${map} {`)).split("\n}")[0];
      expect([...body.matchAll(/^\s+(W\w+):/gm)].map(([, name]) => name).sort()).toEqual([...COMPONENTS].sort());
    }
  });

  it("checks every renderer file for conformance", () => {
    const conformance = read("tests/types/conformance.ts");
    const files = [...renderers("src/components"), ...readdirSync(join(root, "src/adapters"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).flatMap((entry) => renderers(`src/adapters/${entry.name}`))];
    expect(files.length).toBeGreaterThanOrEqual(COMPONENTS.length);
    for (const file of files) {
      const alias = conformance.match(new RegExp(`^import type (\\w+) from "\\.\\./\\.\\./${file.replaceAll(".", "\\.")}";$`, "m"))?.[1];
      expect(alias, `${file} is missing from tests/types/conformance.ts`).toBeDefined();
      // The import alone checks nothing; the renderer must sit in a checked provider map.
      expect(conformance).toMatch(new RegExp(`^  W\\w+: typeof ${alias};$`, "m"));
    }
  });
});
