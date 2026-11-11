import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WCheckbox, WSwitch } from "../src";
import { framework, shadcnHost, wakeb } from "./wakeb";

/* Same usage and assertions on every provider (SPEC R12); queries use roles, labels and Wakeb classes. */
const host = () => (framework === "vuetify" ? createVuetify() : framework === "primevue" ? ([PrimeVue, { theme: "none" }] as const) : shadcnHost);
const render = (component: unknown, options: Record<string, unknown> = {}) =>
  mount(component as never, {
    attachTo: document.body,
    global: { plugins: [host() as never, wakeb()], stubs: { transition: false } },
    ...options,
  });
const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
};
/* Native checkboxes report `checked`; reka-ui buttons report aria-checked. */
const isChecked = (element: Element) =>
  element instanceof HTMLInputElement ? element.checked : element.getAttribute("aria-checked") === "true";
const labelFor = (element: Element) => document.querySelector(`label[for="${element.id}"]`)?.textContent ?? "";
afterEach(() => {
  document.body.innerHTML = "";
});

describe(`WSwitch contract (${framework})`, () => {
  const view = (props: Record<string, unknown> = {}) => {
    const value = ref(false);
    const component = defineComponent(() => () =>
      h(WSwitch, { label: "Notifications", modelValue: value.value, "onUpdate:modelValue": (next: boolean) => (value.value = next), ...props }),
    );
    return { component, value };
  };

  it("is a labelled switch that toggles its boolean model", async () => {
    const { component, value } = view();
    const w = render(component);
    const control = w.get('[role="switch"]').element;
    expect(labelFor(control)).toContain("Notifications");
    expect(isChecked(control)).toBe(false);
    (control as HTMLElement).click();
    await settle();
    expect(value.value).toBe(true);
    expect(isChecked(w.get('[role="switch"]').element)).toBe(true);
  });

  it("routes attributes, marks loading and stays inert when disabled", async () => {
    const { component, value } = view({ disabled: true, loading: true, class: "caller", "data-test": "switch", "aria-describedby": "hint" });
    const w = render(component);
    const root = w.get(".wakeb-switch");
    expect(root.classes()).toContain("caller");
    expect(root.attributes("data-test")).toBe("switch");
    const control = w.get('[role="switch"]');
    expect(control.attributes("aria-describedby")).toBe("hint");
    expect(control.attributes("aria-busy")).toBe("true");
    expect(control.attributes()).toHaveProperty("disabled");
    (control.element as HTMLElement).click();
    await settle();
    expect(value.value).toBe(false);
  });

  it("names a switch without a visible label through aria-label", () => {
    const w = render(WSwitch, { props: { modelValue: true }, attrs: { "aria-label": "Grid lines" } });
    const control = w.get('[role="switch"]');
    expect(control.attributes("aria-label")).toBe("Grid lines");
    expect(isChecked(control.element)).toBe(true);
  });
});

describe(`WCheckbox contract (${framework})`, () => {
  it("toggles a boolean model and links its label", async () => {
    const value = ref(false);
    const w = render(defineComponent(() => () =>
      h(WCheckbox, { label: "Accept", modelValue: value.value, "onUpdate:modelValue": (next: boolean) => (value.value = next) }),
    ));
    const control = w.get('[role="checkbox"], input[type="checkbox"]').element;
    expect(labelFor(control)).toContain("Accept");
    (control as HTMLElement).click();
    await settle();
    expect(value.value).toBe(true);
    expect(isChecked(w.get('[role="checkbox"], input[type="checkbox"]').element)).toBe(true);
  });

  it("adds and removes its value in an array model", async () => {
    const selected = ref<unknown[]>(["read"]);
    const w = render(defineComponent(() => () =>
      h("div", ["read", "write"].map((name) =>
        h(WCheckbox, { key: name, label: name, value: name, modelValue: selected.value, "onUpdate:modelValue": (next: unknown[]) => (selected.value = next) }),
      )),
    ));
    const controls = () => w.findAll('[role="checkbox"], input[type="checkbox"]').map((item) => item.element);
    expect(controls().map(isChecked)).toEqual([true, false]);
    (controls()[1] as HTMLElement).click();
    await settle();
    expect(selected.value).toEqual(["read", "write"]);
    (controls()[0] as HTMLElement).click();
    await settle();
    expect(selected.value).toEqual(["write"]);
    expect(controls().map(isChecked)).toEqual([false, true]);
  });

  it("does not change when disabled and renders the label slot", async () => {
    const value = ref(false);
    const w = render(defineComponent(() => () =>
      h(WCheckbox, { disabled: true, modelValue: value.value, "onUpdate:modelValue": (next: boolean) => (value.value = next) }, { label: () => h("b", { class: "rich" }, "Rich") }),
    ));
    expect(w.find(".rich").exists()).toBe(true);
    const control = w.get('[role="checkbox"], input[type="checkbox"]');
    expect(control.attributes()).toHaveProperty("disabled");
    (control.element as HTMLElement).click();
    await settle();
    expect(value.value).toBe(false);
  });
});
