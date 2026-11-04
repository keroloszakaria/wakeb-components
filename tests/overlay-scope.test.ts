import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { enableAutoUnmount, mount, type VueWrapper } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { VApp } from "vuetify/components/VApp";
import {
  WAvatarStack,
  WBadgeStack,
  WButton,
  WDrawer,
  WExportDropdown,
  WModal,
  WTooltipBtn,
  WTruncatedText,
  type WakebComponentsOptions,
} from "../src";
import { wakeb } from "./wakeb";

/* Theme and direction scope on every Vuetify overlay surface (SPEC R17, R19). */
const theme = { mode: "dark" as const, tokens: { primary: "#123456", zIndexOverlay: 3100 } };
const configured: Partial<WakebComponentsOptions> = { theme, direction: "rtl" };
const caller = { "--wakeb-ui-primary": "#abcdef" };

afterEach(() => {
  document.body.innerHTML = "";
});
// Open overlays register in the Vuetify stack; unmount first (after hooks run in reverse) so stacking starts clean.
enableAutoUnmount(afterEach);

const render = (component: unknown, props: Record<string, unknown>, options: Partial<WakebComponentsOptions>, attrs: Record<string, unknown> = {}) =>
  mount(
    defineComponent({ render: () => h(VApp, null, { default: () => h(component as never, { ...props, ...attrs }) }) }),
    { attachTo: document.body, global: { plugins: [createVuetify(), wakeb(options)], stubs: { transition: false } } },
  );
const focus = (selector: string) => async (w: VueWrapper) => {
  (w.get(selector).element as HTMLElement).focus();
  await nextTick();
};
const focusAndClick = (selector: string) => async (w: VueWrapper) => {
  await focus(selector)(w);
  await w.get(selector).trigger("click");
};

interface Case {
  name: string;
  component: unknown;
  props: Record<string, unknown>;
  open: (w: VueWrapper) => Promise<void>;
  /** Element inside the teleported content that the caller can style. */
  content: string;
  /** Prop that styles the overlay content, when the component has one. */
  styleProp?: string;
}
const people = [{ id: 1, name: "Ada Lovelace" }, { id: 2, name: "Grace Hopper" }, { id: 3, name: "Alan Turing" }];
const cases: Case[] = [
  { name: "WTooltipBtn tooltip", component: WTooltipBtn, props: { text: "Help", icon: "$close", openDelay: 0 }, open: focus("button"), content: '[role="tooltip"] .v-overlay__content', styleProp: "tooltipStyle" },
  { name: "WTruncatedText tooltip", component: WTruncatedText, props: { label: "A long accessible label", length: 8 }, open: focus(".truncated-text"), content: '[role="tooltip"] .v-overlay__content', styleProp: "tooltipStyle" },
  { name: "WButton tooltip", component: WButton, props: { title: "Save", icon: "$close", isTooltip: true }, open: focus("button"), content: '[role="tooltip"] .v-overlay__content' },
  { name: "WAvatarStack tooltip", component: WAvatarStack, props: { items: people.slice(0, 1) }, open: focus('[role="img"][tabindex="0"]'), content: '[role="tooltip"] .v-overlay__content', styleProp: "tooltipStyle" },
  { name: "WAvatarStack overflow menu", component: WAvatarStack, props: { items: people, max: 1, showOverflowMenu: true, overflowLabel: "More people" }, open: focusAndClick('button[aria-label="More people"]'), content: ".overflow-menu-list", styleProp: "menuStyle" },
  { name: "WBadgeStack overflow menu", component: WBadgeStack, props: { items: [{ label: "Admin" }, { label: "Member" }], showOverflowMenu: true, overflowLabel: "More roles" }, open: focusAndClick('button[aria-label="More roles"]'), content: ".overflow-menu-list", styleProp: "menuStyle" },
  { name: "WExportDropdown menu", component: WExportDropdown, props: {}, open: async (w) => w.get("button").trigger("click"), content: '[role="menu"]', styleProp: "menuStyle" },
  { name: "WModal dialog", component: WModal, props: { modelValue: true, title: "Report" }, open: async () => {}, content: '[role="dialog"]' },
];

const openContent = async (w: VueWrapper, item: Case) => {
  await item.open(w);
  await vi.waitFor(() => expect(document.querySelector(item.content)).not.toBeNull());
  const content = document.querySelector<HTMLElement>(item.content)!;
  const overlay = content.closest<HTMLElement>(".v-overlay")!;
  expect(overlay).not.toBeNull();
  // Teleported: the overlay is outside the component's own DOM, so it cannot inherit the root scope.
  expect(w.get(".v-application").element.contains(overlay)).toBe(false);
  return { content, overlay };
};

describe.each(cases)("overlay scope: $name", (item) => {
  it("carries mode, direction, tokens and the overlay z-index into teleported content", async () => {
    const w = render(item.component, item.props, configured);
    const { overlay } = await openContent(w, item);
    expect(overlay.getAttribute("data-wakeb-theme")).toBe("dark");
    expect(overlay.getAttribute("dir")).toBe("rtl");
    expect(overlay.style.getPropertyValue("--wakeb-ui-primary")).toBe("#123456");
    expect(overlay.style.zIndex).toBe("3100");
  });

  it("adds nothing when theme and direction are not configured", async () => {
    const w = render(item.component, item.props, {});
    const { overlay } = await openContent(w, item);
    expect(overlay.hasAttribute("data-wakeb-theme")).toBe(false);
    expect(overlay.hasAttribute("dir")).toBe(false);
    expect(overlay.getAttribute("style") ?? "").not.toContain("--wakeb-ui");
    expect(overlay.style.zIndex).not.toBe("3100");
  });

  // WButton has no tooltip styling surface; WModal forwards caller attrs to the overlay root itself.
  it.runIf(item.styleProp || item.component === WModal)("lets caller overlay styling win over the scope", async () => {
    const props = item.styleProp ? { ...item.props, [item.styleProp]: caller } : item.props;
    const w = render(item.component, props, configured, item.styleProp ? {} : { style: caller });
    const { content, overlay } = await openContent(w, item);
    expect((item.styleProp ? content : overlay).style.getPropertyValue("--wakeb-ui-primary")).toBe("#abcdef");
    expect(overlay.getAttribute("data-wakeb-theme")).toBe("dark");
    expect(overlay.style.zIndex).toBe("3100");
  });
});

describe("overlay scope isolation", () => {
  it("keeps two apps' tooltips on one page apart", async () => {
    const first = render(WTooltipBtn, { text: "First", icon: "$close", openDelay: 0 }, { theme: { tokens: { primary: "#111111", zIndexOverlay: 3100 } }, direction: "rtl" });
    const second = render(WTooltipBtn, { text: "Second", icon: "$close", openDelay: 0 }, { theme: { tokens: { primary: "#222222" } } });
    for (const w of [first, second]) (w.get("button").element as HTMLElement).focus();
    await vi.waitFor(() => expect(document.querySelectorAll('[role="tooltip"]').length).toBe(2));
    const overlayOf = (text: string) =>
      [...document.querySelectorAll<HTMLElement>('[role="tooltip"]')].find((node) => node.textContent?.includes(text))!.closest<HTMLElement>(".v-overlay")!;
    expect(overlayOf("First").style.getPropertyValue("--wakeb-ui-primary")).toBe("#111111");
    expect(overlayOf("First").getAttribute("dir")).toBe("rtl");
    expect(overlayOf("First").style.zIndex).toBe("3100");
    expect(overlayOf("Second").style.getPropertyValue("--wakeb-ui-primary")).toBe("#222222");
    expect(overlayOf("Second").hasAttribute("dir")).toBe(false);
    expect(overlayOf("Second").style.zIndex).not.toBe("3100");
  });
});

describe("WDrawer scope", () => {
  // The drawer is teleported inside its Wakeb-owned layout host; its panel root takes the scope attributes.
  it("carries the scope on the drawer panel and keeps caller styles first", async () => {
    render(WDrawer, { modelValue: true, title: "Filters" }, configured, { style: caller });
    await nextTick();
    const panel = document.querySelector<HTMLElement>(".wakeb-drawer")!;
    expect(panel.getAttribute("data-wakeb-theme")).toBe("dark");
    expect(panel.getAttribute("dir")).toBe("rtl");
    expect(panel.style.getPropertyValue("--wakeb-ui-primary")).toBe("#abcdef");
  });

  it("adds nothing to the drawer when nothing is configured", async () => {
    render(WDrawer, { modelValue: true, title: "Filters" }, {});
    await nextTick();
    const panel = document.querySelector<HTMLElement>(".wakeb-drawer")!;
    expect(panel.hasAttribute("data-wakeb-theme")).toBe(false);
    expect(panel.hasAttribute("dir")).toBe(false);
    expect(panel.getAttribute("style") ?? "").not.toContain("--wakeb-ui");
  });
});
