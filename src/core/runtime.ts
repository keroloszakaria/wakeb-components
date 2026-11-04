import { defineComponent, inject, type App, type InjectionKey } from "vue";
import { WakebError, buildPluginMissing } from "./errors";
import type { WakebFramework, WakebProviderServices } from "./options";

export { WakebError, buildPluginMissing } from "./errors";
export type { WakebErrorCode } from "./errors";

export interface WakebContext {
  readonly framework: WakebFramework;
  readonly locale: "en" | "ar";
  readonly direction: "ltr" | "rtl";
  /** Validated plugin defaults per component; copied again for each instance. */
  readonly defaults: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  /**
   * Attributes that carry the configured theme and direction to Wakeb roots and teleported
   * overlay content. Empty unless theme or direction was configured.
   */
  readonly scope: Readonly<Record<string, unknown>>;
  /** Configured overlay z-index; providers keep their own stacking when absent. */
  readonly zIndexOverlay?: number;
  /** True when Wakeb reused a provider instance the host installed. */
  readonly providerReused: boolean;
  /** Identity of the plugin object that installed this context. */
  readonly owner: object;
  /** Development warnings already reported for this app. */
  readonly warned: Set<string>;
}

export const WAKEB_CONTEXT: InjectionKey<WakebContext> = Symbol.for("wakeb-components:context");

export type WakebWarningCode = "WAKEB_DEPRECATED_VALUE" | "WAKEB_UNKNOWN_VALUE";

/**
 * Reports a development warning once per app and key. Call it behind
 * `process.env.NODE_ENV !== "production"` so production bundles drop the call and its text.
 */
export function warnOnce(context: WakebContext | null, code: WakebWarningCode, key: string, message: string) {
  const id = `${code}:${key}`;
  if (context) {
    if (context.warned.has(id)) return;
    context.warned.add(id);
  }
  console.warn(`[${code}] ${message}`);
}

export function useWakebContext(component: string): WakebContext {
  const context = inject(WAKEB_CONTEXT, null);
  if (!context)
    throw new WakebError(
      "WAKEB_CONTEXT_MISSING",
      `${component} rendered without Wakeb. Install it once per app: app.use(createWakebComponents({ framework: '...' })).`,
    );
  return context;
}

export const appContext = (app: App) => app.runWithContext(() => inject(WAKEB_CONTEXT, null));

/** Placeholder renderer for a component the selected alpha adapter does not implement yet. */
export const createUnsupportedComponent = (name: string, framework: WakebFramework) =>
  defineComponent({
    name,
    setup() {
      throw new WakebError(
        "WAKEB_COMPONENT_UNSUPPORTED",
        `${name} is not implemented by the ${framework} adapter yet. See the capability matrix in the wakeb-components documentation, or select a provider that supports it.`,
      );
    },
  });

/** Renderer used when the package is bundled without wakebComponents(). */
export const createUnconfiguredComponent = (name: string) =>
  defineComponent({
    name,
    setup() {
      throw buildPluginMissing();
    },
  });

export const unconfiguredServices: WakebProviderServices = {
  framework: null,
  components: [],
  installProvider() {
    throw buildPluginMissing();
  },
};
