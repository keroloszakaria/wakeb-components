<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WSemiCircleGauge

مؤشر SVG نصف دائري، بعرّافات gradients مستقلة وslot للمحتوى.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ComponentPlayground initial="semi-circle-gauge" />

## الاستخدام

```vue
<script setup lang="ts">
import { WSemiCircleGauge } from 'wakeb-components'
</script>

<template>
  <WSemiCircleGauge :value="75" label="75%" sub-label="Quality" aria-label="Quality: 75 percent" />
</template>
```

## أمثلة

### تخصيص المنتصف

خصص النص عبر default slot مع إبقاء القيمة القابلة للقراءة.

```vue
<script setup lang="ts">
import { WSemiCircleGauge } from 'wakeb-components'
</script>

<template>
  <WSemiCircleGauge :value="90" aria-label="Quality 90 percent"><template #default>Excellent</template></WSemiCircleGauge>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `value` | `number` | `0` | النسبة بين 0 و100؛ تصبح NaN صفرًا. |
| `size` | `number` | `154` | حجم موجب ومحدود بالبكسل؛ القيم غير الصالحة ترجع إلى 154. |
| `thickness` | `number` | `0` | الصفر يعني 23.6% من الحجم، ويُحصر السمك الموجب عند نصف الحجم. |
| `label` | `string` | `""` | القيمة أو النص الأساسي الظاهر. |
| `subLabel` | `string` | `""` | نص صغير فوق القيمة الأساسية. |
| `ariaLabel` | `string` | `""` | وصف لقارئ الشاشة؛ الافتراضي النسبة بعد الحصر. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

`default`: يستقبل `{ value, label, subLabel }` بدل النص الداخلي.

```ts
default?(props: { value: number; label: string; subLabel: string }): unknown;
```

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

## وجهة السمات

العنصر الجذري `div.semi-circle-gauge`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

يقرأ قارئ الشاشة النسبة أو ariaLabel عبر SVG بدور img، ويُخفى النص الزخرفي المكرر عن ARIA. Vue useId يمنع تداخل عرّافات SVG ويدعم SSR. ينعكس الرسم في RTL ولا ينعكس النص. تُصحح الأبعاد غير الصالحة، وتُحترم reduced motion. size هو العرض الكامل، وارتفاع القوس نصفه. يرسم PrimeVue نفس SVG وCSS من Wakeb كما في Vuetify (لا يُستخدم Knob من PrimeVue لأنه حقل إدخال)، فيتطابق الـDOM والعرّافات والـtokens على المزودين. في shadcn-vue يُرسم ملف SVG نفسه من Wakeb بالهندسة نفسها؛ لا يملك shadcn-vue ولا reka-ui مقياسًا للقراءة فقط.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
