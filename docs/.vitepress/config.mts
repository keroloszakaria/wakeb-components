import { defineConfig } from "vitepress";
import reference from "../reference-data.mjs";
const sidebar = (ar = false) => {
  const p = ar ? "/ar" : "";
  return [{ text: ar ? "ابدأ هنا" : "Start here", items: [
    { text: ar ? "نظرة عامة" : "Overview", link: `${p}/guide/introduction` },
    { text: ar ? "التثبيت" : "Installation", link: `${p}/guide/installation` },
    { text: ar ? "التخصيص" : "Customization", link: `${p}/guide/customization` },
    { text: "SSR", link: `${p}/guide/ssr` },
    { text: ar ? "نماذج البيانات" : "Data models", link: `${p}/guide/data-models` },
  ] }, { text: ar ? "المكونات" : "Components", items: reference.map(c => ({ text: c.name, link: `${p}/components/${c.slug}` })) },
  { text: ar ? "استخدام الفريق" : "Team adoption", items: [
    { text: ar ? "الانتقال من Aware" : "Migration from Aware", link: `${p}/guide/migration` },
    { text: ar ? "خريطة الفصل" : "Extraction roadmap", link: `${p}/guide/extraction-roadmap` },
    { text: ar ? "التحقق والمساهمة" : "Verification & contribution", link: `${p}/guide/contributing` },
    { text: ar ? "سجل التغييرات" : "Changelog", link: `${p}/changelog` },
  ] }];
};
export default defineConfig({
  title: "Wakeb Components", description: "Typed Vue 3 components. Accessible defaults, explicit customization and Vuetify 3 integration.",
  cleanUrls: true, sitemap: { hostname: "https://wakeb-components.surge.sh" },
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }]],
  locales: {
    root: { label: "English", lang: "en", themeConfig: { sidebar: sidebar(), nav: [{ text: "Guide", link: "/guide/installation" }, { text: "Components", link: "/components/truncated-text" }, { text: "v0.7.0", link: "/changelog" }] } },
    ar: { label: "العربية", lang: "ar", dir: "rtl", description: "مكونات Vue 3 واضحة، قابلة للتخصيص، مع Vuetify 3.", themeConfig: { sidebar: sidebar(true), nav: [{ text: "الدليل", link: "/ar/guide/installation" }, { text: "المكونات", link: "/ar/components/truncated-text" }, { text: "v0.7.0", link: "/ar/changelog" }], outline: { label: "في هذه الصفحة" }, docFooter: { prev: "السابق", next: "التالي" } } },
  },
  themeConfig: { logo: "/logo.svg", outline: [2, 3], search: { provider: "local", options: { locales: { ar: { translations: { button: { buttonText: "بحث", buttonAriaLabel: "البحث في التوثيق" }, modal: { noResultsText: "لا توجد نتائج", resetButtonTitle: "مسح البحث", displayDetails: "عرض التفاصيل" } } } } } }, footer: { message: "Vue 3 + Vuetify 3. Built for reuse.", copyright: "MIT © 2026 Wakeb contributors" } },
  markdown: { lineNumbers: true }, ignoreDeadLinks: false,
  vite: { server: { host: "localhost" }, ssr: { noExternal: ["vuetify"] } },
});
