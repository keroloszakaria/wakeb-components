export type WakebFramework = "vuetify" | "primevue" | "shadcn";
export const FRAMEWORKS: readonly WakebFramework[] = ["vuetify", "primevue", "shadcn"];

/**
 * How Wakeb obtains the provider instance (SPEC R24).
 * - auto: reuse a compatible host instance on the same app, otherwise install one.
 * - reuse: require a host instance installed before Wakeb.
 * - install: Wakeb installs the provider and fails if the host already did.
 */
export type WakebProviderMode = "auto" | "reuse" | "install";

export interface WakebProviderOptions<F extends WakebFramework> {
  kind: F;
  mode?: WakebProviderMode;
  /** Native provider options used only when Wakeb installs the provider. Not portable. */
  options?: Readonly<Record<string, unknown>>;
}

interface WakebBaseOptions {
  locale?: "en" | "ar";
  direction?: "ltr" | "rtl";
}

export type WakebComponentsOptions = {
  [F in WakebFramework]: WakebBaseOptions & { framework: F; providerOptions?: WakebProviderOptions<F> };
}[WakebFramework];

/** Implemented components per provider; alpha adapters report what they do not cover yet (SPEC R21). */
export interface WakebCapabilities {
  readonly version: 1;
  readonly framework: WakebFramework;
  readonly components: readonly string[];
}

export interface WakebPlugin {
  readonly framework: WakebFramework;
  readonly capabilities: WakebCapabilities;
  install(app: import("vue").App): void;
}

/** What a provider service module exports; the build integration selects exactly one. */
export interface WakebProviderServices {
  readonly framework: WakebFramework | null;
  readonly components: readonly string[];
  installProvider(
    app: import("vue").App,
    options: { mode: WakebProviderMode; options?: Readonly<Record<string, unknown>> },
  ): { reused: boolean };
}
