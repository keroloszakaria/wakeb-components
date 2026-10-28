<!-- Generated from docs/reference-data.mjs -->
# WTooltipBtn

زر أيقونة بنص Tooltip مترجم من المشروع وخصائص زر HTML.

## الاستخدام

```vue
<script setup lang="ts">
import { WTooltipBtn } from 'wakeb-components'
</script>
<template>
  <WTooltipBtn text="Save changes" icon="$complete" btn-icon aria-label="Save changes" @click="() => {}" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `icon` | `SharedIcon` | `undefined` | أيقونة Vuetify؛ استخدم slot للأيقونات المخصصة. |
| `text` | `string` | `""` | نص Tooltip مترجم مسبقًا؛ القيمة الفارغة تلغيه. |
| `ariaLabel` | `string \| null` | `undefined` | اسم مقروء صريح للزر؛ البديل text. |
| `btnIcon` | `boolean` | `false` | تفعيل شكل زر الأيقونة في Vuetify. |
| `variant` | `"text" \| "flat" \| "elevated" \| "tonal" \| "outlined" \| "plain"` | `"text"` | شكل زر Vuetify. |
| `location` | `"top" \| "bottom" \| "start" \| "end"` | `"bottom"` | موضع Tooltip. |
| `openDelay` | `string \| number` | `200` | تأخير فتح Tooltip بالمللي ثانية. |
| `contentClass` | `string` | `"v-app-tooltip-btn__content"` | class على Tooltip overlay. |
| `tooltipStyle` | `CSSProperties` | `undefined` | أنماط على محتوى Tooltip المنقول. |
| `wrapperAttrs` | `Record<string, unknown>` | `undefined` | خصائص span الخارجي؛ الخصائص العادية تستهدف VBtn. |

## الأحداث

لا توجد أحداث مخصصة. أحداث النقر والكيبورد وخصائص الفورم تصل إلى VBtn دون مستمع إضافي على الحاوية.

## Slots

`icon`: يستقبل `{ icon }` ويستبدل VIcon. لا يوجد slot افتراضي للنص؛ استخدم WButton للأزرار النصية.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |


## الوصول وحدود السلوك

الخصائص والأحداث العادية تصل إلى VBtn مرة واحدة؛ wrapperAttrs للحاوية الخارجية. الافتراضات مطابقة للأصل: text وأسفل وتأخير 200ms. مرر text=t(key) من المشروع؛ الحزمة لا تعتمد على i18n ولا تستقبل path. VTooltip يستخدم activator=parent مع التركيز وhover وEscape وaria-describedby. وفر ariaLabel أو نصًا واضحًا للأزرار المصورة. الزر المعطل يحتفظ بسلوكه ولا يصبح هدفًا للـTooltip عبر الكيبورد؛ استخدم عنصر مساعدة منفصلًا عند الحاجة. VIcon يحتاج إعداد أيقونات Vuetify؛ slot يدعم SVG مباشرة. خصص Tooltip عبر tooltipStyle بسبب teleport. التنسيق من Vuetify theme دون متغيرات CSS إضافية خاصة بالحزمة.

## جرّب بنفسك

<IdentityPlayground initial="tooltip-btn" />
