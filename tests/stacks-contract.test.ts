import { afterEach, describe, expect, it, vi } from "vitest";
import { h, nextTick, ref } from "vue";
import { enableAutoUnmount, mount, type VueWrapper } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WAccordion, WAvatarStack, WBadgeStack, type WakebComponentsOptions } from "../src";
import { framework, wakeb } from "./wakeb";

/*
 * Shared contract for WAvatarStack, WBadgeStack and WAccordion (SPEC R12–R14, R17, R18, R23), run once
 * per provider project. Queries use roles, ARIA and Wakeb classes; the only provider-specific lookup is
 * the teleported overlay root, because the scope lands on whatever element the provider teleports.
 */
const vuetify = framework === "vuetify";
const host = () => (vuetify ? createVuetify() : ([PrimeVue, { theme: "none" }] as const));
/* Overlays need real transitions to mount teleported content; the accordion keeps the default stub so v-show settles at once. */
const render = (component: unknown, options: Record<string, unknown> = {}, plugin: Partial<WakebComponentsOptions> = {}, transitions = false) =>
  mount(component as never, {
    attachTo: document.body,
    global: { plugins: [host() as never, wakeb(plugin)], stubs: { transition: transitions } },
    ...options,
  });
const warnings = () => vi.mocked(console.warn).mock.calls.map(([message]) => String(message));
afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});
enableAutoUnmount(afterEach);

/** The overflow list and the element the provider teleports (scope target). */
const overflowList = () => document.querySelector<HTMLElement>(".overflow-menu-list");
const overlayRoot = (content: HTMLElement) => content.closest<HTMLElement>(vuetify ? ".v-overlay" : ".wakeb-pv-overflow")!;
/** Tooltip content (caller style target) and its overlay root (scope target). */
const tooltipParts = () => {
  const content = document.querySelector<HTMLElement>(vuetify ? ".v-tooltip .v-overlay__content" : '[role="tooltip"]');
  return content ? { content, overlay: vuetify ? content.closest<HTMLElement>(".v-overlay")! : content } : undefined;
};
const theme: Partial<WakebComponentsOptions> = { theme: { mode: "dark", tokens: { primary: "#123456", zIndexOverlay: 3100 } }, direction: "rtl" };
const caller = { "--wakeb-ui-primary": "#abcdef" };

describe(`WAvatarStack contract (${framework})`, () => {
  const items = [{ id: 1, profile: { name: "Ada Lovelace" } }, { id: 2, profile: { name: "آدم محمد" } }, { id: 3 }, { id: 4, profile: { name: "Grace Hopper" } }];

  it("reads own-property paths, names every visible avatar and reacts to prop changes", async () => {
    const w = render(WAvatarStack, { props: { items, max: 2, nameKey: "profile.name", showTooltip: false } });
    expect(w.findAll('[role="img"]').map((x) => x.attributes("aria-label"))).toEqual(["Ada Lovelace", "آدم محمد", "+2"]);
    expect(w.text()).toContain("AL");
    expect(w.text()).toContain("آم");
    expect(w.find('[tabindex="0"]').exists()).toBe(false);
    await w.setProps({ max: 4 });
    expect(w.find(".actor-overflow").exists()).toBe(false);
    expect(w.text()).toContain("?");
    await w.setProps({ items: [] });
    expect(w.find(".actor-avatar").exists()).toBe(false);
  });

  it.each([[-1, 4], [0, 4], [1.8, 3], [Number.NaN, 1]])("normalizes max=%s", (max, overflow) => {
    const w = render(WAvatarStack, { props: { items, max, nameKey: "profile.name" } });
    expect(w.get(".actor-overflow").text()).toBe(`+${overflow}`);
  });

  it("passes the avatar and overflow slot payloads and safe fallbacks", () => {
    const seen: Record<string, unknown>[] = [];
    const w = render(WAvatarStack, {
      props: { items: [null, { name: 12, avatar: "/a.png" }, { name: "😊 Team" }], max: 2 },
      slots: {
        avatar: (payload: Record<string, unknown>) => (seen.push(payload), h("b", `${payload.label}:${payload.initials}`)),
        overflow: ({ count }: { count: number }) => h("i", `${count} hidden`),
      },
    });
    expect(w.findAll("b").map((x) => x.text())).toEqual(["Unknown user:?", "Unknown user:?"]);
    expect(seen[1]).toMatchObject({ index: 1, label: "Unknown user", avatar: "/a.png", initials: "?" });
    expect(w.get("i").text()).toBe("1 hidden");
  });

  it("renders image avatars as decorative images inside the named wrapper", () => {
    const w = render(WAvatarStack, { props: { items: [{ name: "Ada Lovelace", avatar: "https://example.test/a.png" }] } });
    const wrapper = w.get('[role="img"]');
    expect(wrapper.attributes("aria-label")).toBe("Ada Lovelace");
    const img = wrapper.find("img");
    if (img.exists()) expect(img.attributes("alt") ?? "").toBe("");
    expect(wrapper.get(".actor-avatar").attributes("aria-hidden")).toBe("true");
  });

  it("opens the tooltip on keyboard focus and on hover", async () => {
    const w = render(WAvatarStack, { props: { items: [{ name: "Ada Lovelace" }] } });
    const target = w.get('[role="img"]');
    expect(target.attributes("tabindex")).toBe("0");
    (target.element as HTMLElement).focus();
    await vi.waitFor(() => expect(tooltipParts()?.content.textContent).toContain("Ada Lovelace"));
    // PrimeVue's directive removes its element on blur; Vuetify keeps a closing overlay in the DOM.
    if (!vuetify) {
      (target.element as HTMLElement).blur();
      await vi.waitFor(() => expect(tooltipParts()).toBeUndefined());
    }
    const hover = render(WAvatarStack, { props: { items: [{ name: "Grace Hopper" }] } });
    hover.get('[role="img"]').element.dispatchEvent(new MouseEvent("mouseenter"));
    await vi.waitFor(() => expect([...document.querySelectorAll('[role="tooltip"]')].some((node) => node.textContent?.includes("Grace Hopper"))).toBe(true));
  });

  it("opens an informational overflow list from a real button", async () => {
    const w = render(WAvatarStack, {
      props: { items, max: 1, nameKey: "profile.name", showOverflowMenu: true, overflowLabel: "More people", unknownLabel: "بدون اسم", menuStyle: { "--wakeb-avatar-menu-text": "#112233" } },
    });
    const button = w.get('button[aria-label="More people"]');
    expect(button.attributes("type")).toBe("button");
    expect(button.attributes("aria-haspopup")).toBeUndefined();
    expect(button.attributes("aria-expanded")).toBe("false");
    (button.element as HTMLElement).focus();
    await button.trigger("click");
    await vi.waitFor(() => expect(overflowList()?.textContent).toContain("Grace Hopper"));
    expect(button.attributes("aria-expanded")).toBe("true");
    expect(document.getElementById(button.attributes("aria-controls")!)?.contains(overflowList())).toBe(true);
    expect(overflowList()!.getAttribute("role")).toBe("list");
    expect(overflowList()!.querySelectorAll('[role="listitem"], li')).toHaveLength(3);
    expect(overflowList()!.textContent).toContain("بدون اسم");
    expect(overflowList()!.getAttribute("style")).toContain("--wakeb-avatar-menu-text: #112233");
    expect(w.element.contains(overflowList())).toBe(false);
  });

  it("sends attributes to the root", () => {
    const onClick = vi.fn();
    const w = render(WAvatarStack, { props: { items: [{ name: "Ada" }] }, attrs: { id: "people", class: "consumer", "data-test": "stack", onClick } });
    expect(w.element.classList).toContain("avatars-stack");
    expect(w.attributes("id")).toBe("people");
    expect(w.classes()).toContain("consumer");
    expect(w.attributes("data-test")).toBe("stack");
    (w.element as HTMLElement).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("paints intents with Wakeb CSS and handles provider color names per provider", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const portable = render(WAvatarStack, { props: { items: [{ name: "Ali Lee" }], avatarColor: "success" } }).get(".actor-avatar");
    expect(portable.attributes("style")).toContain("var(--wakeb-ui-success,");
    const named = render(WAvatarStack, { props: { items: [{ name: "Ali Lee" }], avatarColor: "deep-purple" } }).get(".actor-avatar");
    if (vuetify) {
      expect(warnings()).toEqual([expect.stringMatching(/^\[WAKEB_DEPRECATED_VALUE\] WAvatarStack avatarColor 'deep-purple'/)]);
    } else {
      expect(named.attributes("style")).toContain("var(--wakeb-ui-primary, var(--p-primary-color))");
      expect(warnings()).toEqual([expect.stringMatching(/^\[WAKEB_UNKNOWN_VALUE\] WAvatarStack avatarColor 'deep-purple'/)]);
    }
  });
});

describe(`WBadgeStack contract (${framework})`, () => {
  const items = [
    { id: 1, label: "Camera monitoring", icon: "/camera.svg", color: "#ff0000" },
    { id: 2, label: "Full overflow label", icon: "/person.svg", color: "#00ff00" },
    { id: 3, label: "Third" },
  ];

  it("keeps truncation, slicing, count and root attrs without enabling a menu", async () => {
    const w = render(WBadgeStack, { props: { items }, attrs: { id: "roles", class: "consumer" } });
    expect(w.attributes("id")).toBe("roles");
    expect(w.classes()).toEqual(expect.arrayContaining(["badge-stack", "consumer"]));
    expect(w.text()).toBe("Camera mo...+2");
    expect(w.find("button").exists()).toBe(false);
    await w.setProps({ max: 0 });
    expect(w.text()).toBe("+3");
    await w.setProps({ max: 8 });
    expect(w.text()).toBe("Camera mo...Full over...Third");
    await w.setProps({ items: [] });
    expect(w.text()).toBe("");
  });

  it("prefers per-item false and empty values to stack defaults and forwards badgeAttrs", () => {
    const w = render(WBadgeStack, {
      props: {
        items: [{ label: "Owner", isDot: false, type: "warning", customPadding: "", iconPosition: "after", classList: "row" }],
        isDot: true,
        badgeType: "success",
        badgePadding: "4px",
        badgeAttrs: { "data-owner": "team" },
      },
    });
    const badge = w.get(".warning");
    expect(badge.classes()).toContain("row");
    expect(badge.classes()).not.toContain("success");
    expect(badge.classes()).not.toContain("badge--custom-padding");
    expect(w.find(".dot").exists()).toBe(false);
    expect(w.get('[data-owner="team"]').element.contains(badge.element)).toBe(true);
  });

  it("opens a teleported overflow list with full labels, the overflow icon payload and local styles", async () => {
    const w = render(WBadgeStack, {
      props: { items, showOverflowMenu: true, overflowLabel: "More roles", menuStyle: { "--wakeb-badge-stack-menu-surface": "#123456" } },
      slots: { icon: ({ item, overflow }: { item: { label: string }; overflow: boolean }) => h("i", { "data-overflow": String(overflow) }, item.label) },
    });
    const button = w.get("button");
    expect(button.attributes("type")).toBe("button");
    expect(button.attributes("aria-label")).toBe("More roles");
    expect(button.attributes("aria-haspopup")).toBeUndefined();
    expect(button.attributes("aria-expanded")).toBe("false");
    expect(w.get("i").attributes("data-overflow")).toBe("false");
    (button.element as HTMLElement).focus();
    await button.trigger("click");
    await vi.waitFor(() => expect(overflowList()?.textContent).toContain("Full overflow label"));
    expect(button.attributes("aria-expanded")).toBe("true");
    expect(overflowList()!.querySelector("i")?.getAttribute("data-overflow")).toBe("true");
    expect(overflowList()!.getAttribute("style")).toContain("#123456");
    expect(w.element.contains(overflowList())).toBe(false);
  });

  it("renders circular images with clamped opacity, a replaceable label and circles inside the teleported list", async () => {
    const w = render(WBadgeStack, {
      props: { items: [{ label: "A", icon: "/a.svg", color: "#ff0000" }, { label: "B", icon: "/b.svg" }], iconVariant: "circle", iconBackgroundOpacity: 0.3, showOverflowMenu: true },
      slots: { label: ({ text }: { text: string }) => h("b", text) },
    });
    expect(w.get(".badge-stack__icon-wrap").attributes("style")).toContain("30%");
    expect(w.get("img").attributes("alt")).toBe("");
    expect(w.get("b").text()).toBe("A");
    await w.get(".badge-stack__overflow-activator").trigger("click");
    await vi.waitFor(() => expect(overflowList()).not.toBeNull());
    expect(overflowList()!.classList.contains("badge-stack--circle-icon")).toBe(true);
  });

  it("supports the legacy div activator and the badgeIcon slot payload", () => {
    const w = render(WBadgeStack, {
      props: { items: [{ label: "Admin", badgeIcon: "$complete" }, { label: "Member" }], showOverflowMenu: true, overflowTag: "div" },
      slots: { badgeIcon: ({ icon, size }: { icon: string; size: string }) => h("svg", { "data-icon": icon, "data-size": size }) },
    });
    expect(w.get(".badge-stack__overflow-activator").element.tagName).toBe("DIV");
    expect(w.get("svg").attributes("data-icon")).toBe("$complete");
    expect(w.get("svg").attributes("data-size")).toBe("xs");
  });

  it("names the stack prop in variant warnings and falls back from provider color names", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(WBadgeStack, {
      props: {
        badgeVariant: "outlined",
        max: 5,
        iconVariant: "circle",
        items: [{ id: 1, label: "Stack" }, { id: 2, label: "Item", variant: "plain" }, { id: 3, label: "Grey", icon: "/g.svg", color: "grey" }],
      },
    });
    expect(warnings()).toEqual([
      "[WAKEB_DEPRECATED_VALUE] WBadgeStack badgeVariant 'outlined' is deprecated; use 'outline'. The alias is removed in the next major release.",
      "[WAKEB_DEPRECATED_VALUE] WBadgeStack items[].variant 'plain' is deprecated; use 'ghost'. The alias is removed in the next major release.",
      expect.stringMatching(/^\[WAKEB_UNKNOWN_VALUE\] WBadgeStack items\[\]\.color 'grey'/),
    ]);
    expect(document.querySelector(".badge-stack__icon-wrap")?.getAttribute("style")).toContain("var(--wakeb-badge-stack-icon-background, #087f8c)");
  });

  it("marks the portable variant on each badge", () => {
    const w = render(WBadgeStack, { props: { items: [{ label: "A" }, { label: "B", variant: "solid" }], max: 2 } });
    expect(w.findAll(".wakeb-badge--soft")).toHaveLength(1);
    expect(w.findAll(".wakeb-badge--solid")).toHaveLength(1);
  });
});

describe(`overflow and tooltip scope (${framework})`, () => {
  const people = [{ id: 1, name: "Ada Lovelace" }, { id: 2, name: "Grace Hopper" }];
  const menus = [
    { name: "WAvatarStack", component: WAvatarStack, props: { items: people, max: 1, showOverflowMenu: true, overflowLabel: "More" } },
    { name: "WBadgeStack", component: WBadgeStack, props: { items: [{ label: "Admin" }, { label: "Member" }], showOverflowMenu: true, overflowLabel: "More" } },
  ];
  const openMenu = async (w: VueWrapper) => {
    const activator = w.get('[aria-label="More"]');
    (activator.element as HTMLElement).focus();
    await activator.trigger("click");
    await vi.waitFor(() => expect(overflowList()).not.toBeNull());
    return { content: overflowList()!, overlay: overlayRoot(overflowList()!) };
  };

  it.each(menus)("$name menu carries mode, direction, tokens and zIndexOverlay; menuStyle wins", async ({ component, props }) => {
    const w = render(component, { props: { ...props, menuStyle: caller } }, theme);
    const { content, overlay } = await openMenu(w);
    expect(w.element.contains(overlay)).toBe(false);
    expect(overlay.getAttribute("data-wakeb-theme")).toBe("dark");
    expect(overlay.getAttribute("dir")).toBe("rtl");
    expect(overlay.style.getPropertyValue("--wakeb-ui-primary")).toBe("#123456");
    expect(overlay.style.zIndex).toBe("3100");
    expect(content.style.getPropertyValue("--wakeb-ui-primary")).toBe("#abcdef");
  });

  it.each(menus)("$name menu adds nothing when nothing is configured", async ({ component, props }) => {
    const w = render(component, { props });
    const { overlay } = await openMenu(w);
    expect(overlay.hasAttribute("data-wakeb-theme")).toBe(false);
    expect(overlay.hasAttribute("dir")).toBe(false);
    expect(overlay.getAttribute("style") ?? "").not.toContain("--wakeb-ui");
    expect(overlay.style.zIndex).not.toBe("3100");
  });

  it("WAvatarStack tooltip carries the scope and tooltipStyle wins", async () => {
    const w = render(WAvatarStack, { props: { items: people.slice(0, 1), tooltipStyle: caller } }, theme);
    (w.get('[role="img"]').element as HTMLElement).focus();
    await vi.waitFor(() => expect(tooltipParts()).toBeDefined());
    const { content, overlay } = tooltipParts()!;
    expect(overlay.getAttribute("data-wakeb-theme")).toBe("dark");
    expect(overlay.getAttribute("dir")).toBe("rtl");
    expect(content.style.getPropertyValue("--wakeb-ui-primary")).toBe("#abcdef");
    // PrimeVue's tooltip directive owns its z-index stack; only Vuetify takes the configured value.
    if (vuetify) expect(overlay.style.zIndex).toBe("3100");
  });
});

describe(`WAccordion contract (${framework})`, () => {
  it("keeps internal toggling with a constant modelValue and emits one update per header click", async () => {
    const w = render(WAccordion, { props: { title: "Details", modelValue: true }, slots: { default: "Body" } }, {}, true);
    await w.get(".accordion__header").trigger("click");
    expect(w.get(".accordion__body").isVisible()).toBe(false);
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
    await w.setProps({ modelValue: false });
    await w.setProps({ modelValue: true });
    expect(w.get(".accordion__body").isVisible()).toBe(true);
    expect(w.emitted("update:modelValue")).toHaveLength(1);
  });

  it("stops actions and toggle buttons from bubbling into a second toggle", async () => {
    const action = vi.fn();
    const w = render(WAccordion, {
      props: { title: "Details", beforeIcon: true, afterIcon: true, toggleLabel: "Show details" },
      slots: { actions: () => h("button", { onClick: action }, "Edit") },
    }, {}, true);
    await w.get(".accordion__actions button").trigger("click");
    expect(action).toHaveBeenCalledOnce();
    expect(w.emitted("update:modelValue")).toBeUndefined();
    const toggles = w.findAll('button[aria-label="Show details"]').filter((button) => button.classes().includes("accordion__toggle"));
    expect(toggles).toHaveLength(2);
    expect(toggles[0].attributes("type")).toBe("button");
    await toggles[0].trigger("click");
    expect(w.emitted("update:modelValue")).toEqual([[true]]);
    expect(w.get(".accordion__body").isVisible()).toBe(true);
    expect(toggles[1].attributes("aria-expanded")).toBe("true");
    expect(toggles[1].attributes("aria-controls")).toBe(w.get(".accordion__body").attributes("id"));
  });

  it("connects the native title trigger to a named region and keeps nested state while closed", async () => {
    const draft = ref("Draft");
    const w = render(WAccordion, {
      props: { title: "Details", modelValue: true },
      slots: { default: () => h("input", { value: draft.value, onInput: (event: Event) => (draft.value = (event.target as HTMLInputElement).value) }) },
    }, {}, true);
    const input = w.get("input");
    await input.setValue("Keep me");
    const trigger = w.get(".accordion__title-trigger");
    const body = w.get(".accordion__body");
    expect(trigger.attributes("type")).toBe("button");
    expect(trigger.attributes("aria-controls")).toBe(body.attributes("id"));
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(body.attributes("role")).toBe("region");
    expect(body.attributes("aria-label")).toBe("Details");
    await trigger.trigger("click");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(w.get(".accordion__body").isVisible()).toBe(false);
    await trigger.trigger("click");
    expect(w.get("input").element).toBe(input.element);
    expect((input.element as HTMLInputElement).value).toBe("Keep me");
    expect(w.emitted("update:modelValue")).toHaveLength(2);
  });

  it("passes header, actions, default and toggleIcon slot payloads and follows the parent model", async () => {
    const open = ref(false);
    const seen: Record<string, unknown> = {};
    const w = render({
      setup: () => () =>
        h(
          WAccordion,
          { modelValue: open.value, "onUpdate:modelValue": (v: boolean) => (open.value = v), title: "Review", afterIcon: true, contentId: "review-panel" },
          {
            header: (payload: { triggerProps: Record<string, unknown> }) => ((seen.header = payload), h("button", { ...payload.triggerProps, class: "custom-trigger" }, "Custom header")),
            actions: (payload: unknown) => ((seen.actions = payload), null),
            toggleIcon: (payload: { icon: string }) => ((seen.toggleIcon = payload), h("i", { "data-icon": payload.icon })),
            default: (payload: unknown) => ((seen.default = payload), h("p", "Body")),
          },
        ),
    }, {}, {}, true);
    expect(seen.header).toMatchObject({ open: false, triggerProps: { type: "button", "aria-expanded": false, "aria-controls": "review-panel", "aria-label": "Review" } });
    expect(seen.actions).toMatchObject({ open: false });
    expect(seen.default).toEqual({ open: false });
    expect(seen.toggleIcon).toMatchObject({ icon: "$expand", size: "sm", maxWidth: "100%" });
    await w.get(".custom-trigger").trigger("click");
    expect(open.value).toBe(true);
    expect(w.get(".custom-trigger").attributes("aria-expanded")).toBe("true");
    expect(w.get("#review-panel").isVisible()).toBe(true);
    open.value = false;
    await nextTick();
    expect(w.get(".accordion__body").isVisible()).toBe(false);
  });

  it("sends attributes to the root and resolves iconColor portably", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = render(WAccordion, { props: { title: "Details", beforeIcon: true, iconColor: "red-darken-2" }, attrs: { id: "faq", class: "consumer", "data-test": "acc" } }, {}, true);
    expect(w.element.classList).toContain("accordion");
    expect(w.attributes("id")).toBe("faq");
    expect(w.classes()).toContain("consumer");
    expect(w.attributes("data-test")).toBe("acc");
    expect(warnings()).toEqual([expect.stringMatching(/^\[WAKEB_UNKNOWN_VALUE\] WAccordion iconColor 'red-darken-2'/)]);
  });
});

/* PrimeVue has no open-on-hover menu, so the adapter composes Popover with Wakeb opening rules. */
describe.runIf(!vuetify)("PrimeVue overflow popup interaction", () => {
  const badges = { items: [{ label: "Admin" }, { label: "Member" }], showOverflowMenu: true, overflowLabel: "More roles" };
  const avatars = { items: [{ name: "Ada Lovelace" }, { name: "Grace Hopper" }], max: 1, showOverflowMenu: true, overflowLabel: "More people" };
  const closed = () => vi.waitFor(() => expect(overflowList()).toBeNull());
  const opened = () => vi.waitFor(() => expect(overflowList()).not.toBeNull());

  it("toggles the badge list on click and closes it on Escape", async () => {
    const w = render(WBadgeStack, { props: badges });
    const button = w.get("button");
    await button.trigger("click");
    await opened();
    await button.trigger("click");
    await closed();
    expect(button.attributes("aria-expanded")).toBe("false");
    expect(button.attributes("aria-controls")).toBeUndefined();
    await button.trigger("click");
    await opened();
    document.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape", key: "Escape" }));
    await closed();
    expect(button.attributes("aria-expanded")).toBe("false");
  });

  it("opens on hover, stays open over the list and closes after the pointer leaves", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const w = render(WBadgeStack, { props: badges });
      const button = w.get("button").element;
      button.dispatchEvent(new MouseEvent("mouseenter"));
      await opened();
      button.dispatchEvent(new MouseEvent("mouseleave"));
      overlayRoot(overflowList()!).dispatchEvent(new MouseEvent("mouseenter"));
      vi.advanceTimersByTime(500);
      await nextTick();
      expect(overflowList()).not.toBeNull();
      overlayRoot(overflowList()!).dispatchEvent(new MouseEvent("mouseleave"));
      vi.advanceTimersByTime(500);
      await closed();
    } finally {
      vi.useRealTimers();
    }
  });

  it("opens the avatar list on focus, keeps it open on click and closes on blur", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const w = render(WAvatarStack, { props: avatars });
      const button = w.get("button");
      (button.element as HTMLElement).focus();
      await opened();
      await button.trigger("click");
      expect(overflowList()).not.toBeNull();
      (button.element as HTMLElement).blur();
      vi.advanceTimersByTime(500);
      await closed();
    } finally {
      vi.useRealTimers();
    }
  });

  it("names the overflow popup and does not mark it modal", async () => {
    const w = render(WAvatarStack, { props: avatars });
    await w.get("button").trigger("click");
    await opened();
    const root = overlayRoot(overflowList()!);
    expect(root.getAttribute("aria-label")).toBe("More people");
    expect(root.getAttribute("aria-modal")).toBe("false");
  });
});
