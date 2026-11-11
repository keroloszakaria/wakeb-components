<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WSwitch

مفتاح تشغيل وإيقاف بقيمة boolean وعنوان مربوط به.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<FormsPlayground initial="switch" />

## الاستخدام

```vue
<script setup lang="ts">
import { WSwitch } from 'wakeb-components'
import { ref } from 'vue'
const notify = ref(true)
</script>

<template>
  <WSwitch v-model="notify" label="Notifications" />
</template>
```

## أمثلة

### إعداد معطل

يحتفظ الزر المعطل بحالة الاختيار.

```vue
<script setup lang="ts">
import { WSwitch } from 'wakeb-components'
</script>

<template>
  <WSwitch :model-value="true" label="Managed setting" disabled />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | حالة التشغيل؛ كل تبديل يرسل update:modelValue بالقيمة الجديدة. |
| `label` | `string` | `undefined` | عنوان ظاهر مترجم من المشروع ومربوط بعنصر التحكم. |
| `disabled` | `boolean` | `false` | عنصر تحكم معطل أصليًا؛ النقر لا يغيّر القيمة. |
| `color` | `WakebColor` | `"primary"` | لون الحالة المحددة: intent من Wakeb أو لون CSS. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | المسافات حول عنصر التحكم. بدون قيمة يبقى الافتراضي للمزود؛ Vuetify يستخدم density المضبوطة. |
| `inset` | `boolean` | `false` | شكل inset في Vuetify: مسار عريض والمقبض بداخله. مفاتيح PrimeVue وshadcn-vue لها هذا الشكل أصلًا. |
| `loading` | `boolean` | `false` | يضع aria-busy=true على عنصر التحكم أثناء انتظار عملية. يبقى قابلًا للاستخدام؛ عطّله بنفسك لمنع التغيير. |

## الأحداث

`update:modelValue(value: boolean)` عندما يبدّل المستخدم المفتاح.

```ts
"update:modelValue": [value: boolean];
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

عنصر التحكم له role=switch وحالة التحديد، والعنوان عنصر `<label for>` مربوط به. بدون عنوان ظاهر مرّر `aria-label`. زر المسافة يبدّله؛ لا يوجد سطر رسائل ولا قواعد ولا حالة غير محددة. على Vuetify: يُرسم بـVSwitch (hide-details)، ويأخذ الإدخال الأصلي role=switch، وloading يعرض أيضًا مؤشر Vuetify داخل المقبض. على PrimeVue: يُرسم بـToggleSwitch؛ اللون يضبط tokens المسار المحدد، وdensity وinset لا يغيّران شيئًا، وloading يخفّت المفتاح. على shadcn-vue: تنسيق Switch من shadcn-vue على زر SwitchRoot من reka-ui؛ density وinset لا يغيّران شيئًا، وloading يخفّت المفتاح.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
