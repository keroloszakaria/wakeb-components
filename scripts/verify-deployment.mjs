import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
// Usage: node scripts/verify-deployment.mjs [url] [expected-proof.json]
// The expected receipt comes from the trusted local build (npm run docs:build), never from the remote site.
const base = new URL(process.argv[2] ?? "https://wakeb-components.surge.sh/");
assert.ok(["https:", "http:"].includes(base.protocol));
const expectedPath = process.argv[3] ?? new URL("../docs/.vitepress/dist/deployment-proof.json", import.meta.url);
const expected = JSON.parse(readFileSync(expectedPath, "utf8"));
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const head = spawnSync("git", ["rev-parse", "HEAD"], { cwd: new URL("..", import.meta.url), encoding: "utf8", windowsHide: true });
assert.equal(head.status, 0, "Git is required to identify the intended release commit");
assert.equal(expected.version, version, "Local build receipt is for another package version");
assert.equal(expected.sourceCommit, head.stdout.trim(), "Local build receipt is for another commit; rebuild before verifying");
assert.equal(expected.sourceDirty, false, "Local build receipt came from a dirty working tree");
const response = await fetch(new URL("deployment-proof.json", base));
assert.equal(response.status, 200, "Deployment receipt must be public");
const proof = await response.json();
assert.equal(proof.package, "wakeb-components");
assert.equal(proof.version, expected.version, "Deployed version differs from the intended release");
assert.equal(proof.sourceCommit, expected.sourceCommit, "Deployed commit differs from the intended release");
assert.deepEqual(proof.files, expected.files, "Deployed asset manifest differs from the local build");
const entries = Object.entries(expected.files);
assert.ok(entries.length > 30, "Receipt must include pages and assets");
const queue = [...entries];
await Promise.all(Array.from({ length: 5 }, async () => {
  for (let entry; (entry = queue.shift());) {
    const [path, hash] = entry;
    assert.ok(!path.startsWith("/") && !path.split("/").includes(".."));
    const result = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
    assert.equal(result.status, 200, path);
    const actual = createHash("sha256").update(new Uint8Array(await result.arrayBuffer())).digest("hex");
    assert.equal(actual, hash, `${path} differs from the local build`);
  }
}));
console.log(JSON.stringify({ domain: base.href, version: proof.version, sourceCommit: proof.sourceCommit, builtAt: proof.builtAt, verifiedFiles: entries.length }));
