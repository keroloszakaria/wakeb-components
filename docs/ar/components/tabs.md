<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WTabs

شريط تبويبات ولوحات تُركَّب عند الحاجة مع أحداث اختيار واضحة.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<NavigationPlayground initial="tabs" />

## الاستخدام

```vue
<script setup lang="ts">
import { WTabs } from 'wakeb-components'
</script>

<template>
  <WTabs :tabs="[{ slot: 'overview', label: 'Overview' }, { slot: 'details', label: 'Details' }]"><template #overview>Overview panel</template><template #details>Details panel</template></WTabs>
</template>
```

## أمثلة

### متابعة الاختيار

استخدم updateTab؛ لا يوفر WTabs خاصية v-model.

```vue
<script setup lang="ts">
import { WTabs } from 'wakeb-components'
import { ref } from 'vue'
import type { NavigationKey } from 'wakeb-components'
const selected = ref<NavigationKey | undefined>()
</script>

<template>
  <WTabs :tabs="[{ slot: 'summary', label: 'Summary' }, { slot: 'history', label: 'History' }]" @update-tab="selected = $event"><template #summary>Summary</template><template #history>History</template></WTabs>
  <p>Selected: {{ selected }}</p>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `styleType` | `"outlined" \| "filled" \| "none" \| "minimal"` | `"outlined"` | شكل شريط التبويبات. |
| `isVertical` | `boolean` | `false` | شريط تبويبات رأسي. |
| `tabs` | `readonly TabItem[]` | `[] (required)` | بيانات التبويبات: الاسم ومفتاح slot والمحتوى الاختياري. |
| `selectedTab` | `NavigationKey \| null` | `""` | قيمة الاختيار الخارجية؛ القيمة الفارغة في switcher تلغي التحديد. |
| `isSwitcherOnly` | `boolean` | `false` | عرض الشريط فقط دون المحتوى. |
| `valueKey` | `string` | `"slot"` | الحقل المستخدم لقيمة التبويب واسم slot للمحتوى. |
| `iconOnly` | `boolean` | `false` | إخفاء الاسم الظاهر مع بقاء الأيقونة والعداد؛ الاسم يصبح aria-label. |
| `tabHeight` | `string \| number \| null` | `null` | الارتفاع بالبكسل؛ يقبل رقمًا أو نصًا رقميًا. |
| `iconSize` | `string \| number` | `"sm"` | حجم الأيقونة كاسم أو بكسل. |
| `classList` | `ComponentClass` | `""` | classes إضافية على الحاوية. |
| `contentGap` | `string \| number \| null` | `null` | المسافة بالبكسل؛ الافتراضي 32px. |
| `ariaLabel` | `string` | `"Tabs"` | اسم شريط التبويبات لقارئ الشاشة. |

## الأحداث

`updateTab(value: NavigationKey | undefined)` للتغيير المحلي فقط؛ لا يُرسل عند التركيب أو مزامنة الأب.

```ts
updateTab: [value: NavigationKey | undefined];
```

## Slots

`header` و`actions`؛ `tab-label`: يستقبل `{ tabItem, index }` ويستبدل الاسم وHTML؛ `tab-icon`: يستقبل `{ tabItem, index, size }`. أسماء محتوى التبويبات من valueKey؛ الأسماء السابقة محجوزة.

```ts
[name: string]: (props: any) => unknown;
"tab-label"(props: { tabItem: TabItem; index: number }): unknown;
"tab-icon"(props: { tabItem: TabItem; index: number; size: string | number }): unknown;
```

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-tabs-item-height` | `44px` |
| `--wakeb-tabs-filled-tab-radius` | `10px` |
| `--wakeb-tabs-filled-item-active-bg` | `#e6f2f3` |
| `--wakeb-tabs-filled-item-active-color` | `#087f8c` |
| `--wakeb-tabs-item-active-color` | `#087f8c` |
| `--wakeb-tabs-item-active-border` | `#d0d5dd` |
| `--wakeb-tabs-item-color` | `#344054` |
| `--wakeb-tabs-input-bg` | `#fff` |
| `--wakeb-tabs-input-border` | `#d0d5dd` |
| `--wakeb-tabs-input-label` | `#344054` |
| `--wakeb-tabs-minimal-tab-gap` | `4px` |
| `--wakeb-tabs-minimal-tab-padding` | `4px` |
| `--wakeb-tabs-minimal-tab-bg` | `#f2f4f7` |
| `--wakeb-tabs-minimal-tab-border` | `#d0d5dd` |
| `--wakeb-tabs-minimal-tab-radius` | `12px` |
| `--wakeb-tabs-minimal-item-radius` | `8px` |
| `--wakeb-tabs-minimal-item-color` | `#667085` |
| `--wakeb-tabs-minimal-item-active-color` | `#101828` |
| `--wakeb-tabs-minimal-item-active-radius` | `8px` |
| `--wakeb-tabs-section-color` | `#667085` |
| `--wakeb-tabs-section-border` | `#d0d5dd` |
| `--wakeb-tabs-content-gap` | `32px` |
| `--wakeb-tabs-fallback` | `undefined (legacy adapter switch)` |

## وجهة السمات

حاوية التخطيط الجذرية `div.wakeb-tabs`. تحتفظ التبويبات واللوحات بالمعرفات والأدوار وروابط aria-controls وaria-labelledby التي يضعها Wakeb. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab` | الدخول إلى التبويب النشط. |
| `Arrow keys / Home / End` | نقل التركيز وتفعيل تبويب؛ الأسهم الأفقية تتبع الاتجاه. |

## الوصول وحدود السلوك

الخصائص على الحاوية. Vue وVuetify هما peers ولا تحتاج Tailwind. الارتفاع والمسافة يضيفان px؛ لا تمرر وحدات CSS. عناوين الأقسام والـheader داخل الشريط. Vuetify يوفر tablist والتركيز والأسهم. لكل تبويب id فريد داخل التطبيق، والتبويب المحدد يشير عبر aria-controls إلى لوحته المعروضة (div.wakeb-tabs__panel بدور tabpanel) واللوحة تأخذ اسمها من التبويب؛ اللوحات تُركب عند الحاجة وتحتفظ بحالة Vue بعد التركيب. selectedTab الفارغ في switcher يلغي التحديد. المزامنة تخص selectedTab وisSwitcherOnly؛ تغيير قائمة العناصر يترك سلوك المجموعة لـVuetify. الصفر في content أو notification يتبع فحص truthy القديم. customHTML يدخل كما هو عبر v-html ويجب أن يكون موثوقًا أو منقّى من المشروع؛ سياق الدالة {value,isSelected}. استخدم tab-label للبيانات غير الموثوقة. الأيقونات عبر VIcon أو slot دون تعديل shadow DOM داخل الحزمة. التبويب المصور فقط يستخدم label كاسم ARIA؛ وفر اسمًا واضحًا حتى مع المحتوى المخصص. الشريط العمودي يضع aria-orientation=vertical على قائمة التبويبات. على PrimeVue يرسم Wakeb قائمة التبويبات بنفسه (div بدور tablist وعناصر button بدور tab) لأن Tabs في PrimeVue يولّد معرفاته الخاصة ويركّب كل اللوحات أو يزيل المخفية منها. التحديد والمعرفات والأحداث من الكود المشترك نفسه مع Vuetify. المفاتيح تتبع سلوك Vuetify: التفعيل يدوي بالنقر أو Enter أو Space، والأسهم تنقل التركيز حسب الاتجاه وتلتف وتنعكس أفقيًا عندما تكون القائمة RTL، وHome/End للطرفين، والتبويب المحدد (أو الأول إن لم يُحدد شيء) هو محطة Tab الوحيدة. اللوحات تُركَّب عند أول اختيار وتبقى مركّبة وتتبدل دون حركة انتقال. الأيقونات عبر محلل أيقونات Wakeb. شكل التبويبات من متغيرات --wakeb-tabs-* نفسها على markup يملكه Wakeb، وليس من أنماط PrimeVue. على shadcn-vue يُستخدم markup ‏Wakeb وأنماطه ومفاتيحه ولوحاته المؤجلة نفسها كما في PrimeVue، لأن Tabs في shadcn-vue ‏(reka-ui) يحدد التبويب عند نقل التركيز بالأسهم افتراضيًا. لا تحمل التبويبات data-slot ولا أصناف wakeb-sc-*، وتُهمَل providerProps مع WAKEB_PROVIDER_PROP_IGNORED. تستخدم عناوين التبويبات غير المختارة --wakeb-ui-on-surface عند ضبطه، بما فيه الافتراضي للوضع الداكن، وتتقدم --wakeb-tabs-item-color.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
