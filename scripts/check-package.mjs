import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createWorkDir, FRAMEWORKS, hash, installedVersion, npm, offlineFlags, packTarball, run, sharedFiles, verifyConsumer, writeConsumerSources } from "./consumer-harness.mjs";

/*
 * Packaging proof (SPEC R09, R10, R11): one packed tarball, one isolated consumer per provider in the
 * system temp directory. The locked minimum/current version matrix lives in check-peers.mjs.
 */
assert(npm, "Use npm run check:package");
const work = createWorkDir("wakeb-consumers-");
const packed = packTarball(work);

const PEERS = {
  vuetify: { vuetify: "3.13.2" },
  primevue: { primevue: installedVersion("primevue"), "@primeuix/themes": installedVersion("@primeuix/themes") },
  shadcn: { "reka-ui": installedVersion("reka-ui") },
};
const evidence = {};

for (const framework of FRAMEWORKS) {
  const dir = join(work, framework);
  writeConsumerSources(dir, framework);
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      dependencies: { "wakeb-components": packed.path, vue: installedVersion("vue"), "@vue/server-renderer": installedVersion("vue"), vite: installedVersion("vite"), ...PEERS[framework] },
    }),
  );
  console.log(run([npm, "install", "--ignore-scripts", "--no-fund", "--no-audit", ...offlineFlags()], dir));
  evidence[framework] = await verifyConsumer(dir, framework);
}

// The published resolver fails loudly when the build integration is missing.
{
  const dir = join(work, "vuetify");
  const vite = await import(pathToFileURL(join(dir, "node_modules/vite/dist/node/index.js")).href);
  await vite.build({ root: dir, configFile: false, logLevel: "silent", ssr: { noExternal: ["wakeb-components", "vuetify"] }, build: { ssr: join(dir, "unconfigured.js"), outDir: "unconfigured-dist" } });
  const { renderPage } = await import(pathToFileURL(join(dir, "unconfigured-dist/unconfigured.js")).href);
  await assert.rejects(async () => renderPage(), (error) => error.code === "WAKEB_BUILD_PLUGIN_MISSING");
}

// Fixture sources are identical; only the plugin file, manifest and lockfile select the provider.
const [first, ...rest] = FRAMEWORKS.map((framework) => join(work, framework));
for (const dir of rest) {
  for (const file of sharedFiles) assert.equal(hash(join(first, file)), hash(join(dir, file)), file);
  assert.notEqual(hash(join(first, "plugins/wakeb-components.js")), hash(join(dir, "plugins/wakeb-components.js")));
}

console.log(JSON.stringify(evidence, null, 2));
console.log("Packed package passed: isolated Vuetify, PrimeVue and shadcn-vue consumers, typed root, browser and SSR builds, tree shaking and unconfigured diagnostics.");
console.log(`Consumer fixtures: ${work}`);
