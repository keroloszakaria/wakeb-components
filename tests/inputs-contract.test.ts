import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WButtonToggle, WProgressLinear, WTextarea } from "../src";
import { framework, shadcnHost, wakeb } from "./wakeb";

/* Same usage and assertions on every provider (SPEC R12); queries use roles, labels and Wakeb classes. */
const host = () => (framework === "vuetify" ? createVuetify() : framework === "primevue" ? ([PrimeVue, { theme: "none" }] as const) : shadcnHost);
const render = (component: unknown, options: Record<string, unknown> = {}, locale?: "ar") =>
  mount(component as never, { attachTo: document.body, global: { plugins: [host() as never, wakeb(locale ? { locale } : {})] }, ...options });
const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
};
afterEach(() => {
  document.body.innerHTML = "";
});

describe(`WProgressLinear contract (${framework})`, () => {
  it("is a named progressbar with a clamped value, Wakeb-owned ARIA and caller attrs", () => {
    const w = render(WProgressLinear, { props: { modelValue: 140, label: "Upload" }, attrs: { class: "caller", "data-test": "bar", role: "img" } });
    const bar = w.get('[data-test="bar"]');
    expect(bar.attributes("role")).toBe("progressbar");
    expect(bar.attributes("aria-label")).toBe("Upload");
    expect(bar.attributes("aria-valuenow")).toBe("100");
    expect(bar.attributes("aria-valuemin")).toBe("0");
    expect(bar.attributes("aria-valuemax")).toBe("100");
    expect(bar.classes()).toEqual(expect.arrayContaining(["caller", "wakeb-progress-linear"]));
  });

  it("has no value while indeterminate, a localized default name, and hides itself while inactive", async () => {
    const w = render(WProgressLinear, { props: { indeterminate: true, absolute: true, location: "bottom" } }, "ar");
    const bar = w.get('[role="progressbar"]');
    expect(bar.attributes("aria-valuenow")).toBeUndefined();
    expect(bar.attributes("aria-label")).toBe("جارٍ التحميل...");
    expect(bar.classes()).toEqual(expect.arrayContaining(["wakeb-progress-linear--absolute", "wakeb-progress-linear--bottom", "wakeb-progress-linear--indeterminate"]));
    expect(bar.attributes("aria-hidden")).not.toBe("true");
    await w.setProps({ active: false });
    expect(w.get('[role="progressbar"]').attributes("aria-hidden")).toBe("true");
    expect(w.get('[role="progressbar"]').classes()).toContain("wakeb-progress-linear--inactive");
  });

  it("sets the bar height from a number or a CSS length", () => {
    const el = (height: number | string) => render(WProgressLinear, { props: { height } }).get('[role="progressbar"]').element as HTMLElement;
    expect(el(6).style.height).toBe("6px");
    expect(el("0.5rem").style.height).toBe("0.5rem");
  });
});

describe(`WTextarea contract (${framework})`, () => {
  const view = (props: Record<string, unknown> = {}) => {
    const value = ref("Draft");
    const component = defineComponent(() => () => h(WTextarea, { label: "Notes", modelValue: value.value, "onUpdate:modelValue": (next: string) => (value.value = next), ...props }));
    return { component, value };
  };

  it("is a labelled multi-line field bound to a string model with rows", async () => {
    const { component, value } = view({ rows: 3 });
    const w = render(component);
    const area = w.get("textarea");
    expect(area.element.value).toBe("Draft");
    expect(area.attributes("rows")).toBe("3");
    expect(document.querySelector(`label[for="${area.attributes("id")}"]`)?.textContent).toContain("Notes");
    await area.setValue("Line one\nLine two");
    await settle();
    expect(value.value).toBe("Line one\nLine two");
  });

  it("routes attrs like WTextField and marks external errors invalid", () => {
    const { component } = view({ errorMessages: "Too short", class: "caller", maxlength: 20, "data-test": "notes" });
    const w = render(component);
    const root = w.get('[data-test="notes"]');
    expect(root.classes()).toEqual(expect.arrayContaining(["caller", "wakeb-textarea"]));
    const area = w.get("textarea");
    expect(area.attributes("maxlength")).toBe("20");
    expect(area.attributes("aria-invalid")).toBe("true");
    expect(w.text()).toContain("Too short");
  });

  it("disables and makes the control read-only", () => {
    const { component } = view({ disabled: true });
    expect(render(component).get("textarea").attributes("disabled")).toBeDefined();
    const { component: ro } = view({ readonly: true });
    expect(render(ro).get("textarea").attributes("readonly")).toBeDefined();
  });
});

describe(`WButtonToggle contract (${framework})`, () => {
  const items = [{ label: "Top", value: "top" }, { label: "Bottom", value: "bottom" }, { label: "Left", value: "left", disabled: true }];
  const view = (initial: unknown, props: Record<string, unknown> = {}) => {
    const value = ref(initial);
    const component = defineComponent(() => () =>
      h(WButtonToggle, { items, ariaLabel: "Legend position", modelValue: value.value as never, "onUpdate:modelValue": (next: unknown) => (value.value = next), ...props }),
    );
    return { component, value };
  };
  const buttons = (w: ReturnType<typeof render>) => w.findAll("button");
  const pressed = (w: ReturnType<typeof render>) => buttons(w).map((button) => button.attributes("aria-pressed"));

  it("is a named group of pressed-state buttons with single selection", async () => {
    const { component, value } = view("top");
    const w = render(component);
    expect(w.get('[role="group"]').attributes("aria-label")).toBe("Legend position");
    expect(buttons(w).map((button) => button.text())).toEqual(["Top", "Bottom", "Left"]);
    expect(pressed(w)).toEqual(["true", "false", "false"]);
    await buttons(w)[1].trigger("click");
    await settle();
    expect(value.value).toBe("bottom");
    expect(pressed(w)).toEqual(["false", "true", "false"]);
    await buttons(w)[1].trigger("click");
    await settle();
    expect(value.value).toBeNull();
  });

  it("mandatory keeps the last selection and never selects by itself", async () => {
    const { component, value } = view(null, { mandatory: true });
    const w = render(component);
    await settle();
    expect(value.value).toBeNull();
    await buttons(w)[0].trigger("click");
    await settle();
    await buttons(w)[0].trigger("click");
    await settle();
    expect(value.value).toBe("top");
  });

  it("multiple mode emits arrays in item order and skips disabled items", async () => {
    const { component, value } = view(["bottom"], { multiple: true });
    const w = render(component);
    await buttons(w)[0].trigger("click");
    await settle();
    expect(value.value).toEqual(["top", "bottom"]);
    expect(buttons(w)[2].attributes("disabled")).toBeDefined();
    await buttons(w)[2].trigger("click");
    await settle();
    expect(value.value).toEqual(["top", "bottom"]);
  });

  it("renders the item slot with its selection", () => {
    const { component } = view("top", {});
    const w = render(defineComponent(() => () => h(WButtonToggle, { items, modelValue: "top" }, { item: ({ item, selected }: { item: { label: string }; selected: boolean }) => h("b", `${item.label}:${selected}`) })));
    expect(w.findAll("b").map((b) => b.text())).toEqual(["Top:true", "Bottom:false", "Left:false"]);
    void component;
  });
});
