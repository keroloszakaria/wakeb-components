<!-- Generated from docs/reference-data.mjs -->
# WCarousel

عرض شرائح من Vuetify بمحتوى مخصص وتحكم في التشغيل ومؤشرات قابلة للوصول.

## الاستخدام

```vue
<script setup lang="ts">
import { WCarousel } from 'wakeb-components'
</script>
<template>
  <div style="position:relative;height:240px"><WCarousel :slides="['First', 'Second']" :cycle="false" show-indicators><template #slide="{slide}">{{slide}}</template></WCarousel></div>
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `slides` | `readonly unknown[]` | `[]` | عناصر تمر كما هي إلى slot الشريحة. |
| `modelValue` | `number` | `undefined` | فهرس خارجي اختياري؛ الاختيار المحلي يبدأ من صفر. |
| `interval` | `number` | `5000` | الفاصل الزمني للتشغيل التلقائي بالمللي ثانية. |
| `cycle` | `boolean` | `true` | تشغيل التنقل التلقائي؛ وفر تحكمًا ظاهرًا للإيقاف عند استخدامه. |
| `showArrows` | `boolean \| "hover"` | `false` | أزرار السابق والتالي الأصلية. |
| `showIndicators` | `boolean` | `false` | إظهار مؤشرات قابلة للنقر؛ الاسم بمعناه المباشر. |
| `height` | `string \| number` | `"100%"` | ارتفاع Carousel. |
| `ariaLabel` | `string` | `"Carousel"` | اسم عرض الشرائح المقروء. |
| `indicatorLabel` | `(index: number) => string` | `index => 'Go to slide ' + (index + 1)` | دالة تسمية المؤشرات من المشروع؛ الفهرس يبدأ من صفر. |
| `indicatorAttrs` | `Record<string, unknown>` | `undefined` | خصائص وأنماط كل مؤشر؛ يمكنها استبدال type الخاص بالزر. |
| `keyboardIndicators` | `boolean` | `true` | تفعيل مفاتيح الأسهم وHome/End وتنسيق التركيز؛ false يحتفظ بسلوك الزر الطبيعي. |

## الأحداث

`update:modelValue(index: number)` مرة عند تغيير الفهرس محليًا؛ مزامنة قيمة الأب الصالحة لا تكرر الحدث.

## Slots

`slide`: يستقبل `{slide,index}`؛ `prev` و`next`: يستقبلان `{props}` من Vuetify؛ اربطها بأزرار التنقل.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-carousel-indicator-bg` | `#98a2b3` |
| `--wakeb-carousel-indicator-active-bg` | `#087f8c` |
| `--wakeb-carousel-focus` | `#087f8c` |
| `--wakeb-carousel-fallback` | `undefined (legacy adapter switch)` |

## الوصول وحدود السلوك

المكوّن يحتفظ بجذرين دون حاوية إضافية. ضعه داخل أب position:relative لأن المؤشرات موضوعة absolute على بعد 2rem من أسفله. الخصائص العادية تستهدف VCarousel. مؤشرات Vuetify الأصلية مخفية، وshowIndicators يتحكم في المؤشرات المخصصة. المؤشرات العامة type=button ولها أسماء وحالة حالية وتدعم اليمين واليسار مع عكس RTL وHome/End وEnter/Space. أزرار السابق والتالي تحتفظ بسلوك Vuetify. الشرائح تُركب عند الحاجة. استخدم فهارس محدودة ضمن النطاق وفواصل زمنية موجبة. التشغيل التلقائي من Vuetify ولا يتوقف تلقائيًا عند hover أو التركيز؛ المثال يبدأ متوقفًا ويوفر تحكمًا في cycle. استخدم cycle=false للتجارب الثابتة أو قليلة الحركة؛ حركة المؤشرات تحترم reduced-motion وانتقالات الشرائح من خصائص Vuetify. المحتوى من المشروع. Aware يحتفظ بعكس معنى hideDelimiters=true وبسلوك type القديم للمؤشرات. Aware يعطل مفاتيح المؤشرات وتنسيق التركيز الإضافيين للاحتفاظ بالسلوك الأصلي.

## جرّب بنفسك

<CompositionPlayground initial="carousel" />
