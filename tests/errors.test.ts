// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { WakebError, type WakebErrorCode } from "../src/core/errors";

/*
 * WAKEB_CAPABILITY_UNSUPPORTED is declared but reserved (SPEC R07, R21): it applies only to a
 * documented optional feature, and the capability manifest defines none yet. Pin both halves so a
 * future optional feature must add its manifest entry, its raising site and its tests together.
 */
const root = join(__dirname, "..");
const files = (dir: string): string[] =>
  readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : /\.(ts|vue|mjs|js)$/.test(entry.name) ? [join(dir, entry.name)] : [],
  );

describe("WAKEB_CAPABILITY_UNSUPPORTED (reserved)", () => {
  it("stays a stable, constructible WakebError code", () => {
    const code: WakebErrorCode = "WAKEB_CAPABILITY_UNSUPPORTED";
    const error = new WakebError(code, "Capability 'example' is not available on this provider. Use 'alternative' instead.");
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe(code);
    expect(error.message).toMatch(/^\[WAKEB_CAPABILITY_UNSUPPORTED\] /);
  });

  it("is raised nowhere while no optional feature is defined", () => {
    const raisers = files("src")
      .filter((file) => !file.endsWith(join("core", "errors.ts")))
      .filter((file) => readFileSync(join(root, file), "utf8").includes("WAKEB_CAPABILITY_UNSUPPORTED"))
      .map((file) => relative(root, join(root, file)));
    expect(raisers).toEqual([]);
  });

  it("has no optional-feature entries in the capability manifest type", () => {
    const options = readFileSync(join(root, "src/core/options.ts"), "utf8");
    const manifest = /export interface WakebCapabilities \{([^}]*)\}/.exec(options)?.[1] ?? "";
    expect([...manifest.matchAll(/readonly (\w+)\??:/g)].map((match) => match[1])).toEqual(["version", "framework", "components"]);
  });
});
