// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createVuetify } from "vuetify";
import PrimeVue from "primevue/config";
import { WAccordion, WAvatarStack, WBadgeStack } from "../src";
import { framework, wakeb } from "./wakeb";

/* Server rendering without browser globals (SPEC R19), on each provider project. */
const renderPage = (view: () => unknown) => {
  const app = createSSRApp({ render: view });
  if (framework === "vuetify") app.use(createVuetify({ ssr: true }));
  else app.use(PrimeVue, { theme: "none" });
  return renderToString(app.use(wakeb()));
};

describe(`stack and accordion SSR (${framework})`, () => {
  it("runs without window or document", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
  });

  it("renders avatars, overflow and closed menus without browser globals", async () => {
    const html = await renderPage(() =>
      h("main", [
        h(WAvatarStack, { items: [{ name: "Ada Lovelace" }, { name: "Grace Hopper" }, { name: "Alan Turing" }], max: 1, showOverflowMenu: true, overflowLabel: "More people" }),
        h(WBadgeStack, { items: [{ label: "Owner" }, { label: "Member" }], showOverflowMenu: true, overflowLabel: "More roles" }),
      ]),
    );
    expect(html).toContain('aria-label="Ada Lovelace"');
    expect(html).toContain('aria-label="More people"');
    expect(html).toContain("AL");
    expect(html).toContain("Owner");
    expect(html).toContain('aria-label="More roles"');
    expect(html).toContain('aria-expanded="false"');
    // Closed overflow lists are not rendered on the server.
    expect(html).not.toContain("Grace Hopper");
    expect(html).not.toContain("Member");
  });

  it("keeps accordion panel ids distinct and deterministic", async () => {
    const view = () => h("div", [h(WAccordion, { title: "One" }), h(WAccordion, { title: "Two", modelValue: true }, () => h("input", { value: "Draft" }))]);
    const html = await renderPage(view);
    const ids = [...html.matchAll(/id="(wakeb-accordion-[^"]+)"/g)].map((match) => match[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    expect((await renderPage(view)).match(/id="wakeb-accordion-[^"]+"/g)).toEqual(html.match(/id="wakeb-accordion-[^"]+"/g));
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain("Draft");
  });
});
