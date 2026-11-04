<!-- Generated from docs/reference-data.mjs -->
# WTruncatedText

نص مختصر مع Tooltip من Vuetify يعمل عند التركيز بالكيبورد.

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
| `tooltipLocation` | `"top" \| "bottom" \| "start" \| "end"` | `"top"` | موضع Tooltip من خلال Vuetify. |
| `tooltipMaxWidth` | `string \| number` | `280` | أقصى عرض للـTooltip. |
| `contentClass` | `string` | `"wakeb-truncated-tooltip"` | class على محتوى Tooltip المنقول إلى overlay. |
| `tooltipStyle` | `CSSProperties` | `undefined` | styles على محتوى Tooltip نفسه، بما فيها الألوان. |

## Slots

`default`: يستقبل `{ text, label, truncated }`. المحتوى الافتراضي هو النص المختصر.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-text-focus-color` | `Vuetify primary / #087f5b` |

## وجهة السمات

عنصر `<span>` الذي يفتح الـTooltip. تُدمج أحداث التركيز والمرور من المستخدم مع أحداث الـTooltip. يملك Wakeb قيمتي tabindex وaria-label: يضعهما للنص المختصر ويزيلهما في غير ذلك، فتُتجاهل القيم القادمة من المستخدم. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## الوصول وحدود السلوك

تصل attributes والأحداث إلى span، وتُدمج أحداث التركيز مع Vuetify. النص المختصر قابل للتركيز وله aria-label كامل؛ النص القصير لا يضيف tab stop. نحافظ على سلوك Wakeb Utils: حد أقل من 3 يرجع النقاط الثلاث، وقد ينقسم emoji بسبب UTF-16. موضع Tooltip وتوقيته يتبعان Vuetify.

## جرّب بنفسك

<ComponentPlayground initial="truncated-text" />
