<!-- Generated from docs/reference-data.mjs -->
# WSemiCircleGauge

مؤشر SVG نصف دائري، بعرّافات gradients مستقلة وslot للمحتوى.

## الاستخدام

```vue
<script setup lang="ts">
import { WSemiCircleGauge } from 'wakeb-components'
</script>
<template>
  <WSemiCircleGauge :value="75" label="75%" sub-label="Quality" aria-label="Quality: 75 percent" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `value` | `number` | `0` | النسبة بين 0 و100؛ تصبح NaN صفرًا. |
| `size` | `number` | `154` | حجم موجب ومحدود بالبكسل؛ القيم غير الصالحة ترجع إلى 154. |
| `thickness` | `number` | `0` | الصفر يعني 23.6% من الحجم، ويُحصر السمك الموجب عند نصف الحجم. |
| `label` | `string` | `""` | القيمة أو النص الأساسي الظاهر. |
| `subLabel` | `string` | `""` | نص صغير فوق القيمة الأساسية. |
| `ariaLabel` | `string` | `""` | وصف لقارئ الشاشة؛ الافتراضي النسبة بعد الحصر. |

## Slots

`default`: يستقبل `{ value, label, subLabel }` بدل النص الداخلي.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-gauge-color` | `#12b76a` |
| `--wakeb-gauge-highlight` | `gauge color` |
| `--wakeb-gauge-track-background` | `#f2f4f7` |
| `--wakeb-gauge-track-border` | `#d0d5dd` |
| `--wakeb-gauge-needle-color` | `#fff` |
| `--wakeb-gauge-text-color` | `currentColor` |
| `--wakeb-gauge-muted-color` | `#667085` |

## الوصول وحدود السلوك

يقرأ قارئ الشاشة النسبة أو ariaLabel عبر SVG بدور img، ويُخفى النص الزخرفي المكرر عن ARIA. Vue useId يمنع تداخل عرّافات SVG ويدعم SSR. ينعكس الرسم في RTL ولا ينعكس النص. تُصحح الأبعاد غير الصالحة، وتُحترم reduced motion. size هو العرض الكامل، وارتفاع القوس نصفه.

## جرّب بنفسك

<ComponentPlayground initial="semi-circle-gauge" />
