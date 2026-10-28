<!-- Generated from docs/reference-data.mjs -->
# WTabs

شريط تبويبات ولوحات Vuetify مع أحداث اختيار واضحة.

## الاستخدام

```vue
<script setup lang="ts">
import { WTabs } from 'wakeb-components'
</script>
<template>
  <WTabs :tabs="[{ slot: 'overview', label: 'Overview' }, { slot: 'details', label: 'Details' }]"><template #overview>Overview panel</template><template #details>Details panel</template></WTabs>
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
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

## Slots

`header` و`actions`؛ `tab-label`: يستقبل `{ tabItem, index }` ويستبدل الاسم وHTML؛ `tab-icon`: يستقبل `{ tabItem, index, size }`. أسماء محتوى التبويبات من valueKey؛ الأسماء السابقة محجوزة.

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

## الوصول وحدود السلوك

الخصائص على الحاوية. Vue وVuetify هما peers ولا تحتاج Tailwind. الارتفاع والمسافة يضيفان px؛ لا تمرر وحدات CSS. عناوين الأقسام والـheader داخل الشريط. Vuetify يوفر tablist والتركيز والأسهم؛ اللوحات تُركب عند الحاجة وتحتفظ بحالة Vue بعد التركيب. selectedTab الفارغ في switcher يلغي التحديد. المزامنة تخص selectedTab وisSwitcherOnly؛ تغيير قائمة العناصر يترك سلوك المجموعة لـVuetify. الصفر في content أو notification يتبع فحص truthy القديم. customHTML يدخل كما هو عبر v-html ويجب أن يكون موثوقًا أو منقّى من المشروع؛ سياق الدالة {value,isSelected}. استخدم tab-label للبيانات غير الموثوقة. الأيقونات عبر VIcon أو slot دون تعديل shadow DOM داخل الحزمة. التبويب المصور فقط يستخدم label كاسم ARIA؛ وفر اسمًا واضحًا حتى مع المحتوى المخصص.

## جرّب بنفسك

<NavigationPlayground initial="tabs" />
