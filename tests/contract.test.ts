import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WButton, WDropdown, WModal } from "../src";
import { framework, wakeb } from "./wakeb";

/*
 * Same Vue usage, same assertions, run once per provider project (SPEC R12, M1). Only the host
 * provider install differs, and Wakeb reuses it. Queries go through roles and Wakeb classes, never
 * provider DOM, because provider markup is not part of the contract.
 */
const host = () => (framework === "vuetify" ? createVuetify() : ([PrimeVue, { theme: "none" }] as const));
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

describe(`WButton contract (${framework})`, () => {
  it("renders the title and emits one MouseEvent per click", async () => {
    const w = render(WButton, { props: { title: "Save" } });
    const button = w.get("button");
    expect(button.text()).toContain("Save");
    expect(button.attributes("type")).toBe("button");
    await button.trigger("click");
    expect(w.emitted("click")).toHaveLength(1);
    expect(w.emitted("click")![0][0]).toBeInstanceOf(MouseEvent);
  });

  it.each([["disabled"], ["isLoading"]])("%s suppresses the click event and native submit", async (state) => {
    let submits = 0;
    const view = defineComponent(() => () =>
      h("form", { onSubmit: (event: Event) => (event.preventDefault(), submits++) }, [
        h(WButton, { title: "Send", action: "submit", [state]: true }),
      ]),
    );
    const w = render(view);
    const button = w.get("button");
    expect(button.attributes("type")).toBe("submit");
    button.element.click();
    await nextTick();
    expect(submits).toBe(0);
    expect(w.findComponent(WButton).emitted("click")).toBeUndefined();
  });

  it("names tooltip buttons, routes attrs to the button and wrapperAttrs to the wrapper", () => {
    const w = render(WButton, {
      props: { title: "Settings", isTooltip: true, icon: "$expand", wrapperAttrs: { "data-wrapper": "yes" } },
      attrs: { "data-test": "action", class: "extra" },
    });
    const button = w.get("button");
    expect(button.attributes("aria-label")).toBe("Settings");
    expect(button.attributes("data-test")).toBe("action");
    expect(button.classes()).toEqual(expect.arrayContaining(["btn", "btn--primary", "btn--lg", "extra"]));
    expect(w.get("[data-wrapper]").element.contains(button.element)).toBe(true);
  });

  it("passes the documented icon slot payload", () => {
    const seen: unknown[] = [];
    render(WButton, {
      props: { title: "Next", icon: "$expand", iconSize: "md", iconColorType: "primary", iconPosition: "end" },
      slots: { icon: (payload: unknown) => (seen.push(payload), h("i", { class: "custom-icon" })) },
    });
    expect(seen[0]).toMatchObject({ icon: "$expand", size: "md", maxWidth: "100%" });
    expect(String((seen[0] as { color: string }).color)).toContain("--wakeb-button-icon-primary");
  });
});

describe(`WDropdown contract (${framework})`, () => {
  const items = [
    { label: "Pending", value: "pending" },
    { label: "Done", value: "done" },
    { label: "Archived", value: "archived", disabled: true },
  ];
  const menuItems = () => Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"]'));
  const open = async (activator: { trigger(event: string): Promise<void> }) => {
    await activator.trigger("click");
    await vi.waitFor(() => expect(menuItems().length).toBeGreaterThan(0));
  };
  const clickItem = async (label: string) => {
    const row = menuItems().find((item) => item.textContent?.includes(label))!;
    (row.querySelector("a, span") as HTMLElement | null ?? (row as HTMLElement)).click();
    await settle();
  };

  it("exposes activator props and opens a role=menu with menuitems", async () => {
    let slotPayload: Record<string, unknown> | undefined;
    const w = render(WDropdown, {
      props: { title: "Status", menuItems: items },
      slots: {
        activator: (payload: Record<string, unknown>) => {
          slotPayload = payload;
          return h("button", { ...(payload.props as object), class: "custom-activator" }, "Open");
        },
      },
    });
    expect(slotPayload).toMatchObject({ isActive: false, buttonProps: { title: "Status" } });
    await open(w.get(".custom-activator"));
    expect(menuItems().map((item) => item.textContent?.trim())).toEqual(["Pending", "Done", "Archived"]);
    expect(w.get(".custom-activator").attributes("aria-expanded")).toBe("true");
    const controlled = document.getElementById(w.get(".custom-activator").attributes("aria-controls")!);
    expect(controlled?.matches('[role="menu"]') || controlled?.querySelector('[role="menu"]')).toBeTruthy();
  });

  it("emits selectedItem before update:modelValue once per choice and ignores disabled rows", async () => {
    const w = render(WDropdown, { props: { title: "Status", menuItems: items, showSelected: true } });
    await open(w.get("button"));
    await clickItem("Done");
    const order = Object.keys(w.emitted()).filter((name) => name === "selectedItem" || name === "update:modelValue");
    expect(order).toEqual(["selectedItem", "update:modelValue"]);
    expect(w.emitted("selectedItem")).toEqual([[items[1]]]);
    expect(w.emitted("update:modelValue")).toEqual([["done"]]);
    expect(w.get("button").text()).toContain("Done");
    // A disabled row never activates, even when a script clicks it past provider pointer-events rules.
    if (!menuItems().length) await open(w.get("button"));
    await clickItem("Archived");
    expect(w.emitted("selectedItem")).toHaveLength(1);
    expect(w.emitted("update:modelValue")).toHaveLength(1);
  });

  it("follows the controlled model, including an explicit null clear", async () => {
    const w = render(WDropdown, { props: { title: "Status", menuItems: items, modelValue: "done", showSelected: true } });
    expect(w.get("button").text()).toContain("Done");
    await w.setProps({ modelValue: null });
    expect(w.get("button").text()).toContain("Status");
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("renders enabled link rows as links and drops href from disabled rows", async () => {
    const links = [
      { label: "Docs", value: 1, href: "/docs" },
      { label: "Admin", value: 2, href: "/admin", disabled: true },
    ];
    const w = render(WDropdown, { props: { title: "Go", menuItems: links, isLinks: true } });
    await open(w.get("button"));
    const [docs, admin] = menuItems();
    expect(docs.querySelector("a")?.getAttribute("href") ?? docs.getAttribute("href")).toBe("/docs");
    expect(admin.querySelector("[href]") ?? (admin.hasAttribute("href") ? admin : null)).toBeNull();
    expect(admin.getAttribute("aria-disabled")).toBe("true");
  });
});

describe(`WModal contract (${framework})`, () => {
  const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null;

  it("opens from the model with an accessible name and closes once through the close button", async () => {
    const w = render(WModal, { props: { modelValue: true, title: "Edit user", closeLabel: "Close dialog" }, slots: { default: () => "Body" } });
    await settle();
    expect(dialog()?.getAttribute("aria-label")).toBe("Edit user");
    expect(dialog()?.textContent).toContain("Body");
    (document.querySelector('[aria-label="Close dialog"]') as HTMLElement).click();
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
  });

  it("applies parent model changes without emitting and renders description-only headers", async () => {
    const w = render(WModal, { props: { modelValue: false, description: "Only a description", closable: false } });
    await w.setProps({ modelValue: true });
    await settle();
    expect(document.querySelector(".wakeb-modal__description")?.textContent).toContain("Only a description");
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("shows the loading slot until data is loaded", async () => {
    render(WModal, {
      props: { modelValue: true, dataLoaded: false, loadingLabel: "Fetching" },
      slots: { loading: ({ label }: { label: string }) => h("p", { class: "custom-loading" }, label) },
    });
    await settle();
    expect(document.querySelector(".custom-loading")?.textContent).toBe("Fetching");
  });

  it("opens from the activator slot props", async () => {
    const open = ref(false);
    const view = defineComponent(() => () =>
      h(
        WModal,
        { modelValue: open.value, "onUpdate:modelValue": (value: boolean) => (open.value = value), title: "From activator" },
        { activator: ({ props }: { props: Record<string, unknown> }) => h("button", { ...props, class: "opener" }, "Open") },
      ),
    );
    const w = render(view);
    await w.get(".opener").trigger("click");
    await settle();
    expect(open.value).toBe(true);
    expect(dialog()?.getAttribute("aria-label")).toBe("From activator");
    // Focus moves into the dialog once it opens (R18); provider transitions decide when.
    await vi.waitFor(() => expect(dialog()?.contains(document.activeElement)).toBe(true));
  });
});
