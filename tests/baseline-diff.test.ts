// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import * as api from "../src/index";
// @ts-expect-error -- plain ESM helper without declarations; also runnable as `node scripts/api-diff.mjs`.
import * as diff from "../scripts/api-diff.mjs";

/*
 * Baseline-to-current public API diff (SPEC R12). Every difference from the 0.7.0 snapshot in
 * specs/ui-abstraction/baseline.json is classified as unchanged, additive or breaking; breaking ones
 * must be listed in specs/ui-abstraction/baseline-changes.json with a reason and a migration-guide
 * section. Unlisted breaking changes and stale entries fail. Defaults are read from the compiled
 * Vuetify renderers, which own them (the facades declare no defaults).
 */
type Difference = { id: string; kind: "unchanged" | "additive" | "breaking"; from?: string; to?: string; changes?: string[] };
type Renderer = { default: { props?: Record<string, unknown> } };

const renderers = import.meta.glob<Renderer>("../src/components/W*.vue", { eager: true });
const baseline = diff.loadBaseline();
let differences: Difference[] = [];

beforeAll(() => {
  const props = Object.fromEntries(
    Object.entries(renderers).map(([file, module]) => [file.match(/(W\w+)\.vue$/)![1], module.default.props ?? {}]),
  );
  differences = [...diff.diffTypes(baseline), ...diff.diffRuntime(baseline, Object.keys(api), props, diff.loadAllowlist().notation)].sort((a: Difference, b: Difference) =>
    a.id.localeCompare(b.id),
  );
}, 60_000);

describe("baseline-to-current API diff (R12)", () => {
  it("covers every baseline component with a compiled renderer", () => {
    expect(baseline.packageVersion).toBe("0.7.0");
    expect(Object.keys(renderers).map((file) => file.match(/(W\w+)\.vue$/)![1]).sort()).toEqual(
      baseline.components.map((component: { name: string }) => component.name).sort(),
    );
    for (const component of baseline.components) {
      const ids = new Set(differences.map((d) => d.id));
      for (const [prop] of component.props) expect(ids.has(`${component.name}.default.${prop}`), `${component.name}.${prop}`).toBe(true);
    }
  });

  it("keeps every baseline runtime export", () => {
    const removed = differences.filter((d) => d.id.startsWith("exports.value.") && d.kind === "breaking");
    expect(removed).toEqual([]);
  });

  it("lists every breaking difference in the allowlist, with no stale entries", () => {
    const problems = diff.checkAllowlist(differences, diff.loadAllowlist(), readFileSync(diff.MIGRATION_FILE, "utf8"));
    expect(problems).toEqual([]);
  });

  it("classifies every difference", () => {
    for (const d of differences) expect(["unchanged", "additive", "breaking"]).toContain(d.kind);
    const breaking = differences.filter((d) => d.kind === "breaking").length;
    expect(diff.loadAllowlist().breaking).toHaveLength(breaking);
  });
});

describe("api-diff helpers", () => {
  it("normalizes whitespace and trailing separators", () => {
    expect(diff.normalize("{\r\n  a: string;\n  b?: number;\n}")).toBe(diff.normalize("{ a: string; b?: number }"));
  });

  it("reads baseline default notation", () => {
    expect(diff.baselineDefault('"top"')).toBe('"top"');
    expect(diff.baselineDefault("12")).toBe("12");
    expect(diff.baselineDefault("[] (required)")).toBe("required");
    expect(diff.baselineDefault("var(--x, #fff)")).toBe('"var(--x, #fff)"');
    expect(diff.baselineDefault("label => label ?? \"\"")).toBe(diff.runtimeDefault({ type: Function, default: (label: string) => label ?? "" }));
    expect(diff.runtimeDefault({ type: Array, default: () => [] })).toBe("[]");
  });

  it("reads VitePress anchors", () => {
    expect([...diff.anchors("## Plugin file {#plugin-file}\n### Badge `type`\n")]).toEqual(["plugin-file", "badge-type"]);
  });
});
