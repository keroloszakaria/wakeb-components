import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { WakebError } from "../core/errors";
import type { WakebFramework } from "../core/options";
import { COMPONENTS, SUPPORTED, type ComponentName } from "../adapters/manifest";
import { readFramework } from "./selector";

export interface WakebVitePluginOptions {
  /** Plugin file holding `export default createWakebComponents({ framework })`, relative to the Vite root. */
  configFile?: string;
}

export const DEFAULT_CONFIG_FILE = "plugins/wakeb-components.js";
const SELECTED = /^wakeb-components\/_internal\/selected\/(\w+)$/;
const UNSUPPORTED = "\0wakeb-components:unsupported:";
/** Packages the consumer must install for each provider (SPEC R10). */
const PEERS: Record<WakebFramework, readonly string[]> = {
  vuetify: ["vuetify"],
  primevue: ["primevue", "@primeuix/themes"],
  shadcn: ["reka-ui"],
};

/* Running from src/build/vite.ts (repository) or dist/vite.js (published package). */
const here = dirname(fileURLToPath(import.meta.url));
const fromSource = import.meta.url.endsWith(".ts");
const sourceRoot = resolve(here, "..");
const distInternal = resolve(here, "_internal");
const renderer = (framework: WakebFramework, name: ComponentName) =>
  fromSource
    ? framework === "vuetify"
      ? join(sourceRoot, "components", `${name}.vue`)
      : join(sourceRoot, "adapters", framework, `${name}.vue`)
    : join(distInternal, "adapters", framework, `${name}.js`);
const servicesPath = (framework: WakebFramework) =>
  fromSource ? join(sourceRoot, "adapters", framework, "services.ts") : join(distInternal, "adapters", framework, "services.js");
const runtimePath = fromSource ? join(sourceRoot, "core", "runtime.ts") : join(distInternal, "core.js");

function installed(root: string, name: string) {
  for (let dir = root; ; dir = dirname(dir)) {
    if (existsSync(join(dir, "node_modules", name, "package.json"))) return true;
    if (dirname(dir) === dir) return false;
  }
}

async function select(root: string, configFile: string | undefined) {
  const candidates = configFile ? [resolve(root, configFile)] : [resolve(root, DEFAULT_CONFIG_FILE)];
  const file = candidates.find((path) => existsSync(path));
  if (!file)
    throw new WakebError(
      "WAKEB_CONFIG_INVALID",
      `No Wakeb plugin file found. Searched: ${candidates.join(", ")}. Create it, or pass wakebComponents({ configFile: 'path/to/wakeb-components.ts' }).`,
    );
  return { file, framework: await readFramework(readFileSync(file, "utf8"), file) };
}

/**
 * One-time Vite integration (SPEC R04, R09). It reads the framework from the consumer plugin
 * file and points every public facade at exactly that provider's renderer modules.
 */
export function wakebComponents(options: WakebVitePluginOptions = {}): Plugin {
  let selection: { file: string; framework: WakebFramework };
  return {
    name: "wakeb-components",
    enforce: "pre",
    async config(config) {
      const root = resolve(config.root ?? process.cwd());
      selection = await select(root, options.configFile);
      const { framework } = selection;
      const missing = PEERS[framework].filter((name) => !installed(root, name));
      if (missing.length)
        throw new WakebError(
          "WAKEB_PROVIDER_MISSING",
          `${selection.file} selects '${framework}', which needs ${missing.join(" and ")}. Install it with: npm install ${missing.join(" ")}`,
        );
      return {
        // Pre-bundling would resolve the selected modules without this plugin.
        optimizeDeps: { exclude: ["wakeb-components"] },
        // Vuetify components import CSS, so SSR must bundle them; Wakeb must pass through this plugin.
        ssr: { noExternal: ["wakeb-components", ...(framework === "vuetify" ? ["vuetify"] : [])] },
      };
    },
    async resolveId(id, importer) {
      const match = SELECTED.exec(id);
      if (!match) return;
      const { framework } = selection;
      if (match[1] === "services") return this.resolve(servicesPath(framework), importer, { skipSelf: true });
      const name = match[1] as ComponentName;
      if (!COMPONENTS.includes(name)) return;
      if (!SUPPORTED[framework].includes(name)) return `${UNSUPPORTED}${name}`;
      return this.resolve(renderer(framework, name), importer, { skipSelf: true });
    },
    load(id) {
      if (!id.startsWith(UNSUPPORTED)) return;
      const name = id.slice(UNSUPPORTED.length);
      return `import { createUnsupportedComponent } from ${JSON.stringify(runtimePath.replaceAll("\\", "/"))};\nexport default createUnsupportedComponent(${JSON.stringify(name)}, ${JSON.stringify(selection.framework)});`;
    },
    configureServer(server) {
      const { file, framework } = selection;
      server.watcher.add(file);
      server.watcher.on("change", async (changed) => {
        if (resolve(changed) !== file) return;
        try {
          const next = await readFramework(readFileSync(file, "utf8"), file);
          if (next === framework) return;
          server.config.logger.info(`[wakeb-components] framework changed from '${framework}' to '${next}'; restarting the dev server.`);
          await server.restart();
        } catch (error) {
          server.config.logger.error(String((error as Error).message));
        }
      });
    },
  };
}

export default wakebComponents;
