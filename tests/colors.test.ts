import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WAvatarStack, WBadge, WBadgeStack, WBaseSidebar, WLoading, WPageSkeleton, WSegmentedProgress } from "../src";
import { intentColor, isCssColor, useColor, useSkeleton } from "../src/core/vocabulary";
import { framework, wakeb } from "./wakeb";

/* Portable intents, color props and the skeleton grammar (SPEC R16, R23). */
const host = () => (framework === "vuetify" ? createVuetify() : ([PrimeVue, { theme: "none" }] as const));
const render = (component: unknown, props: Record<string, unknown> = {}, plugin = wakeb()) =>
  mount(component as never, { attachTo: document.body, props, global: { plugins: [host() as never, plugin] } });
const warnings = () => vi.mocked(console.warn).mock.calls.map(([message]) => String(message));
/** Runs a vocabulary hook inside a Wakeb app and returns what it produced. */
const inApp = <T,>(hook: () => T): T => {
  let result!: T;
  render(defineComponent({ setup: () => ((result = hook()), () => h("i")) }));
  return result;
};

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
enableAutoUnmount(afterEach);

describe("color values", () => {
  it.each(["#fff", "#12b76aff", "rgb(1 2 3)", "rgba(1,2,3,.5)", "hsl(10 50% 50%)", "oklch(0.7 0.1 200)", "color-mix(in srgb, red 20%, white)", "var(--brand)", "var(--brand, #000)", "transparent", "currentColor"])(
    "accepts the CSS color %s",
    (value) => expect(isCssColor(value)).toBe(true),
  );

  it.each(["red", "red-darken-2", "error", "#ggg", "url(x)", "var(brand)", "rgb(1,2,3);color:red"])("rejects %s as a CSS color", (value) =>
    expect(isCssColor(value)).toBe(false),
  );

  it("resolves an intent to its token, then the provider bridge, then the Wakeb fallback", () => {
    expect(intentColor("danger")).toBe("var(--wakeb-ui-danger, #f04438)");
    expect(intentColor("danger", { danger: "rgb(var(--v-theme-error))" })).toBe("var(--wakeb-ui-danger, rgb(var(--v-theme-error)))");
  });

  it("keeps provider names only where the adapter accepts them, with one warning each", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const [native, portable] = inApp(() => [useColor("WX", {}, true), useColor("WY")] as const);
    expect(native("red-darken-2", "color", "primary")).toEqual({ css: "red-darken-2", native: "red-darken-2" });
    expect(native("red-darken-2", "color", "primary").native).toBe("red-darken-2");
    expect(portable("red-darken-2", "color", "primary")).toEqual({ css: "var(--wakeb-ui-primary, #087f8c)" });
    expect(portable("", "color", "")).toEqual({ css: "" });
    expect(warnings()).toEqual([
      "[WAKEB_DEPRECATED_VALUE] WX color 'red-darken-2' is a provider color name and is not portable; use an intent (primary, secondary, success, warning, danger, info, neutral) or a CSS color. Provider names are removed in the next major release.",
      "[WAKEB_UNKNOWN_VALUE] WY color 'red-darken-2' is not a Wakeb intent or CSS color; using 'primary'. Use one of: primary, secondary, success, warning, danger, info, neutral, #hex, rgb(), hsl() or var(--…).",
    ]);
  });

  it("accepts intent theme tokens", () => {
    const w = render(WLoading, { color: "success" }, wakeb({ theme: { tokens: { success: "#00aa55", neutral: "var(--gray)" } } }));
    expect(w.attributes("style")).toContain("--wakeb-ui-success: #00aa55");
    expect(() => wakeb({ theme: { tokens: { danger: "red;" } } })).toThrow(/theme.tokens.danger must be a CSS color/);
  });
});

describe(`WLoading color (${framework})`, () => {
  const spinner = (w: ReturnType<typeof render>) =>
    w.get(framework === "vuetify" ? ".v-progress-circular" : ".p-progressspinner").attributes("style") ?? "";

  it("maps an intent to the Wakeb token over the provider theme", () => {
    const style = spinner(render(WLoading, { color: "danger" }));
    expect(style).toContain(framework === "vuetify" ? "var(--wakeb-ui-danger, rgb(var(--v-theme-error)))" : "var(--wakeb-ui-danger, #f04438)");
  });

  it("defaults to the primary intent", () => {
    expect(spinner(render(WLoading))).toContain(framework === "vuetify" ? "var(--wakeb-ui-primary, rgb(var(--v-theme-primary)))" : "var(--wakeb-ui-primary, var(--p-primary-color))");
  });

  it("passes a CSS color through", () => {
    expect(spinner(render(WLoading, { color: "#123456" }))).toMatch(/#123456|rgb\(18, 52, 86\)/);
  });

  it("handles a provider palette name per the deprecation policy", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = render(WLoading, { color: "red-darken-2" });
    if (framework === "vuetify") {
      expect(w.get(".v-progress-circular").classes()).toContain("text-red-darken-2");
      expect(warnings()[0]).toMatch(/^\[WAKEB_DEPRECATED_VALUE\] WLoading color 'red-darken-2'/);
    } else {
      expect(spinner(w)).toContain("var(--wakeb-ui-primary, var(--p-primary-color))");
      expect(warnings()[0]).toMatch(/^\[WAKEB_UNKNOWN_VALUE\] WLoading color 'red-darken-2'/);
    }
  });

  it("stays silent in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(WLoading, { color: "red-darken-2" });
    expect(warnings()).toEqual([]);
  });
});

describe.runIf(framework === "vuetify")("Vuetify color props", () => {
  it("paints avatars with Wakeb CSS for intents and keeps Vuetify names as classes", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const items = [{ id: 1, name: "Ali Lee" }];
    const portable = render(WAvatarStack, { items, avatarColor: "success" }).get(".v-avatar");
    expect(portable.attributes("style")).toContain("var(--wakeb-ui-success, rgb(var(--v-theme-success)))");
    expect(portable.classes().some((name) => name.startsWith("bg-"))).toBe(false);
    const native = render(WAvatarStack, { items, avatarColor: "deep-purple" }).get(".v-avatar");
    expect(native.classes()).toContain("bg-deep-purple");
    expect(warnings()).toHaveLength(1);
  });

  it("does not forward Wakeb badge types to Vuetify as colors", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const chip = render(WBadge, { label: "Ok", type: "success" }).get(".v-chip");
    expect(chip.classes()).toContain("success");
    expect(chip.classes().some((name) => /^(text|bg)-success$/.test(name))).toBe(false);
    expect(warnings()).toEqual([]);
  });

  it("forwards a non-Wakeb badge type as a deprecated Vuetify color", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const chip = render(WBadge, { label: "Odd", type: "teal" }).get(".v-chip");
    expect(chip.classes()).toContain("text-teal");
    expect(warnings()).toEqual([
      "[WAKEB_DEPRECATED_VALUE] WBadge type 'teal' is not a Wakeb badge type; it is passed to Vuetify as a color name, which is not portable. Use one of: success, success-transparent, primary, primarybtn, danger, danger-transparent, warning, info, transparent, dark, tertiary, outline, outline-secondary, check, uncheck. Provider names are removed in the next major release.",
    ]);
  });

  it("marks the portable variant on the badge root", () => {
    expect(render(WBadge, { label: "Fill", variant: "solid" }).get(".v-chip").classes()).toContain("wakeb-badge--solid");
  });

  it("resolves dot and stack icon colors", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const badge = render(WBadge, { label: "Dot", isDot: true, dotColor: "warning" });
    expect(badge.get(".dot").attributes("style")).toContain("var(--wakeb-ui-warning, #f79009)");
    const stack = render(WBadgeStack, {
      max: 2,
      iconVariant: "circle",
      items: [{ id: 1, label: "A", icon: "/a.svg", color: "info" }, { id: 2, label: "B", icon: "/b.svg", color: "grey" }],
    });
    const icons = stack.findAll(".badge-stack__icon-wrap").map((icon) => icon.attributes("style") ?? "");
    expect(icons).toHaveLength(2);
    expect(icons[0]).toContain("var(--wakeb-ui-info, #2e90fa)");
    expect(icons[1]).toContain("var(--wakeb-badge-stack-icon-background, #087f8c)");
    expect(warnings()).toEqual([expect.stringMatching(/^\[WAKEB_UNKNOWN_VALUE\] WBadgeStack items\[\]\.color 'grey'/)]);
  });

  it("resolves WSegmentedProgress intents", () => {
    const w = render(WSegmentedProgress, { value: 40, color: "info" });
    expect(w.html()).toContain("var(--wakeb-ui-info, #2e90fa)");
  });
});

describe("skeleton grammar", () => {
  const parse = (value: string | undefined, native = false) => inApp(() => useSkeleton("WX", native))(value, "type");

  it.each([
    [undefined, "text"],
    ["", "text"],
    ["card", "card"],
    [" heading , list-item-avatar@3 ,text ", "heading, list-item-avatar@3, text"],
    ["table-row@1", "table-row"],
    ["paragraph@250", "paragraph@100"],
  ])("normalizes %j to %j", (value, expected) => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parse(value)).toBe(expected);
  });

  it("drops unknown names and malformed repetitions with a warning", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parse("card, sparkles, text@0, text@x, chip")).toBe("card, chip");
    expect(warnings()).toHaveLength(3);
    expect(warnings()[0]).toMatch(/^\[WAKEB_UNKNOWN_VALUE\] WX type 'sparkles' is not a Wakeb skeleton/);
  });

  it("keeps Vuetify-only names only where the adapter accepts them", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parse("article, text", true)).toBe("article, text");
    expect(parse("article, text")).toBe("text");
    expect(warnings()[0]).toMatch(/^\[WAKEB_DEPRECATED_VALUE\] WX type 'article' is a Vuetify skeleton name/);
  });

  it.runIf(framework === "vuetify")("applies to WBaseSidebar skeletonType and WPageSkeleton items", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const sidebar = render(WBaseSidebar, { loading: true, skeletonType: "list-item@2, bogus" });
    expect(sidebar.findAll(".v-skeleton-loader__list-item")).toHaveLength(2);
    const page = render(WPageSkeleton, { config: [{ items: [{ type: "chip@500" }] }] });
    expect(page.findAll(".v-skeleton-loader__chip")).toHaveLength(100);
  });
});

describe.runIf(framework === "vuetify")("skeleton grid", () => {
  const classes = (row: Record<string, unknown>) =>
    render(WPageSkeleton, { config: [{ items: [], ...row }] }).get(".wakeb-grid-col").classes().filter((name) => name.startsWith("wakeb-grid-col--"));

  it.each([
    [{}, ["wakeb-grid-col--12"]],
    [{ cols: 0 }, ["wakeb-grid-col--12"]],
    [{ cols: false }, ["wakeb-grid-col--12"]],
    [{ cols: 4 }, ["wakeb-grid-col--4"]],
    [{ cols: "6" }, ["wakeb-grid-col--6"]],
    [{ cols: "auto" }, ["wakeb-grid-col--auto"]],
    [{ cols: true }, ["wakeb-grid-col--grow"]],
    [{ cols: 12, sm: 6, md: "auto", lg: true }, ["wakeb-grid-col--12", "wakeb-grid-col--sm-6", "wakeb-grid-col--md-auto", "wakeb-grid-col--lg-grow"]],
    [{ sm: false, md: "" }, ["wakeb-grid-col--12"]],
  ])("maps %j to Wakeb grid classes", (row, expected) => expect(classes(row)).toEqual(expected));

  it("ignores spans outside 1–12 with a warning", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(classes({ cols: 13, md: 0.5 })).toEqual(["wakeb-grid-col--12"]);
    expect(warnings()).toHaveLength(2);
    expect(warnings()[0]).toMatch(/^\[WAKEB_UNKNOWN_VALUE\] WPageSkeleton config\[\]\.cols 13 is not a grid span; using 12/);
  });

  it("does not render Vuetify grid components", () => {
    const w = render(WPageSkeleton, { config: [{ items: [], cols: 6 }] });
    expect(w.find(".v-row").exists()).toBe(false);
    expect(w.find(".v-col-6").exists()).toBe(false);
  });

  it("uses the fixed Wakeb breakpoints", async () => {
    const { readFileSync } = await import("node:fs");
    const css = readFileSync("src/styles/grid.css", "utf8");
    expect([...css.matchAll(/@media \(min-width: (\d+)px\)/g)].map((match) => Number(match[1]))).toEqual([600, 960, 1280]);
  });
});
