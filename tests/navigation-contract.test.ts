import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WCarousel, WTabs, WTree } from "../src";
import { framework, wakeb } from "./wakeb";

/*
 * Shared WTabs, WTree and WCarousel contract (SPEC R12, R13, R18; IMPLEMENTATION M4), run once per
 * provider project. Queries use roles and Wakeb classes only: provider markup is not part of the contract.
 */
const host = () => (framework === "vuetify" ? createVuetify() : ([PrimeVue, { theme: "none" }] as const));
const wrappers: VueWrapper[] = [];
const render = (component: unknown, options: Record<string, unknown> = {}, plugin = wakeb()) => {
  const w = mount(component as never, {
    attachTo: document.body,
    global: { plugins: [host() as never, plugin], stubs: { transition: false } },
    ...options,
  });
  wrappers.push(w);
  return w;
};
const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
};
/** Names of the declared events, in emission order. */
const order = (w: VueWrapper, names: string[]) => Object.keys(w.emitted()).filter((name) => names.includes(name));
afterEach(() => {
  for (const w of wrappers.splice(0)) w.unmount();
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const tabs = Object.freeze([
  Object.freeze({ slot: "one", label: "One", content: "First panel" }),
  Object.freeze({ slot: "two", label: "Two" }),
  Object.freeze({ slot: "three", label: "Three", content: "Third panel" }),
]);
const tabButtons = (w: VueWrapper) => w.findAll("[role=tab]");
const selectedTab = (w: VueWrapper) => w.findAll('[role=tab][aria-selected="true"]');

describe(`WTabs contract (${framework})`, () => {
  it("selects the first tab silently, then emits updateTab once per click", async () => {
    const w = render(WTabs, { props: { tabs }, slots: { two: () => h("input", { class: "draft", value: "Draft" }) } });
    await settle();
    expect(w.emitted("updateTab")).toBeUndefined();
    expect(selectedTab(w).map((tab) => tab.text())).toEqual(["One"]);
    await tabButtons(w)[1].trigger("click");
    await settle();
    // Clicking the selected tab again changes nothing.
    await tabButtons(w)[1].trigger("click");
    await settle();
    expect(w.emitted("updateTab")).toEqual([["two"]]);
    expect(order(w, ["updateTab"])).toEqual(["updateTab"]);
    expect((w.get(".draft").element as HTMLInputElement).value).toBe("Draft");
  });

  it("follows selectedTab without echo and keeps an empty switcher unselected", async () => {
    const w = render(WTabs, { props: { tabs, isSwitcherOnly: true, selectedTab: "" } });
    await settle();
    expect(selectedTab(w)).toHaveLength(0);
    await w.setProps({ selectedTab: "three" });
    await settle();
    expect(selectedTab(w).map((tab) => tab.text())).toEqual(["Three"]);
    await w.setProps({ selectedTab: "" });
    await settle();
    expect(selectedTab(w)).toHaveLength(0);
    expect(w.emitted("updateTab")).toBeUndefined();
    expect(w.find("[role=tabpanel]").exists()).toBe(false);
  });

  it("keeps numeric zero keys with a custom valueKey", async () => {
    const w = render(WTabs, {
      props: { tabs: [{ key: 0, label: "Zero" }, { key: 2, label: "Two" }], valueKey: "key", selectedTab: 0 },
      slots: { "0": () => h("b", "Zero content"), "2": () => h("b", "Two content") },
    });
    await settle();
    expect(selectedTab(w).map((tab) => tab.text())).toEqual(["Zero"]);
    expect(w.get("[role=tabpanel]").text()).toBe("Zero content");
    await tabButtons(w)[1].trigger("click");
    await settle();
    expect(w.emitted("updateTab")).toEqual([[2]]);
    // The parent accepts the change, then selects zero again; neither sync echoes.
    await w.setProps({ selectedTab: 2 });
    await settle();
    await w.setProps({ selectedTab: 0 });
    await settle();
    expect(selectedTab(w).map((tab) => tab.text())).toEqual(["Zero"]);
    expect(w.emitted("updateTab")).toHaveLength(1);
  });

  it("links the selected tab and its panel with app-unique ids and names the tablist", async () => {
    const w = render(WTabs, { props: { tabs, ariaLabel: "Sections", isVertical: true } });
    await settle();
    const list = w.get("[role=tablist]");
    expect(list.attributes("aria-label")).toBe("Sections");
    expect(list.attributes("aria-orientation")).toBe("vertical");
    const ids = tabButtons(w).map((tab) => tab.attributes("id"));
    expect(new Set(ids).size).toBe(3);
    const panel = document.getElementById(selectedTab(w)[0].attributes("aria-controls")!);
    expect(panel?.getAttribute("role")).toBe("tabpanel");
    expect(panel?.getAttribute("aria-labelledby")).toBe(ids[0]);
    expect(panel?.textContent).toContain("First panel");
    // Inactive panels are lazy: only the selected tab references a panel.
    expect(tabButtons(w)[1].attributes("aria-controls")).toBeUndefined();
  });

  it("offers one tab stop and moves focus with arrows, Home and End without selecting", async () => {
    const w = render(WTabs, { props: { tabs } });
    await settle();
    const buttons = tabButtons(w);
    expect(buttons.map((tab) => tab.attributes("tabindex"))).toEqual(["0", "-1", "-1"]);
    (buttons[0].element as HTMLElement).focus();
    await buttons[0].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(buttons[1].element);
    await buttons[1].trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(buttons[2].element);
    await buttons[2].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(buttons[0].element);
    await buttons[0].trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement).toBe(buttons[2].element);
    await buttons[2].trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(buttons[0].element);
    await settle();
    expect(w.emitted("updateTab")).toBeUndefined();
  });

  it("keeps a visited panel mounted through a round trip", async () => {
    const w = render(WTabs, {
      props: { tabs: [{ slot: "one", label: "One" }, tabs[1]] },
      slots: { one: () => h("input", { class: "kept" }) },
    });
    await settle();
    const input = w.get(".kept").element as HTMLInputElement;
    input.value = "Edited";
    await tabButtons(w)[1].trigger("click");
    await settle();
    await tabButtons(w)[0].trigger("click");
    await settle();
    expect(w.get(".kept").element).toBe(input);
    expect(input.value).toBe("Edited");
    expect(w.emitted("updateTab")).toEqual([["two"], ["one"]]);
  });

  it("passes label and icon slot payloads and names icon-only tabs", async () => {
    const seen: unknown[] = [];
    const w = render(WTabs, {
      props: { tabs: [{ slot: "one", label: "One", icon: "$complete", notification: 3 }], iconOnly: true, iconSize: "md" },
      slots: { "tab-icon": (payload: unknown) => (seen.push(payload), h("i", { class: "custom-icon" })) },
    });
    await settle();
    expect(seen[0]).toMatchObject({ tabItem: { slot: "one" }, index: 0, size: "md" });
    expect(tabButtons(w)[0].attributes("aria-label")).toBe("One");
    expect(w.get(".tab-notification").text()).toBe("3");
  });

  it("uses the Arabic default name", async () => {
    const w = render(WTabs, { props: { tabs } }, wakeb({ locale: "ar" }));
    await settle();
    expect(w.get("[role=tablist]").attributes("aria-label")).toBe("علامات التبويب");
  });
});

const deepFreeze = <T>(value: T): T => {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
};
const nodes = deepFreeze([
  {
    id: 0,
    name: "Root",
    description: "Branch",
    children: [
      { id: 2, name: "Child", children: [{ id: 3, name: "Leaf" }] },
      { id: 4, name: "Sibling" },
    ],
  },
  { id: 5, name: "Other" },
]);
const row = (w: VueWrapper, key: number | string) => w.get(`[data-tree-key="${key}"]`);
const toggleOf = (w: VueWrapper, key: number | string) =>
  row(w, key).find('[aria-label="Toggle branch"]').element.closest("button") as HTMLButtonElement;

describe(`WTree contract (${framework})`, () => {
  it("emits original records and never changes controlled expansion itself", async () => {
    const w = render(WTree, { props: { nodes } });
    await w.get(".tree__node-content").trigger("click");
    toggleOf(w, 0).click();
    await settle();
    expect(w.emitted("node-click")).toEqual([[nodes[0]]]);
    expect(w.emitted("node-click")![0][0]).toBe(nodes[0]);
    expect(w.emitted("toggle")).toEqual([[nodes[0]]]);
    expect(order(w, ["node-click", "toggle"])).toEqual(["node-click", "toggle"]);
    expect(w.find(".tree__children").exists()).toBe(false);
    await w.setProps({ expandedKeys: [0] });
    expect(w.text()).toContain("Child");
    expect(row(w, 0).attributes("aria-expanded")).toBe("true");
    expect(w.emitted("toggle")).toHaveLength(1);
  });

  it("treats zero keys and a null activeKey as real values", async () => {
    const w = render(WTree, { props: { nodes, expandedKeys: [0, 2], activeKey: 0 } });
    expect(row(w, 0).attributes("aria-selected")).toBe("true");
    expect(w.findAll(".tree__node-content--active")).toHaveLength(1);
    await w.setProps({ activeKey: 3 });
    expect(row(w, 3).attributes("aria-selected")).toBe("true");
    expect(row(w, 0).attributes("aria-selected")).toBe("false");
    expect(w.findAll(".tree__node-line-curve--active").length).toBeGreaterThan(0);
    await w.setProps({ activeKey: null });
    expect(w.findAll('[aria-selected="true"]')).toHaveLength(0);
    expect(w.emitted()).not.toHaveProperty("node-click");
  });

  it("exposes tree semantics with one roving tab stop", () => {
    const w = render(WTree, { props: { nodes, expandedKeys: [0], ariaLabel: "Teams" } });
    const tree = w.get("[role=tree]");
    expect(tree.element).toBe(w.element);
    expect(tree.attributes("aria-label")).toBe("Teams");
    expect(w.findAll("[role=group]")).toHaveLength(1);
    expect(row(w, 2).attributes()).toMatchObject({ "aria-level": "2", "aria-posinset": "1", "aria-setsize": "2" });
    expect(w.findAll('[role=treeitem][tabindex="0"]')).toHaveLength(1);
  });

  it("navigates with arrows, Home and End, requests selection with Enter and Space", async () => {
    const w = render(WTree, { props: { nodes, expandedKeys: [0] } });
    const items = w.findAll("[role=treeitem]");
    (items[0].element as HTMLElement).focus();
    await items[0].trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1].element);
    await items[1].trigger("keydown", { key: "Enter" });
    await items[1].trigger("keydown", { key: " " });
    expect(w.emitted("node-click")).toEqual([[nodes[0].children[0]], [nodes[0].children[0]]]);
    await items[1].trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("toggle")).toEqual([[nodes[0].children[0]]]);
    await items[1].trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement).toBe(items[0].element);
    await items[0].trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(items.at(-1)!.element);
    await items.at(-1)!.trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(items[0].element);
    expect(w.emitted("toggle")).toHaveLength(1);
  });

  it("reverses branch arrows when rtl is set", async () => {
    const w = render(WTree, { props: { nodes, rtl: true, expandedKeys: [0] } });
    const items = w.findAll("[role=treeitem]");
    (items[1].element as HTMLElement).focus();
    await items[1].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(items[0].element);
    await items[0].trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("toggle")).toEqual([[nodes[0]]]);
  });

  it("moves focus to the surviving ancestor only when focus was inside the tree", async () => {
    const w = render(WTree, { props: { nodes, expandedKeys: [0] } });
    await settle();
    (row(w, 2).element as HTMLElement).focus();
    await w.setProps({ expandedKeys: [] });
    await settle();
    expect(document.activeElement?.getAttribute("data-tree-key")).toBe("0");
    const outside = document.createElement("input");
    document.body.append(outside);
    await w.setProps({ expandedKeys: [0] });
    await settle();
    (row(w, 2).element as HTMLElement).focus();
    outside.focus();
    await w.setProps({ expandedKeys: [] });
    await settle();
    expect(document.activeElement).toBe(outside);
  });

  it("forwards node, actions and toggle slots to every level and isolates action clicks", async () => {
    const w = render(WTree, {
      props: { nodes, expandedKeys: [0, 2] },
      slots: {
        node: ({ node, level, expanded }: any) => h("b", `${node.name}:${level}:${expanded}`),
        actions: ({ node }: any) => h("button", { "data-action": node.id }, "Edit"),
        "toggle-trailing": ({ hasChildren, toggle }: any) => (hasChildren ? h("button", { "data-toggle": "", onClick: toggle }, "T") : null),
      },
    });
    expect(w.text()).toContain("Root:0:true");
    expect(w.text()).toContain("Leaf:2:false");
    await w.get("button[data-action]").trigger("click");
    expect(w.emitted("node-click")).toBeUndefined();
    await w.findAll("button[data-toggle]")[1].trigger("click");
    expect(w.emitted("toggle")).toEqual([[nodes[0].children[0]]]);
  });

  it("drops tree roles and tab stops when keyboard navigation is off", async () => {
    const w = render(WTree, { props: { nodes, keyboardNavigation: false }, slots: { node: () => h("input") } });
    expect(w.find("[role=tree]").exists()).toBe(false);
    expect(w.find("[role=treeitem]").exists()).toBe(false);
    await w.get("input").trigger("keydown", { key: "Enter" });
    expect(w.emitted("node-click")).toBeUndefined();
  });
});

const slides = Object.freeze(["First", "Second", "Third"]);
const region = (w: VueWrapper) => w.get('[role="region"]');
const indicatorButtons = (w: VueWrapper) => w.findAll(".carousel-indicators button");

describe(`WCarousel contract (${framework})`, () => {
  it("names the region, passes slide payloads and routes attrs to the region", async () => {
    const seen: unknown[] = [];
    const w = render(WCarousel, {
      props: { slides, cycle: false, ariaLabel: "Highlights" },
      attrs: { id: "slides", "data-owner": "team" },
      slots: { slide: (payload: { slide: string; index: number }) => (seen.push(payload), h("p", `${payload.index}:${payload.slide}`)) },
    });
    await settle();
    expect(region(w).attributes()).toMatchObject({ "aria-label": "Highlights", "aria-roledescription": "carousel", id: "slides", "data-owner": "team" });
    expect(w.text()).toContain("0:First");
    expect(seen[0]).toEqual({ slide: "First", index: 0 });
  });

  it("changes slides once through native indicators and follows the parent silently", async () => {
    const w = render(WCarousel, {
      props: { slides, cycle: false, showIndicators: true, indicatorLabel: (index: number) => `Slide ${index + 1}` },
    });
    const buttons = indicatorButtons(w);
    expect(buttons[1].attributes()).toMatchObject({ type: "button", "aria-label": "Slide 2" });
    expect(buttons[0].attributes("aria-current")).toBe("true");
    await buttons[1].trigger("click");
    await buttons[1].trigger("click");
    expect(w.emitted("update:modelValue")).toEqual([[1]]);
    expect(buttons[1].attributes("aria-current")).toBe("true");
    await w.setProps({ modelValue: 2 });
    await settle();
    expect(w.emitted("update:modelValue")).toHaveLength(1);
    expect(buttons[2].attributes("aria-current")).toBe("true");
    await w.setProps({ modelValue: 0 });
    await settle();
    expect(buttons[0].attributes("aria-current")).toBe("true");
    expect(w.emitted("update:modelValue")).toHaveLength(1);
  });

  it("moves between indicators with Home, End and wrapping arrows", async () => {
    const w = render(WCarousel, { props: { slides, cycle: false, showIndicators: true } });
    const buttons = indicatorButtons(w);
    (buttons[0].element as HTMLElement).focus();
    await buttons[0].trigger("keydown", { key: "End" });
    await nextTick();
    expect(document.activeElement).toBe(buttons[2].element);
    await buttons[2].trigger("keydown", { key: "ArrowRight" });
    await nextTick();
    expect(document.activeElement).toBe(buttons[0].element);
    await buttons[0].trigger("keydown", { key: "ArrowLeft" });
    await nextTick();
    expect(w.emitted("update:modelValue")).toEqual([[2], [0], [2]]);
  });

  it("gives custom arrows click handlers and names, wrapping at both ends", async () => {
    let prevPayload: Record<string, unknown> = {};
    const w = render(WCarousel, {
      props: { slides, cycle: false, showArrows: true },
      slots: {
        prev: ({ props }: { props: Record<string, unknown> }) => ((prevPayload = props), h("button", { ...props, class: "my-prev" }, "Previous")),
        next: ({ props }: { props: Record<string, unknown> }) => h("button", { ...props, class: "my-next" }, "Next"),
      },
    });
    expect(typeof prevPayload.onClick).toBe("function");
    expect(typeof prevPayload["aria-label"]).toBe("string");
    await w.get(".my-prev").trigger("click");
    await settle();
    await w.get(".my-next").trigger("click");
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([[2], [0]]);
  });

  describe("automatic cycling", () => {
    const cycling = (props: Record<string, unknown> = {}) =>
      render(WCarousel, { props: { slides, cycle: true, interval: 100, showIndicators: true, ...props } });
    const advance = async (ms: number) => {
      await vi.advanceTimersByTimeAsync(ms);
      await nextTick();
    };

    it("advances once per interval, wraps, and stops when cycle turns off", async () => {
      vi.useFakeTimers();
      const w = cycling();
      await nextTick();
      await advance(110);
      expect(w.emitted("update:modelValue")).toEqual([[1]]);
      await advance(100);
      await advance(100);
      expect(w.emitted("update:modelValue")).toEqual([[1], [2], [0]]);
      await w.setProps({ cycle: false });
      await advance(1000);
      expect(w.emitted("update:modelValue")).toHaveLength(3);
    });

    it("pauses while hovered or focused and resumes afterwards", async () => {
      vi.useFakeTimers();
      const w = cycling();
      await nextTick();
      await region(w).trigger("mouseenter");
      await advance(500);
      expect(w.emitted("update:modelValue")).toBeUndefined();
      await region(w).trigger("mouseleave");
      await w.get(".carousel-indicators").trigger("mouseenter");
      await advance(500);
      expect(w.emitted("update:modelValue")).toBeUndefined();
      await w.get(".carousel-indicators").trigger("mouseleave");
      indicatorButtons(w)[1].element.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
      await advance(500);
      expect(w.emitted("update:modelValue")).toBeUndefined();
      indicatorButtons(w)[1].element.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: null }));
      await advance(110);
      expect(w.emitted("update:modelValue")).toEqual([[1]]);
    });

    it("pauses while the document is hidden", async () => {
      vi.useFakeTimers();
      const state = vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
      const w = cycling();
      await nextTick();
      await advance(500);
      expect(w.emitted("update:modelValue")).toBeUndefined();
      state.mockReturnValue("visible");
      document.dispatchEvent(new Event("visibilitychange"));
      await advance(110);
      expect(w.emitted("update:modelValue")).toEqual([[1]]);
    });

    it("does not cycle when the user prefers reduced motion", async () => {
      vi.useFakeTimers();
      vi.spyOn(window, "matchMedia").mockImplementation(
        (query: string) =>
          ({ matches: query.includes("reduce"), media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
      );
      const w = cycling();
      await nextTick();
      await advance(1000);
      expect(w.emitted("update:modelValue")).toBeUndefined();
    });

    it("removes its timer and listeners on unmount", async () => {
      vi.useFakeTimers();
      const removed = vi.spyOn(document, "removeEventListener");
      const w = cycling();
      await nextTick();
      w.unmount();
      wrappers.splice(wrappers.indexOf(w), 1);
      await advance(1000);
      expect(w.emitted("update:modelValue")).toBeUndefined();
      expect(removed.mock.calls.some(([type]) => type === "visibilitychange")).toBe(true);
    });
  });

  it("keeps a visited slide mounted and accepts readonly records", async () => {
    const records = Object.freeze([Object.freeze({ title: "A" }), Object.freeze({ title: "B" })]);
    const view = defineComponent(() => {
      const index = ref(0);
      return () =>
        h(
          WCarousel,
          { slides: records, cycle: false, showIndicators: true, modelValue: index.value, "onUpdate:modelValue": (v: number) => (index.value = v) },
          { slide: ({ slide }: { slide: { title: string } }) => h("input", { class: `slide-${slide.title}` }) },
        );
    });
    const w = render(view);
    await settle();
    const first = w.get(".slide-A").element as HTMLInputElement;
    first.value = "kept";
    await indicatorButtons(w)[1].trigger("click");
    await settle();
    await indicatorButtons(w)[0].trigger("click");
    await settle();
    expect(w.get(".slide-A").element).toBe(first);
    expect(first.value).toBe("kept");
  });
});
