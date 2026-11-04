import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { enableAutoUnmount, mount, type VueWrapper } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WBadge, WButton, WTooltipBtn, WTruncatedText, WUserBadge, type WakebComponentsOptions } from "../src";
import { framework, shadcnHost, wakeb } from "./wakeb";

/*
 * Shared contract for WTruncatedText, WTooltipBtn, WBadge and WUserBadge (SPEC R12, R14, R17, R18, R23),
 * run once per provider project. Queries use roles, Wakeb classes and native elements; the only
 * provider-specific data are the R23 native mapping tables, which is what they document.
 */
const vuetify = framework === "vuetify";
const shadcn = framework === "shadcn";
const host = () => (vuetify ? createVuetify() : shadcn ? shadcnHost : ([PrimeVue, { theme: "none" }] as const));
const render = (component: unknown, options: Record<string, unknown> = {}, plugin: Partial<WakebComponentsOptions> = {}) =>
  mount(component as never, {
    attachTo: document.body,
    global: { plugins: [host() as never, wakeb(plugin)], stubs: { transition: false } },
    ...options,
  });
const warnings = () => vi.mocked(console.warn).mock.calls.map(([message]) => String(message));
const portableAttrs = (listener: () => void) => ({
  class: "caller-class",
  style: { outline: "1px solid red" },
  id: "caller-id",
  "data-test": "caller",
  "aria-describedby": "caller-help",
  onMouseenter: listener,
});
const expectPortableTarget = (element: Element) => {
  expect(element.classList.contains("caller-class")).toBe(true);
  expect((element as HTMLElement).style.outline).toContain("red");
  expect(element.id).toBe("caller-id");
  expect(element.getAttribute("aria-describedby")).toBe("caller-help");
  expect(document.querySelectorAll('[data-test="caller"]')).toHaveLength(1);
};
/** Shown tooltips: PrimeVue removes closed ones, Vuetify keeps them with display: none. */
const shown = () =>
  [...document.querySelectorAll<HTMLElement>('[role="tooltip"]')].filter(
    (node) => node.style.display !== "none" && !node.querySelector('[style*="display: none"]'),
  );
const rendered = () => [...document.querySelectorAll<HTMLElement>('[role="tooltip"]')];
/**
 * The open tooltip that shows `text`, outside the component's own DOM. `visible: false` only requires
 * the activated content: under jsdom, Vuetify's activator="parent" tooltip in VBtn (WTooltipBtn)
 * renders its content but keeps it display: none, so visibility there needs a real browser.
 */
const tooltipWith = async (w: VueWrapper, text: string, visible = true) => {
  const find = () => (visible ? shown() : rendered()).find((node) => node.textContent?.includes(text));
  await vi.waitFor(() => expect(find()).toBeDefined());
  const tooltip = find()!;
  expect(w.element.contains(tooltip)).toBe(false);
  return tooltip;
};
const noTooltip = () => expect(shown()).toEqual([]);
/** The teleported element that carries the theme scope: the tooltip or one of its ancestors. */
const scopeOf = (tooltip: HTMLElement) =>
  // reka-ui renders role="tooltip" as a visually hidden copy inside the teleported tooltip root.
  shadcn ? tooltip.closest<HTMLElement>(".wakeb-sc-tooltip")! : (tooltip.closest<HTMLElement>("[data-wakeb-theme]") ?? tooltip);
const focus = async (element: Element) => {
  (element as HTMLElement).focus();
  await nextTick();
};

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});
// Open tooltips register in provider stacks; unmount first so each case starts clean.
enableAutoUnmount(afterEach);

describe(`WTruncatedText contract (${framework})`, () => {
  it("keeps short labels plain and unfocusable", () => {
    const w = render(WTruncatedText, { props: { label: "Short" } });
    const text = w.get(".truncated-text");
    expect(text.element.tagName).toBe("SPAN");
    expect(text.text()).toBe("Short");
    expect(text.attributes("tabindex")).toBeUndefined();
    expect(text.attributes("aria-label")).toBeUndefined();
  });

  it("uses the default length of 12 and an empty default label", async () => {
    const w = render(WTruncatedText);
    expect(w.get(".truncated-text").text()).toBe("");
    await w.setProps({ label: "Exactly twelve" });
    expect(w.get(".truncated-text").text()).toBe("Exactly t...");
  });

  it("truncates with UTF-16 lengths, names the span and makes it focusable", () => {
    const w = render(WTruncatedText, { props: { label: "مرحبا بالعالم", length: 1 } });
    const text = w.get(".truncated-text");
    expect(text.text()).toBe("...");
    expect(text.attributes("aria-label")).toBe("مرحبا بالعالم");
    expect(text.attributes("tabindex")).toBe("0");
  });

  it("passes a reactive { text, label, truncated } default slot payload", async () => {
    const seen: unknown[] = [];
    const w = render(WTruncatedText, {
      props: { label: "abcdefgh", length: 6 },
      slots: { default: (payload: { text: string; truncated: boolean }) => (seen.push(payload), h("strong", `${payload.text}:${payload.truncated}`)) },
    });
    expect(seen.at(-1)).toEqual({ text: "abc...", label: "abcdefgh", truncated: true });
    await w.setProps({ length: 20 });
    expect(w.get("strong").text()).toBe("abcdefgh:false");
    expect(w.get(".truncated-text").attributes("tabindex")).toBeUndefined();
  });

  it("sends attrs and DOM listeners to the span and keeps tabindex and aria-label Wakeb-owned", async () => {
    const enter = vi.fn();
    const w = render(WTruncatedText, {
      props: { label: "A long label to shorten", length: 6 },
      attrs: { ...portableAttrs(enter), tabindex: "-1", "aria-label": "Caller" },
    });
    const text = w.get(".truncated-text").element;
    expectPortableTarget(text);
    expect(text.getAttribute("tabindex")).toBe("0");
    expect(text.getAttribute("aria-label")).toBe("A long label to shorten");
    text.dispatchEvent(new MouseEvent("mouseenter"));
    expect(enter).toHaveBeenCalledTimes(1);
  });

  it("opens the tooltip on keyboard focus, describes the span and composes caller focus listeners", async () => {
    const focused = vi.fn();
    const w = render(WTruncatedText, { props: { label: "A long accessible label", length: 8 }, attrs: { onFocus: focused } });
    const text = w.get(".truncated-text").element;
    await focus(text);
    const tooltip = await tooltipWith(w, "A long accessible label");
    expect(focused).toHaveBeenCalledOnce();
    const described = document.getElementById(text.getAttribute("aria-describedby")!);
    expect(described === tooltip || tooltip.contains(described) || !!described?.contains(tooltip)).toBe(true);
  });

  it("opens the tooltip on hover", async () => {
    const w = render(WTruncatedText, { props: { label: "A long hovered label", length: 8 } });
    await w.get(".truncated-text").trigger("mouseenter");
    await tooltipWith(w, "A long hovered label");
  });

  it("does not open a tooltip for text that fits", async () => {
    const w = render(WTruncatedText, { props: { label: "Fits" } });
    await focus(w.get(".truncated-text").element);
    await w.get(".truncated-text").trigger("mouseenter");
    await new Promise((resolve) => setTimeout(resolve, 20));
    noTooltip();
  });

  it("carries the theme scope into the teleported tooltip and lets tooltipStyle win", async () => {
    const w = render(
      WTruncatedText,
      { props: { label: "A long scoped label", length: 6, tooltipStyle: { "--wakeb-ui-primary": "#abcdef" }, contentClass: "caller-tooltip" } },
      { theme: { mode: "dark", tokens: { primary: "#123456" } }, direction: "rtl" },
    );
    await focus(w.get(".truncated-text").element);
    const tooltip = await tooltipWith(w, "A long scoped label");
    const scope = scopeOf(tooltip);
    expect(scope.getAttribute("data-wakeb-theme")).toBe("dark");
    expect(scope.getAttribute("dir")).toBe("rtl");
    expect(scope.style.getPropertyValue("--wakeb-ui-primary")).toBe("#123456");
    const styled = [scope, ...scope.querySelectorAll<HTMLElement>("*")].find((node) => node.style.getPropertyValue("--wakeb-ui-primary") === "#abcdef");
    expect(styled?.textContent).toContain("A long scoped label");
    expect(document.querySelector(".caller-tooltip")?.textContent).toContain("A long scoped label");
  });

  it("adds no scope to the tooltip when nothing is configured", async () => {
    const w = render(WTruncatedText, { props: { label: "A long unscoped label", length: 6 } });
    await focus(w.get(".truncated-text").element);
    const tooltip = await tooltipWith(w, "A long unscoped label");
    expect(document.querySelector("[data-wakeb-theme]")).toBeNull();
    // reka-ui writes its ConfigProvider direction (default ltr) on popper content (M5-DECISION deviation).
    expect(tooltip.closest("[dir]")?.getAttribute("dir") ?? null).toBe(shadcn ? "ltr" : null);
  });
});

describe(`WTooltipBtn contract (${framework})`, () => {
  /* Draft R23 mapping table per provider: Wakeb variant -> native class on the button. */
  const VARIANT_CLASS = vuetify
    ? { soft: "v-btn--variant-tonal", solid: "v-btn--variant-flat", outline: "v-btn--variant-outlined", ghost: "v-btn--variant-text" }
    : { soft: "wakeb-tooltip-btn--soft", solid: "wakeb-tooltip-btn--solid", outline: "wakeb-tooltip-btn--outline", ghost: "wakeb-tooltip-btn--ghost" };

  it("routes attrs and listeners to the native button and wrapperAttrs to the outer span", async () => {
    const click = vi.fn();
    const enter = vi.fn();
    const w = render(WTooltipBtn, {
      props: { text: "Save profile", icon: "$close", wrapperAttrs: { class: "layout", "data-wrapper": "yes" } },
      attrs: { ...portableAttrs(enter), form: "profile", type: "submit", onClick: click },
    });
    expect(w.element.tagName).toBe("SPAN");
    expect(w.classes()).toEqual(expect.arrayContaining(["wakeb-tooltip-btn", "layout"]));
    expect(w.attributes("data-wrapper")).toBe("yes");
    const button = w.get("button");
    expectPortableTarget(button.element);
    expect(button.attributes()).toMatchObject({ form: "profile", type: "submit", "aria-label": "Save profile" });
    await button.trigger("click");
    expect(click).toHaveBeenCalledOnce();
    button.element.dispatchEvent(new MouseEvent("mouseenter"));
    expect(enter).toHaveBeenCalledTimes(1);
  });

  it("defaults to a native type=button named by its text", () => {
    const w = render(WTooltipBtn, { props: { text: "Help" } });
    expect(w.get("button").attributes("type")).toBe("button");
    expect(w.get("button").attributes("aria-label")).toBe("Help");
  });

  it("lets ariaLabel name the button, including null to remove the name", async () => {
    const w = render(WTooltipBtn, { props: { text: "حفظ", ariaLabel: "حفظ الملف" } });
    expect(w.get("button").attributes("aria-label")).toBe("حفظ الملف");
    await w.setProps({ ariaLabel: null });
    expect(w.get("button").attributes("aria-label")).toBeUndefined();
  });

  it("renders the icon, passes { icon } to the icon slot and keeps native disabled", async () => {
    const seen: unknown[] = [];
    const w = render(WTooltipBtn, { props: { text: "Close", icon: "$close" } });
    expect(w.find("button svg").exists()).toBe(true);
    const replaced = render(WTooltipBtn, {
      props: { text: "", icon: "$close", btnIcon: true },
      attrs: { disabled: true },
      slots: { icon: (payload: unknown) => (seen.push(payload), h("i", { class: "custom-icon" })) },
    });
    expect(seen[0]).toEqual({ icon: "$close" });
    expect(replaced.get("button .custom-icon").exists()).toBe(true);
    expect(replaced.get("button").attributes("disabled")).toBeDefined();
    await replaced.get("button").trigger("focus");
    noTooltip();
  });

  it("opens its tooltip on keyboard focus and on hover", async () => {
    const w = render(WTooltipBtn, { props: { text: "Focus help", icon: "$close", openDelay: 0 } });
    await focus(w.get("button").element);
    const tooltip = await tooltipWith(w, "Focus help", !vuetify);
    const described = document.getElementById(w.get("button").attributes("aria-describedby")!);
    expect(described === tooltip || tooltip.contains(described) || !!described?.contains(tooltip)).toBe(true);
    if (!vuetify) {
      (w.get("button").element as HTMLElement).blur();
      await vi.waitFor(() => noTooltip());
    }
    const hovered = render(WTooltipBtn, { props: { text: "Hover help", icon: "$close", openDelay: 0 } });
    await hovered.get("button").trigger("mouseenter");
    await tooltipWith(hovered, "Hover help", !vuetify);
  });

  it("omits the tooltip without text", async () => {
    const w = render(WTooltipBtn, { props: { text: "", icon: "$close", openDelay: 0 } });
    await focus(w.get("button").element);
    await new Promise((resolve) => setTimeout(resolve, 20));
    noTooltip();
    expect(w.get("button").attributes("aria-describedby")).toBeUndefined();
  });

  it("carries the theme scope into the teleported tooltip and lets tooltipStyle win", async () => {
    const w = render(
      WTooltipBtn,
      { props: { text: "Scoped help", icon: "$close", openDelay: 0, tooltipStyle: { "--wakeb-ui-primary": "#abcdef" } } },
      { theme: { tokens: { primary: "#123456" } }, direction: "rtl" },
    );
    await focus(w.get("button").element);
    const scope = scopeOf(await tooltipWith(w, "Scoped help", !vuetify));
    expect(scope.getAttribute("dir")).toBe("rtl");
    expect(scope.style.getPropertyValue("--wakeb-ui-primary")).toBe("#123456");
    const styled = [scope, ...scope.querySelectorAll<HTMLElement>("*")].find((node) => node.style.getPropertyValue("--wakeb-ui-primary") === "#abcdef");
    expect(styled?.textContent).toContain("Scoped help");
  });

  it.each(Object.entries(VARIANT_CLASS))("maps the portable variant %s to %s", (variant, native) => {
    const w = render(WTooltipBtn, { props: { text: "Help", icon: "$close", variant } });
    expect(w.get("button").classes()).toContain(native);
    expect(warnings()).toEqual([]);
  });

  it("defaults to ghost and maps deprecated and unknown variants with one warning each", () => {
    expect(render(WTooltipBtn, { props: { text: "Help" } }).get("button").classes()).toContain(VARIANT_CLASS.ghost);
    const view = defineComponent(() => () => [h(WTooltipBtn, { text: "A", variant: "outlined" }), h(WTooltipBtn, { text: "B", variant: "outlined" }), h(WTooltipBtn, { text: "C", variant: "glow" })]);
    const w = render(view);
    expect(w.findAll("button").map((button) => button.classes().includes(VARIANT_CLASS.outline))).toEqual([true, true, false]);
    expect(w.findAll("button")[2].classes()).toContain(VARIANT_CLASS.ghost);
    expect(warnings()).toEqual([
      "[WAKEB_DEPRECATED_VALUE] WTooltipBtn variant 'outlined' is deprecated; use 'outline'. The alias is removed in the next major release.",
      "[WAKEB_UNKNOWN_VALUE] WTooltipBtn variant 'glow' is not a Wakeb variant; using 'ghost'. Use one of: soft, solid, outline, ghost.",
    ]);
  });
});

describe(`WButton tooltip on focus (${framework})`, () => {
  it("opens the tooltip on keyboard focus as well as hover (SPEC R18)", async () => {
    const w = render(WButton, { props: { title: "Settings", icon: "$close", isTooltip: true } });
    await focus(w.get("button").element);
    await tooltipWith(w, "Settings");
    expect(w.get("button").attributes("aria-label")).toBe("Settings");
  });
});

describe(`WBadge contract (${framework})`, () => {
  /* Draft R23 mapping table per provider: Wakeb variant -> native chip class (Wakeb CSS paints PrimeVue). */
  const NATIVE_VARIANT = vuetify
    ? { soft: "v-chip--variant-tonal", solid: "v-chip--variant-flat", outline: "v-chip--variant-outlined", ghost: "v-chip--variant-text" }
    : { soft: "wakeb-badge--soft", solid: "wakeb-badge--solid", outline: "wakeb-badge--outline", ghost: "wakeb-badge--ghost" };
  const children = (w: VueWrapper) => [...w.get(".wakeb-badge").element.querySelectorAll(".dot, i, b, span:not(.dot)")];

  it("renders the documented defaults", () => {
    const w = render(WBadge, { props: { label: "Ready" } });
    expect(w.element.tagName).toBe("DIV");
    const chip = w.get(".wakeb-badge");
    expect(chip.classes()).toEqual(expect.arrayContaining(["primary", "wakeb-badge--soft", "border-radius-md"]));
    expect(chip.classes()).not.toContain("badge--custom-padding");
    expect(chip.text()).toBe("Ready");
    expect(w.find(".dot").exists()).toBe(false);
    expect(warnings()).toEqual([]);
  });

  it("keeps icon, actions, dot and content order on either side", async () => {
    const w = render(WBadge, {
      props: { label: "Ready", isDot: true, iconPosition: "before" },
      slots: { icon: () => h("i", "I"), actions: () => h("b", "A") },
    });
    expect(w.get(".wakeb-badge").text()).toBe("IAReady");
    const order = (selector: string) => children(w).findIndex((node) => node.matches(selector));
    expect(order("i")).toBeLessThan(order("b"));
    expect(order("b")).toBeLessThan(order(".dot"));
    await w.setProps({ iconPosition: "after" });
    expect(w.get(".wakeb-badge").text()).toBe("ReadyIA");
    expect(order(".dot")).toBeLessThan(order("i"));
    expect(order("i")).toBeLessThan(order("b"));
  });

  it("passes { icon, size } to the icon slot and renders a default icon", () => {
    const seen: unknown[] = [];
    render(WBadge, { props: { label: "A", icon: "$complete", iconSize: "md" }, slots: { icon: (payload: unknown) => (seen.push(payload), h("i")) } });
    expect(seen[0]).toEqual({ icon: "$complete", size: "md" });
    const w = render(WBadge, { props: { label: "B", icon: "$complete" } });
    expect(w.find(".wakeb-badge .icon").exists()).toBe(true);
  });

  it("sends attrs to the root div and chipAttrs to the chip", async () => {
    const click = vi.fn();
    const enter = vi.fn();
    const w = render(WBadge, {
      props: { label: "Unused", chipAttrs: { id: "status-chip", "aria-label": "Ready", onClick: click } },
      attrs: portableAttrs(enter),
      slots: { default: () => h("strong", "Custom") },
    });
    expectPortableTarget(w.element);
    const chip = w.get(".wakeb-badge");
    expect(chip.attributes("id")).toBe("status-chip");
    expect(chip.attributes("aria-label")).toBe("Ready");
    expect(w.get("strong").text()).toBe("Custom");
    await chip.trigger("click");
    expect(click).toHaveBeenCalledOnce();
    w.element.dispatchEvent(new MouseEvent("mouseenter"));
    expect(enter).toHaveBeenCalledTimes(1);
  });

  it("applies custom radius, padding and the dot color reactively", async () => {
    const w = render(WBadge, { props: { label: "Dot", isDot: true, dotColor: "warning", customBorderRadius: "6px", customPadding: "4px 8px", borderRadius: "sm" } });
    const chip = w.get(".wakeb-badge");
    expect(chip.classes()).toEqual(expect.arrayContaining(["border-radius-sm", "badge--custom-padding"]));
    expect(chip.attributes("style")).toContain("border-radius: 6px");
    expect(chip.attributes("style")).toContain("height: auto");
    expect(w.get(".dot").attributes("style")).toContain("var(--wakeb-ui-warning, #f79009)");
    await w.setProps({ dotColor: "#123456", customPadding: "" });
    expect(w.get(".dot").attributes("style")).toContain("rgb(18, 52, 86)");
    expect(w.get(".wakeb-badge").classes()).not.toContain("badge--custom-padding");
  });

  it.each(Object.entries(NATIVE_VARIANT))("marks the portable variant %s (native %s)", (variant, native) => {
    const chip = render(WBadge, { props: { label: "V", variant } }).get(".wakeb-badge");
    expect(chip.classes()).toEqual(expect.arrayContaining([`wakeb-badge--${variant}`, native]));
    expect(warnings()).toEqual([]);
  });

  it.each([
    ["default", "soft"],
    ["tonal", "soft"],
    ["flat", "solid"],
    ["elevated", "solid"],
    ["outlined", "outline"],
    ["text", "ghost"],
    ["plain", "ghost"],
  ] as const)("maps the deprecated variant %s to %s with one warning per app", (alias, portable) => {
    const view = defineComponent(() => () => [h(WBadge, { label: "A", variant: alias }), h(WBadge, { label: "B", variant: alias })]);
    const w = render(view);
    for (const chip of w.findAll(".wakeb-badge")) expect(chip.classes()).toEqual(expect.arrayContaining([`wakeb-badge--${portable}`, NATIVE_VARIANT[portable]]));
    expect(warnings()).toEqual([`[WAKEB_DEPRECATED_VALUE] WBadge variant '${alias}' is deprecated; use '${portable}'. The alias is removed in the next major release.`]);
  });

  it("stays silent in production while still mapping aliases", () => {
    vi.stubEnv("NODE_ENV", "production");
    const chip = render(WBadge, { props: { label: "P", variant: "elevated", type: "teal" } }).get(".wakeb-badge");
    expect(chip.classes()).toContain("wakeb-badge--solid");
    expect(warnings()).toEqual([]);
  });

  it("paints Wakeb types with Wakeb classes only", () => {
    for (const type of ["success", "danger-transparent", "outline-secondary", "check"]) {
      const chip = render(WBadge, { props: { label: type, type } }).get(".wakeb-badge");
      expect(chip.classes()).toContain(type);
      expect(chip.classes().some((name) => /^(text|bg)-/.test(name))).toBe(false);
    }
    expect(warnings()).toEqual([]);
  });

  it("handles a provider color name as the deprecation policy says for this provider", () => {
    const chip = render(WBadge, { props: { label: "Odd", type: "teal" } }).get(".wakeb-badge");
    const list = "success, success-transparent, primary, primarybtn, danger, danger-transparent, warning, info, transparent, dark, tertiary, outline, outline-secondary, check, uncheck";
    if (vuetify) {
      expect(chip.classes()).toEqual(expect.arrayContaining(["teal", "text-teal"]));
      expect(warnings()).toEqual([
        `[WAKEB_DEPRECATED_VALUE] WBadge type 'teal' is not a Wakeb badge type; it is passed to Vuetify as a color name, which is not portable. Use one of: ${list}. Provider names are removed in the next major release.`,
      ]);
    } else {
      expect(chip.classes()).toContain("primary");
      expect(chip.classes()).not.toContain("teal");
      expect(chip.html()).not.toContain("teal");
      expect(warnings()).toEqual([`[WAKEB_UNKNOWN_VALUE] WBadge type 'teal' is not a Wakeb badge type; using 'primary'. Use one of: ${list}.`]);
    }
  });

  it("does not accept providerProps", () => {
    const w = render(WBadge, { props: { label: "Ready" }, attrs: { providerProps: { severity: "info" } } });
    expect(w.html()).not.toMatch(/providerprops|severity/i);
    expect(warnings().join("\n")).toContain("WBadge does not accept providerProps");
  });
});

describe(`WUserBadge contract (${framework})`, () => {
  const initials = (w: VueWrapper) => w.get(".wakeb-user-badge__initials").text();

  it("renders the root badge with the outline type and the user name", () => {
    const w = render(WUserBadge, { props: { user: { name: "Ada Lovelace" } } });
    expect(w.classes()).toContain("wakeb-user-badge");
    expect(w.get(".wakeb-badge").classes()).toEqual(expect.arrayContaining(["outline", "wakeb-badge--soft"]));
    expect(w.get(".wakeb-badge").text()).toContain("Ada Lovelace");
    expect(warnings()).toEqual([]);
  });

  it("keeps the baseline initials and empty-name cases", async () => {
    const w = render(WUserBadge, { props: { user: { name: "  Ada  Lovelace Byron " } } });
    expect(initials(w)).toBe("AL");
    for (const [name, text] of [["", "?"], ["—", "?"], ["   ", ""], ["كيرلس زكريا", "كز"]]) {
      await w.setProps({ user: { name } });
      expect(initials(w)).toBe(text);
    }
    await w.setProps({ user: {} });
    expect(initials(w)).toBe("?");
  });

  it("renders HTTP, root-relative and data avatars as decorative images and rejects bare filenames", async () => {
    const w = render(WUserBadge, { props: { user: { name: "Ada", avatar: "photo.png" } } });
    expect(w.find("img").exists()).toBe(false);
    expect(initials(w)).toBe("A");
    for (const avatar of ["https://example.com/a.png", "/a.png", "data:image/png;base64,AA=="]) {
      await w.setProps({ user: { name: "Ada", avatar } });
      await vi.waitFor(() => expect(w.find("img").exists()).toBe(true));
      expect(w.get("img").attributes("src")).toBe(avatar);
      expect(w.get("img").attributes("alt")).toBe("");
      expect(w.find(".wakeb-user-badge__initials").exists()).toBe(false);
    }
  });

  it("passes the documented avatar, default and actions slot payloads", () => {
    const user = { name: "Grace Hopper", avatar: "/g.png" };
    const seen: Record<string, unknown> = {};
    const w = render(WUserBadge, {
      props: { user, avatarSize: 24 },
      slots: {
        avatar: (payload: unknown) => ((seen.avatar = payload), h("em", "avatar")),
        default: (payload: unknown) => ((seen.default = payload), h("strong", "name")),
        actions: (payload: unknown) => ((seen.actions = payload), h("button", { type: "button" }, "Remove")),
      },
    });
    expect(seen.avatar).toEqual({ user, avatar: "/g.png", initials: "GH", size: 24 });
    expect(seen.default).toEqual({ user });
    expect(seen.actions).toEqual({ user });
    expect(w.find("img").exists()).toBe(false);
    expect(w.get(".wakeb-badge").text()).toBe("avatarnameRemove");
  });

  it("keeps action order with iconPosition after, escapes names and routes attrs to the root", async () => {
    const click = vi.fn();
    const enter = vi.fn();
    const w = render(WUserBadge, {
      props: { user: { name: "<b>Ada</b>" }, iconPosition: "after" },
      attrs: { ...portableAttrs(enter), onClick: click },
      slots: { actions: () => h("button", { type: "button" }, "Remove") },
    });
    expectPortableTarget(w.element);
    expect(w.element.classList.contains("wakeb-user-badge")).toBe(true);
    expect(w.find("b").exists()).toBe(false);
    expect(w.get(".wakeb-badge").text()).toBe("<b>Ada</b>Remove<");
    await w.get("button").trigger("click");
    expect(click).toHaveBeenCalledOnce();
  });

  it("sizes the avatar from avatarSize", () => {
    const w = render(WUserBadge, { props: { user: { name: "Ada" }, avatarSize: 24 } });
    const style = w.get(".wakeb-user-badge__initials").attributes("style") ?? "";
    expect(style).toContain("width: 24px");
    expect(style).toContain("height: 24px");
  });

  it("paints initials with a Wakeb intent and handles provider color names per the policy", () => {
    const portable = render(WUserBadge, { props: { user: { name: "Ada" }, avatarColor: "success" } });
    expect(portable.get(".wakeb-user-badge__initials").attributes("style")).toContain("var(--wakeb-ui-success, ");
    expect(warnings()).toEqual([]);
    const native = render(WUserBadge, { props: { user: { name: "Ada" }, avatarColor: "deep-purple" } });
    const avatar = native.get(".wakeb-user-badge__initials");
    if (vuetify) {
      expect(avatar.classes()).toContain("bg-deep-purple");
      expect(warnings()[0]).toMatch(/^\[WAKEB_DEPRECATED_VALUE\] WUserBadge avatarColor 'deep-purple'/);
    } else {
      expect(avatar.attributes("style")).toContain(shadcn ? "var(--wakeb-ui-primary, var(--primary, #087f8c))" : "var(--wakeb-ui-primary, var(--p-primary-color))");
      expect(warnings()[0]).toMatch(/^\[WAKEB_UNKNOWN_VALUE\] WUserBadge avatarColor 'deep-purple'/);
    }
  });
});
