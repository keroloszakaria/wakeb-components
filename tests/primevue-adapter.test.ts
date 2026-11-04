import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import PrimeVue from "primevue/config";
import { WDropdown } from "../src";
import { wakeb } from "./wakeb";

/* PrimeVue-specific wiring the shared contract cannot express: PrimeVue's own Menu keyboard path. */
afterEach(() => {
  document.body.innerHTML = "";
});

describe("PrimeVue WDropdown keyboard selection", () => {
  it("selects with ArrowDown and Enter for non-link rows and skips disabled rows", async () => {
    const items = [
      { label: "Pending", value: "p" },
      { label: "Archived", value: "a", disabled: true },
      { label: "Done", value: "d" },
    ];
    const w = mount(WDropdown, {
      attachTo: document.body,
      props: { title: "Status", menuItems: items, showSelected: true },
      global: { plugins: [[PrimeVue, { theme: "none" }] as never, wakeb()] },
    });
    await w.get("button").trigger("click");
    await vi.waitFor(() => expect(document.querySelector('[role="menu"]')).not.toBeNull());
    const list = document.querySelector('[role="menu"]') as HTMLElement;
    list.dispatchEvent(new FocusEvent("focus"));
    for (const code of ["ArrowDown", "ArrowDown", "Enter"]) {
      list.dispatchEvent(new KeyboardEvent("keydown", { code, bubbles: true }));
      await nextTick();
    }
    expect(w.emitted("update:modelValue")).toEqual([["d"]]);
    expect(w.get("button").text()).toContain("Done");
  });
});
