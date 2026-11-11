import { afterEach, describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WAvatar, WCard, WCountBadge, WDivider, WIcon, WImage, WList } from "../src";
import { framework, shadcnHost, wakeb } from "./wakeb";

/* Same usage and assertions on every provider (SPEC R12); queries use roles, text and Wakeb classes. */
const host = () => (framework === "vuetify" ? createVuetify() : framework === "primevue" ? ([PrimeVue, { theme: "none" }] as const) : shadcnHost);
const render = (component: unknown, options: Record<string, unknown> = {}) =>
  mount(component as never, { attachTo: document.body, global: { plugins: [host() as never, wakeb()] }, ...options });
afterEach(() => {
  document.body.innerHTML = "";
});

describe(`WCard contract (${framework})`, () => {
  it("renders the title, subtitle, content and actions, and takes caller attrs", () => {
    const w = render(WCard, {
      props: { title: "Camera", subtitle: "Gate 3", variant: "outlined" },
      attrs: { class: "caller", "data-test": "card" },
      slots: { default: () => h("p", "Body"), actions: () => h("button", "Open") },
    });
    const card = w.get('[data-test="card"]');
    expect(card.classes()).toEqual(expect.arrayContaining(["caller", "wakeb-card", "wakeb-card--outlined", "wakeb-card--padded"]));
    expect(w.get(".wakeb-card__title").text()).toBe("Camera");
    expect(w.get(".wakeb-card__subtitle").text()).toBe("Gate 3");
    expect(w.get(".wakeb-card__actions").text()).toBe("Open");
    expect(w.text()).toContain("Body");
  });

  it("replaces the title through its slot and omits empty sections", () => {
    const w = render(WCard, { props: { padded: false }, slots: { title: () => h("strong", "Custom"), default: () => "Edge" } });
    expect(w.get(".wakeb-card__title strong").text()).toBe("Custom");
    expect(w.find(".wakeb-card__subtitle").exists()).toBe(false);
    expect(w.find(".wakeb-card__actions").exists()).toBe(false);
    expect(w.get(".wakeb-card").classes()).not.toContain("wakeb-card--padded");
  });
});

describe(`WDivider contract (${framework})`, () => {
  it("is a separator, with a vertical orientation", async () => {
    const w = render(WDivider, { attrs: { "data-test": "line" } });
    expect(w.get('[data-test="line"]').attributes("role") ?? (w.element as HTMLElement).tagName.toLowerCase()).toMatch(/separator|hr/);
    await w.setProps({ vertical: true });
    expect(w.get('[data-test="line"]').attributes("aria-orientation")).toBe("vertical");
  });
});

describe(`WList contract (${framework})`, () => {
  const items = [{ title: "Profile", subtitle: "Account", value: "profile" }, { title: "Logout", value: "logout", disabled: true }];

  it("is a named list of titled rows", () => {
    const w = render(WList, { props: { items, ariaLabel: "Account menu" } });
    const list = w.get('[role="list"]');
    expect(list.attributes("aria-label")).toBe("Account menu");
    expect(w.text()).toContain("Profile");
    expect(w.text()).toContain("Account");
    expect(w.text()).toContain("Logout");
  });

  it("emits select only for enabled rows when interactive", async () => {
    const w = render(WList, { props: { items, interactive: true } });
    const row = (label: string) => [...document.querySelectorAll<HTMLElement>(".wakeb-list__item, .wakeb-list__row")].find((element) => element.textContent?.includes(label) && !element.querySelector(".wakeb-list__row"))!;
    row("Profile").click();
    await nextTick();
    row("Logout").click();
    await nextTick();
    expect(w.emitted("select")).toEqual([[items[0]]]);
  });

  it("does not emit when not interactive and renders the item slot", async () => {
    const w = render(WList, { props: { items }, slots: { item: ({ item, index }: { item: { title: string }; index: number }) => h("b", `${index}:${item.title}`) } });
    expect(w.findAll("b").map((b) => b.text())).toEqual(["0:Profile", "1:Logout"]);
    (w.get("b").element as HTMLElement).click();
    await nextTick();
    expect(w.emitted("select")).toBeUndefined();
  });
});

describe(`WIcon contract (${framework})`, () => {
  it("is decorative without a label and a named image with one", async () => {
    const w = render(WIcon, { props: { icon: "$close" }, attrs: { "data-test": "icon" } });
    expect(w.get('[data-test="icon"]').attributes("aria-hidden")).toBe("true");
    expect(w.find("svg").exists()).toBe(true);
    await w.setProps({ label: "Close" });
    const icon = w.get('[data-test="icon"]');
    expect(icon.attributes("role")).toBe("img");
    expect(icon.attributes("aria-label")).toBe("Close");
  });
});

describe(`WImage contract (${framework})`, () => {
  it("renders a safe image source sized by width and aspect ratio", () => {
    const w = render(WImage, { props: { src: "/camera.png", alt: "Gate camera", width: 120, aspectRatio: "16/9", lazy: false } });
    const image = w.find("img");
    if (image.exists()) {
      expect(image.attributes("src")).toBe("/camera.png");
      expect(image.attributes("alt") ?? "").toMatch(/Gate camera|^$/);
    }
    const root = w.get(".wakeb-image");
    expect(root.text() + (root.attributes("aria-label") ?? "") + (image.exists() ? image.attributes("alt") : "")).toContain("Gate camera");
  });

  it("refuses script URLs", () => {
    const w = render(WImage, { props: { src: "javascript:alert(1)", alt: "x" } });
    expect(w.html()).not.toContain("javascript:");
  });
});

describe(`WAvatar contract (${framework})`, () => {
  it("shows initials named by the person, and an image without initials", async () => {
    const w = render(WAvatar, { props: { name: "Grace Hopper", size: 32 }, attrs: { "data-test": "avatar" } });
    const avatar = w.get('[data-test="avatar"]');
    expect(avatar.attributes("role")).toBe("img");
    expect(avatar.attributes("aria-label")).toBe("Grace Hopper");
    expect(w.text()).toContain("GH");
    await w.setProps({ image: "https://example.test/grace.png" });
    expect(w.html()).toContain("https://example.test/grace.png");
  });

  it("is decorative without a name and renders the default slot", () => {
    const w = render(WAvatar, { attrs: { "data-test": "avatar" }, slots: { default: () => h("i", "★") } });
    expect(w.get('[data-test="avatar"]').attributes("aria-hidden")).toBe("true");
    expect(w.text()).toContain("★");
  });
});

describe(`WCountBadge contract (${framework})`, () => {
  const status = () => document.querySelector<HTMLElement>('[role="status"]');
  const visible = (element: HTMLElement | null) => !!element && element.style.display !== "none";

  it("wraps its slot and caps the count with a polite named status", async () => {
    const w = render(WCountBadge, { props: { content: 120, label: "120 unread notifications" }, slots: { default: () => h("button", "Bell") } });
    expect(w.get("button").text()).toBe("Bell");
    expect(w.get(".wakeb-count-badge").classes()).toContain("wakeb-count-badge--top-end");
    expect(status()?.textContent?.trim()).toBe("99+");
    expect(status()?.getAttribute("aria-label")).toBe("120 unread notifications");
    expect(status()?.getAttribute("aria-live")).toBe("polite");
    await w.setProps({ content: 7, max: 9, label: undefined });
    expect(status()?.textContent?.trim()).toBe("7");
    expect(status()?.getAttribute("aria-label")).toBe("7");
  });

  it("hides without content or when not visible, and moves to the requested corner", async () => {
    const w = render(WCountBadge, { props: { location: "bottom start" }, slots: { default: () => "Icon" } });
    expect(visible(status())).toBe(false);
    await w.setProps({ content: "New" });
    expect(visible(status())).toBe(true);
    expect(w.get(".wakeb-count-badge").classes()).toContain("wakeb-count-badge--bottom-start");
    await w.setProps({ visible: false });
    expect(visible(status())).toBe(false);
  });
});
