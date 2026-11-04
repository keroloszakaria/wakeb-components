import type { App } from "vue";
import services from "wakeb-components/_internal/selected/services";
import { WakebError, buildPluginMissing } from "./errors";
import { WAKEB_CONTEXT, appContext, type WakebContext } from "./runtime";
import { validateDefaults, validateTheme } from "./defaults";
import { validateIcons } from "./icons";
import {
  FRAMEWORKS,
  type WakebCapabilities,
  type WakebComponentsOptions,
  type WakebPlugin,
  type WakebProviderMode,
} from "./options";

const KNOWN_OPTIONS = ["framework", "defaults", "locale", "direction", "theme", "icons", "providerOptions"];
const MODES: readonly WakebProviderMode[] = ["auto", "reuse", "install"];
const invalid = (message: string) => new WakebError("WAKEB_CONFIG_INVALID", message);
const list = (values: readonly string[]) => values.map((value) => `'${value}'`).join(", ");

function validate(options: WakebComponentsOptions) {
  if (!options || typeof options !== "object") throw invalid("createWakebComponents() needs an options object with a framework.");
  if (!FRAMEWORKS.includes(options.framework))
    throw invalid(`framework must be one of ${list(FRAMEWORKS)}; received ${JSON.stringify(options.framework)}. There is no default provider.`);
  for (const key of Object.keys(options))
    if (!KNOWN_OPTIONS.includes(key)) throw invalid(`Unknown option '${key}'. Supported options: ${list(KNOWN_OPTIONS)}.`);
  if (options.locale !== undefined && !["en", "ar"].includes(options.locale))
    throw invalid(`locale must be 'en' or 'ar'; received ${JSON.stringify(options.locale)}.`);
  if (options.direction !== undefined && !["ltr", "rtl"].includes(options.direction))
    throw invalid(`direction must be 'ltr' or 'rtl'; received ${JSON.stringify(options.direction)}.`);
  const provider = options.providerOptions;
  if (provider === undefined) return { mode: "auto" as const, options: undefined };
  if (provider.kind !== options.framework)
    throw invalid(`providerOptions.kind must be '${options.framework}' to match framework; received ${JSON.stringify(provider.kind)}.`);
  const mode = provider.mode ?? "auto";
  if (!MODES.includes(mode)) throw invalid(`providerOptions.mode must be one of ${list(MODES)}; received ${JSON.stringify(mode)}.`);
  if (provider.options !== undefined && mode === "reuse")
    throw invalid("providerOptions.options only applies when Wakeb installs the provider; it cannot be combined with mode 'reuse'.");
  return { mode, options: provider.options };
}

/**
 * Creates the per-application plugin. Creation has no side effects; install is synchronous,
 * reuses or installs the selected provider and provides an app-scoped context (SPEC R02, R06, R24).
 */
export function createWakebComponents(options: WakebComponentsOptions): WakebPlugin {
  const provider = validate(options);
  const defaults = validateDefaults(options.defaults);
  const theme = validateTheme(options.theme);
  const icons = validateIcons(options.icons);
  // Scope attributes reach Wakeb roots and teleported overlays; nothing is added unless configured.
  const scope: Record<string, unknown> = {};
  if (Object.keys(theme.variables).length) scope.style = Object.freeze(theme.variables);
  if (theme.mode) scope["data-wakeb-theme"] = theme.mode;
  if (options.direction) scope.dir = options.direction;
  Object.freeze(scope);
  const { framework } = options;
  const capabilities: WakebCapabilities = Object.freeze({
    version: 1,
    framework,
    components: Object.freeze([...services.components]),
  });
  const plugin: WakebPlugin = {
    framework,
    capabilities,
    install(app: App) {
      if (services.framework === null) throw buildPluginMissing();
      if (services.framework !== framework)
        throw new WakebError(
          "WAKEB_FRAMEWORK_MISMATCH",
          `The app selects '${framework}' but the bundle was compiled for '${services.framework}'. Restart the dev server or rebuild so the build integration re-reads the plugin file.`,
        );
      const existing = appContext(app);
      if (existing) {
        if (existing.owner === plugin) return;
        throw new WakebError(
          "WAKEB_INSTALL_CONFLICT",
          "Another Wakeb plugin is already installed on this app. Install one createWakebComponents() plugin per app.",
        );
      }
      const { reused } = services.installProvider(app, provider);
      const context: WakebContext = Object.freeze({
        framework,
        locale: options.locale ?? "en",
        direction: options.direction ?? "ltr",
        defaults,
        scope,
        icons,
        zIndexOverlay: theme.tokens.zIndexOverlay,
        providerReused: reused,
        owner: plugin,
        warned: new Set<string>(),
      });
      app.provide(WAKEB_CONTEXT, context);
    },
  };
  return Object.freeze(plugin);
}
