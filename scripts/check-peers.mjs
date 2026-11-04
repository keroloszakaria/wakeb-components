import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createWorkDir, installedVersion, npm, offlineFlags, packTarball, runNpm, verifyConsumer, writeConsumerSources } from "./consumer-harness.mjs";
import { CELLS, COLUMNS, expectedManifest, FIXTURES, lockedVersions, readPackage, RESULTS, syncDocs, TARBALL } from "./peer-matrix.mjs";

/*
 * Locked peer version matrix (SPEC R10, R22; ACCEPTANCE R10). For each provider, installs the minimum
 * and the newest in-range version of every advertised peer with `npm ci` from a committed lockfile and
 * the freshly packed tarball, then runs the packed-consumer checks (tsc --strict, browser and SSR builds,
 * SSR markup, provider isolation and tree shaking). Writes results.json and the docs tables.
 *
 *   npm run check:peers               verify every cell against its committed lockfile
 *   npm run check:peers -- --update   rewrite manifests from package.json and re-resolve lockfiles first
 *
 * Needs the npm registry or a warm npm cache (WAKEB_CHECK_OFFLINE=1 forces the cache).
 */
assert(npm, "Use npm run check:peers");
const update = process.argv.includes("--update");
const started = Date.now();
const pkg = readPackage();
const work = createWorkDir("wakeb-peers-");
const packed = packTarball(work);
const LOCKED_FIELDS = ["dependencies", "peerDependencies", "peerDependenciesMeta", "engines"];
const PEER_WARNING = /^npm (warn|error).*(peer|ERESOLVE|conflict)/im;

const prepare = (cell) => {
  const dir = join(work, cell.id);
  mkdirSync(dir, { recursive: true });
  copyFileSync(packed.path, join(dir, TARBALL));
  return dir;
};

if (update) {
  for (const cell of CELLS) {
    const dir = prepare(cell);
    const manifest = `${JSON.stringify(expectedManifest(cell, pkg), null, 2)}\n`;
    writeFileSync(join(dir, "package.json"), manifest);
    runNpm(["install", "--package-lock-only", "--ignore-scripts", "--no-fund", "--no-audit"], dir);
    const lock = JSON.parse(readFileSync(join(dir, "package-lock.json"), "utf8"));
    // The tarball is rebuilt for every run; its integrity is injected at install time instead.
    delete lock.packages["node_modules/wakeb-components"].integrity;
    mkdirSync(join(FIXTURES, cell.id), { recursive: true });
    writeFileSync(join(FIXTURES, cell.id, "package.json"), manifest);
    writeFileSync(join(FIXTURES, cell.id, "package-lock.json"), `${JSON.stringify(lock, null, 2)}\n`);
    console.log(`Locked ${cell.id}: ${JSON.stringify(lockedVersions(cell))}`);
  }
}

const results = { cells: {} };
for (const cell of CELLS) {
  const cellStarted = Date.now();
  const versions = lockedVersions(cell);
  try {
    const manifest = JSON.parse(readFileSync(join(FIXTURES, cell.id, "package.json"), "utf8"));
    assert.deepEqual(manifest, expectedManifest(cell, pkg), `${cell.id} manifest does not match package.json peer ranges; run npm run check:peers -- --update`);
    const dir = prepare(cell);
    writeFileSync(join(dir, "package.json"), JSON.stringify(manifest, null, 2));
    const lock = JSON.parse(readFileSync(join(FIXTURES, cell.id, "package-lock.json"), "utf8"));
    const entry = lock.packages["node_modules/wakeb-components"];
    assert.equal(entry.resolved, `file:${TARBALL}`, `${cell.id} lock resolves wakeb-components from the packed tarball`);
    // A lock taken against other dependencies or peer metadata no longer describes this package.
    for (const field of LOCKED_FIELDS) assert.deepEqual(entry[field], pkg[field], `${cell.id} lock ${field} is stale; run npm run check:peers -- --update`);
    Object.assign(entry, { version: packed.version, integrity: packed.integrity });
    writeFileSync(join(dir, "package-lock.json"), JSON.stringify(lock, null, 2));

    const install = runNpm(["ci", "--ignore-scripts", "--no-fund", "--no-audit", ...offlineFlags()], dir);
    // Unselected optional provider peers must not produce peer warnings (SPEC R10).
    assert(!PEER_WARNING.test(install.stderr), `${cell.id} npm ci reported peer warnings:\n${install.stderr}`);
    runNpm(["ls", "--all"], dir);
    for (const [name, version] of Object.entries(versions)) assert.equal(installedVersion(name, dir), version, `${cell.id} installed ${name}`);
    for (const name of COLUMNS.filter((name) => !versions[name])) assert(!["vue", "vite"].includes(name), `${cell.id} lacks required peer ${name}`);
    assert.equal(versions["@vue/server-renderer"], versions.vue, `${cell.id} @vue/server-renderer matches vue`);

    writeConsumerSources(dir, cell.framework);
    const evidence = await verifyConsumer(dir, cell.framework);
    results.cells[cell.id] = { versions, result: "pass" };
    console.log(`${cell.id} passed in ${Math.round((Date.now() - cellStarted) / 1000)}s: ${JSON.stringify(versions)} ${JSON.stringify({ ...evidence, rendered: evidence.rendered.length })}`);
  } catch (error) {
    results.cells[cell.id] = { versions, result: "fail" };
    console.error(`${cell.id} FAILED: ${error.stack ?? error}`);
  }
}

writeFileSync(RESULTS, `${JSON.stringify(results, null, 2)}\n`);
syncDocs(results, true);
const failed = Object.entries(results.cells).filter(([, cell]) => cell.result !== "pass").map(([id]) => id);
console.log(`Peer matrix ${failed.length ? `FAILED (${failed.join(", ")})` : "passed"} in ${Math.round((Date.now() - started) / 1000)}s. Consumers: ${work}`);
if (failed.length) process.exitCode = 1;
