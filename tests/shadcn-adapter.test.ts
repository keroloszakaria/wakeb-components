import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { WButton, WCarousel, WDrawer, WDropdown, WExportDropdown, WLoading, WModal, WTabs, WTree } from "../src";
import TooltipContent from "../src/adapters/shadcn/ui/TooltipContent.vue";
import { shadcnHost, wakeb } from "./wakeb";

/*
 * shadcn-vue wiring the shared contract cannot express: reka-ui keyboard paths, dialog focus
 * management, afterLeave timing, nonportable native looks and the precompiled CSS (SPEC R11, R18).
 */
const render = (component: unknown, options: Record<string, unknown> = {}, plugin = wakeb()) =>
  mount(component as never, { attachTo: document.body, global: { plugins: [shadcnHost as never, plugin] }, ...options });
const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
};
const key = (target: Element, name: string) => target.dispatchEvent(new KeyboardEvent("keydown", { key: name, bubbles: true, cancelable: true }));
beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});
enableAutoUnmount(afterEach);

describe("shadcn WDropdown keyboard and focus", () => {
  const items = [
    { label: "Pending", value: "p" },
    { label: "Archived", value: "a", disabled: true },
    { label: "Done", value: "d" },
  ];
  const menu = () => document.querySelector<HTMLElement>('[role="menu"]');

  it("moves with arrow keys past disabled rows, selects with Enter and returns focus to the activator", async () => {
    const w = render(WDropdown, { props: { title: "Status", menuItems: items, showSelected: true } });
    const activator = w.get("button").element as HTMLButtonElement;
    activator.focus();
    activator.click();
    await vi.waitFor(() => expect(menu()).not.toBeNull());
    expect(activator.getAttribute("aria-controls")).toBe(menu()!.id);
    for (const name of ["ArrowDown", "ArrowDown"]) {
      key(document.activeElement ?? menu()!, name);
      await settle();
    }
    expect(document.activeElement?.textContent).toContain("Done");
    key(document.activeElement!, "Enter");
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([["d"]]);
    expect(w.emitted("selectedItem")).toEqual([[items[2]]]);
    await vi.waitFor(() => expect(menu()).toBeNull());
    await vi.waitFor(() => expect(document.activeElement).toBe(activator));
    expect(activator.textContent).toContain("Done");
  });

  it("closes on Escape without selecting and returns focus", async () => {
    const w = render(WDropdown, { props: { title: "Status", menuItems: items } });
    const activator = w.get("button").element as HTMLButtonElement;
    activator.focus();
    activator.click();
    await vi.waitFor(() => expect(menu()).not.toBeNull());
    key(menu()!, "Escape");
    await settle();
    expect(menu()).toBeNull();
    expect(activator.getAttribute("aria-expanded")).toBe("false");
    expect(w.emitted("update:modelValue")).toBeUndefined();
    await vi.waitFor(() => expect(document.activeElement).toBe(activator));
  });

  it("toggles closed from the activator and names the menu after it", async () => {
    const w = render(WDropdown, { props: { title: "Status", menuItems: items } });
    const activator = w.get("button").element as HTMLButtonElement;
    activator.click();
    await vi.waitFor(() => expect(menu()).not.toBeNull());
    expect(menu()!.getAttribute("aria-label")).toBe("Status");
    activator.click();
    await settle();
    expect(menu()).toBeNull();
  });
});

describe("shadcn WModal focus, dismissal and afterLeave", () => {
  const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]');
  const view = (props: Record<string, unknown>, onAfterLeave = () => {}) => {
    const open = ref(false);
    const component = defineComponent(() => () => [
      h("button", { class: "opener", onClick: () => (open.value = true) }, "Open"),
      h(
        WModal,
        { ...props, modelValue: open.value, "onUpdate:modelValue": (value: boolean) => (open.value = value), onAfterLeave },
        { default: () => [h("input", { class: "first" }), h("button", { class: "last" }, "Last")] },
      ),
    ]);
    return { open, w: render(component) };
  };

  it("contains Tab, closes on Escape, emits afterLeave once and returns focus to the opener", async () => {
    const afterLeave = vi.fn();
    const { open, w } = view({ title: "Edit", persistent: false, closeLabel: "Close dialog" }, afterLeave);
    const opener = w.get(".opener").element as HTMLButtonElement;
    opener.focus();
    opener.click();
    await vi.waitFor(() => expect(dialog()?.contains(document.activeElement)).toBe(true));
    // reka-ui's focus scope wraps Tab from the last tabbable element to the first.
    (dialog()!.querySelector(".last") as HTMLElement).focus();
    key(dialog()!.querySelector(".last")!, "Tab");
    await settle();
    expect(dialog()!.contains(document.activeElement)).toBe(true);
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Close dialog");
    key(document.activeElement!, "Escape");
    await settle();
    expect(open.value).toBe(false);
    expect(dialog()).toBeNull();
    expect(afterLeave).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(document.activeElement).toBe(opener));
  });

  it("stays open on Escape and outside presses when persistent", async () => {
    const { open, w } = view({ title: "Edit", persistent: true });
    w.get(".opener").element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await vi.waitFor(() => expect(dialog()).not.toBeNull());
    key(dialog()!, "Escape");
    document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    await settle();
    expect(open.value).toBe(true);
    expect(dialog()).not.toBeNull();
  });

  it("does not emit afterLeave when an open dialog is torn down", async () => {
    const afterLeave = vi.fn();
    const w = render(WModal, { props: { modelValue: true, title: "Edit", onAfterLeave: afterLeave } });
    await settle();
    w.unmount();
    await settle();
    expect(afterLeave).not.toHaveBeenCalled();
  });

  it("marks the page outside the dialog inert for assistive technology", async () => {
    render(defineComponent(() => () => [h("main", { class: "page" }, "Page"), h(WModal, { modelValue: true, title: "Edit" })]));
    await settle();
    expect(document.querySelector(".page")?.closest("[aria-hidden='true']")).not.toBeNull();
  });
});

describe("shadcn WExportDropdown keyboard and focus", () => {
  const formats = [
    { label: "PDF", value: "pdf" },
    { label: "Locked", value: "locked", disabled: true },
    { label: "CSV", value: "csv" },
  ];
  const menu = () => document.querySelector<HTMLElement>('[role="menu"]');

  it("moves with arrow keys past disabled formats, emits one select on Enter and returns focus", async () => {
    const w = render(WExportDropdown, { props: { formats } });
    const activator = w.get("button").element as HTMLButtonElement;
    activator.focus();
    activator.click();
    await vi.waitFor(() => expect(menu()).not.toBeNull());
    expect(activator.getAttribute("aria-controls")).toBe(menu()!.id);
    expect(menu()!.getAttribute("aria-label")).toBe("Download");
    for (const name of ["ArrowDown", "ArrowDown"]) {
      key(document.activeElement ?? menu()!, name);
      await settle();
    }
    expect(document.activeElement?.textContent).toContain("CSV");
    key(document.activeElement!, "Enter");
    await settle();
    expect(w.emitted("select")).toEqual([["csv"]]);
    await vi.waitFor(() => expect(menu()).toBeNull());
    await vi.waitFor(() => expect(document.activeElement).toBe(activator));
  });

  it("closes on Escape without selecting, removes the overlay wrapper and never opens while loading", async () => {
    const w = render(WExportDropdown, { props: { formats }, attrs: { "data-test": "exports" } });
    const activator = w.get("button").element as HTMLButtonElement;
    activator.focus();
    activator.click();
    await vi.waitFor(() => expect(menu()).not.toBeNull());
    key(document.activeElement ?? menu()!, "Escape");
    await settle();
    await vi.waitFor(() => expect(document.querySelector('[data-test="exports"]')).toBeNull());
    expect(w.emitted("select")).toBeUndefined();
    await w.setProps({ isLoading: true });
    activator.click();
    await settle();
    expect(menu()).toBeNull();
  });
});

describe("shadcn WDrawer overlay host (R18, R19)", () => {
  const drawer = () => document.querySelector<HTMLElement>(".wakeb-drawer");
  const view = (props: Record<string, unknown> = {}) => {
    const open = ref(false);
    const component = defineComponent(() => () => [
      h("main", { class: "page" }, [h("button", { class: "opener", onClick: () => (open.value = true) }, "Open")]),
      h(
        WDrawer,
        { title: "Filters", ...props, modelValue: open.value, "onUpdate:modelValue": (value: boolean) => (open.value = value) },
        { content: () => [h("input", { class: "first" }), h("button", { class: "last" }, "Last")] },
      ),
    ]);
    return { open, component };
  };

  it("renders a named modal dialog with no layout host, traps focus, locks scroll and returns focus to the opener", async () => {
    const { open, component } = view();
    const w = render(component);
    const opener = w.get(".opener").element as HTMLButtonElement;
    opener.focus();
    opener.click();
    await vi.waitFor(() => expect(drawer()?.contains(document.activeElement)).toBe(true));
    const root = drawer()!;
    expect(root.getAttribute("role")).toBe("dialog");
    expect(root.getAttribute("aria-modal")).toBe("true");
    expect(root.getAttribute("aria-label")).toBe("Filters");
    expect(root.parentElement).toBe(document.body);
    expect(document.querySelector(".page")?.closest("[aria-hidden='true']")).not.toBeNull();
    await vi.waitFor(() => expect(document.body.style.overflow).toBe("hidden"));
    // reka-ui's focus scope wraps Tab from the last tabbable element to the first.
    (root.querySelector(".last") as HTMLElement).focus();
    key(root.querySelector(".last")!, "Tab");
    await settle();
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Close");
    (root.querySelector('button[aria-label="Close"]') as HTMLElement).click();
    await settle();
    expect(open.value).toBe(false);
    await vi.waitFor(() => expect(drawer()).toBeNull());
    await vi.waitFor(() => expect(document.activeElement).toBe(opener));
    expect(document.body.style.overflow).toBe("");
  });

  it("closes from an outside press unless persistent, and a transparent overlay still blocks the background", async () => {
    const { open, component } = view({ transparentOverlay: true });
    const w = render(component);
    w.get(".opener").element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await vi.waitFor(() => expect(drawer()).not.toBeNull());
    const overlay = document.querySelector<HTMLElement>(".wakeb-sc-sheet-overlay")!;
    expect(overlay.classList.contains("wakeb-sc-sheet-overlay--transparent")).toBe(true);
    await settle();
    document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    await settle();
    expect(open.value).toBe(false);

    const persistent = view({ persistent: true });
    const p = render(persistent.component);
    p.get(".opener").element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await vi.waitFor(() => expect(drawer()).not.toBeNull());
    await settle();
    key(drawer()!, "Escape");
    document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    await settle();
    expect(persistent.open.value).toBe(true);
    expect(drawer()).not.toBeNull();
  });

  it("maps logical positions through the Wakeb direction and stacks the overlay with zIndexOverlay", async () => {
    render(WDrawer, { props: { modelValue: true, position: "end", width: "560px" } }, wakeb({ direction: "rtl", theme: { tokens: { zIndexOverlay: 3100 } } }));
    await settle();
    const root = drawer()!;
    expect(root.getAttribute("data-side")).toBe("left");
    expect(root.style.width).toBe("560px");
    expect(root.style.zIndex).toBe("3100");
    expect(document.querySelector<HTMLElement>(".wakeb-sc-sheet-overlay")!.style.zIndex).toBe("3100");
    render(WDrawer, { props: { modelValue: true, position: "start" } });
    await settle();
    expect([...document.querySelectorAll(".wakeb-drawer")].at(-1)!.getAttribute("data-side")).toBe("left");
  });
});

describe("shadcn WButton tooltip and native looks", () => {
  it("opens the tooltip on keyboard focus and maps logical sides through the direction", async () => {
    const w = render(WButton, { props: { title: "Settings", icon: "$close", isTooltip: true, location: "end" } });
    (w.get("button").element as HTMLElement).focus();
    await vi.waitFor(() => expect(document.querySelector('[role="tooltip"]')?.textContent).toBe("Settings"));
    // The requested side; reka-ui may still flip it to fit the viewport.
    expect(w.findComponent(TooltipContent).props("side")).toBe("right");
    expect(w.get("button").attributes("aria-describedby")).toBe(document.querySelector('[role="tooltip"]')!.id);
  });

  it("flips logical sides under a configured right-to-left direction", async () => {
    const w = render(WButton, { props: { title: "Settings", icon: "$close", isTooltip: true, location: "end" } }, wakeb({ direction: "rtl" }));
    (w.get("button").element as HTMLElement).focus();
    await vi.waitFor(() => expect(document.querySelector('[role="tooltip"]')).not.toBeNull());
    expect(w.findComponent(TooltipContent).props("side")).toBe("left");
    expect(document.querySelector(".wakeb-sc-tooltip")?.getAttribute("dir")).toBe("rtl");
  });

  it("renders no tooltip parts for a plain button", () => {
    const w = render(WButton, { props: { title: "Save" } });
    expect(w.get("button").attributes("data-state")).toBeUndefined();
    expect(w.get("button").attributes("data-slot")).toBe("button");
  });

  it("exposes shadcn-vue variant and size only through providerProps, as data attributes", () => {
    const plain = render(WButton, { props: { title: "Save" } }).get("button");
    expect(plain.attributes("data-variant")).toBeUndefined();
    const native = render(WButton, { props: { title: "Delete", providerProps: { variant: "destructive", size: "sm" } } }).get("button");
    expect(native.attributes("data-variant")).toBe("destructive");
    expect(native.attributes("data-size")).toBe("sm");
    expect(native.classes()).toEqual(expect.arrayContaining(["btn", "btn--primary", "wakeb-sc-button"]));
  });

  it("renders PrimeIcons and Vuetify names as the Wakeb fallback: shadcn-vue has no icon set of its own", () => {
    const w = render(WButton, { props: { icon: "pi pi-check" } });
    expect(w.find(".wakeb-icon--fallback").exists()).toBe(true);
    expect(w.find("i.pi").exists()).toBe(false);
  });
});

describe("shadcn WLoading indicator", () => {
  it("keeps a decorative Lucide loader inside the named status", () => {
    const w = render(WLoading, { props: { label: "Saving", size: 32, providerProps: { strokeWidth: 3, absoluteStrokeWidth: true } } });
    const svg = w.get("svg.wakeb-sc-spinner");
    expect(svg.attributes("aria-hidden")).toBe("true");
    expect(svg.attributes("stroke-width")).toBe(String((3 * 24) / 32));
    expect(svg.attributes("style")).toContain("width: 32px");
    expect(w.get('[role="status"]').attributes("aria-label")).toBe("Saving");
  });
});

describe("shadcn WTabs, WTree and WCarousel keyboard and attribute targets", () => {
  const tabs = [
    { slot: "one", label: "One", content: "First" },
    { slot: "two", label: "Two", content: "Second" },
    { slot: "three", label: "Three", content: "Third" },
  ];

  it("mirrors horizontal tab arrows in right-to-left layouts without selecting", async () => {
    // jsdom does not inherit `direction`, so the computed layout direction a browser reports is stubbed.
    const computed = window.getComputedStyle;
    vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => Object.assign(computed(element, pseudo), { direction: "rtl" }));
    const w = render(WTabs, { props: { tabs } });
    const buttons = () => w.findAll<HTMLElement>("[role=tab]").map((tab) => tab.element);
    buttons()[0].focus();
    key(buttons()[0], "ArrowLeft");
    await settle();
    expect(document.activeElement).toBe(buttons()[1]);
    key(buttons()[1], "ArrowRight");
    await settle();
    expect(document.activeElement).toBe(buttons()[0]);
    key(buttons()[0], "End");
    await settle();
    expect(document.activeElement).toBe(buttons()[2]);
    expect(buttons()[0].getAttribute("aria-selected")).toBe("true");
    expect(buttons().map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
  });

  it("toggles branches with the shadcn-vue WButton and keeps action clicks off the node", async () => {
    const nodes = [{ id: 1, name: "Root", children: [{ id: 2, name: "Child" }] }];
    const w = render(WTree, { props: { nodes, expandedKeys: [] } });
    const toggle = w.get("button.tree__toggle");
    expect(toggle.attributes("data-slot")).toBe("button");
    expect(toggle.classes()).toContain("wakeb-sc-button");
    expect(toggle.attributes("aria-expanded")).toBe("false");
    await toggle.trigger("click");
    expect(w.emitted("toggle")).toEqual([[nodes[0]]]);
    expect(w.emitted("node-click")).toBeUndefined();
  });

  it("keeps focus on the matching arrow when arrow keys move slides", async () => {
    const w = render(WCarousel, { props: { slides: ["a", "b", "c"], showArrows: true }, slots: { slide: ({ slide }: { slide: string }) => h("p", slide) } });
    const [prev, next] = w.findAll<HTMLElement>(".wakeb-carousel__arrow").map((arrow) => arrow.element);
    next.focus();
    key(next, "ArrowRight");
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([[1]]);
    expect(document.activeElement).toBe(next);
    key(next, "ArrowLeft");
    await settle();
    expect(document.activeElement).toBe(prev);
  });

  it.each([
    ["WTabs", WTabs, { tabs }, ".wakeb-tabs"],
    ["WTree", WTree, { nodes: [{ id: 1, name: "Root" }] }, 'ul[role="tree"]'],
    ["WCarousel", WCarousel, { slides: [1, 2] }, '[role="region"]'],
  ] as const)("%s sends portable attributes to its documented root", (_name, component, props, selector) => {
    render(component, { props, attrs: { class: "caller-class", id: "caller-id", "data-test": "caller" } });
    const target = document.querySelector('[data-test="caller"]')!;
    expect(target.matches(selector)).toBe(true);
    expect(target.classList.contains("caller-class")).toBe(true);
    expect(target.id).toBe("caller-id");
  });
});

/*
 * Precompiled adapter CSS (SPEC R11): every class the shadcn renderers can put on the page has a rule
 * in the adapter sources, and nothing targets elements outside Wakeb-namespaced classes. The packed
 * consumer check repeats both assertions against the shipped style.css.
 */
describe("shadcn adapter CSS", () => {
  const dir = join(__dirname, "../src/adapters/shadcn");
  const sources = [...readdirSync(dir), ...readdirSync(join(dir, "ui")).map((name) => `ui/${name}`)]
    .filter((name) => name.endsWith(".vue"))
    .map((name) => readFileSync(join(dir, name), "utf8"));
  const styles = sources.map((source) => [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((match) => match[1]).join("\n")).join("\n");
  const templates = sources.map((source) => /<template>([\s\S]*)<\/template>/.exec(source)?.[1] ?? "").join("\n");

  it("styles every wakeb-sc class the templates use", () => {
    const used = new Set([...templates.matchAll(/wakeb-sc-[\w-]+/g)].map((match) => match[0]));
    expect(used.size).toBeGreaterThan(8);
    for (const name of used) expect(styles, name).toMatch(new RegExp(`\\.${name}(?![\\w-])`));
  });

  it("has no global reset: every top-level rule starts at a Wakeb class or an at-rule", () => {
    const css = styles.replace(/\/\*[\s\S]*?\*\//g, "");
    const topLevel = css.split("\n").filter((line) => /^\S.*[{,]\s*$/.test(line));
    expect(topLevel.length).toBeGreaterThan(10);
    for (const line of topLevel) expect(line, line).toMatch(/^(\.wakeb-|\.dropdown-activator|\.loading|@(keyframes|media))/);
    expect(css).not.toMatch(/(^|[\s,}])(\*|html|body|:root)\s*[,{]/);
  });
});
