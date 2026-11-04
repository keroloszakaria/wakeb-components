<!-- Generated from docs/reference-data.mjs -->
# WTruncatedText

نص مختصر مع Tooltip يفتح عند مرور المؤشر وعند التركيز بالكيبورد.

## الاستخدام

```vue
<script setup lang="ts">
import { WTruncatedText } from 'wakeb-components'
</script>
<template>
  <WTruncatedText label="A shared foundation for every team" :length="20" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `label` | `string` | `""` | النص الكامل؛ لا يُفسر كـHTML. |
| `length` | `number` | `12` | الطول بوحدات UTF-16 ويشمل النقاط الثلاث. |
| `tooltipLocation` | `"top" \| "bottom" \| "start" \| "end"` | `"top"` | موضع Tooltip؛ start وend جهتان منطقيتان. |
| `tooltipMaxWidth` | `string \| number` | `280` | أقصى عرض للـTooltip. |
| `contentClass` | `string` | `"wakeb-truncated-tooltip"` | class على محتوى Tooltip المنقول إلى overlay. |
| `tooltipStyle` | `CSSProperties` | `undefined` | styles على محتوى Tooltip نفسه، بما فيها الألوان. |

## Slots

`default`: يستقبل `{ text, label, truncated }`. المحتوى الافتراضي هو النص المختصر.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-text-focus-color` | `Vuetify primary or --wakeb-ui-focus / PrimeVue primary / #087f5b` |

## وجهة السمات

عنصر `<span>` الذي يفتح الـTooltip. تُدمج أحداث التركيز والمرور من المستخدم مع أحداث الـTooltip. يملك Wakeb قيمتي tabindex وaria-label: يضعهما للنص المختصر ويزيلهما في غير ذلك، فتُتجاهل القيم القادمة من المستخدم. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## الوصول وحدود السلوك

تصل attributes والأحداث إلى span، وتُدمج أحداث التركيز مع Vuetify. النص المختصر قابل للتركيز وله aria-label كامل؛ النص القصير لا يضيف tab stop. نحافظ على سلوك Wakeb Utils: حد أقل من 3 يرجع النقاط الثلاث، وقد ينقسم emoji بسبب UTF-16. موضع Tooltip وتوقيته يتبعان Vuetify. تحت PrimeVue: يرسم توجيه Tooltip في PrimeVue التلميح داخل document.body، ويفتحه Wakeb عند مرور المؤشر وعند التركيز بالكيبورد، ويُغلق عند فقدان التركيز والنقر وEscape. يشير الـspan إليه عبر aria-describedby بمعرّف من useId، وتتقدم قيمة aria-describedby القادمة من المستخدم كما في Vuetify. تتبع start وend خيار direction في الـplugin. تنسّق tooltipStyle فقاعة نص التلميح، وتنسّق contentClass وtooltipMaxWidth جذر التلميح الذي يحمل نطاق theme الخاص بالـplugin أيضًا؛ ويحتفظ PrimeVue بترتيب z-index الخاص بتلميحاته، فلا ينطبق zIndexOverlay. يرجع إطار التركيز إلى --wakeb-ui-focus ثم إلى اللون الأساسي في PrimeVue. تحت shadcn-vue: يفتح Tooltip من reka-ui عند التركيز بلوحة المفاتيح وعند مرور المؤشر (مع mouseenter وأحداث pointer)، ويبقى مفتوحًا ما دام المؤشر فوقه، ويُغلق عند فقدان التركيز وبـEscape. وما دام مفتوحًا يشير aria-describedby في الـspan إليه، وتتقدم قيمة aria-describedby القادمة من المستخدم. لا تحمل مخرجات الخادم aria-describedby لأن التلميح مغلق. تنسّق tooltipStyle النص داخل التلميح، ويحمل جذر التلميح نطاق theme وcontentClass وtooltipMaxWidth وzIndexOverlay. ودون خيار direction في الـplugin تكتب reka-ui السمة dir=ltr على التلميح. يرجع إطار التركيز إلى --wakeb-ui-focus ثم إلى المتغير --ring في shadcn-vue.

## جرّب بنفسك

<ComponentPlayground initial="truncated-text" />
