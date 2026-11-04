import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick } from "vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WButton, WDropdown, WLoading, WModal, type WakebComponentsOptions } from "../src";
import { warnOnce, type WakebContext } from "../src/core/runtime";
import { framework, wakeb } from "./wakeb";

/* Plugin defaults, built-in locale strings and theme scope (SPEC R05, R06, R17), run on each provider. */
const host = () => (framework === "vuetify" ? createVuetify() : ([PrimeVue, { theme: "none" }] as const));
const render = (component: unknown, options: Partial<WakebComponentsOptions>, mountOptions: Record<string, unknown> = {}) =>
  mount(component as never, {
    attachTo: document.body,
    global: { plugins: [host() as never, wakeb(options)], stubs: { transition: false } },
    ...mountOptions,
  });
const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
};
const invalid = (options: Record<string, unknown>) => () => wakeb(options as Partial<WakebComponentsOptions>);
afterEach(() => {
  document.body.innerHTML = "";
});
// Open overlays register in provider stacks; unmount first (after hooks run in reverse) so stacking starts clean.
enableAutoUnmount(afterEach);

describe(`plugin defaults (${framework})`, () => {
  const defaults = { WButton: { size: "md", title: "Plugin", disabled: true } };

  it("applies plugin defaults only to props the caller left absent", () => {
    const w = render(WButton, { defaults });
    const button = w.get("button");
    expect(button.classes()).toContain("btn--md");
    expect(button.text()).toContain("Plugin");
    expect(button.element.disabled).toBe(true);
  });

  it("keeps explicit false, empty string and Boolean attribute casting", () => {
    expect(render(WButton, { defaults }, { props: { disabled: false } }).get("button").element.disabled).toBe(false);
    expect(render(WButton, { defaults }, { props: { title: "", icon: "$close" } }).get("button").text()).not.toContain("Plugin");
    const cast = render(defineComponent(() => () => h(WButton, { disabled: "" })), { defaults: { WButton: { disabled: false } } });
    expect(cast.get("button").element.disabled).toBe(true);
  });

  it("treats undefined as absent and falls back to the plugin default", () => {
    const w = render(WButton, { defaults }, { props: { title: undefined, size: undefined } });
    expect(w.get("button").text()).toContain("Plugin");
    expect(w.get("button").classes()).toContain("btn--md");
  });

  it("falls back to the Wakeb default when neither the caller nor the plugin sets a prop", () => {
    const w = render(WButton, { defaults: { WButton: { title: "Only title" } } });
    expect(w.get("button").classes()).toEqual(expect.arrayContaining(["btn--primary", "btn--lg"]));
    expect(w.get("button").attributes("type")).toBe("button");
  });

  it("copies mutable defaults per instance and detaches them from the source config", () => {
    const wrapperAttrs = { "data-source": "plugin" };
    const options = { defaults: { WButton: { title: "Copy", wrapperAttrs } } };
    const plugin = wakeb(options);
    wrapperAttrs["data-source"] = "mutated";
    const w = mount(
      defineComponent(() => () => [h(WButton), h(WButton)]),
      { attachTo: document.body, global: { plugins: [host() as never, plugin] } },
    );
    const wrappers = w.findAll("[data-source]");
    expect(wrappers.map((item) => item.attributes("data-source"))).toEqual(["plugin", "plugin"]);
    const [first, second] = w.findAllComponents({ name: "WButton" }).filter((item) => item.vm.$.type !== WButton);
    expect(first.props("wrapperAttrs")).not.toBe(second.props("wrapperAttrs"));
  });

  it.each([
    [{ defaults: { WDropdown: { modelValue: "x" } } }, "defaults.WDropdown.modelValue is data or model state"],
    [{ defaults: { WDropdown: { menuItems: [] } } }, "defaults.WDropdown.menuItems is data or model state"],
    [{ defaults: { WButton: { onClick: () => {} } } }, "is an event listener"],
    [{ defaults: { WDropdown: { labelFormatter: (value: string) => value } } }, "is a callback"],
    [{ defaults: { WButton: { title: undefined } } }, "which means absent"],
    [{ defaults: { WSelect: {} } }, "defaults.WSelect is not a Wakeb component"],
    [{ defaults: { WButton: "md" } }, "defaults.WButton must be an object"],
    [{ defaults: [] }, "defaults must be an object"],
  ])("rejects invalid defaults %#", (options, message) => {
    expect(invalid(options)).toThrow(message);
    try {
      invalid(options)();
    } catch (error) {
      expect((error as { code: string }).code).toBe("WAKEB_CONFIG_INVALID");
    }
  });
});

describe(`built-in locale strings (${framework})`, () => {
  it("uses Arabic strings for unset labels", () => {
    expect(render(WLoading, { locale: "ar" }).get('[role="status"]').attributes("aria-label")).toBe("جارٍ التحميل");
    expect(render(WLoading, {}).get('[role="status"]').attributes("aria-label")).toBe("Loading");
  });

  it("lets plugin defaults and explicit props override localized strings", () => {
    const plugin = render(WLoading, { locale: "ar", defaults: { WLoading: { label: "Plugin label" } } });
    expect(plugin.get('[role="status"]').attributes("aria-label")).toBe("Plugin label");
    const explicit = render(WLoading, { locale: "ar", defaults: { WLoading: { label: "Plugin label" } } }, { props: { label: "Mine" } });
    expect(explicit.get('[role="status"]').attributes("aria-label")).toBe("Mine");
  });

  it("names the dialog and its close button in Arabic", async () => {
    render(WModal, { locale: "ar" }, { props: { modelValue: true } });
    await settle();
    const dialog = document.querySelector('[role="dialog"]')!;
    expect(dialog.getAttribute("aria-label")).toBe("نافذة حوار");
    expect(dialog.querySelector('[aria-label="إغلاق"]')).not.toBeNull();
  });
});

describe(`theme and direction scope (${framework})`, () => {
  const theme = { mode: "dark" as const, tokens: { primary: "#123456", radius: "6px", zIndexOverlay: 3100 } };

  it("adds nothing to the DOM when theme and direction are not configured", () => {
    const button = render(WButton, {}, { props: { title: "Plain" } }).get("button");
    expect(button.attributes("data-wakeb-theme")).toBeUndefined();
    expect(button.attributes("dir")).toBeUndefined();
    expect(button.attributes("style") ?? "").not.toContain("--wakeb-ui");
  });

  it("writes tokens, mode and direction on component roots while caller styles win", () => {
    const w = render(WButton, { theme, direction: "rtl" }, { props: { title: "Themed" }, attrs: { style: "--wakeb-ui-radius: 2px" } });
    const button = w.get("button").element as HTMLElement;
    expect(button.style.getPropertyValue("--wakeb-ui-primary")).toBe("#123456");
    expect(button.style.getPropertyValue("--wakeb-ui-radius")).toBe("2px");
    expect(button.getAttribute("data-wakeb-theme")).toBe("dark");
    expect(button.getAttribute("dir")).toBe("rtl");
  });

  it("carries the scope and overlay z-index into teleported menu content", async () => {
    const w = render(WDropdown, { theme, direction: "rtl" }, { props: { title: "Status", menuItems: [{ label: "Done", value: 1 }] } });
    await w.get("button").trigger("click");
    await vi.waitFor(() => expect(document.querySelector('[role="menu"]')).not.toBeNull());
    const menu = document.querySelector('[role="menu"]')!;
    const scoped = menu.closest<HTMLElement>("[data-wakeb-theme]");
    expect(scoped).not.toBeNull();
    expect(w.element.contains(scoped)).toBe(false);
    expect(scoped!.getAttribute("dir")).toBe("rtl");
    expect(scoped!.style.getPropertyValue("--wakeb-ui-primary")).toBe("#123456");
    expect(scoped!.style.zIndex).toBe("3100");
  });

  it("keeps two apps with different themes isolated", () => {
    const mountApp = (primary: string) => {
      const root = document.createElement("div");
      document.body.append(root);
      createApp(() => h(WButton, { title: primary }))
        .use(host() as never)
        .use(wakeb({ theme: { tokens: { primary } } }))
        .mount(root);
      return root.querySelector("button")!;
    };
    expect(mountApp("#111111").style.getPropertyValue("--wakeb-ui-primary")).toBe("#111111");
    expect(mountApp("#222222").style.getPropertyValue("--wakeb-ui-primary")).toBe("#222222");
  });

  it.each([
    [{ theme: { mode: "dim" } }, "theme.mode must be 'light' or 'dark'"],
    [{ theme: { tokens: { primary: "red; background: url(x)" } } }, "theme.tokens.primary must be a CSS color value"],
    [{ theme: { tokens: { radius: "big" } } }, "theme.tokens.radius must be a CSS length value"],
    [{ theme: { tokens: { zIndexOverlay: "10" } } }, "theme.tokens.zIndexOverlay must be an integer"],
    [{ theme: { tokens: { shadow: "none" } } }, "Unknown token 'shadow'"],
    [{ theme: { palette: {} } }, "Unknown theme option 'palette'"],
  ])("rejects malformed theme values %#", (options, message) => {
    expect(invalid(options)).toThrow(message);
  });

  it("reports the icons option as an unsupported capability", () => {
    expect(invalid({ icons: () => null })).toThrow("WAKEB_CAPABILITY_UNSUPPORTED");
  });
});

describe("development warnings", () => {
  it("warns once per app and key", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const context = { warned: new Set<string>() } as unknown as WakebContext;
    warnOnce(context, "WAKEB_DEPRECATED_VALUE", "WBadge.variant.tonal", "Use 'soft'.");
    warnOnce(context, "WAKEB_DEPRECATED_VALUE", "WBadge.variant.tonal", "Use 'soft'.");
    warnOnce(context, "WAKEB_DEPRECATED_VALUE", "WBadge.variant.flat", "Use 'solid'.");
    expect(warn.mock.calls.map(([message]) => message)).toEqual([
      "[WAKEB_DEPRECATED_VALUE] Use 'soft'.",
      "[WAKEB_DEPRECATED_VALUE] Use 'solid'.",
    ]);
    warn.mockRestore();
  });
});
