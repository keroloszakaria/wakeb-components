<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WCheckbox

مربع اختيار بقيمة boolean، أو بقائمة تحتوي القيم المحددة.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<FormsPlayground initial="checkbox" />

## الاستخدام

```vue
<script setup lang="ts">
import { WCheckbox } from 'wakeb-components'
import { ref } from 'vue'
const permissions = ref<boolean | unknown[]>(['read'])
</script>

<template>
  <WCheckbox v-for="name in ['read', 'write']" :key="name" v-model="permissions" :value="name" :label="name" />
</template>
```

## أمثلة

### نموذج منطقي

لا تمرر value عند استخدام قيمة منطقية.

```vue
<script setup lang="ts">
import { WCheckbox } from 'wakeb-components'
import { ref } from 'vue'
const accepted = ref<boolean | unknown[]>(false)
</script>

<template>
  <WCheckbox v-model="accepted" label="Accept terms" />
  <p>Accepted: {{ accepted }}</p>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `modelValue` | `boolean \| readonly unknown[]` | `false` | حالة التحديد. مع قائمة يكون المربع محددًا طالما تحتوي `value`، وكل تبديل يرسل قائمة جديدة بإضافة `value` أو حذفها. |
| `value` | `unknown` | `undefined` | العنصر الذي يضيفه المربع إلى القائمة أو يحذفه منها؛ تتم المقارنة بـ===. |
| `label` | `string` | `undefined` | عنوان ظاهر مترجم من المشروع ومربوط بعنصر التحكم. |
| `disabled` | `boolean` | `false` | عنصر تحكم معطل أصليًا؛ النقر لا يغيّر القيمة. |
| `color` | `WakebColor` | `"primary"` | لون الحالة المحددة: intent من Wakeb أو لون CSS. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | المسافات حول عنصر التحكم. بدون قيمة يبقى الافتراضي للمزود؛ Vuetify يستخدم density المضبوطة. |

## الأحداث

`update:modelValue(value: boolean | unknown[])` عندما يبدّل المستخدم المربع: قيمة boolean، أو قائمة جديدة عند استخدام قائمة.

```ts
"update:modelValue": [value: boolean | unknown[]];
```

## Slots

`label` (بدون بيانات) يستبدل نص العنوان ويبقى مربوطًا بعنصر التحكم.

```ts
label?(): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

مثل عناصر الاختيار في Vuetify على كل المزودات: `class` و`style` و`id` و`inert` و`dir` و`data-*` وكل المستمعات تصل إلى الجذر (`.wakeb-switch` / `.wakeb-checkbox`)، وباقي السمات (`name` و`aria-label` و`aria-describedby`) تصل إلى عنصر التحكم مع مستمعي focus وblur.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab` | التركيز على الحقل المفعل. |
| `Space` | تغيير حالة الاختيار. |

## الوصول وحدود السلوك

عنصر التحكم مربع اختيار له حالة التحديد، والعنوان عنصر `<label for>` مربوط به. زر المسافة يبدّله. Wakeb يدير القائمة على كل المزودات، فلا تُستخدم خيارات المجموعات وقيم true/false الخاصة بالمزودات. لا يوجد سطر رسائل ولا قواعد ولا حالة غير محددة. على Vuetify: يُرسم بـVCheckbox (hide-details). على PrimeVue: يُرسم بـCheckbox في الوضع binary؛ اللون يضبط tokens الحالة المحددة، وdensity لا يغيّر شيئًا. على shadcn-vue: تنسيق Checkbox من shadcn-vue على زر CheckboxRoot من reka-ui (role=checkbox)؛ density لا يغيّر شيئًا.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
