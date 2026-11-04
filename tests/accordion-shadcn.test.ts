import { afterEach, describe, expect, it, vi } from "vitest";
import { h, nextTick, ref } from "vue";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { WAccordion, type WakebComponentsOptions } from "../src";
import { framework, shadcnHost, wakeb } from "./wakeb";

/*
 * WAccordion shared contract on the shadcn-vue project (SPEC R12–R14, R17, R18). The cases are the
 * WAccordion block of tests/stacks-contract.test.ts, unchanged; that file also covers the stacks, which
 * are enabled for shadcn-vue separately, so the accordion cases live here until it is split per component.
 * Vuetify and PrimeVue keep running them from stacks-contract.test.ts, so this file runs only on shadcn.
 */
const render = (component: unknown, options: Record<string, unknown> = {}, plugin: Partial<WakebComponentsOptions> = {}, transitions = false) =>
  mount(component as never, {
    attachTo: document.body,
    global: { plugins: [shadcnHost as never, wakeb(plugin)], stubs: { transition: transitions } },
    ...options,
  });
const warnings = () => vi.mocked(console.warn).mock.calls.map(([message]) => String(message));
afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});
enableAutoUnmount(afterEach);

describe.runIf(framework === "shadcn")("WAccordion on shadcn-vue", () => {
  describe(`WAccordion contract (${framework})`, () => {
    it("keeps internal toggling with a constant modelValue and emits one update per header click", async () => {
      const w = render(WAccordion, { props: { title: "Details", modelValue: true }, slots: { default: "Body" } }, {}, true);
      await w.get(".accordion__header").trigger("click");
      expect(w.get(".accordion__body").isVisible()).toBe(false);
      expect(w.emitted("update:modelValue")).toEqual([[false]]);
      await w.setProps({ modelValue: false });
      await w.setProps({ modelValue: true });
      expect(w.get(".accordion__body").isVisible()).toBe(true);
      expect(w.emitted("update:modelValue")).toHaveLength(1);
    });

    it("stops actions and toggle buttons from bubbling into a second toggle", async () => {
      const action = vi.fn();
      const w = render(WAccordion, {
        props: { title: "Details", beforeIcon: true, afterIcon: true, toggleLabel: "Show details" },
        slots: { actions: () => h("button", { onClick: action }, "Edit") },
      }, {}, true);
      await w.get(".accordion__actions button").trigger("click");
      expect(action).toHaveBeenCalledOnce();
      expect(w.emitted("update:modelValue")).toBeUndefined();
      const toggles = w.findAll('button[aria-label="Show details"]').filter((button) => button.classes().includes("accordion__toggle"));
      expect(toggles).toHaveLength(2);
      expect(toggles[0].attributes("type")).toBe("button");
      await toggles[0].trigger("click");
      expect(w.emitted("update:modelValue")).toEqual([[true]]);
      expect(w.get(".accordion__body").isVisible()).toBe(true);
      expect(toggles[1].attributes("aria-expanded")).toBe("true");
      expect(toggles[1].attributes("aria-controls")).toBe(w.get(".accordion__body").attributes("id"));
    });

    it("connects the native title trigger to a named region and keeps nested state while closed", async () => {
      const draft = ref("Draft");
      const w = render(WAccordion, {
        props: { title: "Details", modelValue: true },
        slots: { default: () => h("input", { value: draft.value, onInput: (event: Event) => (draft.value = (event.target as HTMLInputElement).value) }) },
      }, {}, true);
      const input = w.get("input");
      await input.setValue("Keep me");
      const trigger = w.get(".accordion__title-trigger");
      const body = w.get(".accordion__body");
      expect(trigger.attributes("type")).toBe("button");
      expect(trigger.attributes("aria-controls")).toBe(body.attributes("id"));
      expect(trigger.attributes("aria-expanded")).toBe("true");
      expect(body.attributes("role")).toBe("region");
      expect(body.attributes("aria-label")).toBe("Details");
      await trigger.trigger("click");
      expect(trigger.attributes("aria-expanded")).toBe("false");
      expect(w.get(".accordion__body").isVisible()).toBe(false);
      await trigger.trigger("click");
      expect(w.get("input").element).toBe(input.element);
      expect((input.element as HTMLInputElement).value).toBe("Keep me");
      expect(w.emitted("update:modelValue")).toHaveLength(2);
    });

    it("passes header, actions, default and toggleIcon slot payloads and follows the parent model", async () => {
      const open = ref(false);
      const seen: Record<string, unknown> = {};
      const w = render({
        setup: () => () =>
          h(
            WAccordion,
            { modelValue: open.value, "onUpdate:modelValue": (v: boolean) => (open.value = v), title: "Review", afterIcon: true, contentId: "review-panel" },
            {
              header: (payload: { triggerProps: Record<string, unknown> }) => ((seen.header = payload), h("button", { ...payload.triggerProps, class: "custom-trigger" }, "Custom header")),
              actions: (payload: unknown) => ((seen.actions = payload), null),
              toggleIcon: (payload: { icon: string }) => ((seen.toggleIcon = payload), h("i", { "data-icon": payload.icon })),
              default: (payload: unknown) => ((seen.default = payload), h("p", "Body")),
            },
          ),
      }, {}, {}, true);
      expect(seen.header).toMatchObject({ open: false, triggerProps: { type: "button", "aria-expanded": false, "aria-controls": "review-panel", "aria-label": "Review" } });
      expect(seen.actions).toMatchObject({ open: false });
      expect(seen.default).toEqual({ open: false });
      expect(seen.toggleIcon).toMatchObject({ icon: "$expand", size: "sm", maxWidth: "100%" });
      await w.get(".custom-trigger").trigger("click");
      expect(open.value).toBe(true);
      expect(w.get(".custom-trigger").attributes("aria-expanded")).toBe("true");
      expect(w.get("#review-panel").isVisible()).toBe(true);
      open.value = false;
      await nextTick();
      expect(w.get(".accordion__body").isVisible()).toBe(false);
    });

    it("sends attributes to the root and resolves iconColor portably", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      const w = render(WAccordion, { props: { title: "Details", beforeIcon: true, iconColor: "red-darken-2" }, attrs: { id: "faq", class: "consumer", "data-test": "acc" } }, {}, true);
      expect(w.element.classList).toContain("accordion");
      expect(w.attributes("id")).toBe("faq");
      expect(w.classes()).toContain("consumer");
      expect(w.attributes("data-test")).toBe("acc");
      expect(warnings()).toEqual([expect.stringMatching(/^\[WAKEB_UNKNOWN_VALUE\] WAccordion iconColor 'red-darken-2'/)]);
    });
  });

  /* shadcn-vue specifics: the indicators are the shadcn-vue Button copy, and every control is a native button. */
  describe("shadcn-vue indicators, keyboard and focus", () => {
    it("renders the indicators with the shadcn-vue Button and keeps focus on the activated control", async () => {
      const w = render(WAccordion, { props: { title: "Details", afterIcon: true } }, {}, true);
      const toggle = w.get(".accordion__toggle");
      expect(toggle.element.tagName).toBe("BUTTON");
      expect(toggle.attributes("data-slot")).toBe("button");
      expect(toggle.attributes("aria-controls")).toBe(w.get(".accordion__body").attributes("id"));
      const trigger = w.get(".accordion__title-trigger");
      (trigger.element as HTMLButtonElement).focus();
      await trigger.trigger("click");
      expect(document.activeElement).toBe(trigger.element);
      expect(toggle.attributes("aria-expanded")).toBe("true");
      (toggle.element as HTMLButtonElement).focus();
      await toggle.trigger("click");
      expect(document.activeElement).toBe(toggle.element);
      expect(trigger.attributes("aria-expanded")).toBe("false");
      expect(w.emitted("update:modelValue")).toEqual([[true], [false]]);
    });

    it("leaves an untitled panel unnamed and without the region role", () => {
      const w = render(WAccordion, { props: { modelValue: true }, slots: { default: "Body" } }, {}, true);
      const body = w.get(".accordion__body");
      expect(body.attributes("role")).toBeUndefined();
      expect(body.attributes("aria-label")).toBeUndefined();
      expect(w.get(".accordion__title-trigger").attributes("aria-label")).toBe("Toggle section");
    });

    it("writes the theme scope on the root", () => {
      const w = render(WAccordion, { props: { title: "Details" } }, { direction: "rtl", theme: { mode: "dark", tokens: { primary: "#123456" } } } as Partial<WakebComponentsOptions>, true);
      expect(w.element.getAttribute("data-wakeb-theme")).toBe("dark");
      expect(w.element.getAttribute("dir")).toBe("rtl");
    });
  });
});
