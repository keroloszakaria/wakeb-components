import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { wakebComponents } from "../../src/build/vite";
import reference from "../reference-data.mjs";
import { readFileSync } from 'node:fs';
const { version } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
const groups = [
  ['Actions and forms', 'الإجراءات والنماذج', ['WButton', 'WTooltipBtn', 'WTextField', 'WTextarea', 'WSwitch', 'WCheckbox', 'WButtonToggle']],
  ['Display and identity', 'العرض والهوية', ['WTruncatedText', 'WBadge', 'WBadgeStack', 'WAvatar', 'WAvatarStack', 'WUserBadge', 'WIcon', 'WImage', 'WCountBadge', 'WSemiCircleGauge']],
  ['Navigation', 'التنقل', ['WAccordion', 'WTabs', 'WTree', 'WDropdown', 'WCarousel', 'WVerticalSteps']],
  ['Layout', 'التخطيط', ['WRow', 'WCol', 'WCard', 'WDivider', 'WList', 'WBaseSidebar']],
  ['Progress and loading', 'التقدم والتحميل', ['WLoading', 'WPageSkeleton', 'WSkeleton', 'WProgressLinear', 'WSegmentedProgress']],
  ['Overlays', 'النوافذ واللوحات', ['WModal', 'WDrawer', 'WPopover']],
  ['Data and export', 'البيانات والتصدير', ['WDataTable', 'WExportDropdown']],
] as const;
const sidebar = (ar = false) => {
  const p = ar ? "/ar" : "";
  return [{ text: ar ? "ابدأ هنا" : "Start here", items: [
    { text: ar ? "نظرة عامة" : "Overview", link: `${p}/guide/introduction` },
    { text: ar ? "التثبيت" : "Installation", link: `${p}/guide/installation` },
    { text: ar ? "المزودات والإعداد" : "Providers and setup", link: `${p}/guide/providers` },
    { text: ar ? "الانتقال من 0.7" : "Migrating from 0.7", link: `${p}/guide/migration` },
    { text: ar ? "تبديل المزود" : "Switching providers", link: `${p}/guide/switching` },
    { text: ar ? "التخصيص" : "Customization", link: `${p}/guide/customization` },
    { text: "SSR", link: `${p}/guide/ssr` },
    { text: ar ? "نماذج البيانات" : "Data models", link: `${p}/guide/data-models` },
  ] }, ...groups.map(([en, arabic, names]) => ({ text: ar ? arabic : en, collapsed: false, items: names.map(name => ({ text: name, link: `${p}/components/${reference.find(c => c.name === name)!.slug}` })) })),
  { text: ar ? "استخدام الفريق" : "Team adoption", items: [
    { text: ar ? "أدوات الـagents: Skill وMCP" : "Coding agents: skill & MCP", link: `${p}/guide/agents` },
    { text: ar ? "التوافق والتغطية" : "Compatibility & coverage", link: `${p}/guide/verification` },
    { text: ar ? "خريطة الفصل" : "Extraction roadmap", link: `${p}/guide/extraction-roadmap` },
    { text: ar ? "التحقق والمساهمة" : "Verification & contribution", link: `${p}/guide/contributing` },
    { text: ar ? "سجل التغييرات" : "Changelog", link: `${p}/changelog` },
  ] }];
};
export default defineConfig({
  title: "Wakeb Components", description: "39 typed Vue 3 components across Vuetify, PrimeVue and shadcn-vue, with English/Arabic contracts and agent tools.",
  cleanUrls: true, sitemap: { hostname: "https://wakeb-components.surge.sh" },
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }]],
  locales: {
    root: { label: "English", lang: "en", themeConfig: { sidebar: sidebar(), nav: [{ text: "Guide", link: "/guide/installation" }, { text: "Components", link: "/components/truncated-text" }, { text: "Migration", link: "/guide/migration" }, { text: `v${version}`, link: "/changelog" }] } },
    ar: { label: "العربية", lang: "ar", dir: "rtl", description: "39 مكونًا Vue 3 مع Vuetify وPrimeVue وshadcn-vue وتوثيق باللغتين وأدوات للـagents.", themeConfig: { sidebar: sidebar(true), nav: [{ text: "الدليل", link: "/ar/guide/installation" }, { text: "المكونات", link: "/ar/components/truncated-text" }, { text: "الانتقال", link: "/ar/guide/migration" }, { text: `v${version}`, link: "/ar/changelog" }], outline: { label: "في هذه الصفحة" }, docFooter: { prev: "السابق", next: "التالي" } } },
  },
  themeConfig: { logo: "/logo.svg", outline: [2, 3], search: { provider: "local", options: { locales: { ar: { translations: { button: { buttonText: "بحث", buttonAriaLabel: "البحث في التوثيق" }, modal: { noResultsText: "لا توجد نتائج", resetButtonTitle: "مسح البحث", displayDetails: "عرض التفاصيل" } } } } } }, footer: { message: "Vue 3 · Vuetify · PrimeVue · shadcn-vue", copyright: "MIT © 2026 Wakeb contributors" } },
  markdown: { lineNumbers: true }, ignoreDeadLinks: false,
  // The docs compile the source package through the same build integration consumers use.
  vite: {
    server: { host: "localhost" },
    resolve: { alias: [{ find: /^wakeb-components$/, replacement: fileURLToPath(new URL("../../src/index.ts", import.meta.url)) }] },
    plugins: [wakebComponents({ configFile: ".vitepress/plugins/wakeb-components.js" })],
  },
});
