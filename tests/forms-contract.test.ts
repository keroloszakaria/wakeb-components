import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WPopover, WTextField } from "../src";
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
afterEach(() => {
  document.body.innerHTML = "";
});

describe(`WTextField contract (${framework})`, () => {
  it("labels the input, emits typed values and routes attributes", async () => {
    const w = render(WTextField, {
      props: { label: "Name", placeholder: "Your name", modelValue: "Ada" },
      attrs: { class: "caller", "data-test": "field", autocomplete: "off", name: "fullName" },
    });
    const input = w.get("input");
    expect(input.element.value).toBe("Ada");
    expect(input.attributes("placeholder")).toBe("Your name");
    const label = document.querySelector(`label[for="${input.attributes("id")}"]`);
    expect(label?.textContent).toContain("Name");
    const root = w.get(".wakeb-text-field");
    expect(root.classes()).toContain("caller");
    expect(root.attributes("data-test")).toBe("field");
    expect(input.attributes("autocomplete")).toBe("off");
    expect(input.attributes("name")).toBe("fullName");
    await input.setValue("Grace");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["Grace"]);
  });

  it("shows the first failing rule after input and links it to the input", async () => {
    const view = defineComponent(() => {
      const value = ref("");
      return () =>
        h(WTextField, {
          label: "Email",
          modelValue: value.value,
          "onUpdate:modelValue": (next: string) => (value.value = next),
          rules: [(v: unknown) => Boolean(v) || "Required", (v: unknown) => String(v).includes("@") || "Invalid email"],
        });
    });
    const w = render(view);
    expect(w.text()).not.toContain("Required");
    await w.get("input").setValue("ada");
    await settle();
    expect(w.text()).toContain("Invalid email");
    expect(w.text()).not.toContain("Required");
    expect(w.get("input").attributes("aria-invalid")).toBe("true");
    await w.get("input").setValue("ada@example.com");
    await settle();
    expect(w.text()).not.toContain("Invalid email");
    expect(w.get("input").attributes("aria-invalid")).not.toBe("true");
  });

  it("shows external error messages at once, before rule messages", async () => {
    const view = defineComponent(() => {
      const errors = ref<string | string[]>(["Name taken", "Second"]);
      return () =>
        h("div", [
          h(WTextField, { label: "Name", modelValue: "", errorMessages: errors.value, rules: [() => "Rule message"] }),
          h("button", { class: "clear", onClick: () => (errors.value = []) }),
        ]);
    });
    const w = render(view);
    await settle();
    const input = w.get("input");
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(w.text()).toContain("Name taken");
    expect(w.text()).not.toContain("Second");
    expect(w.text()).not.toContain("Rule message");
    const described = input.attributes("aria-describedby") ?? "";
    expect(described.split(" ").some((id) => document.getElementById(id)?.textContent?.includes("Name taken"))).toBe(true);
    await w.get(".clear").trigger("click");
    await settle();
    expect(w.text()).not.toContain("Name taken");
    expect(w.get("input").attributes("aria-invalid")).not.toBe("true");
  });

  it("marks the density on the field root", () => {
    const w = render(WTextField, { props: { density: "compact", label: "Compact" } });
    const root = w.get(".wakeb-text-field");
    expect(root.classes().some((name) => name.endsWith("--compact"))).toBe(true);
  });

  it("keeps disabled and readonly native, and renders start and end slots", () => {
    const w = render(WTextField, {
      props: { disabled: true, readonly: true, hideDetails: true },
      slots: { start: () => h("i", { class: "start-icon" }), end: () => h("i", { class: "end-icon" }) },
    });
    expect(w.get("input").attributes()).toHaveProperty("disabled");
    expect(w.get("input").attributes()).toHaveProperty("readonly");
    expect(w.find(".start-icon").exists()).toBe(true);
    expect(w.find(".end-icon").exists()).toBe(true);
  });
});

describe(`WPopover contract (${framework})`, () => {
  const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null;
  const view = (props: Record<string, unknown> = {}) => {
    const open = ref<boolean>(false);
    const component = defineComponent(() => () =>
      h(
        WPopover,
        { modelValue: open.value, "onUpdate:modelValue": (value: boolean) => (open.value = value), ariaLabel: "Filters", contentClass: "caller-panel", ...props },
        {
          activator: ({ props: activator }: { props: Record<string, unknown> }) => h("button", { ...activator, class: "opener", type: "button" }, "Filter"),
          default: ({ close }: { close: () => void }) => [h("input", { class: "inside", type: "checkbox" }), h("button", { class: "done", onClick: close }, "Done")],
        },
      ),
    );
    return { open, component };
  };

  it("opens a labelled non-modal dialog from the activator and closes through the slot", async () => {
    const { open, component } = view();
    const w = render(component);
    const opener = w.get(".opener");
    expect(opener.attributes("aria-haspopup")).toBe("dialog");
    expect(opener.attributes("aria-expanded")).toBe("false");
    await opener.trigger("click");
    await settle();
    expect(open.value).toBe(true);
    await vi.waitFor(() => expect(dialog()?.getAttribute("aria-label")).toBe("Filters"));
    expect(opener.attributes("aria-expanded")).toBe("true");
    expect(document.querySelector(".caller-panel")).not.toBeNull();
    // Focus moves into the panel once it is shown (R18); provider transitions decide when.
    await vi.waitFor(() => expect(dialog()?.contains(document.activeElement)).toBe(true));
    // Content clicks keep it open by default.
    (document.querySelector(".inside") as HTMLElement).click();
    await settle();
    expect(open.value).toBe(true);
    (document.querySelector(".done") as HTMLElement).click();
    await settle();
    expect(open.value).toBe(false);
  });

  it("closes on a content click when closeOnContentClick is set", async () => {
    const { open, component } = view({ closeOnContentClick: true });
    const w = render(component);
    await w.get(".opener").trigger("click");
    await settle();
    await vi.waitFor(() => expect(document.querySelector(".inside")).not.toBeNull());
    (document.querySelector(".inside") as HTMLElement).click();
    await settle();
    expect(open.value).toBe(false);
  });

  it("never opens while disabled", async () => {
    const { open, component } = view({ disabled: true });
    const w = render(component);
    await w.get(".opener").trigger("click");
    await settle();
    expect(open.value).toBe(false);
    expect(dialog()).toBeNull();
  });

  it("routes anchor attributes on PrimeVue and shadcn without fragment warnings", () => {
    if (framework === 'vuetify') return;
    const warnings: string[] = [];
    const { component } = view({ id: 'filter-anchor', 'data-owner': 'filters', class: 'caller-anchor' });
    const w = render(component, { global: { plugins: [host() as never, wakeb()], config: { warnHandler: (message: string) => warnings.push(message) } } });
    const anchor = w.get('#filter-anchor');
    expect(anchor.element.tagName).toBe('SPAN');
    expect(anchor.attributes('data-owner')).toBe('filters');
    expect(anchor.classes()).toContain('caller-anchor');
    expect(warnings).toEqual([]);
  });
});
