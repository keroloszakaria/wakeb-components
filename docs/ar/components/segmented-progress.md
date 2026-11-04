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
| `color` | `WakebColor` | `var(--wakeb-progress-color, #12b76a)` | intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS. القيم الأخرى ترجع إلى القيمة الافتراضية. |
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

## وجهة السمات

العنصر الجذري `div.segmented-progress` الذي يحمل `role="progressbar"` على كل المزودين. قيمتا `role` و`aria-value*` ملك لـWakeb وتغلبان على سمات المستخدم؛ وقيمة `aria-label` من المستخدم هي الخاصية المكتوبة `ariaLabel`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## الوصول وحدود السلوك

يستخدم role=progressbar وحدود وقيمة ARIA. عند صفر لا يظهر جزء ممتلئ أو label مرئي، ويظل الاسم متاحًا لقارئ الشاشة. عند 100 يختفي الجزء الفارغ. الأجزاء تبدأ من flex basis صفر، فالجزء الممتلئ يساوي value% من عرض الشريط بعد خصم مسافة 2px مهما كان طول النص. الاتجاه موروث، والحركة تحترم reduced motion. لا توجد طلبات شبكة أو حالة مخزنة داخله. يرسم PrimeVue الـmarkup والـCSS نفسيهما من Wakeb كما في Vuetify (دون ProgressBar من PrimeVue)، فيتطابق الـDOM وبيانات الـslot والـtokens على المزودين.

## جرّب بنفسك

<ComponentPlayground initial="segmented-progress" />
