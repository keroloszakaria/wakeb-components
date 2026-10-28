import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { createVuetify } from "vuetify";
import { VTooltip } from "vuetify/components/VTooltip";
import { WBadgeStack, WUserBadge, WTooltipBtn, WBadge } from "../src";
const wrappers: VueWrapper[] = [];
function render(component: any, options: any = {}) {
  const w = mount(component, {
    attachTo: document.body,
    global: { plugins: [createVuetify()] },
    ...options,
  });
  wrappers.push(w);
  return w;
}
afterEach(() => {
  for (const w of wrappers.splice(0)) w.unmount();
  document.body.innerHTML = "";
});
const items = [
  { id: 1, label: "Camera monitoring", icon: "/camera.svg", color: "#ff0000" },
  {
    id: 2,
    label: "Full overflow label",
    icon: "/person.svg",
    color: "#00ff00",
  },
  { id: 3, label: "Third" },
];
describe("WBadgeStack", () => {
  it("keeps truncation, slicing, count and root attrs without enabling a menu", async () => {
    const w = render(WBadgeStack, {
      props: { items },
      attrs: { id: "roles", class: "consumer" },
    });
    expect(w.attributes("id")).toBe("roles");
    expect(w.classes()).toContain("consumer");
    expect(w.text()).toBe("Camera mo...+2");
    expect(w.find("button").exists()).toBe(false);
    await w.setProps({ max: 0 });
    expect(w.text()).toBe("+3");
    await w.setProps({ max: 8 });
    expect(w.findAllComponents(WBadge)).toHaveLength(3);
    await w.setProps({ items: [] });
    expect(w.text()).toBe("");
  });
  it("prefers per-item false/empty values to stack-level defaults", () => {
    const w = render(WBadgeStack, {
      props: {
        items: [
          {
            label: "Owner",
            isDot: false,
            type: "warning",
            customPadding: "",
            iconPosition: "after",
            classList: "row",
          },
        ],
        isDot: true,
        badgeType: "success",
        badgePadding: "4px",
        iconPosition: "before",
        badgeAttrs: { "data-owner": "team" },
      },
    });
    const badge = w.getComponent(WBadge);
    expect(badge.props()).toMatchObject({
      isDot: false,
      type: "warning",
      customPadding: "",
      iconPosition: "after",
      classList: "row",
    });
    expect(badge.attributes("data-owner")).toBe("team");
  });
  it("opens a real teleported overflow menu with full labels, icon slots and local styles", async () => {
    const w = render(WBadgeStack, {
      props: {
        items,
        showOverflowMenu: true,
        overflowLabel: "More roles",
        menuStyle: { "--wakeb-badge-stack-menu-surface": "#123456" },
      },
      slots: {
        icon: ({ item, overflow }: any) =>
          h("i", { "data-overflow": String(overflow) }, item.label),
      },
    });
    const button = w.get("button");
    expect(button.attributes("type")).toBe("button");
    expect(button.attributes("aria-label")).toBe("More roles");
    expect(w.get("i").attributes("data-overflow")).toBe("false");
    (button.element as HTMLElement).focus();
    await button.trigger("click");
    await nextTick();
    await vi.waitFor(() =>
      expect(
        document.querySelector(".overflow-menu-list")?.textContent,
      ).toContain("Full overflow label"),
    );
    expect(
      document
        .querySelector(".overflow-menu-list i")
        ?.getAttribute("data-overflow"),
    ).toBe("true");
    expect(
      document.querySelector(".overflow-menu-list")?.getAttribute("style"),
    ).toContain("#123456");
  });
  it("renders circular images with clamped opacity and a replaceable label", () => {
    const w = render(WBadgeStack, {
      props: {
        items,
        iconVariant: "circle",
        iconBackgroundOpacity: 0.3,
        max: 3,
      },
      slots: { label: ({ text }: any) => h("b", text) },
    });
    expect(w.get(".badge-stack__icon-wrap").attributes("style")).toContain(
      "30%",
    );
    expect(w.get("img").attributes("alt")).toBe("");
    expect(w.get("b").text()).toBe("Camera mo...");
  });
  it("supports the explicit legacy activator tag and separate badge glyph renderer", () => {
    const w = render(WBadgeStack, {
      props: {
        items: [
          { label: "Admin", badgeIcon: "$complete" },
          { label: "Member" },
        ],
        showOverflowMenu: true,
        overflowTag: "div",
      },
      slots: {
        badgeIcon: ({ icon, size }: any) =>
          h("svg", { "data-icon": icon, "data-size": size }),
      },
    });
    expect(w.get(".badge-stack__overflow-activator").element.tagName).toBe(
      "DIV",
    );
    expect(w.get("svg").attributes("data-icon")).toBe("$complete");
    expect(w.get("svg").attributes("data-size")).toBe("xs");
  });
  it("keeps distinct overflow border radius contracts with and without a menu", async () => {
    const w = render(WBadgeStack, {
      props: {
        items,
        customBorderRadius: "6px",
        customOverflowBorderRadius: "99px",
      },
    });
    expect(w.findAllComponents(WBadge)[1].props("customBorderRadius")).toBe(
      "6px",
    );
    await w.setProps({ showOverflowMenu: true });
    expect(w.findAllComponents(WBadge)[1].props("customBorderRadius")).toBe(
      "99px",
    );
  });
});
describe("WUserBadge", () => {
  it("keeps the original initials and empty-name cases", async () => {
    const w = render(WUserBadge, {
      props: { user: { name: "  Ada  Lovelace Byron " } },
    });
    expect(w.get(".v-avatar").text()).toBe("AL");
    for (const [name, text] of [
      ["", "?"],
      ["—", "?"],
      ["   ", ""],
      ["كيرلس زكريا", "كز"],
    ]) {
      await w.setProps({ user: { name } });
      expect(w.get(".v-avatar").text()).toBe(text);
    }
  });
  it("accepts HTTP, root-relative and data avatars, and rejects bare filenames", async () => {
    const w = render(WUserBadge, {
      props: { user: { name: "Ada", avatar: "photo.png" } },
    });
    expect(w.find(".v-img").exists()).toBe(false);
    for (const avatar of [
      "https://example.com/a.png",
      "/a.png",
      "data:image/png;base64,AA==",
    ]) {
      await w.setProps({ user: { name: "Ada", avatar } });
      expect(w.get(".v-img").attributes("aria-label")).toBe("");
      expect(w.get(".v-img img").attributes("src")).toBe(avatar);
      expect(w.get(".v-img img").attributes("alt")).toBe("");
    }
  });
  it("preserves action order, icon position, attrs and escaped user content", async () => {
    const click = vi.fn();
    const w = render(WUserBadge, {
      props: { user: { name: "<b>Ada</b>" }, iconPosition: "after" },
      attrs: { id: "user", onClick: click },
      slots: { actions: () => h("button", { type: "button" }, "Remove") },
    });
    expect(w.attributes("id")).toBe("user");
    expect(w.find("b").exists()).toBe(false);
    expect(w.get(".v-chip__content").text()).toBe("<b>Ada</b>Remove<");
    await w.get("button").trigger("click");
    expect(click).toHaveBeenCalledOnce();
  });
  it("allows replacing avatar and content without needing app services", () => {
    const w = render(WUserBadge, {
      props: { user: { name: "Grace Hopper" }, avatarSize: 24 },
      slots: {
        avatar: ({ initials, size }: any) => h("em", `${initials}:${size}`),
        default: ({ user }: any) => h("strong", user.name),
      },
    });
    expect(w.find(".v-avatar").exists()).toBe(false);
    expect(w.get("em").text()).toBe("GH:24");
    expect(w.get("strong").text()).toBe("Grace Hopper");
  });
});
describe("WTooltipBtn", () => {
  it("forwards native attributes/listeners once while keeping wrapper attrs explicit", async () => {
    const click = vi.fn();
    const w = render(WTooltipBtn, {
      props: { text: "Save profile", wrapperAttrs: { class: "layout" } },
      attrs: { id: "save", form: "profile", type: "submit", onClick: click },
    });
    expect(w.element.tagName).toBe("SPAN");
    expect(w.classes()).toContain("layout");
    expect(w.attributes("id")).toBeUndefined();
    expect(w.get("button").attributes()).toMatchObject({
      id: "save",
      form: "profile",
      type: "submit",
      "aria-label": "Save profile",
    });
    await w.get("button").trigger("click");
    expect(click).toHaveBeenCalledOnce();
  });
  it("uses translated text, configurable tooltip props, and an explicit accessible name", () => {
    const w = render(WTooltipBtn, {
      props: {
        text: "حفظ",
        ariaLabel: "حفظ الملف",
        location: "top",
        openDelay: 350,
        tooltipStyle: { color: "#123456" },
      },
    });
    expect(w.get("button").attributes("aria-label")).toBe("حفظ الملف");
    const tooltip = w.getComponent(VTooltip);
    expect(tooltip.props()).toMatchObject({
      location: "top",
      openDelay: 350,
      activator: "parent",
    });
    expect(tooltip.text()).toBe("");
    expect(tooltip.props("contentProps")).toEqual({
      style: { color: "#123456" },
    });
  });
  it("omits empty tooltips, retains native disabled state and replaces the icon", async () => {
    const w = render(WTooltipBtn, {
      props: { text: "", btnIcon: true },
      attrs: { disabled: true },
      slots: { icon: () => h("svg", { "aria-hidden": "true" }) },
    });
    expect(w.findComponent(VTooltip).exists()).toBe(false);
    expect(w.get("button").attributes("disabled")).toBeDefined();
    expect(w.find(".v-icon").exists()).toBe(false);
    expect(w.find("svg").exists()).toBe(true);
    await w.setProps({ text: "Details" });
    expect(w.findComponent(VTooltip).exists()).toBe(true);
  });
});
