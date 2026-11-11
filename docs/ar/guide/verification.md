# التوافق والتحقق

تعرض النسخة 0.8.0-alpha.0 **39 مكونًا** بعقد Vue موحد عبر Vuetify 3 وPrimeVue 4
وshadcn-vue فوق Reka UI. هذا هدف توافق مع توضيح اختلافات المزودات، ولا يعني تطابق
HTML أو توفير كل إمكانات مكتبات المزودات الأصلية.

## ما الذي يُفحص؟

| المستوى | الأمر | الدليل |
| --- | --- | --- |
| الأنواع العامة ومطابقة renderers | `npm run typecheck` | الخصائص وحمولات الأحداث وslots؛ لا أنواع للمزودات داخل الواجهة العامة. |
| عقود السلوك | `npm test` | اختبارات العرض والتنقل والنماذج والاختيار والتخطيط والعناصر والجدول نفسها على المزودات الثلاثة، مع فحوص مركزة لـSSR والتنظيف ونطاق التطبيق. |
| الباكدج المثبتة | `npm run check:package` | تثبيت أرشيف حقيقي في ثلاثة تطبيقات Vite معزولة خارج المستودع؛ فحص الأنواع الصارم لكل أمثلة التوثيق وبناء المتصفح وSSR وtree shaking وغياب اعتمادات المزودات غير المختارة. |
| تفاعل المتصفح | `npm run test:browser` | Chromium وثلاثة مزودات × فاتح/داكن × LTR/RTL × عرض 390px/1280px؛ هوية عقد hydration والتحذيرات والتركيز والكيبورد والمدخلات والحوارات. يعرض التطبيق التجريبي المكونات الـ39. |
| نسخ peers | `npm run check:peers` | ست بيئات مقفلة للحد الأدنى والحالي؛ [النسخ المدعومة](./installation#supported-versions) تعرض ما فُحص بالتحديد. |
| تكامل الـagents | `npm run test:agents` | عميل MCP الرسمي عبر stdio؛ الاكتشاف والعقود واللغات والموارد والـprompt وحالات الخطأ. |
| الموقع والملفات | `npm run docs:build` | تغطية الخصائص مقابل TypeScript وتطابق اللغتين والروابط الداخلية وأرشيفات المكتبة والـskill وMCP وبصمات ملفات النشر. |

شغّل `npm run check` للبوابة المجمعة: الأنواع والبناء والعقود والتطبيقات المعزولة
والمتصفح والـagents وبناء الموقع. فحص peers إضافي صريح لأنه يثبت ست بيئات مقفلة.

بعد بناء الموقع شغّل `npm run test:docs` لفحص صفحات Accordion وجدول البيانات
ودليل الـagents بالإنجليزية والعربية والوضعين الفاتح والداكن على عرض المكتب والهاتف.
يشغّل `npm run check:agents:package` سيرفر MCP من أرشيف مثبت خارج المستودع ويعيد
فحص الاكتشاف والعقود من النسخة المثبتة.

## تغطية كل مكون

<!-- component-coverage -->

| المكون | Vuetify | PrimeVue | shadcn-vue | أمثلة SFC |
| --- | --- | --- | --- | --- |
| [WTruncatedText](../components/truncated-text) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WSegmentedProgress](../components/segmented-progress) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WSemiCircleGauge](../components/semi-circle-gauge) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WAvatarStack](../components/avatar-stack) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WLoading](../components/loading) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WPageSkeleton](../components/page-skeleton) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WVerticalSteps](../components/vertical-steps) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WButton](../components/button) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WBadge](../components/badge) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WAccordion](../components/accordion) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WBadgeStack](../components/badge-stack) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WUserBadge](../components/user-badge) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WTooltipBtn](../components/tooltip-btn) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WTabs](../components/tabs) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WTree](../components/tree) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WDropdown](../components/dropdown) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WCarousel](../components/carousel) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WExportDropdown](../components/export-dropdown) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WBaseSidebar](../components/base-sidebar) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WModal](../components/modal) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WDrawer](../components/drawer) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WTextField](../components/text-field) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WPopover](../components/popover) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WSwitch](../components/switch) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WCheckbox](../components/checkbox) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WSkeleton](../components/skeleton) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WRow](../components/row) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WCol](../components/col) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WProgressLinear](../components/progress-linear) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WTextarea](../components/textarea) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WButtonToggle](../components/button-toggle) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WCard](../components/card) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WDivider](../components/divider) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WList](../components/list) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WIcon](../components/icon) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WImage](../components/image) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WAvatar](../components/avatar) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WCountBadge](../components/count-badge) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |
| [WDataTable](../components/data-table) | عقد + متصفح | عقد + متصفح | عقد + متصفح | 2 |

<!-- /component-coverage -->

## قراءة الأدلة

تُحفظ نتائج المتصفح والصور في `.audit/browser/`، ويسجل تقرير JSON نتيجة كل مشروع
واختبار. يطبع فحص الباكدج مسار التطبيقات المؤقتة وعدد modules لكل مزود. تسجل مصفوفة
peers نتائجها في `tests/fixtures/peers/results.json`. نجاح البناء المحلي لا يعني نشر
الموقع أو إصدار npm. نشر التوثيق يتم عبر Jervis DevOps.

تستخدم التجارب الحية داخل الموقع **Vuetify**. تحافظ الأمثلة القابلة للنسخ على واجهة
Wakeb نفسها عبر المزودات، وتتحقق التطبيقات المعزولة ومصفوفة المتصفح منها بصورة
مستقلة. توضح صفحة كل مكون اختلافات تنفيذه.

## الحدود

تستخدم مصفوفة المتصفح Chromium؛ لا تشمل البوابة المسجلة Firefox أو WebKit أو أجهزة
لمس فعلية. لا تغني فحوص الأدوار وARIA والكيبورد والتركيز عن تدقيق بتقنيات مساعدة
وقارئات شاشة حقيقية. تغطي الاختبارات الواجهة والحالات الموثقة، ولا تشمل كل تركيب
ممكن لـCSS التطبيق أو تجاوزات المزود الأصلي أو إضافات خارجية. تحقق من التطبيق
على المزود المختار عند ترقية peers.

## منهج التوثيق

استُخدمت الأنماط المفيدة من
[Accordion في shadcn-vue](https://www.shadcn-vue.com/docs/components/accordion)
للمعاينة والتثبيت والاستخدام القابل للنسخ، ومن
[AutoComplete في PrimeVue](https://primevue.dev/autocomplete/)
لأمثلة المهام والحالات وتخصيص القوالب والوصول بالكيبورد. تصف الأمثلة هنا واجهة Wakeb
الفعلية؛ لا تُستبدل بعقود المزود الأصلي. تعرض [أدوات الـagents](./agents) العقود نفسها.
