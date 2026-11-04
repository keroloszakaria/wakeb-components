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
| `color` | `WakebColor` | `"primary"` | لون المؤشر. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS. |
| `label` | `string` | `"Loading"` | اسم حالة التحميل لقارئ الشاشة؛ مرر ترجمة المشروع. |

## Slots

`default`: يستبدل المؤشر مع الاحتفاظ بحاوية الحالة واسمها.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |


## الوصول وحدود السلوك

الحاوية role=status والمؤشر الافتراضي زخرفي ومخفي عن ARIA لمنع تكرار القراءة. التوسيط يعمل دون utility CSS. لا يوجد مؤقت أو طلب شبكة أو حالة تحميل داخلية؛ المشروع يتحكم في ظهور المكون. حركة المؤشر تتبع Vuetify.

## جرّب بنفسك

<ComponentPlayground initial="loading" />
