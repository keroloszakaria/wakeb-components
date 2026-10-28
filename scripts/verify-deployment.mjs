import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const base = new URL(process.argv[2] ?? "https://wakeb-components.surge.sh/");
assert.ok(["https:", "http:"].includes(base.protocol));
const response = await fetch(new URL("deployment-proof.json", base));
assert.equal(response.status, 200, "Deployment receipt must be public");
const proof = await response.json();
assert.equal(proof.package, "wakeb-components");
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
assert.equal(proof.version, version);
const entries = Object.entries(proof.files);
assert.ok(entries.length > 30, "Receipt must include pages and assets");
const queue = [...entries];
await Promise.all(Array.from({ length: 5 }, async () => {
  for (let entry; (entry = queue.shift());) {
    const [path, expected] = entry;
    assert.ok(!path.startsWith("/") && !path.split("/").includes(".."));
    const result = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
    assert.equal(result.status, 200, path);
    const actual = createHash("sha256").update(new Uint8Array(await result.arrayBuffer())).digest("hex");
    assert.equal(actual, expected, `${path} differs from the deployment receipt`);
  }
}));
console.log(JSON.stringify({ domain: base.href, version: proof.version, sourceCommit: proof.sourceCommit, builtAt: proof.builtAt, verifiedFiles: entries.length }));
