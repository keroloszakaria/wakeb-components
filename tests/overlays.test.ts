import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { createVuetify } from "vuetify";
import { VApp } from "vuetify/components/VApp";
import { VDialog } from "vuetify/components/VDialog";
import { VNavigationDrawer } from "vuetify/components/VNavigationDrawer";
import { WModal, WDrawer } from "../src";
const wrappers: VueWrapper[] = [];
async function render(component: any, options: any = {}, rtl = false) {
  const vuetify = createVuetify({
    locale: { locale: rtl ? "ar" : "en", rtl: { ar: true, en: false } },
  });
  const Host = defineComponent({
    render: () =>
      h(VApp, null, {
        default: () =>
          h(
            component,
            { ...options.props, ...options.attrs, transition: false },
            options.slots,
          ),
      }),
  });
  const host = mount(Host, {
    attachTo: document.body,
    global: { plugins: [vuetify], stubs: { transition: false } },
  });
  wrappers.push(host);
  await flushPromises();
  await nextTick();
  return host.findComponent(component);
}
const settle = async () => {
  await flushPromises();
  await nextTick();
};
afterEach(() => {
  for (const w of wrappers.splice(0)) w.unmount();
  document.body.innerHTML = "";
});
describe("WModal", () => {
  it("uses a persistent closed dialog and forwards attrs to Vuetify", async () => {
    const w = await render(WModal, {
      attrs: { id: "report-dialog", "data-owner": "company" },
    });
    expect(w.getComponent(VDialog).props()).toMatchObject({
      persistent: true,
      modelValue: false,
    });
    expect(w.getComponent(VDialog).vm.$attrs).toMatchObject({
      id: "report-dialog",
      "data-owner": "company",
    });
  });
  it("closes once from a localized native button without submitting a form", async () => {
    const w = await render(WModal, {
      props: {
        modelValue: true,
        title: "Report",
        closeLabel: "Dismiss report",
        width: "640px",
      },
      slots: { content: () => h("input", { value: "Draft" }) },
    });
    const button = document.querySelector(
      'button[aria-label="Dismiss report"]',
    ) as HTMLButtonElement;
    expect(button.type).toBe("button");
    expect(document.querySelector("input")?.value).toBe("Draft");
    expect(w.getComponent(VDialog).props("maxWidth")).toBe("640px");
    button.click();
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
  });
  it("supports title/icon/decoration and action slots with no app icon registry", async () => {
    await render(WModal, {
      props: { modelValue: true, title: "Fallback", description: "Details" },
      slots: {
        title: () => h("h2", "Custom heading"),
        "header-icon": () => h("b", "Icon"),
        "header-decoration": () => h("i", "Decoration"),
        "header-actions": () => h("button", "Pin"),
        actions: () => h("button", "Save"),
      },
    });
    expect(document.body.textContent).toContain("Custom heading");
    expect(document.body.textContent).toContain("Decoration");
    expect(document.body.textContent).toContain("Details");
    expect(document.querySelector(".v-card-actions")?.textContent).toContain(
      "Save",
    );
  });
  it("replaces content while data loads and provides an independent loading overlay", async () => {
    await render(WModal, {
      props: { modelValue: true, dataLoaded: false, loading: true },
      slots: {
        content: () => h("b", "Secret content"),
        loading: () => h("p", "Fetching"),
        "loading-overlay": () => h("div", { id: "saving" }, "Saving"),
      },
    });
    expect(document.body.textContent).toContain("Fetching");
    expect(document.body.textContent).not.toContain("Secret content");
    expect(document.querySelector("#saving")).not.toBeNull();
  });
  it("supports full header replacement and hides actions explicitly", async () => {
    const w = await render(WModal, {
      props: { modelValue: true, showActions: false },
      slots: {
        header: ({ close }: any) =>
          h("button", { id: "custom-close", onClick: close }, "Custom close"),
        actions: () => h("p", "Hidden footer"),
        default: () => h("p", "Default body"),
      },
    });
    expect(document.querySelector(".v-card-actions")).toBeNull();
    expect(document.body.textContent).toContain("Default body");
    (document.querySelector("#custom-close") as HTMLElement).click();
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
  });
  it("delegates Escape to Vuetify and honors persistent dialogs", async () => {
    const w = await render(WModal, {
      props: { modelValue: true, persistent: false },
    });
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
    const persistent = await render(WModal, {
      props: { modelValue: true, persistent: true },
    });
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await settle();
    expect(persistent.emitted("update:modelValue")).toBeUndefined();
  });
});
describe("WDrawer", () => {
  it("defaults to a temporary end drawer with a 420px width", async () => {
    const w = await render(WDrawer);
    expect(w.getComponent(VNavigationDrawer).props()).toMatchObject({
      modelValue: false,
      temporary: true,
      persistent: false,
      scrim: true,
      width: 420,
      location: "right",
    });
  });
  it("maps logical start/end to RTL and preserves numeric width parsing", async () => {
    const rtl = await render(
      WDrawer,
      { props: { position: "end", width: "560px" } },
      true,
    );
    expect(rtl.getComponent(VNavigationDrawer).props()).toMatchObject({
      location: "left",
      width: 560,
    });
    const start = await render(
      WDrawer,
      { props: { position: "start", width: "invalid" } },
      true,
    );
    expect(start.getComponent(VNavigationDrawer).props()).toMatchObject({
      location: "right",
      width: 420,
    });
  });
  it("emits model then close only for the close button", async () => {
    const w = await render(WDrawer, {
      props: { modelValue: true, closeLabel: "Dismiss panel" },
    });
    (
      document.querySelector(
        'button[aria-label="Dismiss panel"]',
      ) as HTMLElement
    ).click();
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
    expect(w.emitted("close")).toEqual([[]]);
  });
  it("closes on scrim without emitting the button-only close event", async () => {
    const w = await render(WDrawer, { props: { modelValue: true } });
    (
      document.querySelector(".v-navigation-drawer__scrim") as HTMLElement
    ).click();
    await settle();
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
    expect(w.emitted("close")).toBeUndefined();
  });
  it("honors persistent/transparent scrims and retains both content slots", async () => {
    const w = await render(WDrawer, {
      props: { modelValue: true, persistent: true },
      slots: {
        content: () => h("p", "Named body"),
        default: () => h("p", "Default body"),
        actions: () => h("button", "Apply"),
      },
    });
    (
      document.querySelector(".v-navigation-drawer__scrim") as HTMLElement
    ).click();
    await settle();
    expect(w.emitted("update:modelValue")).toBeUndefined();
    expect(document.body.textContent).toContain("Named body");
    expect(document.body.textContent).toContain("Default body");
    expect(document.querySelector(".drawer-panel__actions")?.textContent).toBe(
      "Apply",
    );
    const transparent = await render(WDrawer, {
      props: { transparentOverlay: true },
    });
    expect(transparent.getComponent(VNavigationDrawer).props("scrim")).toBe(
      false,
    );
  });
  it("replaces data content during loading and omits unused header/footer", async () => {
    await render(WDrawer, {
      props: {
        modelValue: true,
        closable: false,
        dataLoaded: false,
        loading: true,
      },
      slots: { content: () => h("p", "Not ready") },
    });
    expect(document.querySelector(".drawer-panel__header")).toBeNull();
    expect(document.querySelector(".drawer-panel__actions")).toBeNull();
    expect(document.body.textContent).not.toContain("Not ready");
    expect(document.querySelectorAll('[role="status"]')).toHaveLength(2);
  });
});
