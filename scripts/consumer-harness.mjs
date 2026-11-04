import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PROVIDER_PEERS } from "./peer-matrix.mjs";

/*
 * Shared machinery for packed-consumer checks (SPEC R09, R10): pack once, install one isolated consumer
 * per provider in the system temp directory so Node resolution can never climb into this repository's
 * node_modules, then type-check, build and render it. Used by check-package.mjs and check-peers.mjs.
 */
export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const npm = process.env.npm_execpath;
export const run = (args, cwd) => {
  try {
    return execFileSync(process.execPath, args, { cwd, encoding: "utf8", windowsHide: true, timeout: 300000 });
  } catch (error) {
    // Keep tool diagnostics (for example tsc errors, which go to stdout) in the failure message.
    error.message += `\n${error.stdout ?? ""}${error.stderr ?? ""}`;
    throw error;
  }
};
/** npm with stdout and stderr captured, so callers can inspect warnings. Throws on a non-zero exit. */
export const runNpm = (args, cwd) => {
  const result = spawnSync(process.execPath, [npm, ...args], { cwd, encoding: "utf8", windowsHide: true, timeout: 600000 });
  if (result.status !== 0) throw new Error(`npm ${args.join(" ")} failed in ${cwd}\n${result.stdout}\n${result.stderr}${result.error?.message ?? ""}`);
  return { stdout: result.stdout, stderr: result.stderr };
};
export const installedVersion = (name, base = root) => JSON.parse(readFileSync(join(base, "node_modules", name, "package.json"), "utf8")).version;
export const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
export const offlineFlags = () => ["--prefer-offline", ...(process.env.WAKEB_CHECK_OFFLINE ? ["--offline"] : [])];

export { PROVIDER_PEERS };
export const FRAMEWORKS = Object.keys(PROVIDER_PEERS);
export const SHARED = join(root, "scripts/consumer");
export const sharedFiles = readdirSync(SHARED);

/** realpath: Windows tmpdir() may be an 8.3 short path that Vite would expand, breaking relative output names. */
export const createWorkDir = (prefix) => realpathSync.native(mkdtempSync(join(tmpdir(), prefix)));

/** Packs the built package into `work` and checks the archive contents. Run `npm run build` first. */
export function packTarball(work) {
  assert(npm, "Run through an npm script so npm_execpath is set");
  const output = run([npm, "pack", "--json", "--ignore-scripts", "--pack-destination", work], root);
  const [packed] = JSON.parse(output.slice(output.indexOf("[")));
  for (const path of ["dist/index.js", "dist/index.d.ts", "dist/vite.js", "dist/build/vite.d.ts", "dist/wakeb-components.css", "dist/_internal/core.js", "dist/_internal/selected/WButton.js", "dist/_internal/selected/services.js", "dist/_internal/adapters/vuetify/services.js", "dist/_internal/adapters/primevue/WModal.js", "LICENSE", "README.md"])
    assert(packed.files.some((file) => file.path === path), `packed ${path}`);
  assert(!packed.files.some((file) => /(^|\/)(node_modules|tests|\.env)(\/|$)/.test(file.path)));
  return { ...packed, path: join(work, packed.filename) };
}

/** Copies the shared consumer sources and writes the provider-selecting plugin file. */
export function writeConsumerSources(dir, framework) {
  mkdirSync(join(dir, "plugins"), { recursive: true });
  for (const file of sharedFiles) copyFileSync(join(SHARED, file), join(dir, file));
  writeFileSync(join(dir, "plugins/wakeb-components.js"), `import { createWakebComponents } from 'wakeb-components'\n\nexport default createWakebComponents({ framework: '${framework}' })\n`);
}

/** Rendered module ids per build, after tree shaking (renderedLength > 0). */
const collector = (sink) => ({
  name: "collect-modules",
  generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle))
      if (chunk.type === "chunk") for (const [id, info] of Object.entries(chunk.modules)) if (info.renderedLength > 0) sink.add(id.replaceAll("\\", "/"));
  },
});
const PROVIDER_MODULE = { vuetify: /\/node_modules\/vuetify\//, primevue: /\/node_modules\/(primevue|@primevue|@primeuix)\// };

/**
 * Verifies an installed consumer: unselected peers are absent, root declarations type-check under
 * `tsc --strict`, browser (full and WButton-only) and SSR builds succeed, SSR output contains every
 * component's expected markup, and the browser graphs contain only the selected provider with
 * overlay primitives tree-shaken from the WButton-only graph.
 */
export async function verifyConsumer(dir, framework) {
  const other = FRAMEWORKS.find((name) => name !== framework);
  for (const name of PROVIDER_PEERS[other]) assert(!existsSync(join(dir, "node_modules", name)), `${framework} consumer must not install ${name}`);

  // Root declarations type-check with only this provider present, without skipping library checks.
  const compilerFlags = ["--noEmit", "--strict", "--target", "ES2022", "--module", "ESNext", "--moduleResolution", "Bundler", "--lib", "ES2022,DOM"];
  run([join(root, "node_modules/typescript/bin/tsc"), ...compilerFlags, "consumer.ts"], dir);
  // Portable declarations name no renderer file and no provider package (SPEC R05, R10).
  for (const file of ["index.d.ts", "contracts.d.ts", "types.d.ts", "core/options.d.ts"]) {
    const text = readFileSync(join(dir, "node_modules/wakeb-components/dist", file), "utf8");
    assert(!/(?:from|import\()\s*["'](?:\.{1,2}\/(?:components|adapters)\/|vuetify|primevue|@primevue|@primeuix)/.test(text), `${file} references a renderer or provider`);
  }
  // Template slot payloads and handler types as vue-tsc infers them from the facades (SPEC R14).
  run([join(root, "node_modules/vue-tsc/bin/vue-tsc.js"), ...compilerFlags, "Templates.vue"], dir);

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
  assert(!/WAKEB_(DEPRECATED_VALUE|UNKNOWN_VALUE|ICON_UNRESOLVED|PROVIDER_PROP_IGNORED)/.test(full.js), `${framework} production bundle keeps development warning text`);
  // providerProps filtering still runs in production; only its diagnostics are dropped.
  assert(/providerProps/.test(full.js), `${framework} production bundle lost the providerProps filter`);
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

  return { rendered: server.checks.map(([name]) => name), fullModules: full.modules.length, buttonOnlyModules: button.modules.length };
}
