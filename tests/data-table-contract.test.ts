import { afterEach, describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WDataTable } from "../src";
import { framework, shadcnHost, wakeb } from "./wakeb";

/* Same usage and assertions on every provider (SPEC R12); queries use roles, text and Wakeb classes. */
const host = () => (framework === "vuetify" ? createVuetify() : framework === "primevue" ? ([PrimeVue, { theme: "none" }] as const) : shadcnHost);
const render = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(WDataTable as never, { attachTo: document.body, props: props as never, slots: slots as never, global: { plugins: [host() as never, wakeb()] } });
const settle = async () => {
  for (let i = 0; i < 3; i++) await nextTick();
};
afterEach(() => {
  document.body.innerHTML = "";
});

const headers = [
  { key: "id", title: "ID", width: 80 },
  { key: "owner.name", title: "Owner" },
  { key: "status", title: "Status", sortable: false, align: "end" },
];
const items = [
  { id: 1, owner: { name: "Grace" }, status: "Online" },
  { id: 2, owner: { name: "Ada" }, status: "Offline" },
];
const columnHeader = (title: string) => [...document.querySelectorAll<HTMLElement>("th")].find((th) => th.textContent?.trim().startsWith(title))!;
const bodyRows = () => [...document.querySelectorAll<HTMLElement>("tbody tr")];
const checkboxes = () => [...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];

describe(`WDataTable contract (${framework})`, () => {
  it("renders a named table with column headers and nested cell values, as given", async () => {
    render({ headers, items, ariaLabel: "Cameras" });
    await settle();
    expect(document.querySelector("table")?.getAttribute("aria-label")).toBe("Cameras");
    expect(columnHeader("ID")).toBeTruthy();
    expect(columnHeader("Owner")).toBeTruthy();
    expect(bodyRows().map((row) => [...row.querySelectorAll("td")].map((td) => td.textContent?.trim()))).toEqual([["1", "Grace", "Online"], ["2", "Ada", "Offline"]]);
  });

  it("emits update:options at once and cycles the single-column sort back to page 1", async () => {
    const w = render({ headers, items, page: 2, itemsPerPage: 25 });
    await settle();
    expect(w.emitted("update:options")?.[0]).toEqual([{ page: 2, itemsPerPage: 25, sortBy: [] }]);
    const click = async (title: string) => {
      const th = columnHeader(title);
      (th.querySelector("button") ?? th).click();
      await settle();
    };
    await click("Owner");
    expect(columnHeader("Owner").getAttribute("aria-sort")).toBe("ascending");
    await click("Owner");
    expect(columnHeader("Owner").getAttribute("aria-sort")).toBe("descending");
    await click("Owner");
    expect(w.emitted("update:sortBy")).toEqual([[[{ key: "owner.name", order: "asc" }]], [[{ key: "owner.name", order: "desc" }]], [[]]]);
    expect(w.emitted("update:options")?.[1]).toEqual([{ page: 1, itemsPerPage: 25, sortBy: [{ key: "owner.name", order: "asc" }] }]);
    expect(w.emitted("update:options")?.at(-1)).toEqual([{ page: 1, itemsPerPage: 25, sortBy: [] }]);
    await click("Status");
    expect(w.emitted("update:sortBy")).toHaveLength(3);
  });

  it("selects rows by itemValue with named checkboxes, without emitting click:row", async () => {
    const w = render({ headers, items, selectable: true, modelValue: [2] });
    await settle();
    const [all, first, second] = checkboxes();
    expect(checkboxes()).toHaveLength(3);
    expect(all.getAttribute("aria-label")).toBe("Select all rows");
    expect(first.getAttribute("aria-label")).toBe("Select row");
    expect(second.checked).toBe(true);
    first.click();
    await settle();
    expect(w.emitted("update:modelValue")?.[0]).toEqual([[2, 1]]);
    checkboxes()[0].click();
    await settle();
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([[]]);
    expect(w.emitted("click:row")).toBeUndefined();
  });

  it("emits click:row with the item and renders item.<key> cell slots", async () => {
    const w = render({ headers, items }, { "item.status": ({ item, value, index }: { item: { id: number }; value: string; index: number }) => h("b", `${index}:${item.id}:${value}`) });
    await settle();
    expect([...document.querySelectorAll("tbody b")].map((b) => b.textContent)).toEqual(["0:1:Online", "1:2:Offline"]);
    bodyRows()[1].querySelector("td")!.click();
    await settle();
    expect(w.emitted("click:row")?.[0]?.[0]).toEqual(items[1]);
  });

  it("replaces the rows with the loading and no-data views", async () => {
    const w = render({ headers, items, loading: true }, { loading: () => h("p", { class: "custom-loading" }, "Fetching") });
    await settle();
    expect(document.querySelector(".custom-loading")?.textContent).toBe("Fetching");
    expect(document.body.textContent).not.toContain("Grace");
    expect(document.querySelector(".wakeb-data-table")?.getAttribute("aria-busy")).toBe("true");
    await w.setProps({ loading: false, items: [] } as never);
    await settle();
    expect(document.body.textContent).toContain("No data available");
    await w.setProps({ noDataText: "Nothing yet" } as never);
    await settle();
    expect(document.body.textContent).toContain("Nothing yet");
  });

  it("shows a skeleton by default while loading", async () => {
    render({ headers, items: [], loading: true });
    await settle();
    expect(document.querySelector(".wakeb-skeleton, .wakeb-skeleton-loader, .v-skeleton-loader")).not.toBeNull();
  });
});
