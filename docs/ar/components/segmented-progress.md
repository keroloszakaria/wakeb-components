<!-- Generated from docs/reference-data.mjs -->
# WSegmentedProgress

شريط تقدم مخطط بقيمة وحدود واضحة لقارئات الشاشة.

## الاستخدام

```vue
<script setup lang="ts">
import { WSegmentedProgress } from 'wakeb-components'
</script>
<template>
  <WSegmentedProgress :value="65" label="65%" color="#0050ff" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `value` | `number` | `0` | النسبة؛ تُحصر بين 0 و100 وتصبح NaN صفرًا. |
| `label` | `string` | `""` | النص الظاهر داخل الجزء الممتلئ. |
| `color` | `string` | `var(--wakeb-progress-color, #12b76a)` | أي لون CSS، بما فيه متغير CSS. |
| `ariaLabel` | `string` | `""` | اسم لقارئ الشاشة؛ الافتراضي label ثم النسبة. |

## Slots

`default`: يستقبل `{ value, label }` داخل الجزء الممتلئ.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-progress-color` | `#12b76a` |
| `--wakeb-progress-height` | `34px` |
| `--wakeb-progress-surface` | `#fff` |
| `--wakeb-progress-track-background` | `#f2f4f7` |
| `--wakeb-progress-track-border` | `#d0d5dd` |

## الوصول وحدود السلوك

يستخدم role=progressbar وحدود وقيمة ARIA. عند صفر لا يظهر جزء ممتلئ أو label مرئي، ويظل الاسم متاحًا لقارئ الشاشة. عند 100 يختفي الجزء الفارغ. الاتجاه موروث، والحركة تحترم reduced motion. لا توجد طلبات شبكة أو حالة مخزنة داخله.

## جرّب بنفسك

<ComponentPlayground initial="segmented-progress" />
