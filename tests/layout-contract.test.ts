import { afterEach, describe, expect, it, vi } from "vitest";
import { h } from "vue";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WCol, WRow, WSkeleton } from "../src";
import { framework, shadcnHost, wakeb } from "./wakeb";

/* Same usage and assertions on every provider (SPEC R12); queries use roles and Wakeb classes. */
const host = () => (framework === "vuetify" ? createVuetify() : framework === "primevue" ? ([PrimeVue, { theme: "none" }] as const) : shadcnHost);
const render = (component: unknown, options: Record<string, unknown> = {}, locale?: "ar") =>
  mount(component as never, { attachTo: document.body, global: { plugins: [host() as never, wakeb(locale ? { locale } : {})] }, ...options });
afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe(`WSkeleton contract (${framework})`, () => {
  it("is a named busy status sized by width and height, with Wakeb-owned semantics", () => {
    const w = render(WSkeleton, { props: { type: "list-item-avatar-two-line", width: 240, height: "5rem" }, attrs: { role: "img", "aria-label": "x", class: "caller", "data-test": "bones" } });
    const root = w.get('[data-test="bones"]');
    expect(root.attributes("role")).toBe("status");
    expect(root.attributes("aria-busy")).toBe("true");
    expect(root.attributes("aria-label")).toBe("Loading...");
    expect(root.classes()).toContain("caller");
    expect(root.classes()).toContain("wakeb-skeleton-loader");
    expect((root.element as HTMLElement).style.width).toBe("240px");
    expect((root.element as HTMLElement).style.height).toBe("5rem");
  });

  it("takes a caller label and localizes the default", () => {
    expect(render(WSkeleton, { props: { label: "Loading cameras" } }).get('[role="status"]').attributes("aria-label")).toBe("Loading cameras");
    expect(render(WSkeleton, {}, "ar").get('[role="status"]').attributes("aria-label")).toBe("جارٍ التحميل...");
  });

  it("draws one part per repeated name and renders the default slot once loading ends", async () => {
    const w = render(WSkeleton, { props: { type: "chip@3" }, slots: { default: () => h("p", "Loaded") } });
    if (framework === "vuetify") expect(w.findAll(".v-skeleton-loader__chip")).toHaveLength(3);
    else expect(w.findAll(".wakeb-skeleton__part--chip")).toHaveLength(3);
    expect(w.text()).not.toContain("Loaded");
    await w.setProps({ loading: false });
    expect(w.find('[role="status"]').exists()).toBe(false);
    expect(w.text()).toBe("Loaded");
  });

  it("skips unknown names with WAKEB_UNKNOWN_VALUE", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = render(WSkeleton, { props: { type: "nope, text" } });
    expect(w.get('[role="status"]').exists()).toBe(true);
    expect(warn.mock.calls.flat().join(" ")).toContain("WAKEB_UNKNOWN_VALUE");
  });
});

describe(`WRow and WCol contract (${framework})`, () => {
  it("renders the Wakeb 12-column grid with breakpoint spans and growing columns", () => {
    const w = render({
      render: () =>
        h(WRow, { dense: true, align: "center", justify: "space-between", class: "cameras" }, () => [
          h(WCol, { cols: 12, sm: 6, md: "4", lg: "auto" }, () => "One"),
          h(WCol, null, () => "Two"),
        ]),
    });
    const row = w.get(".wakeb-grid-row");
    expect(row.classes()).toEqual(expect.arrayContaining(["cameras", "wakeb-grid-row--dense", "wakeb-grid-row--align-center", "wakeb-grid-row--justify-space-between"]));
    const [one, two] = w.findAll(".wakeb-grid-col");
    expect(one.classes()).toEqual(expect.arrayContaining(["wakeb-grid-col--12", "wakeb-grid-col--sm-6", "wakeb-grid-col--md-4", "wakeb-grid-col--lg-auto"]));
    expect(two.classes()).toContain("wakeb-grid-col--grow");
    expect(w.text()).toBe("OneTwo");
  });

  it("no-gutters wins over dense, and invalid values are ignored with WAKEB_UNKNOWN_VALUE", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = render({ render: () => h(WRow, { dense: true, noGutters: true, align: "middle" as never }, () => h(WCol, { cols: 13, md: "x" })) });
    expect(w.get(".wakeb-grid-row").classes()).toEqual(["wakeb-grid-row", "wakeb-grid-row--no-gutters"]);
    expect(w.get(".wakeb-grid-col").classes()).toEqual(["wakeb-grid-col", "wakeb-grid-col--grow"]);
    expect(warn.mock.calls.flat().join(" ")).toContain("WAKEB_UNKNOWN_VALUE");
  });
});
