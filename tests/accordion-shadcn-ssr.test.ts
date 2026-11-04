// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { WAccordion } from "../src";
import { framework, wakeb } from "./wakeb";

/*
 * WAccordion server rendering without browser globals (SPEC R19) on the shadcn-vue project: the
 * accordion case of tests/stacks-ssr.test.ts, which Vuetify and PrimeVue keep running from there.
 * shadcn-vue installs no host plugin (SPEC R24).
 */
const renderPage = (view: () => unknown) => renderToString(createSSRApp({ render: view }).use(wakeb()));

describe.runIf(framework === "shadcn")("WAccordion SSR on shadcn-vue", () => {
  it("runs without window or document", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
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
