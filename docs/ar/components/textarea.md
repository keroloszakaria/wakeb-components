<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WTextarea

حقل نص متعدد الأسطر بعنوان، بنفس قواعد التحقق في WTextField.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="textarea" />

## الاستخدام

```vue
<script setup lang="ts">
import { WTextarea } from 'wakeb-components'
import { ref } from 'vue'
const notes = ref('')
</script>

<template>
  <WTextarea v-model="notes" label="Notes" rows="3" density="compact" />
</template>
```

## أمثلة

### التحقق من الإدخال

رسائل التحقق محلية، ومنطق الإرسال يخص التطبيق.

```vue
<script setup lang="ts">
import { WTextarea } from 'wakeb-components'
import { ref } from 'vue'
const notes = ref('')
</script>

<template>
  <WTextarea v-model="notes" label="Notes" :rules="[value => String(value ?? '').length >= 3 || 'Use at least 3 characters']" hide-details="auto" />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | `undefined` | قيمة الحقل؛ الكتابة ترسل update:modelValue بالنص. |
| `label` | `string` | `undefined` | عنوان مترجم من المشروع ومربوط بالحقل. |
| `placeholder` | `string` | `undefined` | نص توضيحي داخل الحقل. |
| `variant` | `"outline" \| "filled"` | `"outline"` | شكل الحقل. |
| `disabled` | `boolean` | `false` | حقل معطل أصليًا. |
| `readonly` | `boolean` | `false` | حقل للقراءة فقط. |
| `required` | `boolean` | `false` | السمة required الأصلية؛ أضف قاعدة لعرض رسالة. |
| `rules` | `readonly WakebFieldRule[]` | `[]` | القواعد تعمل مع كل قيمة؛ وأول فشل يظهر بعد الكتابة في الحقل أو مغادرته. |
| `hideDetails` | `boolean \| "auto"` | `false` | true يخفي سطر الرسائل؛ وauto يعرضه فقط عند وجود رسالة. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | المسافات داخل الحقل. بدون قيمة يبقى الافتراضي للمزود. |
| `errorMessages` | `string \| readonly string[]` | `undefined` | رسائل خارجية (مثل رسائل الخادم)؛ تظهر فورًا وتجعل الحقل غير صالح. |
| `rows` | `number \| string` | `5` | عدد الأسطر الظاهرة. |
| `autoGrow` | `boolean` | `false` | يتمدد مع المحتوى بدل التمرير. |
| `noResize` | `boolean` | `false` | يزيل مقبض تغيير الحجم. |

## الأحداث

`update:modelValue(value: string)` أثناء الكتابة.

```ts
"update:modelValue": [value: string];
```

## Slots

لا يوجد.



## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

مثل WTextField على كل المزودات: `class` و`style` و`id` و`inert` و`dir` و`data-*` وكل المستمعات تصل إلى جذر الحقل (`.wakeb-textarea`)، وباقي السمات (`name` و`maxlength` و`autocomplete` و`aria-*`) تصل إلى عنصر textarea الأصلي مع مستمعي focus وblur.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab / Shift+Tab` | الدخول إلى الحقل المفعل أو مغادرته. |
| `Native editing keys` | تحرير النص؛ readonly يمنع التعديل. |

## الوصول وحدود السلوك

العنوان عنصر `<label for>` مربوط بالحقل؛ والحقل غير الصالح يأخذ aria-invalid=true، وسطر الرسائل role=alert (ومربوط عبر aria-describedby على PrimeVue وshadcn-vue). لا يوجد عداد ولا زر مسح ولا slot قبل الحقل أو بعده. على Vuetify: يُرسم بـVTextarea مع العنوان العائم وسطر الرسائل من Vuetify. على PrimeVue: يُرسم بـTextarea (وautoResize مع autoGrow) تحت عنوان وسطر رسائل من Wakeb. على shadcn-vue: تنسيق Textarea من shadcn-vue على textarea أصلي؛ وautoGrow يستخدم CSS field-sizing، فالمتصفحات التي لا تدعمه تبقي ارتفاع rows.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
