import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { VBtn } from "vuetify/components/VBtn";
import { VMenu } from "vuetify/components/VMenu";
import { VDialog } from "vuetify/components/VDialog";
import { VProgressCircular } from "vuetify/components/VProgressCircular";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Menu from "primevue/menu";
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import ShadcnButton from "../src/adapters/shadcn/ui/Button.vue";
import ShadcnDropdownMenuContent from "../src/adapters/shadcn/ui/DropdownMenuContent.vue";
import ShadcnDialogContent from "../src/adapters/shadcn/ui/DialogContent.vue";
import ShadcnSpinner from "../src/adapters/shadcn/ui/Spinner.vue";
import {
  WAccordion, WAvatarStack, WBadge, WBadgeStack, WBaseSidebar, WButton, WCarousel, WDrawer, WDropdown, WExportDropdown, WLoading, WModal,
  WPageSkeleton, WSegmentedProgress, WSemiCircleGauge, WTabs, WTooltipBtn, WTree, WTruncatedText, WUserBadge, WVerticalSteps,
} from "../src";
import { framework, shadcnHost, wakeb } from "./wakeb";

/*
 * Attribute targets (SPEC R14) and the providerProps escape hatch (SPEC R12), run on each provider.
 * Attribute assertions are portable and identical on both projects; providerProps cases use each
 * provider's own native prop names, which is exactly why they are not portable.
 */
const vuetify = framework === "vuetify";
const shadcn = framework === "shadcn";
const host = () => (vuetify ? createVuetify() : shadcn ? shadcnHost : ([PrimeVue, { theme: "none" }] as const));
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
const warnings = () => vi.mocked(console.warn).mock.calls.map(([message]) => String(message));
const ignored = () => warnings().filter((message) => message.startsWith("[WAKEB_PROVIDER_PROP_IGNORED]"));
const primitive = {
  vuetify: { WButton: VBtn, WDropdown: VMenu, WModal: VDialog, WLoading: VProgressCircular },
  primevue: { WButton: Button, WDropdown: Menu, WModal: Dialog, WLoading: ProgressSpinner },
  // shadcn-vue primitives are Wakeb's adapted copies of the shadcn-vue components over reka-ui.
  shadcn: { WButton: ShadcnButton, WDropdown: ShadcnDropdownMenuContent, WModal: ShadcnDialogContent, WLoading: ShadcnSpinner },
}[framework];
const portableAttrs = (listener: () => void) => ({
  class: "caller-class",
  style: { outline: "1px solid red" },
  id: "caller-id",
  "data-test": "caller",
  "aria-describedby": "caller-help",
  onMouseenter: listener,
});
const expectPortableTarget = (element: Element) => {
  expect(element.classList.contains("caller-class")).toBe(true);
  expect((element as HTMLElement).style.outline).toContain("red");
  expect(element.id).toBe("caller-id");
  expect(element.getAttribute("data-test")).toBe("caller");
  expect(element.getAttribute("aria-describedby")).toBe("caller-help");
  // Exactly one element receives them.
  expect(document.querySelectorAll('[data-test="caller"]')).toHaveLength(1);
  expect(document.querySelectorAll(".caller-class")).toHaveLength(1);
};

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});
enableAutoUnmount(afterEach);

describe(`attribute targets (${framework})`, () => {
  it("WButton routes attrs and DOM listeners to the native button, and wrapperAttrs to the layout div", async () => {
    const enter = vi.fn();
    const w = render(WButton, { props: { title: "Save", wrapperAttrs: { "data-wrapper": "yes" } }, attrs: portableAttrs(enter) });
    const button = w.get("button").element;
    expectPortableTarget(button);
    expect(button.closest("[data-wrapper]")).toBe(w.element);
    button.dispatchEvent(new MouseEvent("mouseenter"));
    expect(enter).toHaveBeenCalledTimes(1);
  });

  it("WButton keeps type, disabled safety and one click per activation when attrs try to override them", async () => {
    const click = vi.fn();
    const w = render(WButton, { props: { title: "Save", disabled: true }, attrs: { type: "submit", onClick: click } });
    const button = w.get("button");
    expect(button.attributes("type")).toBe("button");
    button.element.click();
    expect(click).not.toHaveBeenCalled();
    await w.setProps({ disabled: false });
    button.element.click();
    expect(click).toHaveBeenCalledTimes(1);
    expect(w.emitted("click")).toHaveLength(1);
  });

  it("WDropdown routes attrs to its root element, not to the activator or the menu", async () => {
    const enter = vi.fn();
    const w = render(WDropdown, { props: { title: "Status", menuItems: [{ label: "Done", value: 1 }] }, attrs: portableAttrs(enter) });
    expectPortableTarget(w.element);
    expect(w.get("button").attributes("id")).not.toBe("caller-id");
    await w.get("button").trigger("click");
    await vi.waitFor(() => expect(document.querySelector('[role="menu"]')).not.toBeNull());
    expect(document.querySelectorAll(".caller-class")).toHaveLength(1);
    w.element.dispatchEvent(new MouseEvent("mouseenter"));
    expect(enter).toHaveBeenCalledTimes(1);
  });

  it("WModal routes attrs to the role=dialog element and keeps its own accessible name", async () => {
    const enter = vi.fn();
    render(WModal, { props: { modelValue: true, title: "Edit" }, attrs: { ...portableAttrs(enter), "aria-label": "Caller name" } });
    await settle();
    const dialog = document.querySelector('[role="dialog"]')!;
    expectPortableTarget(dialog);
    expect(dialog.classList.contains("wakeb-modal")).toBe(true);
    expect(dialog.getAttribute("aria-label")).toBe("Edit");
    dialog.dispatchEvent(new MouseEvent("mouseenter"));
    expect(enter).toHaveBeenCalledTimes(1);
  });

  it("WLoading routes attrs to the role=status root and keeps its status semantics", () => {
    const enter = vi.fn();
    const w = render(WLoading, { props: { label: "Saving" }, attrs: { ...portableAttrs(enter), role: "presentation", "aria-label": "Caller name" } });
    expectPortableTarget(w.element);
    expect(w.element.getAttribute("role")).toBe("status");
    expect(w.element.getAttribute("aria-label")).toBe("Saving");
    w.element.dispatchEvent(new MouseEvent("mouseenter"));
    expect(enter).toHaveBeenCalledTimes(1);
  });
});

/* The documented targets of the components only Vuetify renders so far (docs/reference-data.mjs `attrs`). */
describe.skipIf(!vuetify)("attribute targets of Vuetify-only components", () => {
  const cases: [string, unknown, Record<string, unknown>, string][] = [
    ["WTruncatedText", WTruncatedText, { label: "A long label to shorten", length: 6 }, "span.truncated-text"],
    ["WSegmentedProgress", WSegmentedProgress, { value: 40 }, '[role="progressbar"]'],
    ["WSemiCircleGauge", WSemiCircleGauge, { value: 40 }, ".semi-circle-gauge"],
    ["WAvatarStack", WAvatarStack, { items: [{ name: "Ada Lovelace" }] }, ".avatars-stack"],
    ["WPageSkeleton", WPageSkeleton, { config: [{ items: [{ type: "text" }] }] }, '.page-skeleton[role="status"]'],
    ["WVerticalSteps", WVerticalSteps, { steps: [{ title: "Review" }] }, '[role="list"]'],
    ["WBadge", WBadge, { label: "Ready" }, "root"],
    ["WAccordion", WAccordion, { title: "Details" }, ".accordion"],
    ["WBadgeStack", WBadgeStack, { items: [{ label: "Admin" }] }, ".badge-stack"],
    ["WUserBadge", WUserBadge, { user: { name: "Ada" } }, ".wakeb-user-badge"],
    ["WTooltipBtn", WTooltipBtn, { text: "Help", icon: "$info" }, "button"],
    ["WTabs", WTabs, { tabs: [{ label: "One", slot: "one" }] }, ".wakeb-tabs"],
    ["WTree", WTree, { nodes: [{ id: 1, name: "Root" }] }, 'ul[role="tree"]'],
    ["WCarousel", WCarousel, { slides: [1, 2] }, '[role="region"]'],
    ["WBaseSidebar", WBaseSidebar, { title: "People", items: [{ id: 1 }] }, ".wakeb-base-sidebar"],
  ];
  it.each(cases)("%s", (_name, component, props, selector) => {
    const w = render(component, { props, attrs: portableAttrs(() => {}) });
    const target = document.querySelector('[data-test="caller"]')!;
    expect(target).not.toBeNull();
    expectPortableTarget(target);
    expect(selector === "root" ? target === w.element : target.matches(selector)).toBe(true);
  });

  it("WDrawer sends attrs to its dialog root", async () => {
    const view = defineComponent(() => () => h(WDrawer, { modelValue: true, title: "Filters", ...portableAttrs(() => {}) }));
    render(view);
    await settle();
    const target = document.querySelector('[data-test="caller"]')!;
    expectPortableTarget(target);
    expect(target.getAttribute("role")).toBe("dialog");
    expect(target.classList.contains("wakeb-drawer")).toBe(true);
  });

  it("WExportDropdown keeps its baseline target: the menu overlay, while open", async () => {
    const w = render(WExportDropdown, { attrs: portableAttrs(() => {}) });
    expect(document.querySelector('[data-test="caller"]')).toBeNull();
    await w.get("button").trigger("click");
    await vi.waitFor(() => expect(document.querySelector('[data-test="caller"] [role="menu"]')).not.toBeNull());
    expectPortableTarget(document.querySelector('[data-test="caller"]')!);
  });
});

describe(`providerProps (${framework})`, () => {
  const openAutoFocus = () => {};
  const native = {
    vuetify: { WButton: { variant: "tonal", ripple: false }, WDropdown: { location: "end", closeOnContentClick: false }, WModal: { scrollable: true }, WLoading: { width: 7 } },
    primevue: { WButton: { severity: "danger", raised: true }, WDropdown: { appendTo: "self" }, WModal: { position: "top" }, WLoading: { animationDuration: "3s" } },
    // reka-ui's DialogContent declares no free native prop, only callbacks; onOpenAutoFocus is one.
    shadcn: { WButton: { variant: "destructive", size: "sm" }, WDropdown: { side: "top", sideOffset: 8 }, WModal: { onOpenAutoFocus: openAutoFocus }, WLoading: { strokeWidth: 3 } },
  }[framework] as Record<"WButton" | "WDropdown" | "WModal" | "WLoading", Record<string, unknown>>;
  const props = {
    WButton: { title: "Save" },
    WDropdown: { title: "Status", menuItems: [{ label: "Done", value: 1 }] },
    WModal: { modelValue: true, title: "Edit" },
    WLoading: {},
  };
  const components = { WButton, WDropdown, WModal, WLoading };

  it.each(Object.keys(native) as (keyof typeof native)[])("%s passes declared native props to the provider primitive", async (name) => {
    const w = render(components[name], { props: { ...props[name], providerProps: native[name] } });
    if (name === "WDropdown") await w.get("button").trigger("click");
    await settle();
    const target = w.findComponent(primitive[name] as never);
    expect(target.exists()).toBe(true);
    // Native listeners are declared events, so they arrive as vnode props rather than component props.
    for (const [key, value] of Object.entries(native[name])) expect(/^on[A-Z]/.test(key) ? target.vm.$.vnode.props?.[key] : target.props(key)).toEqual(value);
    expect(ignored()).toEqual([]);
  });

  it("follows reactive providerProps updates", async () => {
    const [key, first, second] = vuetify ? ["variant", "tonal", "flat"] : shadcn ? ["variant", "destructive", "outline"] : ["severity", "danger", "info"];
    const w = render(WButton, { props: { title: "Save", providerProps: { [key]: first } } });
    await w.setProps({ providerProps: { [key]: second } });
    expect(w.findComponent(primitive.WButton as never).props(key)).toBe(second);
  });

  it("never lets providerProps override WButton safety, element type, name or the portable click", async () => {
    const nativeClick = vi.fn();
    const w = render(WButton, {
      props: {
        title: "Save",
        isTooltip: false,
        disabled: true,
        providerProps: { disabled: false, loading: true, type: "submit", onClick: nativeClick, class: "native-class", "aria-label": "Hijack", id: "native-id", ...(vuetify ? { href: "/away" } : { label: "Hijack", as: "a" }) },
      },
    });
    const button = w.get("button");
    expect(button.element.disabled).toBe(true);
    expect(button.attributes("type")).toBe("button");
    expect(button.classes()).not.toContain("native-class");
    expect(button.attributes("aria-label")).not.toBe("Hijack");
    expect(button.attributes("id")).not.toBe("native-id");
    await w.setProps({ disabled: false });
    button.element.click();
    expect(w.emitted("click")).toHaveLength(1);
    expect(nativeClick).not.toHaveBeenCalled();
    const report = ignored().join("\n");
    for (const key of ["disabled", "loading", "type", "onClick", "class", "aria-label", "id"]) expect(report).toContain(`'${key}'`);
  });

  it("chains native callbacks without a second portable event and blocks the model handler", async () => {
    const native = vi.fn();
    const model = vi.fn();
    const nativeEvent = vuetify ? "onAfterEnter" : shadcn ? "onOpenAutoFocus" : "onShow";
    const w = render(WModal, {
      props: { modelValue: false, title: "Edit", closeLabel: "Close dialog", providerProps: { [nativeEvent]: native, "onUpdate:modelValue": model, persistent: false } },
    });
    await w.setProps({ modelValue: true });
    await settle();
    await vi.waitFor(() => expect(native).toHaveBeenCalledTimes(1));
    // Wakeb's own handler on the same event still runs: focus moves into the dialog.
    await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')?.contains(document.activeElement)).toBe(true));
    (document.querySelector('[aria-label="Close dialog"]') as HTMLElement).click();
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
    expect(model).not.toHaveBeenCalled();
    expect(ignored().join("\n")).toContain("'onUpdate:modelValue'");
    expect(ignored().join("\n")).toContain("'persistent'");
  });

  it("blocks the portable afterLeave callback so it cannot fire twice", async () => {
    const after = vi.fn();
    const key = vuetify || shadcn ? "onAfterLeave" : "onAfterHide";
    render(WModal, { props: { modelValue: true, title: "Edit", providerProps: { [key]: after } } });
    await settle();
    expect(ignored().join("\n")).toContain(`'${key}'`);
  });

  it("keeps WDropdown disabled when providerProps tries to enable or open the menu", async () => {
    const w = render(WDropdown, {
      props: { title: "Status", disabled: true, menuItems: [{ label: "Done", value: 1 }], providerProps: vuetify ? { disabled: false, modelValue: true } : shadcn ? { forceMount: true, open: true } : { popup: false, model: [] } },
    });
    await w.get("button").trigger("click");
    await settle();
    expect(document.querySelector('[role="menuitem"]')).toBeNull();
    expect(ignored().length).toBeGreaterThan(0);
  });

  it("drops keys the selected primitive does not declare, with a diagnostic", async () => {
    const w = render(WLoading, { props: { providerProps: { notANativeProp: 1, onMouseenter: () => {} } } });
    expect(w.html()).not.toMatch(/notanativeprop/i);
    const report = ignored().join("\n");
    expect(report).toContain("'notANativeProp' is not a prop or event");
    expect(report).toContain("'onMouseenter' is not a prop or event");
  });

  it("ignores a value that is not a plain object", () => {
    render(WButton, { props: { title: "Save", providerProps: "variant=tonal" as never } });
    expect(ignored().join("\n")).toContain("expected a plain object");
  });

  it("reports each ignored key once per app", async () => {
    const w = render(WButton, { props: { title: "Save", providerProps: { type: "submit" } } });
    await w.setProps({ title: "Again", providerProps: { type: "reset" } });
    expect(ignored()).toHaveLength(1);
  });

  it("is rejected in plugin defaults, which stay portable", () => {
    expect(() => wakeb({ defaults: { WButton: { providerProps: {} } } as never })).toThrow(/WAKEB_CONFIG_INVALID.*providerProps/);
  });

  it.skipIf(!vuetify)("is dropped with a diagnostic by components that have no provider primitive yet", () => {
    const w = render(WBadge, { props: { label: "Ready" }, attrs: { providerProps: { variant: "flat" } } });
    expect(w.html()).not.toMatch(/providerprops/i);
    expect(ignored().join("\n")).toContain("WBadge does not accept providerProps");
  });

  it("leaves internal compositions untouched", async () => {
    // The WModal close button is a WButton rendered by Wakeb; it gets no native props from the modal.
    const view = defineComponent(() => () => h(WModal, { modelValue: true, title: "Edit", closeLabel: "Close dialog", providerProps: native.WModal }));
    render(view);
    await settle();
    const close = document.querySelector('[aria-label="Close dialog"]') as HTMLButtonElement;
    expect(close.getAttribute("type")).toBe("button");
    expect(ignored()).toEqual([]);
  });
});
