import { defineComponent, inject, type App, type InjectionKey } from "vue";
import { WakebError, buildPluginMissing } from "./errors";
import type { WakebFramework, WakebProviderServices } from "./options";

export { WakebError, buildPluginMissing } from "./errors";
export type { WakebErrorCode } from "./errors";

export interface WakebContext {
  readonly framework: WakebFramework;
  readonly locale: "en" | "ar";
  readonly direction: "ltr" | "rtl";
  /** True when Wakeb reused a provider instance the host installed. */
  readonly providerReused: boolean;
  /** Identity of the plugin object that installed this context. */
  readonly owner: object;
}

export const WAKEB_CONTEXT: InjectionKey<WakebContext> = Symbol.for("wakeb-components:context");

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
