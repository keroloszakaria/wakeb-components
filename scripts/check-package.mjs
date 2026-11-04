import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/*
 * M1 packaging proof (SPEC R09, R10): one packed tarball, one isolated consumer per provider in the
 * system temp directory so Node resolution can never climb into this repository's node_modules.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.env.npm_execpath;
assert(npm, "Use npm run check:package");
const run = (args, cwd) => execFileSync(process.execPath, args, { cwd, encoding: "utf8", windowsHide: true, timeout: 300000 });
const installedVersion = (name) => JSON.parse(readFileSync(join(root, "node_modules", name, "package.json"), "utf8")).version;
// realpath: Windows tmpdir() may be an 8.3 short path that Vite would expand, breaking relative output names.
const work = realpathSync.native(mkdtempSync(join(tmpdir(), "wakeb-consumers-")));
const output = run([npm, "pack", "--json", "--ignore-scripts", "--pack-destination", work], root);
const [packed] = JSON.parse(output.slice(output.indexOf("[")));
for (const path of ["dist/index.js", "dist/index.d.ts", "dist/vite.js", "dist/build/vite.d.ts", "dist/wakeb-components.css", "dist/_internal/core.js", "dist/_internal/selected/WButton.js", "dist/_internal/selected/services.js", "dist/_internal/adapters/vuetify/services.js", "dist/_internal/adapters/primevue/WModal.js", "LICENSE", "README.md"])
  assert(packed.files.some((file) => file.path === path), `packed ${path}`);
assert(!packed.files.some((file) => /(^|\/)(node_modules|tests|\.env)(\/|$)/.test(file.path)));

const PROVIDERS = {
  vuetify: { vuetify: "3.13.2" },
  primevue: { primevue: installedVersion("primevue"), "@primeuix/themes": installedVersion("@primeuix/themes") },
};
const SHARED = join(root, "scripts/consumer");
const sharedFiles = readdirSync(SHARED);
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
/** Rendered module ids per build, after tree shaking (renderedLength > 0). */
const collector = (sink) => ({
  name: "collect-modules",
  generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle))
      if (chunk.type === "chunk") for (const [id, info] of Object.entries(chunk.modules)) if (info.renderedLength > 0) sink.add(id.replaceAll("\\", "/"));
  },
});
const results = {};

for (const [framework, peers] of Object.entries(PROVIDERS)) {
  const dir = join(work, framework);
  mkdirSync(join(dir, "plugins"), { recursive: true });
  for (const file of sharedFiles) copyFileSync(join(SHARED, file), join(dir, file));
  writeFileSync(join(dir, "plugins/wakeb-components.js"), `import { createWakebComponents } from 'wakeb-components'\n\nexport default createWakebComponents({ framework: '${framework}' })\n`);
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      dependencies: { "wakeb-components": join(work, packed.filename), vue: installedVersion("vue"), "@vue/server-renderer": installedVersion("vue"), vite: installedVersion("vite"), ...peers },
    }),
  );
  console.log(run([npm, "install", "--ignore-scripts", "--no-fund", "--no-audit", "--prefer-offline", ...(process.env.WAKEB_CHECK_OFFLINE ? ["--offline"] : [])], dir));

  // Only the selected provider is installed; every other provider's peers are absent.
  for (const [otherFramework, otherPeers] of Object.entries(PROVIDERS))
    if (otherFramework !== framework)
      for (const name of Object.keys(otherPeers)) assert(!existsSync(join(dir, "node_modules", name)), `${framework} fixture must not install ${name}`);

  // Root declarations type-check with only this provider present, without skipping library checks.
  run([join(root, "node_modules/typescript/bin/tsc"), "--noEmit", "--strict", "--target", "ES2022", "--module", "ESNext", "--moduleResolution", "Bundler", "--lib", "ES2022,DOM", "consumer.ts"], dir);

  const vite = await import(pathToFileURL(join(dir, "node_modules/vite/dist/node/index.js")).href);
  const { wakebComponents } = await import(pathToFileURL(join(dir, "node_modules/wakeb-components/dist/vite.js")).href);
  const browserBuild = async (entry, outDir) => {
    const modules = new Set();
    writeFileSync(join(dir, `${outDir}.html`), `<div id="app"></div><script type="module" src="/${entry}"></script>\n`);
    await vite.build({ root: dir, configFile: false, logLevel: "warn", plugins: [wakebComponents(), collector(modules)], build: { outDir, rollupOptions: { input: join(dir, `${outDir}.html`) } } });
    const assets = (ext) => readdirSync(join(dir, outDir, "assets")).filter((file) => file.endsWith(ext)).map((file) => readFileSync(join(dir, outDir, "assets", file), "utf8")).join("\n");
    return { modules: [...modules], css: assets(".css"), js: assets(".js") };
  };
  const full = await browserBuild("browser.js", "browser-dist");
  // Development warnings sit behind process.env.NODE_ENV, so a production bundle drops their text (SPEC R07).
  assert(!/WAKEB_(DEPRECATED_VALUE|UNKNOWN_VALUE|ICON_UNRESOLVED)/.test(full.js), `${framework} production bundle keeps development warning text`);
  // Wakeb-owned icons (SPEC R15): built-in chevron and the fallback box ship without an icon font.
  assert(full.js.includes("M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"), `${framework} bundle contains the built-in $expand icon`);
  if (framework !== "vuetify") assert(full.js.includes("M3,3H21V21H3V3M5,5V19H19V5H5Z"), `${framework} bundle contains the icon fallback box`);
  if (framework === "vuetify") assert(full.modules.some((id) => /adapters\/vuetify\/WBadge\.js$/.test(id)), "vuetify bundle renders WBadge, which warns in development");
  const button = await browserBuild("button-only.js", "button-dist");

  await vite.build({ root: dir, configFile: false, logLevel: "warn", plugins: [wakebComponents()], build: { ssr: join(dir, "server.js"), outDir: "ssr-dist" } });
  const server = await import(pathToFileURL(join(dir, "ssr-dist/server.js")).href);
  const html = await server.renderPage();
  assert(!/NaN|Infinity/.test(html));
  for (const [name, needles] of server.checks) for (const needle of needles) assert(html.includes(needle), `${framework} SSR ${name} renders ${needle}`);

  results[framework] = { dir, full, button, rendered: server.checks.map(([name]) => name) };
}

// The published resolver fails loudly when the build integration is missing.
{
  const dir = results.vuetify.dir;
  const vite = await import(pathToFileURL(join(dir, "node_modules/vite/dist/node/index.js")).href);
  await vite.build({ root: dir, configFile: false, logLevel: "silent", ssr: { noExternal: ["wakeb-components", "vuetify"] }, build: { ssr: join(dir, "unconfigured.js"), outDir: "unconfigured-dist" } });
  const { renderPage } = await import(pathToFileURL(join(dir, "unconfigured-dist/unconfigured.js")).href);
  await assert.rejects(async () => renderPage(), (error) => error.code === "WAKEB_BUILD_PLUGIN_MISSING");
}

// Fixture sources are identical; only the plugin file, manifest and lockfile select the provider.
for (const file of sharedFiles) assert.equal(hash(join(results.vuetify.dir, file)), hash(join(results.primevue.dir, file)), file);
assert.notEqual(hash(join(results.vuetify.dir, "plugins/wakeb-components.js")), hash(join(results.primevue.dir, "plugins/wakeb-components.js")));

const PROVIDER_MODULE = { vuetify: /\/node_modules\/vuetify\//, primevue: /\/node_modules\/(primevue|@primevue|@primeuix)\// };
const evidence = {};
for (const [framework, { full, button, rendered }] of Object.entries(results)) {
  const other = framework === "vuetify" ? "primevue" : "vuetify";
  for (const build of [full, button]) assert(!build.modules.some((id) => PROVIDER_MODULE[other].test(id)), `${framework} build must not contain ${other} modules`);
  assert(full.modules.some((id) => PROVIDER_MODULE[framework].test(id)), `${framework} build uses its provider`);
  const adapter = (name) => (id) => id.endsWith(`/_internal/adapters/${framework}/${name}.js`);
  // WButton-only graph: no other renderer and no dialog/menu primitives; the full graph has them.
  for (const name of ["WModal", "WDropdown"]) {
    assert(full.modules.some(adapter(name)), `${framework} full build includes ${name}`);
    assert(!button.modules.some(adapter(name)), `${framework} WButton-only build excludes ${name}`);
  }
  // Component entry modules only: VTooltip legitimately shares the tiny VMenu/shared.js symbol module.
  const overlay = framework === "vuetify" ? /\/components\/(VDialog\/VDialog|VMenu\/VMenu)\.js$/ : /\/primevue\/(dialog|menu)\/index\.mjs$/;
  assert(full.modules.some((id) => overlay.test(id)) && !button.modules.some((id) => overlay.test(id)), `${framework} overlay primitives are tree-shaken`);
  if (framework === "primevue") assert(!/\.v-application|--v-theme-surface:/.test(full.css), "PrimeVue CSS must not include Vuetify framework styles");
  evidence[framework] = { rendered, fullModules: full.modules.length, buttonOnlyModules: button.modules.length };
}
console.log(JSON.stringify(evidence, null, 2));
console.log("Packed package passed: isolated Vuetify and PrimeVue consumers, typed root, browser and SSR builds, tree shaking and unconfigured diagnostics.");
console.log(`Consumer fixtures: ${work}`);
