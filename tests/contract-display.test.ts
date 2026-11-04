import { afterEach, describe, expect, it, vi } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WPageSkeleton, WSegmentedProgress, WSemiCircleGauge, WVerticalSteps, type WakebComponentsOptions } from "../src";
import { SKELETON_NAMES } from "../src/core/vocabulary";
import { framework, wakeb } from "./wakeb";

/*
 * M3 Batch A shared contract: WSegmentedProgress, WSemiCircleGauge, WVerticalSteps and WPageSkeleton.
 * Same usage and assertions on each provider project (SPEC R12, R14, R16, R17, R18, R19). Queries go
 * through roles and Wakeb classes, never provider DOM.
 */
const host = (ssr = false) => (framework === "vuetify" ? createVuetify({ ssr }) : ([PrimeVue, { theme: "none" }] as const));
const render = (component: unknown, options: Record<string, unknown> = {}, plugin: Partial<WakebComponentsOptions> = {}) =>
  mount(component as never, { attachTo: document.body, global: { plugins: [host() as never, wakeb(plugin)] }, ...options });
const warnings = () => vi.mocked(console.warn).mock.calls.map(([message]) => String(message));
const callerAttrs = {
  class: "caller-class",
  style: { outline: "1px solid red" },
  id: "caller-id",
  "data-test": "caller",
  "aria-describedby": "caller-help",
};
const expectCallerTarget = (element: Element) => {
  expect(element.classList.contains("caller-class")).toBe(true);
  expect((element as HTMLElement).style.outline).toContain("red");
  expect(element.id).toBe("caller-id");
  expect(element.getAttribute("aria-describedby")).toBe("caller-help");
  expect(document.querySelectorAll('[data-test="caller"]')).toHaveLength(1);
};
afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});
enableAutoUnmount(afterEach);

describe(`WSegmentedProgress contract (${framework})`, () => {
  it("defaults to an empty, named progressbar", () => {
    const bar = render(WSegmentedProgress).get('[role="progressbar"]');
    expect(bar.attributes()).toMatchObject({ "aria-valuenow": "0", "aria-valuemin": "0", "aria-valuemax": "100", "aria-label": "0%" });
    expect(bar.find(".segmented-progress__fill").exists()).toBe(false);
    expect(bar.find(".segmented-progress__track").exists()).toBe(true);
  });

  it.each([[-10, 0], [40, 40], [150, 100], [Number.NaN, 0]])("clamps %s to %s with zero-basis segments", (input, expected) => {
    const bar = render(WSegmentedProgress, { props: { value: input, label: "Capacity" } }).get('[role="progressbar"]');
    expect(bar.attributes("aria-valuenow")).toBe(String(expected));
    expect(bar.attributes("aria-label")).toBe("Capacity");
    expect(bar.find(".segmented-progress__fill").exists()).toBe(expected > 0);
    expect(bar.find(".segmented-progress__track").exists()).toBe(expected < 100);
    if (expected > 0 && expected < 100) {
      expect((bar.get(".segmented-progress__fill").element as HTMLElement).style.flex).toBe(`${expected} 1 0%`);
      expect((bar.get(".segmented-progress__track").element as HTMLElement).style.flex).toBe(`${100 - expected} 1 0%`);
    }
  });

  it("passes { value, label } to the default slot, prefers ariaLabel and resolves colors", async () => {
    const seen: unknown[] = [];
    const w = render(WSegmentedProgress, {
      props: { value: 20, label: "Disk", ariaLabel: "Storage capacity", color: "info" },
      slots: { default: (payload: { value: number }) => (seen.push(payload), h("b", `${payload.value} used`)) },
    });
    expect(seen[0]).toEqual({ value: 20, label: "Disk" });
    expect(w.get("b").text()).toBe("20 used");
    expect(w.get('[role="progressbar"]').attributes("aria-label")).toBe("Storage capacity");
    expect(w.get(".segmented-progress__fill").attributes("style")).toContain("var(--wakeb-ui-info, #2e90fa)");
    await w.setProps({ value: 90, color: "#0050ff" });
    expect(w.get("b").text()).toBe("90 used");
    expect(w.get(".segmented-progress__fill").attributes("style")).toContain("rgb(0, 80, 255)");
  });

  it("routes attrs to the root and keeps the progressbar semantics Wakeb-owned", () => {
    const w = render(WSegmentedProgress, {
      props: { value: 40, label: "Ready" },
      attrs: { ...callerAttrs, role: "presentation", "aria-valuenow": "7", "aria-label": "Caller" },
    });
    expectCallerTarget(w.element);
    expect(w.element.getAttribute("role")).toBe("progressbar");
    expect(w.element.getAttribute("aria-valuenow")).toBe("40");
    // `aria-label` matches the declared `ariaLabel` prop, so a caller name is the typed prop and wins over `label`.
    expect(w.element.getAttribute("aria-label")).toBe("Caller");
  });
});

describe(`WSemiCircleGauge contract (${framework})`, () => {
  it("defaults to a 154px gauge named by its percentage", () => {
    const w = render(WSemiCircleGauge);
    const svg = w.get('svg[role="img"]');
    expect(svg.attributes("aria-label")).toBe("0%");
    expect(svg.attributes("viewBox")).toBe("0 0 154 77");
    expect(w.get(".semi-circle-gauge__content").attributes("aria-hidden")).toBe("true");
  });

  it("moves the arc and needle and passes { value, label, subLabel } to the slot", async () => {
    const seen: unknown[] = [];
    const w = render(WSemiCircleGauge, {
      props: { value: 0, label: "0", subLabel: "Score" },
      slots: { default: (payload: unknown) => (seen.push(payload), h("em", "custom")) },
    });
    expect(seen[0]).toEqual({ value: 0, label: "0", subLabel: "Score" });
    const offset = w.get(".semi-circle-gauge__value").attributes("stroke-dashoffset");
    await w.setProps({ value: 100, label: "100" });
    expect(offset).not.toBe("0");
    expect(w.get(".semi-circle-gauge__value").attributes("stroke-dashoffset")).toBe("0");
    expect(w.get(".semi-circle-gauge__needle").attributes("transform")).toContain("rotate(90 ");
    expect(w.get("svg").attributes("aria-label")).toBe("100%");
  });

  it("normalizes invalid geometry and sends attrs to the root", () => {
    const w = render(WSemiCircleGauge, { props: { size: -1, thickness: 900, value: Number.NaN, ariaLabel: "Quality" }, attrs: callerAttrs });
    expect(w.get("svg").attributes("viewBox")).toBe("0 0 154 77");
    expect(w.html()).not.toMatch(/NaN|Infinity/);
    expect(w.get("svg").attributes("aria-label")).toBe("Quality");
    expectCallerTarget(w.element);
    expect(w.element.matches(".semi-circle-gauge")).toBe(true);
  });
});

describe(`WVerticalSteps contract (${framework})`, () => {
  const steps = [{ title: "<b>Review</b>", is_active: true }, { title: "Ship", time: "09:00", date: "2026-10-28" }];

  it("renders a named list with escaped titles and numbered markers", async () => {
    const w = render(WVerticalSteps, { props: { steps } });
    const list = w.get('[role="list"]');
    expect(list.attributes("aria-label")).toBe("Steps");
    expect(w.findAll('[role="listitem"]')).toHaveLength(2);
    expect(w.get("h2").text()).toBe("<b>Review</b>");
    expect(w.find("h2 b").exists()).toBe(false);
    expect(w.findAll(".icon")[0].classes()).toContain("active");
    expect(w.findAll(".icon")[1].text()).toBe("02");
    expect(w.text()).toContain("09:00");
    await w.setProps({ steps: Array.from({ length: 10 }, (_, i) => ({ title: `S${i}` })) });
    expect(w.findAll(".icon")[9].text()).toBe("10");
    await w.setProps({ steps: [] });
    expect(w.find('[role="listitem"]').exists()).toBe(false);
  });

  it("passes { step, index } to every slot", () => {
    const seen: Record<string, unknown[]> = {};
    const slot = (name: string) => (payload: unknown) => ((seen[name] ??= []).push(payload), h("i", { class: `slot-${name}` }, name));
    render(WVerticalSteps, { props: { steps: [steps[1]] }, slots: { icon: slot("icon"), title: slot("title"), timeIcon: slot("timeIcon"), dateIcon: slot("dateIcon") } });
    for (const name of ["icon", "title", "timeIcon", "dateIcon"]) expect(seen[name]?.[0]).toEqual({ step: steps[1], index: 0 });
    const replaced = render(WVerticalSteps, { props: { steps: [steps[0]] }, slots: { indicator: slot("indicator") } });
    expect(seen.indicator[0]).toEqual({ step: steps[0], index: 0 });
    expect(replaced.find(".icon").exists()).toBe(false);
  });

  it("routes attrs to the list root and keeps its role and name Wakeb-owned", () => {
    const w = render(WVerticalSteps, { props: { steps, label: "Release steps" }, attrs: { ...callerAttrs, role: "navigation", "aria-label": "Caller" } });
    expectCallerTarget(w.element);
    expect(w.element.getAttribute("role")).toBe("list");
    expect(w.element.getAttribute("aria-label")).toBe("Release steps");
  });
});

describe(`WPageSkeleton contract (${framework})`, () => {
  it("defaults to a named, busy status in a column", () => {
    const w = render(WPageSkeleton, { props: { config: [] } });
    const status = w.get('[role="status"]');
    expect(status.attributes("aria-label")).toBe("Loading content");
    expect(status.attributes("aria-busy")).toBe("true");
    expect((status.element as HTMLElement).style.flexDirection).toBe("column");
  });

  it("renders rows on the Wakeb grid with variants, headers and repeats", async () => {
    const w = render(WPageSkeleton, {
      props: {
        label: "Loading report",
        direction: "row",
        config: [{ repeat: 2, cols: 6, md: 3, variant: "card", header: [{ type: "text", width: 120 }], items: [{ type: "chip", height: 20 }] }],
      },
    });
    expect(w.element.getAttribute("aria-label")).toBe("Loading report");
    expect((w.element as HTMLElement).style.flexDirection).toBe("row");
    expect(w.get(".wakeb-grid-row").attributes("aria-hidden")).toBe("true");
    expect(w.findAll(".wakeb-grid-col--6")).toHaveLength(2);
    expect(w.findAll(".wakeb-grid-col--md-3")).toHaveLength(2);
    expect(w.findAll(".skeleton-block--card")).toHaveLength(2);
    expect(w.findAll(".skeleton-block__header")).toHaveLength(2);
    await w.setProps({ config: [{ repeat: -8, items: [] }, { repeat: Number.NaN }, { repeat: 2.8, cols: true, lg: "auto" }] });
    expect(w.findAll(".wakeb-grid-col")).toHaveLength(4);
    expect(w.findAll(".wakeb-grid-col--grow")).toHaveLength(2);
    expect(w.findAll(".wakeb-grid-col--lg-auto")).toHaveLength(2);
  });

  it("routes attrs to the status root and keeps its semantics Wakeb-owned", () => {
    const w = render(WPageSkeleton, { props: { config: [] }, attrs: { ...callerAttrs, role: "region", "aria-busy": "false" } });
    expectCallerTarget(w.element);
    expect(w.element.matches('.page-skeleton[role="status"]')).toBe(true);
    expect(w.element.getAttribute("aria-busy")).toBe("true");
  });

  it("skips unknown names on every provider and keeps Vuetify-only names only on Vuetify", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(WPageSkeleton, { props: { config: [{ items: [{ type: "sparkles, text" }, { type: "article" }] }] } });
    expect(warnings()[0]).toMatch(/^\[WAKEB_UNKNOWN_VALUE\] WPageSkeleton config\[\]\.items\[\]\.type 'sparkles'/);
    expect(warnings()[1]).toMatch(
      framework === "vuetify"
        ? /^\[WAKEB_DEPRECATED_VALUE\] WPageSkeleton config\[\]\.items\[\]\.type 'article' is a Vuetify skeleton name/
        : /^\[WAKEB_UNKNOWN_VALUE\] WPageSkeleton config\[\]\.items\[\]\.type 'article' is not a Wakeb skeleton/,
    );
  });

  it.runIf(framework === "primevue")("draws every portable name with Wakeb bones and caps repeats at 100", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = render(WPageSkeleton, { props: { config: [{ items: SKELETON_NAMES.map((type) => ({ type })) }, { items: [{ type: "chip@500", width: 200, height: "3rem", class: "mine" }] }] } });
    for (const name of SKELETON_NAMES) {
      const part = w.get(`.wakeb-skeleton__part--${name}`);
      expect(part.findAll(".wakeb-skeleton__bone").length, name).toBeGreaterThan(0);
    }
    expect(w.findAll(".wakeb-skeleton__part--avatar .wakeb-skeleton__bone--circle")).toHaveLength(1);
    expect(w.findAll(".wakeb-skeleton__part--table-row .wakeb-skeleton__bone")).toHaveLength(6);
    expect(w.findAll(".wakeb-skeleton__part--chip")).toHaveLength(101);
    const item = w.get(".wakeb-skeleton.mine").element as HTMLElement;
    expect([item.style.width, item.style.height]).toEqual(["200px", "3rem"]);
    expect(w.findAll(".wakeb-skeleton__bone").every((bone) => bone.attributes("aria-hidden") === "true")).toBe(true);
  });
});

describe(`Batch A locale, theme scope and SSR (${framework})`, () => {
  it("uses the built-in Arabic names", () => {
    expect(render(WVerticalSteps, {}, { locale: "ar" }).get('[role="list"]').attributes("aria-label")).toBe("الخطوات");
    expect(render(WPageSkeleton, { props: { config: [] } }, { locale: "ar" }).get('[role="status"]').attributes("aria-label")).toBe("جارٍ تحميل المحتوى");
  });

  it("writes the theme scope and direction on each root", () => {
    const plugin = { direction: "rtl", theme: { mode: "dark", tokens: { primary: "#123456" } } } as Partial<WakebComponentsOptions>;
    const views: [unknown, Record<string, unknown>][] = [
      [WSegmentedProgress, { value: 10 }],
      [WSemiCircleGauge, { value: 10 }],
      [WVerticalSteps, { steps: [{ title: "A" }] }],
      [WPageSkeleton, { config: [{ items: [{ type: "text" }] }] }],
    ];
    for (const [component, props] of views) {
      const root = render(component, { props }, plugin).element as HTMLElement;
      expect(root.getAttribute("data-wakeb-theme")).toBe("dark");
      expect(root.getAttribute("dir")).toBe("rtl");
      expect(root.style.getPropertyValue("--wakeb-ui-primary")).toBe("#123456");
    }
  });

  it("server-renders without browser globals", async () => {
    // Apps and provider instances are created first; only rendering runs without browser globals.
    const app = () =>
      createSSRApp(() => [
        h(WSegmentedProgress, { value: 60, label: "Ready" }),
        h(WSemiCircleGauge, { value: 75, label: "75" }),
        h(WVerticalSteps, { steps: [{ title: "Review" }] }),
        h(WPageSkeleton, { config: [{ items: [{ type: "list-item-avatar, chip@2" }] }] }),
      ])
        .use(host(true) as never)
        .use(wakeb({ locale: "ar" }));
    const apps = [app(), app()];
    let index = 0;
    const page = () => renderToString(apps[index++]);
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("document", undefined);
    vi.stubGlobal("navigator", undefined);
    let html: string;
    let again: string;
    try {
      html = await page();
      again = await page();
    } finally {
      vi.unstubAllGlobals();
    }
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="60"');
    expect(html).toContain('aria-label="75%"');
    expect(html).toContain("Review");
    expect(html).toContain('aria-label="الخطوات"');
    expect(html).toContain("skeleton-block");
    expect(html).not.toMatch(/NaN|Infinity/);
    // Deterministic SVG IDs across requests (Vue useId).
    expect(again.match(/id="wakeb-gauge-[^"]+"/g)).toEqual(html.match(/id="wakeb-gauge-[^"]+"/g));
  });
});
