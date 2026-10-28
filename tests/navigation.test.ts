import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import { createVuetify } from "vuetify";
import { WTabs, WTree, WDropdown, WButton } from "../src";
const wrappers: VueWrapper[] = [];
function render(c: any, o: any = {}) {
  const w = mount(c, {
    attachTo: document.body,
    global: { plugins: [createVuetify()] },
    ...o,
  });
  wrappers.push(w);
  return w;
}
afterEach(() => {
  for (const w of wrappers.splice(0)) w.unmount();
  document.body.innerHTML = "";
});
const settle = async () => {
  await flushPromises();
  await nextTick();
  await nextTick();
};
const tabs = [
  { slot: "one", label: "One", content: "First panel" },
  { slot: "two", label: "Two" },
];
describe("WTabs", () => {
  it("selects the first panel without an initial event and emits one click update", async () => {
    const w = render(WTabs, {
      props: { tabs },
      slots: { two: () => h("input", { value: "Draft" }) },
    });
    await settle();
    expect(w.emitted("updateTab")).toBeUndefined();
    expect(w.get("[role=tab][aria-selected=true]").text()).toBe("One");
    await w.findAll("[role=tab]")[1].trigger("click");
    await settle();
    expect(w.emitted("updateTab")).toEqual([["two"]]);
    expect(w.get("input").element.value).toBe("Draft");
  });
  it("syncs parent selections without echoing and keeps an empty switcher unselected", async () => {
    const w = render(WTabs, {
      props: { tabs, isSwitcherOnly: true, selectedTab: "" },
    });
    await settle();
    expect(w.find("[aria-selected=true]").exists()).toBe(false);
    await w.setProps({ selectedTab: "two" });
    await settle();
    expect(w.get("[aria-selected=true]").text()).toBe("Two");
    expect(w.emitted("updateTab")).toBeUndefined();
    expect(w.find(".v-card-text").exists()).toBe(false);
    await w.setProps({ selectedTab: "" });
    await settle();
    expect(w.find("[aria-selected=true]").exists()).toBe(false);
  });
  it("keeps numeric keys, custom value fields and explicit sizing", async () => {
    const w = render(WTabs, {
      props: {
        tabs: [
          { key: 0, label: "Zero" },
          { key: 2, label: "Two" },
        ],
        valueKey: "key",
        selectedTab: 0,
        tabHeight: 40,
        contentGap: 16,
      },
      slots: { "0": () => h("b", "Zero content") },
    });
    await settle();
    expect(w.text()).toContain("Zero content");
    expect(w.attributes("style")).toContain("--wakeb-tabs-item-height: 40px");
    expect(w.attributes("style")).toContain("gap: 16px");
    await w.findAll("[role=tab]")[1].trigger("click");
    await settle();
    expect(w.emitted("updateTab")).toEqual([[2]]);
  });
  it("retains trusted custom HTML/context and class callbacks as selection changes", async () => {
    const callback = vi.fn(
      (item: any, context: any) =>
        `<strong>${item.label}:${context.isSelected}</strong>`,
    );
    const classes = vi.fn((_i: any, _n: any, c: any) =>
      c.isSelected ? "chosen" : "idle",
    );
    const w = render(WTabs, {
      props: {
        tabs: [
          {
            slot: "one",
            label: "HTML",
            customHTML: callback,
            itemClassList: classes,
          },
          tabs[1],
        ],
      },
    });
    await settle();
    expect(w.get("strong").text()).toBe("HTML:true");
    expect(w.get("[role=tab]").classes()).toContain("chosen");
    expect(classes).toHaveBeenCalledWith(expect.anything(), 0, {
      value: "one",
      isSelected: true,
    });
    await w.findAll("[role=tab]")[1].trigger("click");
    await settle();
    expect(w.get("strong").text()).toBe("HTML:false");
  });
  it("lets tab-label replace custom HTML while header, actions, notification and icon slots stay available", async () => {
    const w = render(WTabs, {
      props: {
        tabs: [
          {
            slot: "one",
            label: "One",
            customHTML: "<b>Unused</b>",
            notification: 3,
          },
        ],
        isVertical: true,
        iconOnly: true,
      },
      slots: {
        header: () => h("h2", "Sections"),
        actions: () => h("button", "Save"),
        "tab-label": ({ tabItem, index }: any) =>
          h("em", `${tabItem.label}:${index}`),
      },
    });
    await settle();
    expect(w.find(".tab-custom-html").exists()).toBe(false);
    expect(w.get("em").text()).toBe("One:0");
    expect(w.get("[role=tab]").attributes("aria-label")).toBe("One");
    expect(w.get(".tab-notification").text()).toBe("3");
    expect(w.text()).toContain("Sections");
    expect(w.text()).toContain("Save");
    expect(w.find(".v-tabs--vertical").exists()).toBe(true);
  });
  it("preserves lazy panel state through a tab round trip and supports icon rendering without a registry", async () => {
    const draft = ref("Saved draft");
    const w = render(WTabs, {
      props: {
        tabs: [{ slot: "one", label: "One", icon: "$complete" }, tabs[1]],
      },
      slots: {
        one: () =>
          h("input", {
            value: draft.value,
            onInput: (e: Event) =>
              (draft.value = (e.target as HTMLInputElement).value),
          }),
        "tab-icon": ({ size }: any) => h("svg", { "data-size": size }),
      },
    });
    await settle();
    const input = w.get("input").element;
    await w.get("input").setValue("Edited draft");
    expect(w.get("svg").attributes("data-size")).toBe("sm");
    await w.findAll("[role=tab]")[1].trigger("click");
    await settle();
    await w.findAll("[role=tab]")[0].trigger("click");
    await settle();
    expect(w.get("input").element).toBe(input);
    expect(input.value).toBe("Edited draft");
  });
  it("uses Vuetify arrow-key focus navigation", async () => {
    const w = render(WTabs, { props: { tabs, isSwitcherOnly: true } });
    await settle();
    const buttons = w.findAll("[role=tab]");
    (buttons[0].element as HTMLElement).focus();
    await buttons[0].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(buttons[1].element);
  });
});
const nodes = [
  {
    id: 1,
    name: "Parent",
    description: "Branch",
    children: [
      { id: 2, name: "Child", children: [{ id: 3, name: "Leaf" }] },
      { id: 4, name: "Sibling" },
    ],
  },
  { id: 5, name: "Other" },
];
describe("WTree", () => {
  it("renders recursive defaults, active connectors and inline-editing string keys", () => {
    const w = render(WTree, {
      props: { nodes, expandedKeys: [1, 2], activeKey: 3, editingNodeId: "2" },
    });
    expect(w.text()).toContain("Leaf");
    expect(w.findAll(".tree__node-content--active")).toHaveLength(1);
    expect(w.findAll(".tree__node--inline-editing")).toHaveLength(1);
    expect(w.findAll(".tree__node-line-curve--active").length).toBeGreaterThan(
      0,
    );
    expect(w.get("[role=treeitem]").attributes("aria-expanded")).toBe("true");
  });
  it("emits original node payloads without mutating controlled expansion or selection", async () => {
    const w = render(WTree, { props: { nodes } });
    await w.get(".tree__node-content").trigger("click");
    expect(w.emitted("node-click")).toEqual([[nodes[0]]]);
    await w.get("button").trigger("click");
    expect(w.emitted("toggle")).toEqual([[nodes[0]]]);
    expect(w.find(".tree__children").exists()).toBe(false);
    expect(w.emitted("node-click")).toHaveLength(1);
    await w.setProps({ expandedKeys: [1] });
    expect(w.text()).toContain("Child");
  });
  it("forwards node/actions/toggle slots to all levels and isolates action clicks", async () => {
    const w = render(WTree, {
      props: { nodes, expandedKeys: [1, 2] },
      slots: {
        node: ({ node, level }: any) => h("b", `${node.name}:${level}`),
        actions: ({ node }: any) =>
          h("button", { "data-action": node.id }, "Edit"),
        "toggle-leading": ({ hasChildren, toggle }: any) =>
          hasChildren
            ? h(
                "button",
                {
                  "data-toggle": true,
                  onClick: (e: Event) => {
                    e.stopPropagation();
                    toggle();
                  },
                },
                "Open",
              )
            : null,
        "toggle-trailing": () => null,
      },
    });
    expect(w.text()).toContain("Leaf:2");
    await w.get("button[data-action]").trigger("click");
    expect(w.emitted("node-click")).toBeUndefined();
    await w.get("button[data-toggle]").trigger("click");
    expect(w.emitted("toggle")).toEqual([[nodes[0]]]);
  });
  it("supports roving arrows, Home/End, keyboard selection and controlled expansion", async () => {
    const w = render(WTree, { props: { nodes, expandedKeys: [1] } });
    const items = w.findAll("[role=treeitem]");
    (items[0].element as HTMLElement).focus();
    await items[0].trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1].element);
    await items[1].trigger("keydown", { key: "Enter" });
    expect(w.emitted("node-click")).toEqual([[nodes[0].children[0]]]);
    await items[1].trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("toggle")).toEqual([[nodes[0].children[0]]]);
    await items[1].trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(items.at(-1)!.element);
    await items.at(-1)!.trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(items[0].element);
  });
  it("reverses branch arrows in RTL and returns focus to the parent on collapse navigation", async () => {
    const w = render(WTree, { props: { nodes, rtl: true, expandedKeys: [1] } });
    let items = w.findAll("[role=treeitem]");
    (items[1].element as HTMLElement).focus();
    await items[1].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(items[0].element);
    await items[0].trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("toggle")).toEqual([[nodes[0]]]);
    await w.setProps({ expandedKeys: [] });
    expect(w.findAll('[tabindex="0"]')).toHaveLength(1);
  });
  it("does not intercept keys from nested inputs or legacy adapters", async () => {
    const w = render(WTree, {
      props: { nodes, keyboardNavigation: false },
      slots: { node: () => h("input") },
    });
    expect(w.find("[role=tree]").exists()).toBe(false);
    expect(w.find("[tabindex]").exists()).toBe(false);
    await w.get("input").trigger("keydown", { key: "Enter" });
    expect(w.emitted("node-click")).toBeUndefined();
  });
  it("handles custom fields and resets the roving target when data disappears", async () => {
    const w = render(WTree, {
      props: {
        nodes: [{ key: "a", title: "Team", children: [] }],
        itemKey: "key",
        itemLabel: "title",
      },
    });
    expect(w.get("[role=treeitem]").attributes("tabindex")).toBe("0");
    await w.setProps({ nodes: [{ key: "b", title: "Next" }] });
    expect(w.get("[role=treeitem]").attributes("tabindex")).toBe("0");
    expect(w.text()).toBe("Next");
  });
});
const menuItems = [
  { label: "Pending", value: 0, icon: "$complete", color: "warning" },
  { label: "Approved", value: 2, color: "success" },
  { label: "Blocked", value: 3, disabled: true },
];
async function open(w: VueWrapper) {
  const button = w.get("button");
  (button.element as HTMLElement).focus();
  await button.trigger("click");
  await vi.waitFor(() =>
    expect(document.querySelector(".v-overlay--active .v-list")).not.toBeNull(),
  );
}
describe("WDropdown", () => {
  it("emits item then model once and updates label/leading icon without mutating records", async () => {
    const events: string[] = [];
    const w = render(WDropdown, {
      props: { menuItems, title: "Status", showSelected: true },
      attrs: {
        onSelectedItem: () => events.push("item"),
        "onUpdate:modelValue": () => events.push("model"),
      },
    });
    await open(w);
    (
      document.querySelectorAll(
        ".v-overlay--active .v-list-item",
      )[1] as HTMLElement
    ).click();
    await settle();
    expect(w.emitted("selectedItem")).toEqual([[menuItems[1]]]);
    expect(w.emitted("update:modelValue")).toEqual([[2]]);
    expect(events).toEqual(["item", "model"]);
    expect(w.get("button").text()).toContain("Approved");
    expect(w.get("button").attributes("aria-label")).toBe("Approved");
  });
  it("syncs numeric zero and label keys without echoing, and retains selection on null", async () => {
    const w = render(WDropdown, {
      props: { menuItems, modelValue: 0, showBoth: true, title: "Status" },
    });
    expect(w.get("button").text()).toContain("Status: Pending");
    await w.setProps({ modelValue: "Approved" });
    expect(w.get("button").text()).toContain("Approved");
    expect(w.get("button").attributes("aria-label")).toBe("Status: Approved");
    await w.setProps({ modelValue: null });
    expect(w.get("button").text()).toContain("Approved");
    expect(w.get("button").attributes("aria-label")).toBe("Status: Approved");
    expect(w.emitted("selectedItem")).toBeUndefined();
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });
  it("respects disabled/loading states and disabled rows", async () => {
    const w = render(WDropdown, {
      props: { menuItems, title: "Status", isLoading: true },
    });
    expect(w.get("button").attributes("disabled")).toBeDefined();
    await w.setProps({ isLoading: false });
    await open(w);
    (
      document.querySelectorAll(
        ".v-overlay--active .v-list-item",
      )[2] as HTMLElement
    ).click();
    await settle();
    expect(w.emitted("selectedItem")).toBeUndefined();
  });
  it("uses host formatting, semantic colors, custom icon slots and explicit overlay styles", async () => {
    const w = render(WDropdown, {
      props: {
        menuItems,
        title: "Status",
        showSelected: true,
        modelValue: 0,
        labelFormatter: (x: string) => `ترجمة ${x}`,
        colorMap: { warning: "#aa5500" },
        menuStyle: { backgroundColor: "#112233" },
      },
      slots: {
        "item-icon": ({ item, color }: any) =>
          h("svg", { "data-label": item.label, "data-color": color }),
      },
    });
    expect(w.get("button").text()).toContain("ترجمة Pending");
    await open(w);
    expect(document.querySelector(".v-list")?.getAttribute("style")).toContain(
      "rgb(17, 34, 51)",
    );
    expect(
      document.querySelector("svg[data-color]")?.getAttribute("data-color"),
    ).toBe("#aa5500");
  });
  it("provides an activator contract and item-label slot without requiring a router", async () => {
    const w = render(WDropdown, {
      props: {
        menuItems: [{ label: "Documentation", href: "#docs" }],
        title: "Links",
        isLinks: true,
      },
      slots: {
        activator: ({ props, buttonProps }: any) =>
          h("button", props, buttonProps.title),
      },
    });
    await open(w);
    expect(document.querySelector(".v-list a")?.getAttribute("href")).toBe(
      "#docs",
    );
  });
  it("keeps showSelected precedence and no leading icon until an actual selection exists", () => {
    const w = render(WDropdown, {
      props: { menuItems, title: "Status", showSelected: true, showBoth: true },
    });
    expect(w.getComponent(WButton).props("title")).toBe("Status");
    expect(w.getComponent(WButton).props("isDropdown")).toBe(false);
  });
});
