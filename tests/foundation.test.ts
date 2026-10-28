import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createSSRApp, h, nextTick, ref } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createVuetify } from "vuetify";
import { WButton, WBadge, WAccordion } from "../src";
const wrappers: VueWrapper[] = [];
function render(component: any, options: any = {}) {
  const wrapper = mount(component, {
    attachTo: document.body,
    global: { plugins: [createVuetify()] },
    ...options,
  });
  wrappers.push(wrapper);
  return wrapper;
}
afterEach(() => {
  for (const w of wrappers.splice(0)) w.unmount();
  document.body.innerHTML = "";
});
describe("WButton", () => {
  it("targets native attributes at one button and emits the original MouseEvent once", async () => {
    const click = vi.fn();
    const w = render(WButton, {
      props: {
        title: "Save",
        action: "submit",
        wrapperAttrs: { class: "layout" },
      },
      attrs: {
        form: "profile",
        id: "save",
        "aria-label": "Save profile",
        class: "native",
        onClick: click,
      },
    });
    expect(w.element.tagName).toBe("DIV");
    expect(w.classes()).toContain("layout");
    expect(w.attributes("id")).toBeUndefined();
    const button = w.get("button");
    expect(button.attributes("id")).toBe("save");
    expect(button.attributes("form")).toBe("profile");
    expect(button.attributes("type")).toBe("submit");
    expect(button.classes()).toContain("native");
    await button.trigger("click");
    expect(click).toHaveBeenCalledOnce();
    expect(click.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
    expect(w.emitted("click")).toHaveLength(1);
  });
  it("keeps icon position, scoped icon color/size and dropdown ordering", async () => {
    const w = render(WButton, {
      props: {
        title: "Open",
        icon: "mdi-check",
        iconPosition: "end",
        iconSize: 18,
        customIconColor: "#123456",
        isDropdown: true,
      },
      slots: {
        icon: ({ icon, size, color, maxWidth }: any) =>
          h(
            "i",
            {
              "data-icon": icon,
              "data-size": size,
              "data-color": color,
              "data-width": maxWidth,
            },
            "icon",
          ),
        dropdown: () => h("b", "dropdown"),
      },
    });
    expect(w.get(".v-btn__content").text()).toBe("Openicondropdown");
    expect(w.get("i").attributes("data-size")).toBe("18");
    expect(w.get("i").attributes("data-color")).toBe("#123456");
    await w.setProps({ iconPosition: "start" });
    expect(w.get(".v-btn__content").text()).toBe("iconOpendropdown");
  });
  it("keeps the same native button for text updates and replaces it when changing between text and icon branches", async () => {
    const w = render(WButton, { props: { title: "First" } });
    const first = w.get("button").element;
    await w.setProps({ title: "Second" });
    expect(w.get("button").element).toBe(first);
    await w.setProps({ title: "" });
    expect(w.get("button").element).not.toBe(first);
  });
  it("keeps content for the icon-only branch and escapes textual titles", async () => {
    const w = render(WButton, {
      slots: { content: () => h("strong", "Slot content") },
      attrs: { "aria-label": "Open tools" },
    });
    expect(w.get("strong").text()).toBe("Slot content");
    await w.setProps({ title: "<b>Save</b>" });
    expect(w.get("p").text()).toBe("<b>Save</b>");
    expect(w.find("p b").exists()).toBe(false);
    expect(w.find("strong").exists()).toBe(false);
  });
  it("honors disabled and loading transitions and preserves native Vuetify attrs", async () => {
    const click = vi.fn();
    const w = render(WButton, {
      props: { title: "Save", disabled: true },
      attrs: { onClick: click },
    });
    await w.get("button").trigger("click");
    expect(click).not.toHaveBeenCalled();
    await w.setProps({ disabled: false, isLoading: true });
    expect(w.get("button").attributes("aria-busy")).toBe("true");
    expect(w.get(".v-progress-circular").exists()).toBe(true);
    await w.setProps({ isLoading: false });
    expect(w.get("button").attributes("aria-busy")).toBeUndefined();
    await w.get("button").trigger("click");
    expect(click).toHaveBeenCalledOnce();
    const native = render(WButton, {
      props: { title: "Native" },
      attrs: { loading: true },
    });
    expect(native.get("button").attributes("aria-busy")).toBe("true");
    expect(native.get("button").classes()).not.toContain("btn--loading");
  });
  it("composes focus listeners with the real Vuetify tooltip and exposes its full title", async () => {
    const focus = vi.fn();
    const w = render(WButton, {
      props: { isTooltip: true, title: "Open tools", icon: "mdi-check" },
      attrs: { onFocus: focus },
    });
    (w.get("button").element as HTMLButtonElement).focus();
    await nextTick();
    await vi.waitFor(() =>
      expect(document.querySelector('[role="tooltip"]')?.textContent).toContain(
        "Open tools",
      ),
    );
    expect(focus).toHaveBeenCalledOnce();
    expect(w.get("button").attributes("aria-label")).toBe("Open tools");
  });
  it("supports a conventional default slot without changing named content priority", () => {
    const plain = render(WButton, {
      slots: { default: () => h("b", "Default label") },
    });
    expect(plain.get("b").text()).toBe("Default label");
    const named = render(WButton, {
      slots: {
        default: () => h("b", "Unused"),
        content: () => h("strong", "Named label"),
      },
    });
    expect(named.find("b").exists()).toBe(false);
    expect(named.get("strong").text()).toBe("Named label");
  });
  it("uses the configured Vuetify icon API and numeric max-width without requiring a global icon component", () => {
    const w = render(WButton, {
      props: { icon: "mdi-check", iconSize: "xs", maxIconWidth: 18 },
      attrs: { "aria-label": "Confirm" },
    });
    expect(w.get(".v-icon").classes()).toContain("mdi-check");
    expect(w.get(".v-icon").attributes("style")).toContain("max-width: 18px");
  });
});
describe("WBadge", () => {
  it("preserves icon, action, dot and content order on either side", async () => {
    const w = render(WBadge, {
      props: { label: "Ready", isDot: true, iconPosition: "before" },
      slots: { icon: () => h("i", "I"), actions: () => h("b", "A") },
    });
    expect(w.get(".v-chip__content").text()).toBe("IAReady");
    expect(w.get(".v-chip__content").element.children[2].className).toBe("dot");
    await w.setProps({ iconPosition: "after" });
    expect(w.get(".v-chip__content").text()).toBe("ReadyIA");
    expect(w.get(".v-chip__content").element.children[0].className).toBe("dot");
  });
  it("keeps chip variants, custom radius/padding and explicit dot color across reactive updates", async () => {
    const w = render(WBadge, {
      props: {
        type: "success",
        variant: "outlined",
        customBorderRadius: "6px",
        customPadding: "4px 8px",
        isDot: true,
        dotColor: "#123456",
      },
    });
    const chip = w.get(".v-chip");
    expect(chip.classes()).toContain("v-chip--variant-outlined");
    expect(chip.attributes("style")).toContain("border-radius: 6px");
    expect(chip.attributes("style")).toContain("height: auto");
    expect(w.get(".dot").attributes("style")).toContain("rgb(18, 52, 86)");
    await w.setProps({ variant: "default", customPadding: "", dotColor: "" });
    expect(w.get(".v-chip").classes()).toContain("v-chip--variant-tonal");
    expect(w.get(".dot").attributes("style")).toBeUndefined();
  });
  it("keeps wrapper attributes separate from explicit chip attrs and default slot", async () => {
    const click = vi.fn();
    const w = render(WBadge, {
      props: {
        label: "Unused",
        chipAttrs: { id: "status-chip", "aria-label": "Ready" },
      },
      attrs: { id: "layout", onClick: click },
      slots: { default: () => h("strong", "Custom") },
    });
    expect(w.attributes("id")).toBe("layout");
    expect(w.get(".v-chip").attributes("id")).toBe("status-chip");
    expect(w.get("strong").text()).toBe("Custom");
    await w.get(".v-chip").trigger("click");
    expect(click).toHaveBeenCalledOnce();
  });
});
describe("WAccordion", () => {
  it("keeps internal toggling even with a constant modelValue and emits one update per header click", async () => {
    const w = render(WAccordion, {
      props: { title: "Details", modelValue: true },
      slots: { default: "Body" },
    });
    await w.get(".accordion__header").trigger("click");
    expect(w.get(".accordion__body").isVisible()).toBe(false);
    expect(w.emitted("update:modelValue")).toEqual([[false]]);
    await w.setProps({ modelValue: false });
    await w.setProps({ modelValue: true });
    expect(w.get(".accordion__body").isVisible()).toBe(true);
    expect(w.emitted("update:modelValue")).toHaveLength(1);
  });
  it("stops actions and toggle buttons from bubbling into a second header toggle", async () => {
    const action = vi.fn();
    const w = render(WAccordion, {
      props: { title: "Details", beforeIcon: true, afterIcon: true },
      slots: { actions: () => h("button", { onClick: action }, "Edit") },
    });
    await w.get(".accordion__actions button").trigger("click");
    expect(action).toHaveBeenCalledOnce();
    expect(w.emitted("update:modelValue")).toBeUndefined();
    await w.get(".accordion__toggle").trigger("click");
    expect(w.emitted("update:modelValue")).toEqual([[true]]);
    expect(w.get(".accordion__body").isVisible()).toBe(true);
  });
  it("preserves nested input state while closed and connects the native title trigger to its panel", async () => {
    const draft = ref("Draft");
    const w = render(WAccordion, {
      props: { title: "Details", modelValue: true },
      slots: {
        default: () =>
          h("input", {
            value: draft.value,
            onInput: (event: Event) =>
              (draft.value = (event.target as HTMLInputElement).value),
          }),
      },
    });
    const input = w.get("input");
    await input.setValue("Keep me");
    const element = input.element;
    const trigger = w.get(".accordion__title-trigger");
    expect(trigger.attributes("type")).toBe("button");
    expect(trigger.attributes("aria-controls")).toBe(
      w.get(".accordion__body").attributes("id"),
    );
    expect(trigger.attributes("aria-expanded")).toBe("true");
    await trigger.trigger("click");
    expect(w.get(".accordion__body").isVisible()).toBe(false);
    await trigger.trigger("click");
    expect(w.get("input").element).toBe(element);
    expect((element as HTMLInputElement).value).toBe("Keep me");
    expect(w.emitted("update:modelValue")).toHaveLength(2);
  });
  it("supports accessible custom headers, icon slots and parent v-model synchronization", async () => {
    const open = ref(false);
    const w = render({
      setup: () => () =>
        h(
          WAccordion,
          {
            modelValue: open.value,
            "onUpdate:modelValue": (v: boolean) => (open.value = v),
            title: "Review",
            afterIcon: true,
          },
          {
            header: ({ triggerProps }: any) =>
              h(
                "button",
                { ...triggerProps, class: "custom-trigger" },
                "Custom header",
              ),
            toggleIcon: ({ icon }: any) => h("i", { "data-icon": icon }),
            default: () => h("p", "Body"),
          },
        ),
    });
    await w.get(".custom-trigger").trigger("click");
    expect(open.value).toBe(true);
    expect(w.get(".custom-trigger").attributes("aria-expanded")).toBe("true");
    expect(w.get("i").attributes("data-icon")).toBe("$expand");
    open.value = false;
    await nextTick();
    expect(w.get(".accordion__body").isVisible()).toBe(false);
  });
  it("keeps panel IDs distinct and deterministic during server rendering", async () => {
    const view = () =>
      h("div", [
        h(WAccordion, { title: "One" }),
        h(WAccordion, { title: "Two", modelValue: true }),
      ]);
    const renderPage = () =>
      renderToString(
        createSSRApp({ render: view }).use(createVuetify({ ssr: true })),
      );
    const html = await renderPage();
    const ids = [...html.matchAll(/id="(wakeb-accordion-[^"]+)"/g)].map(
      (m) => m[1],
    );
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    expect((await renderPage()).match(/id="wakeb-accordion-[^"]+"/g)).toEqual(
      html.match(/id="wakeb-accordion-[^"]+"/g),
    );
  });
});
