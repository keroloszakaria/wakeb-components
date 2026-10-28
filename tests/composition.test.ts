import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { createVuetify } from "vuetify";
import { VCarousel } from "vuetify/components/VCarousel";
import { VSkeletonLoader } from "vuetify/components/VSkeletonLoader";
import { WCarousel, WExportDropdown, WBaseSidebar } from "../src";
const wrappers: VueWrapper[] = [];
function render(component: any, options: any = {}) {
  const w = mount(component, {
    attachTo: document.body,
    global: { plugins: [createVuetify()] },
    ...options,
  });
  wrappers.push(w);
  return w;
}
afterEach(() => {
  for (const w of wrappers.splice(0)) w.unmount();
  vi.clearAllTimers();
  vi.useRealTimers();
  document.body.innerHTML = "";
});
const slides = [{ title: "First" }, { title: "Second" }, { title: "Third" }];
const settle = async () => {
  await flushPromises();
  await nextTick();
};
describe("WCarousel", () => {
  it("passes records/index to slides, defaults to 100% height and hides native delimiters", () => {
    const w = render(WCarousel, {
      props: { slides, cycle: false },
      slots: {
        slide: ({ slide, index }: any) => h("p", `${index}:${slide.title}`),
      },
    });
    expect(w.getComponent(VCarousel).props()).toMatchObject({
      height: "100%",
      hideDelimiters: true,
      showArrows: false,
      interval: 5000,
    });
    expect(w.text()).toContain("0:First");
    expect(w.find(".carousel-indicators").exists()).toBe(false);
  });
  it("changes slides once through accessible non-submit indicators and synchronizes the parent silently", async () => {
    const w = render(WCarousel, {
      props: {
        slides,
        showIndicators: true,
        cycle: false,
        indicatorLabel: (index: number) => `Slide ${index + 1}`,
      },
    });
    const buttons = w.findAll(".indicator");
    expect(buttons[1].attributes()).toMatchObject({
      type: "button",
      "aria-label": "Slide 2",
    });
    await buttons[1].trigger("click");
    expect(w.emitted("update:modelValue")).toEqual([[1]]);
    expect(buttons[1].attributes("aria-current")).toBe("true");
    await w.setProps({ modelValue: 2 });
    await settle();
    expect(w.emitted("update:modelValue")).toHaveLength(1);
    expect(buttons[2].classes()).toContain("active");
  });
  it("supports Home/End and directional indicator navigation", async () => {
    const w = render(WCarousel, {
      props: { slides, cycle: false, showIndicators: true },
    });
    const buttons = w.findAll(".indicator");
    (buttons[0].element as HTMLElement).focus();
    await buttons[0].trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(buttons[2].element);
    await buttons[2].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(buttons[0].element);
    expect(w.emitted("update:modelValue")).toEqual([[2], [0]]);
  });
  it("forwards attrs to the carousel and supports custom previous/next arrows", async () => {
    const w = render(WCarousel, {
      props: { slides, cycle: false, showArrows: true },
      attrs: { id: "slides", "data-owner": "company" },
      slots: {
        prev: ({ props }: any) => h("button", props, "Previous"),
        next: ({ props }: any) => h("button", props, "Next"),
      },
    });
    expect(w.get("#slides").attributes("data-owner")).toBe("company");
    await w
      .findAll("button")
      .find((b) => b.text() === "Next")!
      .trigger("click");
    expect(w.emitted("update:modelValue")).toEqual([[1]]);
  });
  it("advances with Vuetify cycling and stops advancing when cycle is disabled", async () => {
    vi.useFakeTimers();
    const w = render(WCarousel, {
      props: { slides, cycle: true, interval: 80 },
    });
    await nextTick();
    await vi.advanceTimersByTimeAsync(90);
    expect(w.emitted("update:modelValue")?.[0]).toEqual([1]);
    await w.setProps({ cycle: false });
    await vi.advanceTimersByTimeAsync(400);
    expect(w.emitted("update:modelValue")).toHaveLength(1);
  });
  it("supports empty slides and an explicit legacy indicator type override", async () => {
    const empty = render(WCarousel, {
      props: { slides: [], cycle: false, showIndicators: true },
    });
    expect(empty.findAll(".indicator")).toHaveLength(0);
    const w = render(WCarousel, {
      props: {
        slides,
        cycle: false,
        showIndicators: true,
        indicatorAttrs: { type: undefined },
        keyboardIndicators: false,
      },
    });
    expect(w.get(".indicator").attributes("type")).toBeUndefined();
    await w.get(".indicator").trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });
});
async function open(w: VueWrapper) {
  const button = w.get("button");
  (button.element as HTMLElement).focus();
  await button.trigger("click");
  await vi.waitFor(() =>
    expect(document.querySelector(".v-overlay--active .v-list")).not.toBeNull(),
  );
}
describe("WExportDropdown", () => {
  it("offers PDF/XLSX and emits only the requested format string", async () => {
    const w = render(WExportDropdown);
    expect(w.get("button").attributes("type")).toBe("button");
    await open(w);
    expect(document.querySelector(".v-list")?.textContent).toContain(
      "Export as PDF",
    );
    (document.querySelectorAll(".v-list-item")[1] as HTMLElement).click();
    await settle();
    expect(w.emitted("select")).toEqual([["xlsx"]]);
  });
  it("allows custom format records, labels, icons and an activator without export services", async () => {
    const w = render(WExportDropdown, {
      props: {
        title: "Save report",
        formats: [{ label: "CSV", value: "csv", icon: "$file" }],
      },
      slots: {
        activator: ({ props, buttonProps }: any) =>
          h("button", { ...props, type: "button" }, buttonProps.title),
        "format-icon": ({ format }: any) =>
          h("svg", { "data-format": format.value }),
        "format-label": ({ format }: any) => h("strong", format.label),
      },
    });
    await open(w);
    expect(document.querySelector("strong")?.textContent).toBe("CSV");
    expect(
      document.querySelector("svg[data-format]")?.getAttribute("data-format"),
    ).toBe("csv");
    (document.querySelector(".v-list-item") as HTMLElement).click();
    await settle();
    expect(w.emitted("select")).toEqual([["csv"]]);
  });
  it("disables the menu during loading and ignores disabled formats", async () => {
    const w = render(WExportDropdown, { props: { isLoading: true } });
    expect(w.get("button").attributes("disabled")).toBeDefined();
    await w.setProps({
      isLoading: false,
      formats: [{ label: "Disabled", value: "csv", disabled: true }],
    });
    await open(w);
    (document.querySelector(".v-list-item") as HTMLElement).click();
    await settle();
    expect(w.emitted("select")).toBeUndefined();
  });
  it("preserves menu attrs and direct teleported list styling", async () => {
    const w = render(WExportDropdown, {
      props: { menuStyle: { backgroundColor: "#123456" } },
      attrs: { "data-owner": "exports" },
    });
    await open(w);
    expect(document.querySelector(".v-list")?.getAttribute("style")).toContain(
      "rgb(18, 52, 86)",
    );
    expect(w.findComponent({ name: "VMenu" }).vm.$attrs["data-owner"]).toBe(
      "exports",
    );
  });
});
describe("WBaseSidebar", () => {
  it("renders a translated title and empty state without any form or store", () => {
    const w = render(WBaseSidebar, {
      props: { title: "الفريق", emptyLabel: "لا توجد عناصر", hasFilter: false },
      attrs: { id: "teams", class: "screen" },
    });
    expect(w.get("h2").text()).toBe("الفريق");
    expect(w.text()).toContain("لا توجد عناصر");
    expect(w.attributes("id")).toBe("teams");
    expect(w.classes()).toContain("screen");
    expect(w.find("input").exists()).toBe(false);
  });
  it("prioritizes loading over empty/items and passes skeleton options", async () => {
    const w = render(WBaseSidebar, {
      props: {
        title: "People",
        loading: true,
        items: [{ id: 1 }],
        skeletonType: "image",
        skeletonWidth: "240px",
      },
    });
    expect(w.getComponent(VSkeletonLoader).props()).toMatchObject({
      type: "image",
      width: "240px",
    });
    expect(w.find("li").exists()).toBe(false);
    await w.setProps({ loading: false });
    expect(w.findAll("li")).toHaveLength(1);
  });
  it("renders records/index and scoped search events without a schema dependency", async () => {
    const payload = { query: "Ada" };
    const w = render(WBaseSidebar, {
      props: {
        title: "People",
        items: [
          { key: "a", name: "Ada" },
          { key: "b", name: "Grace" },
        ],
        itemKey: "key",
      },
      slots: {
        item: ({ item, index }: any) => h("b", `${index}:${item.name}`),
        search: ({ search }: any) =>
          h("button", { onClick: () => search(payload) }, "Search"),
      },
    });
    expect(w.findAll("li").map((x) => x.text())).toEqual(["0:Ada", "1:Grace"]);
    await w
      .findAll("button")
      .find((b) => b.text() === "Search")!
      .trigger("click");
    expect(w.emitted("search")).toEqual([[payload]]);
  });
  it("keeps filter/cancel event names and visibility", async () => {
    const w = render(WBaseSidebar, {
      props: {
        title: "People",
        isFiltered: true,
        filterLabel: "Apply",
        cancelLabel: "Clear",
      },
    });
    await w
      .findAll("button")
      .find((b) => b.text() === "Apply")!
      .trigger("click");
    await w
      .findAll("button")
      .find((b) => b.text() === "Clear")!
      .trigger("click");
    expect(w.emitted("filterClick")).toHaveLength(1);
    expect(w.emitted("filterCancel")).toHaveLength(1);
    await w.setProps({ hasFilter: false });
    expect(w.find("button").exists()).toBe(false);
  });
  it("allows full content and header overrides and retains filter-modal placement", () => {
    const w = render(WBaseSidebar, {
      props: { title: "Custom", loading: true, items: [{ id: 1 }] },
      slots: {
        "header-actions": () => h("span", "Header controls"),
        content: () => h("article", "Custom body"),
        search: () => h("input"),
        item: () => h("i", "Hidden"),
        "filter-modal": () => h("dialog", "Filter modal"),
      },
    });
    expect(w.text()).toContain("Header controls");
    expect(w.text()).toContain("Custom body");
    expect(w.find("input").exists()).toBe(false);
    expect(w.findComponent(VSkeletonLoader).exists()).toBe(false);
    expect(w.get("dialog").element.parentElement).toBe(w.element);
  });
  it("supports custom loading and empty slots while keeping the list region", async () => {
    const w = render(WBaseSidebar, {
      props: { title: "People", loading: true },
      slots: {
        loading: () => h("b", "Loading records"),
        empty: ({ label }: any) => h("em", label),
      },
    });
    expect(w.get("b").text()).toBe("Loading records");
    await w.setProps({ loading: false, emptyLabel: "Nothing here" });
    expect(w.get("em").text()).toBe("Nothing here");
    expect(w.find(".sidebar__list").exists()).toBe(true);
  });
});
