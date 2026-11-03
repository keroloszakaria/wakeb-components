import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { createVuetify } from "vuetify";
import { VDialog } from "vuetify/components/VDialog";
import {
  WAvatarStack,
  WBadgeStack,
  WButton,
  WDropdown,
  WExportDropdown,
  WModal,
  WSegmentedProgress,
  WTabs,
  WTree,
} from "../src";
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
async function openMenu(w: VueWrapper) {
  await w.get("button").trigger("click");
  await vi.waitFor(() =>
    expect(document.querySelector(".v-overlay--active .v-list")).not.toBeNull(),
  );
}

describe("WSegmentedProgress geometry", () => {
  it("sizes segments from a zero basis so labels cannot skew the ratio", () => {
    const w = render(WSegmentedProgress, {
      props: { value: 10, label: "A long label that is wider than ten percent" },
    });
    const fill = w.get(".segmented-progress__fill").element as HTMLElement;
    const track = w.get(".segmented-progress__track").element as HTMLElement;
    expect(fill.style.flex).toBe("10 1 0%");
    expect(track.style.flex).toBe("90 1 0%");
  });
});

describe("WDropdown contracts", () => {
  it("prefers an exact value over another row's matching label", () => {
    const w = render(WDropdown, {
      props: {
        title: "Pick",
        showSelected: true,
        modelValue: "b",
        menuItems: [
          { label: "b", value: "a" },
          { label: "Bravo", value: "b" },
        ],
      },
    });
    expect(w.get("button").text()).toContain("Bravo");
  });
  it("refreshes the selected label when item records are replaced", async () => {
    const w = render(WDropdown, {
      props: {
        title: "Pick",
        showSelected: true,
        modelValue: 1,
        menuItems: [{ label: "Draft", value: 1 }],
      },
    });
    await w.setProps({ menuItems: [{ label: "Published", value: 1 }] });
    expect(w.get("button").text()).toContain("Published");
  });
  it("exposes menu roles and removes navigation from disabled links", async () => {
    const w = render(WDropdown, {
      props: {
        title: "Links",
        isLinks: true,
        menuItems: [
          { label: "Docs", href: "#docs" },
          { label: "Admin", href: "#admin", disabled: true },
        ],
      },
    });
    expect(w.get("button").attributes("aria-haspopup")).toBe("menu");
    await openMenu(w);
    const list = document.querySelector(".v-overlay--active .v-list")!;
    expect(list.getAttribute("role")).toBe("menu");
    const rows = list.querySelectorAll("[role=menuitem]");
    expect(rows).toHaveLength(2);
    expect(rows[0].getAttribute("href")).toBe("#docs");
    expect(rows[1].hasAttribute("href")).toBe(false);
    expect(rows[1].getAttribute("aria-disabled")).toBe("true");
    (rows[1] as HTMLElement).click();
    await settle();
    expect(w.emitted("selectedItem")).toBeUndefined();
  });
});

describe("Overflow and export menus", () => {
  it("uses menu roles for export actions", async () => {
    const w = render(WExportDropdown, {
      props: { formats: [{ label: "CSV", value: "csv", disabled: true }] },
    });
    await openMenu(w);
    const row = document.querySelector(".v-overlay--active [role=menuitem]");
    expect(document.querySelector(".v-overlay--active [role=menu]")).not.toBeNull();
    expect(row?.getAttribute("aria-disabled")).toBe("true");
  });
  it("does not announce informational overflow lists as menus", () => {
    const badges = render(WBadgeStack, {
      props: { items: [{ label: "A" }, { label: "B" }], showOverflowMenu: true },
    });
    const avatars = render(WAvatarStack, {
      props: { items: [{ name: "A" }, { name: "B" }], max: 1, showOverflowMenu: true },
    });
    expect(badges.get(".badge-stack__overflow-activator").attributes("aria-haspopup")).toBeUndefined();
    expect(avatars.get(".actor-overflow").attributes("aria-haspopup")).toBeUndefined();
  });
  it("keeps circular icon styles on the teleported overflow list", async () => {
    const w = render(WBadgeStack, {
      props: {
        items: [{ label: "A" }, { label: "B", icon: "/b.svg" }],
        showOverflowMenu: true,
        iconVariant: "circle",
      },
    });
    await w.get(".badge-stack__overflow-activator").trigger("click");
    await vi.waitFor(() =>
      expect(
        document.querySelector(".v-overlay--active .overflow-menu-list"),
      ).not.toBeNull(),
    );
    expect(
      document
        .querySelector(".v-overlay--active .overflow-menu-list")
        ?.classList.contains("badge-stack--circle-icon"),
    ).toBe(true);
  });
});

describe("WTabs ARIA linkage", () => {
  it("links each tab to its panel with ids unique across instances", async () => {
    const tabs = [
      { slot: "a", label: "A", content: "First" },
      { slot: "b", label: "B", content: "Second" },
    ];
    // Vue's useId is unique per app, so both instances share one app here.
    const page = render({
      render: () => [h(WTabs, { tabs }), h(WTabs, { tabs })],
    });
    await settle();
    const [one, two] = page.findAllComponents(WTabs);
    const ids = new Set<string>();
    for (const w of [one, two]) {
      const selected = w.get("[role=tab][aria-selected=true]");
      const panel = document.getElementById(selected.attributes("aria-controls")!);
      expect(panel?.getAttribute("role")).toBe("tabpanel");
      expect(panel?.getAttribute("aria-labelledby")).toBe(selected.attributes("id"));
      for (const tab of w.findAll("[role=tab]")) ids.add(tab.attributes("id")!);
    }
    expect(ids.size).toBe(4);
    await one.findAll("[role=tab]")[1].trigger("click");
    await settle();
    const second = one.findAll("[role=tab]")[1];
    expect(
      document.getElementById(second.attributes("aria-controls")!)?.textContent,
    ).toContain("Second");
  });
  it("omits panel references for switcher-only tabs", async () => {
    const w = render(WTabs, {
      props: { tabs: [{ slot: "a", label: "A" }], isSwitcherOnly: true },
    });
    await settle();
    expect(w.get("[role=tab]").attributes("aria-controls")).toBeUndefined();
  });
});

describe("WButton loading", () => {
  it.each([false, true])(
    "suppresses click and native submit while loading (tooltip %s)",
    async (isTooltip) => {
      const submit = vi.fn((event: Event) => event.preventDefault());
      const form = document.createElement("form");
      form.addEventListener("submit", submit);
      document.body.append(form);
      const w = render(WButton, {
        attachTo: form,
        props: { title: "Save", action: "submit", isLoading: true, isTooltip },
      });
      (w.get("button").element as HTMLButtonElement).click();
      await settle();
      expect(w.emitted("click")).toBeUndefined();
      expect(submit).not.toHaveBeenCalled();
      expect(w.get("button").attributes("aria-busy")).toBe("true");
    },
  );
  it("emits exactly once when idle", async () => {
    const w = render(WButton, { props: { title: "Save" } });
    await w.get("button").trigger("click");
    expect(w.emitted("click")).toHaveLength(1);
  });
});

describe("WModal header and width", () => {
  it("renders a description-only header", async () => {
    render(WModal, {
      props: { modelValue: true, closable: false, description: "Only details" },
    });
    await settle();
    expect(document.querySelector(".wakeb-modal__description")?.textContent).toContain(
      "Only details",
    );
  });
  it("lets width win and falls back to a native max-width attr", async () => {
    const both = render(WModal, {
      props: { modelValue: false, width: 640 },
      attrs: { "max-width": 320 },
    });
    const native = render(WModal, {
      props: { modelValue: false },
      attrs: { "max-width": 320 },
    });
    expect(both.getComponent(VDialog).props("maxWidth")).toBe(640);
    expect(native.getComponent(VDialog).props("maxWidth")).toBe(320);
  });
});

describe("WTree focus recovery", () => {
  const nodes = [{ id: 1, name: "Root", children: [{ id: 2, name: "Child" }] }];
  it("moves focus to the surviving ancestor when the focused row collapses", async () => {
    const w = render(WTree, { props: { nodes, expandedKeys: [1] } });
    await settle();
    (w.get('[data-tree-key="2"]').element as HTMLElement).focus();
    await w.setProps({ expandedKeys: [] });
    await settle();
    expect(document.activeElement?.getAttribute("data-tree-key")).toBe("1");
    expect(w.get('[data-tree-key="1"]').attributes("tabindex")).toBe("0");
  });
  it("never steals focus from outside the tree", async () => {
    const outside = document.createElement("input");
    document.body.append(outside);
    const w = render(WTree, { props: { nodes, expandedKeys: [1] } });
    await settle();
    (w.get('[data-tree-key="2"]').element as HTMLElement).focus();
    outside.focus();
    await w.setProps({ expandedKeys: [] });
    await settle();
    expect(document.activeElement).toBe(outside);
  });
});
