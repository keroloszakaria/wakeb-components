<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WProgressLinear

شريط تقدم أفقي محدد أو غير محدد، ويمكن تثبيته على الحافة العليا أو السفلى للحاوية.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="progress-linear" />

## الاستخدام

```vue
<script setup lang="ts">
import { WProgressLinear } from 'wakeb-components'
import { ref } from 'vue'
const saving = ref(true)
</script>

<template>
  <WProgressLinear :active="saving" indeterminate absolute location="bottom" />
</template>
```

## أمثلة

### تقدم محدد

مرر قيمة واسمًا واضحًا للعمل القابل للقياس.

```vue
<script setup lang="ts">
import { WProgressLinear } from 'wakeb-components'
</script>

<template>
  <WProgressLinear :model-value="45" aria-label="Upload 45 percent" />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `modelValue` | `number \| string` | `0` | التقدم من 0 إلى 100؛ القيم خارج المدى تُقص وغير الأرقام تصبح 0. |
| `indeterminate` | `boolean` | `false` | شريط متحرك بدون قيمة؛ ويُحذف aria-valuenow. |
| `active` | `boolean` | `true` | false يخفي الشريط (opacity 0) ويضع aria-hidden=true؛ ويبقى العنصر في مكانه. |
| `color` | `WakebColor` | `"primary"` | لون الشريط: intent من Wakeb أو لون CSS. |
| `height` | `number \| string` | `4` | ارتفاع الشريط؛ الأرقام والنصوص الرقمية بالبكسل، والنصوص الأخرى أطوال CSS. |
| `absolute` | `boolean` | `false` | يضع الشريط بموضع absolute بعرض أقرب أب له موضع. |
| `location` | `"top" \| "bottom"` | `"top"` | الحافة المستخدمة مع absolute. |
| `label` | `string` | `undefined` | الاسم المساعد. بدون قيمة يُستخدم "Loading..." في الوضع غير المحدد و"Progress" في غيره، حسب لغة الـplugin. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

لا يوجد.



## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات إلى عنصر شريط التقدم. يربط Wakeb السمات role وaria-label وaria-valuemin وaria-valuemax وaria-valuenow وaria-hidden بعدها، فتبقى تحت تحكم Wakeb.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

الجذر role=progressbar مع min ‏0 وmax ‏100 على كل المزودات. لا يوجد وضع buffer أو stream أو striped أو reverse أو clickable. على Vuetify: يُرسم بـVProgressLinear، والارتفاعات غير الرقمية تُطبق كنمط inline. على PrimeVue: يُرسم بـProgressBar (بدون عرض القيمة)؛ واللون والارتفاع يضبطان tokens لون القيمة والارتفاع. على shadcn-vue: تنسيق Progress من shadcn-vue على ProgressRoot من reka-ui، مع حركة انزلاق من Wakeb للوضع غير المحدد (تتوقف مع prefers-reduced-motion) وتتبع الاتجاه.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
