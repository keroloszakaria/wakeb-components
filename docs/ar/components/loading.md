<!-- Generated from docs/reference-data.mjs -->
# WLoading

حالة تحميل باسم قابل للترجمة ومؤشر دائري من Vuetify.

## الاستخدام

```vue
<script setup lang="ts">
import { WLoading } from 'wakeb-components'
</script>
<template>
  <WLoading label="Loading report" :size="50" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `size` | `string \| number` | `50` | حجم مؤشر Vuetify. |
| `color` | `WakebColor \| WakebDeprecatedColor` | `"primary"` | لون المؤشر. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS. أسماء ألوان Vuetify المهملة (WakebDeprecatedColor مثل error أو red-darken-2) ما زالت مقبولة في TypeScript وتُعرض تحت Vuetify مع WAKEB_DEPRECATED_VALUE، وترجع المزودات الأخرى إلى القيمة الافتراضية مع WAKEB_UNKNOWN_VALUE. |
| `label` | `string` | `"Loading"` | اسم حالة التحميل لقارئ الشاشة؛ مرر ترجمة المشروع. |
| `providerProps` | `WakebProviderProps` | `undefined` | غير قابل للنقل. خصائص أصلية لـprimitive مؤشر التحميل (`VProgressCircular` في Vuetify و`ProgressSpinner` في PrimeVue). `color` و`size` وحالة التحميل غير المحددة و`strokeWidth` و`pt` في PrimeVue يملكها Wakeb. لا أثر له عندما يستبدل الـslot الافتراضي المؤشر. |

## Slots

`default`: يستبدل المؤشر مع الاحتفاظ بحاوية الحالة واسمها.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |


## وجهة السمات

العنصر الجذري `div.loading` الذي يحمل `role="status"` على كل المزودين. تبقى role وaria-label الخاصة بـWakeb هي الغالبة. أما `providerProps` فيذهب إلى مؤشر التحميل الخاص بالمزود. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## الوصول وحدود السلوك

الحاوية role=status والمؤشر الافتراضي زخرفي ومخفي عن ARIA لمنع تكرار القراءة. التوسيط يعمل دون utility CSS. لا يوجد مؤقت أو طلب شبكة أو حالة تحميل داخلية؛ المشروع يتحكم في ظهور المكون. حركة المؤشر تتبع Vuetify.

## جرّب بنفسك

<ComponentPlayground initial="loading" />
