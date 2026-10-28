import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createSSRApp, h, nextTick } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createVuetify } from "vuetify";
import { WTruncatedText, WSegmentedProgress, WSemiCircleGauge } from "../src";
const wrappers: VueWrapper[] = [];
function render(component: any, options: any = {}) {
  const wrapper = mount(component, { attachTo: document.body, global: { plugins: [createVuetify()] }, ...options });
  wrappers.push(wrapper); return wrapper;
}
afterEach(() => { for (const w of wrappers.splice(0)) w.unmount(); document.body.innerHTML = ""; });
describe("WTruncatedText", () => {
  it("keeps short text nonfocusable and forwards DOM attributes and click listeners", async () => {
    const clicked = vi.fn();
    const w = render(WTruncatedText, { props: { label: "Short" }, attrs: { class: "consumer", "data-owner": "team", onClick: clicked } });
    const text = w.get("span");
    expect(text.text()).toBe("Short"); expect(text.attributes("tabindex")).toBeUndefined();
    expect(text.classes()).toContain("consumer"); expect(text.attributes("data-owner")).toBe("team");
    await text.trigger("click"); expect(clicked).toHaveBeenCalledOnce();
  });
  it("preserves nullish labels, Arabic text and legacy short limits", () => {
    const w = render(WTruncatedText, { props: { label: "مرحبا بالعالم", length: 1 } });
    expect(w.get("span").text()).toBe("..."); expect(w.get("span").attributes("aria-label")).toBe("مرحبا بالعالم");
    expect(w.get("span").attributes("tabindex")).toBe("0");
  });
  it("reacts to label and length changes and exposes a typed display slot", async () => {
    const w = render(WTruncatedText, { props: { label: "abcdefgh", length: 6 }, slots: { default: ({ text, truncated }: any) => h("strong", `${text}:${truncated}`) } });
    expect(w.get("strong").text()).toBe("abc...:true");
    await w.setProps({ length: 20 }); expect(w.get("strong").text()).toBe("abcdefgh:false");
    expect(w.get("span").attributes("tabindex")).toBeUndefined();
  });
  it("opens the real Vuetify tooltip on keyboard focus and composes consumer focus listeners", async () => {
    const focused = vi.fn();
    const w = render(WTruncatedText, { props: { label: "A long accessible label", length: 8 }, attrs: { onFocus: focused } });
    (w.get("span").element as HTMLElement).focus(); await nextTick();
    await vi.waitFor(() => expect(document.querySelector('[role="tooltip"]')?.textContent).toContain("A long accessible label"));
    expect(focused).toHaveBeenCalledOnce();
  });
});
describe("WSegmentedProgress", () => {
  it.each([[-10, 0], [40, 40], [150, 100], [Number.NaN, 0]])("normalizes %s and exposes numeric progress semantics", (input, expected) => {
    const w = render(WSegmentedProgress, { props: { value: input, label: "Capacity" } });
    expect(w.attributes("role")).toBe("progressbar"); expect(w.attributes("aria-valuenow")).toBe(String(expected));
    expect(w.attributes("aria-valuemin")).toBe("0"); expect(w.attributes("aria-valuemax")).toBe("100");
    expect(w.attributes("aria-label")).toBe("Capacity");
    expect(w.find(".segmented-progress__fill").exists()).toBe(expected > 0);
    expect(w.find(".segmented-progress__track").exists()).toBe(expected < 100);
  });
  it("updates value, label, custom color and slot content without owning application state", async () => {
    const w = render(WSegmentedProgress, { props: { value: 20, color: "#0050ff", ariaLabel: "Storage capacity" }, slots: { default: ({ value }: any) => h("b", `${value} used`) } });
    expect(w.get("b").text()).toBe("20 used"); expect(w.attributes("aria-label")).toBe("Storage capacity");
    expect(w.get(".segmented-progress__fill").attributes("style")).toContain("rgb(0, 80, 255)");
    await w.setProps({ value: 90 }); expect(w.get("b").text()).toBe("90 used");
  });
});
describe("WSemiCircleGauge", () => {
  it("keeps accessible progress current and moves both the arc and needle", async () => {
    const w = render(WSemiCircleGauge, { props: { value: 0, label: "0", subLabel: "Score" } });
    const offset = w.get(".semi-circle-gauge__value").attributes("stroke-dashoffset");
    expect(w.get("svg").attributes("aria-label")).toBe("0%");
    await w.setProps({ value: 100, label: "100" });
    expect(w.get(".semi-circle-gauge__value").attributes("stroke-dashoffset")).toBe("0");
    expect(offset).not.toBe("0"); expect(w.get(".semi-circle-gauge__needle").attributes("transform")).toContain("rotate(90 ");
    expect(w.get("strong").text()).toBe("100"); expect(w.get("svg").attributes("aria-label")).toBe("100%");
  });
  it("handles invalid geometry without SVG NaN and forwards accessible labels and attributes", () => {
    const w = render(WSemiCircleGauge, { props: { size: -1, thickness: 900, value: Number.NaN, ariaLabel: "Quality" }, attrs: { id: "quality" } });
    expect(w.get("svg").attributes("viewBox")).toBe("0 0 154 77");
    expect(w.html()).not.toMatch(/NaN|Infinity/); expect(w.attributes("id")).toBe("quality");
    expect(w.get("svg").attributes("aria-label")).toBe("Quality");
  });
  it("creates isolated SVG IDs for repeated instances, including deterministic SSR requests", async () => {
    const view = () => h("div", [h(WSemiCircleGauge, { value: 25 }), h(WSemiCircleGauge, { value: 75 })]);
    const html = await renderToString(createSSRApp({ render: view }));
    const ids = [...html.matchAll(/id="(wakeb-gauge-[^"]+)"/g)].map(m => m[1]);
    expect(ids).toHaveLength(6); expect(new Set(ids).size).toBe(6);
    const again = await renderToString(createSSRApp({ render: view }));
    expect([...again.matchAll(/id="(wakeb-gauge-[^"]+)"/g)].map(m => m[1])).toEqual(ids);
  });
});
