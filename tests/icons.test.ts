import { afterEach, describe, expect, it, vi } from "vitest";
import { createSSRApp, defineComponent, h } from "vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WButton, WDropdown, type WakebComponentsOptions, type WakebIconsOptions } from "../src";
import { BUILTIN_ICONS, FALLBACK_ICON, NO_ICONS, resolveIcon, validateIcons } from "../src/core/icons";
import { framework, wakeb } from "./wakeb";

/* Wakeb-owned icons and the `icons` resolver option (SPEC R15), run on each provider. */
const host = () => (framework === "vuetify" ? createVuetify() : ([PrimeVue, { theme: "none" }] as const));
const render = (props: Record<string, unknown>, options: Partial<WakebComponentsOptions> = {}, component: unknown = WButton) =>
  mount(component as never, { attachTo: document.body, props, global: { plugins: [host() as never, wakeb(options)] } });
const paths = (w: ReturnType<typeof render>) => w.findAll("svg path").map((path) => path.attributes("d"));
const warnings = () => vi.mocked(console.warn).mock.calls.map(([message]) => String(message));
const BRAND = "M2,2H22V22H2Z";
const Glyph = defineComponent({ name: "BrandGlyph", setup: () => () => h("svg", { class: "brand-glyph" }) });

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
enableAutoUnmount(afterEach);

describe("icon resolution order", () => {
  it("resolves svg: strings, aliases, then the resolver, then built-ins, and leaves other names unresolved", () => {
    const resolve = vi.fn((name: string) => (name === "brand-from-resolver" ? Glyph : undefined));
    const registry = validateIcons({ aliases: { brand: [BRAND], $close: [BRAND] }, resolve });
    expect(resolveIcon(registry, "svg:M1,1L2,2")).toEqual({ kind: "svg", paths: ["M1,1L2,2"] });
    expect(resolveIcon(registry, "brand")).toEqual({ kind: "svg", paths: [BRAND] });
    expect(resolveIcon(registry, "$close")).toEqual({ kind: "svg", paths: [BRAND] });
    expect(resolveIcon(registry, "brand-from-resolver")).toEqual({ kind: "component", component: Glyph });
    expect(resolveIcon(registry, "$expand")).toEqual({ kind: "svg", paths: BUILTIN_ICONS.$expand });
    expect(resolveIcon(registry, "mdi-check")).toEqual({ kind: "name", name: "mdi-check" });
    expect(resolveIcon(registry, "")).toBeUndefined();
    expect(resolve).not.toHaveBeenCalledWith("brand");
    expect(resolve).toHaveBeenCalledWith("$expand");
  });

  it("ships built-ins for chevrons, close, loading and toggles", () => {
    expect(Object.keys(BUILTIN_ICONS)).toEqual(
      expect.arrayContaining(["$expand", "$collapse", "$prev", "$next", "$close", "$loading", "$checkboxOn", "$checkboxOff", "$radioOn", "$radioOff"]),
    );
    expect(resolveIcon(NO_ICONS, "toString")).toEqual({ kind: "name", name: "toString" });
    expect(resolveIcon(NO_ICONS, "constructor")).toEqual({ kind: "name", name: "constructor" });
  });

  it("detaches aliases from the caller's objects", () => {
    const aliases: Record<string, string[]> = { brand: [BRAND] };
    const registry = validateIcons({ aliases } as WakebIconsOptions);
    aliases.brand.push("M0,0Z");
    aliases.other = [BRAND];
    expect(registry.aliases.brand).toEqual([BRAND]);
    expect(registry.aliases.other).toBeUndefined();
    expect(Object.isFrozen(registry.aliases)).toBe(true);
  });
});

describe(`icon rendering (${framework})`, () => {
  it("renders the built-in chevron for the dropdown indicator without an icon font", () => {
    const w = render({ title: "Menu", isDropdown: true });
    expect(paths(w)).toContain(BUILTIN_ICONS.$expand[0]);
  });

  it("renders configured aliases and lets them replace a built-in", () => {
    const w = render({ title: "Brand", icon: "brand", isDropdown: true }, { icons: { aliases: { brand: [[BRAND, 0.5]], $expand: ["M1,1L3,3Z"] } } });
    const brand = w.findAll("svg path").find((path) => path.attributes("d") === BRAND)!;
    expect(brand.attributes("fill-opacity")).toBe("0.5");
    expect(paths(w)).toContain("M1,1L3,3Z");
    expect(paths(w)).not.toContain(BUILTIN_ICONS.$expand[0]);
  });

  it("renders resolver components, svg: strings and path lists", () => {
    const resolve = vi.fn((name: string) => (name === "brand" ? Glyph : undefined));
    expect(render({ icon: "brand" }, { icons: { resolve } }).find(".brand-glyph").exists()).toBe(true);
    expect(resolve).toHaveBeenCalledWith("brand");
    expect(paths(render({ icon: "svg:M5,5L6,6Z" }))).toContain("M5,5L6,6Z");
    expect(paths(render({ icon: [BRAND] }))).toContain(BRAND);
    expect(render({ icon: Glyph }).find(".brand-glyph").exists()).toBe(true);
  });

  it("resolves the WDropdown activator icon and its default chevron", () => {
    const options = { icons: { aliases: { brand: [BRAND] } } };
    expect(paths(render({ title: "Open", icon: "brand" }, options, WDropdown))).toContain(BRAND);
    expect(paths(render({ title: "Open" }, options, WDropdown))).toContain(BUILTIN_ICONS.$expand[0]);
  });

  it("ignores a resolver result that is neither SVG path data nor a component", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const resolve = (() => "<svg></svg>") as unknown as WakebIconsOptions["resolve"];
    const w = render({ title: "Menu", isDropdown: true }, { icons: { resolve } });
    expect(paths(w)).toContain(BUILTIN_ICONS.$expand[0]);
    expect(w.html()).not.toContain("&lt;svg");
    expect(warnings()).toEqual([
      "[WAKEB_ICON_UNRESOLVED] icons.resolve('$expand') returned a value that is neither SVG path data nor a Vue component; it is ignored.",
    ]);
  });

  it("keeps apps and SSR requests isolated", async () => {
    const { renderToString } = await import("vue/server-renderer");
    const request = (path: string) =>
      renderToString(
        createSSRApp(() => h(WButton, { icon: "brand" }))
          .use(host() as never)
          .use(wakeb({ icons: { aliases: { brand: [path] } } })),
      );
    const [first, second] = await Promise.all([request("M1,1H9Z"), request("M2,2H8Z")]);
    expect(first).toContain('d="M1,1H9Z"');
    expect(first).not.toContain("M2,2H8Z");
    expect(second).toContain('d="M2,2H8Z"');
    expect(second).not.toContain("M1,1H9Z");
  });
});

describe(`unresolved icon names (${framework})`, () => {
  if (framework === "vuetify") {
    it("keeps Vuetify names on the host Vuetify icon set without a warning", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const w = render({ icon: "mdi-check" });
      expect(w.get(".v-icon").classes()).toContain("mdi-check");
      expect(w.find(".wakeb-icon--fallback").exists()).toBe(false);
      expect(warn.mock.calls.some(([message]) => String(message).includes("WAKEB_ICON_UNRESOLVED"))).toBe(false);
    });
  } else {
    it("renders the fallback box and warns once per app and name", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      const w = mount(
        defineComponent({ setup: () => () => [h(WButton, { icon: "mdi-check" }), h(WButton, { icon: "mdi-check" })] }),
        { attachTo: document.body, global: { plugins: [host() as never, wakeb()] } },
      );
      const fallbacks = w.findAll(".wakeb-icon--fallback");
      expect(fallbacks).toHaveLength(2);
      expect(fallbacks[0].findAll("path").map((path) => path.attributes("d"))).toEqual([FALLBACK_ICON[0][0], FALLBACK_ICON[1]]);
      expect(w.find("i.mdi").exists()).toBe(false);
      expect(warnings()).toEqual([
        "[WAKEB_ICON_UNRESOLVED] Icon 'mdi-check' is not resolved under the primevue provider; rendering the Wakeb fallback box. Add it to the icons.aliases or icons.resolve plugin option, or pass SVG path data or a Vue component.",
      ]);
    });

    it("keeps PrimeIcons class names, the PrimeVue icon set", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const w = render({ icon: "pi pi-check" });
      expect(w.get("i.wakeb-icon").classes()).toEqual(expect.arrayContaining(["pi", "pi-check"]));
      expect(warn).not.toHaveBeenCalled();
    });

    it("stays silent in production but still renders the fallback", () => {
      vi.stubEnv("NODE_ENV", "production");
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(render({ icon: "$unknownAlias" }).find(".wakeb-icon--fallback").exists()).toBe(true);
      expect(warn).not.toHaveBeenCalled();
    });
  }
});
