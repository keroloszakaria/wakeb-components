import { describe, expect, it } from "vitest";
import { createApp, defineComponent, h, inject } from "vue";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WButton, WTabs, createWakebComponents, type WakebComponentsOptions } from "../src";
import { WAKEB_CONTEXT, type WakebContext } from "../src/core/runtime";
import { SUPPORTED } from "../src/adapters/manifest";
import { framework, wakeb } from "./wakeb";

const other = framework === "vuetify" ? "primevue" : "vuetify";
const installHost = (app: ReturnType<typeof createApp>) =>
  framework === "vuetify" ? app.use(createVuetify()) : app.use(PrimeVue, { theme: "none" });
/** Snapshot of host provider state Wakeb must leave untouched when it reuses the instance (SPEC R24). */
const hostState = (app: ReturnType<typeof createApp>) =>
  framework === "vuetify"
    ? app.runWithContext(() => ({
        theme: inject(Symbol.for("vuetify:theme")),
        defaults: inject(Symbol.for("vuetify:defaults")),
        icons: inject(Symbol.for("vuetify:icons")),
        locale: inject(Symbol.for("vuetify:locale")),
      }))
    : { primevue: app.config.globalProperties.$primevue, config: JSON.stringify(app.config.globalProperties.$primevue.config) };
const hasProvider = (app: ReturnType<typeof createApp>) =>
  framework === "vuetify"
    ? app.runWithContext(() => inject(Symbol.for("vuetify:theme"), null)) !== null
    : Boolean(app.config.globalProperties.$primevue);
const context = (app: ReturnType<typeof createApp>) => app.runWithContext(() => inject(WAKEB_CONTEXT, null)) as WakebContext | null;
const codeOf = (action: () => unknown) => {
  try {
    action();
  } catch (error) {
    return (error as { code?: string }).code;
  }
  return undefined;
};

describe(`createWakebComponents (${framework})`, () => {
  it("is side-effect free and exposes framework and capability metadata", () => {
    const plugin = wakeb();
    expect(plugin.framework).toBe(framework);
    expect(plugin.capabilities).toEqual({ version: 1, framework, components: [...SUPPORTED[framework]] });
    expect(Object.isFrozen(plugin.capabilities)).toBe(true);
  });

  it.each([
    [{}, "framework must be one of"],
    [{ framework: "react" }, "received \"react\""],
    [{ framework, theme: "dark" }, "Unknown option 'theme'"],
    [{ framework, locale: "fr" }, "locale must be"],
    [{ framework, providerOptions: { kind: other } }, `providerOptions.kind must be '${framework}'`],
    [{ framework, providerOptions: { kind: framework, mode: "always" } }, "providerOptions.mode must be one of"],
    [{ framework, providerOptions: { kind: framework, mode: "reuse", options: {} } }, "cannot be combined with mode 'reuse'"],
  ])("rejects invalid configuration %j with WAKEB_CONFIG_INVALID", (options, message) => {
    expect(() => createWakebComponents(options as unknown as WakebComponentsOptions)).toThrow(message);
    expect(codeOf(() => createWakebComponents(options as unknown as WakebComponentsOptions))).toBe("WAKEB_CONFIG_INVALID");
  });

  it("fails when the runtime selection differs from the compiled provider", () => {
    const app = createApp({ render: () => null });
    expect(codeOf(() => app.use(createWakebComponents({ framework: other })))).toBe("WAKEB_FRAMEWORK_MISMATCH");
  });

  it("fails a rendered component without the plugin", () => {
    expect(codeOf(() => mount(WButton, { props: { title: "x" }, global: { plugins: [] } }))).toBe("WAKEB_CONTEXT_MISSING");
  });
});

describe(`host provider modes (${framework})`, () => {
  it("auto reuses a host installed first and leaves its state untouched", () => {
    const app = createApp({ render: () => null });
    installHost(app);
    const before = hostState(app);
    app.use(wakeb());
    expect(context(app)?.providerReused).toBe(true);
    expect(hostState(app)).toEqual(before);
    if (framework === "vuetify") for (const [key, value] of Object.entries(before)) expect(hostState(app)[key as never]).toBe(value);
  });

  it("auto installs the provider when the app has none", () => {
    const app = createApp({ render: () => null });
    app.use(wakeb());
    expect(context(app)?.providerReused).toBe(false);
    expect(hasProvider(app)).toBe(true);
  });

  it("reuse requires the host to be installed before Wakeb", () => {
    const app = createApp({ render: () => null });
    const plugin = wakeb({ providerOptions: { kind: framework, mode: "reuse" } } as never);
    expect(() => app.use(plugin)).toThrow("before app.use(wakeb)");
    expect(codeOf(() => createApp({ render: () => null }).use(plugin))).toBe("WAKEB_HOST_PROVIDER_MISSING");
    const ordered = createApp({ render: () => null });
    installHost(ordered);
    ordered.use(plugin);
    expect(context(ordered)?.providerReused).toBe(true);
  });

  it("install refuses an existing host instance and auto refuses ignored native options", () => {
    const app = createApp({ render: () => null });
    installHost(app);
    expect(codeOf(() => app.use(wakeb({ providerOptions: { kind: framework, mode: "install" } } as never)))).toBe("WAKEB_INSTALL_CONFLICT");
    expect(codeOf(() => app.use(wakeb({ providerOptions: { kind: framework, options: { ripple: true } } } as never)))).toBe(
      "WAKEB_CONFIG_INVALID",
    );
  });

  it("keeps one plugin object isolated across two apps on one page", () => {
    const plugin = wakeb();
    const withHost = createApp({ render: () => null });
    installHost(withHost);
    const bare = createApp({ render: () => null });
    withHost.use(plugin);
    bare.use(plugin);
    expect(context(withHost)?.providerReused).toBe(true);
    expect(context(bare)?.providerReused).toBe(false);
    expect(context(withHost)).not.toBe(context(bare));
  });

  it("is idempotent for the same plugin and rejects a second Wakeb plugin on one app", () => {
    const app = createApp({ render: () => null });
    const plugin = wakeb();
    app.use(plugin);
    expect(() => plugin.install(app)).not.toThrow();
    expect(codeOf(() => app.use(wakeb()))).toBe("WAKEB_INSTALL_CONFLICT");
  });
});

describe(`capability coverage (${framework})`, () => {
  it("renders supported components and fails unsupported ones with a stable code", () => {
    const view = defineComponent(() => () => h(WTabs, { tabs: [{ slot: "a", label: "A" }] }));
    const attempt = () => mount(view, { global: { plugins: [installHostPlugin(), wakeb()] } });
    if (SUPPORTED[framework].includes("WTabs")) expect(attempt().text()).toContain("A");
    else expect(codeOf(attempt)).toBe("WAKEB_COMPONENT_UNSUPPORTED");
  });
});

function installHostPlugin() {
  return framework === "vuetify" ? createVuetify() : ([PrimeVue, { theme: "none" }] as never);
}
