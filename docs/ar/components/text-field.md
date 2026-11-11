<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WTextField

حقل إدخال نصي بسطر واحد له عنوان وقواعد تحقق موحدة وعناصر في بدايته ونهايته.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<FormsPlayground initial="text-field" />

## الاستخدام

```vue
<script setup lang="ts">
import { WTextField } from 'wakeb-components'
import { ref } from 'vue'
const email = ref('')
</script>

<template>
  <WTextField v-model="email" type="email" label="Email" :rules="[v => !!v || 'Required']" hide-details="auto" />
</template>
```

## أمثلة

### قيمة للقراءة

تسمح readonly بالقراءة والتركيز وتمنع التعديل.

```vue
<script setup lang="ts">
import { WTextField } from 'wakeb-components'
</script>

<template>
  <WTextField model-value="TEAM-001" label="Reference" readonly />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | `undefined` | القيمة الحالية؛ الكتابة ترسل update:modelValue بنص الحقل. |
| `type` | `"text" \| "search" \| "email" \| "tel" \| "url" \| "password" \| "number"` | `"text"` | نوع الإدخال الأصلي. |
| `label` | `string` | `undefined` | عنوان ظاهر مترجم من المشروع ومربوط بالحقل. |
| `placeholder` | `string` | `undefined` | نص توضيحي مترجم من المشروع. |
| `variant` | `"outline" \| "filled"` | `"outline"` | حقل بإطار أو بخلفية ممتلئة. |
| `disabled` | `boolean` | `false` | حقل معطل أصليًا ولا يرسل أحداثًا. |
| `readonly` | `boolean` | `false` | حقل للقراءة فقط ويبقى قابلًا للتركيز. |
| `required` | `boolean` | `false` | يضيف خاصية required الأصلية؛ أضف قاعدة لإظهار رسالة. |
| `rules` | `readonly WakebFieldRule[]` | `[]` | تُنفذ القواعد مع كل قيمة، وتظهر رسالة أول قاعدة لا ترجع true. |
| `hideDetails` | `boolean \| "auto"` | `false` | true يخفي سطر الرسالة؛ و"auto" يظهره فقط عند وجود رسالة. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | ارتفاع الحقل. بدون قيمة يبقى الافتراضي للمزود: Vuetify يستخدم density المضبوطة لـVTextField، وPrimeVue وshadcn-vue يستخدمان الحجم العادي. |
| `errorMessages` | `string \| readonly string[]` | `undefined` | رسائل من خارج الحقل مثل أخطاء السيرفر. طالما فيه رسالة يصبح الحقل غير صالح فورًا وتظهر أول رسالة قبل رسائل القواعد. |

## الأحداث

`update:modelValue(value: string)` مع كل إدخال. حقول الأرقام ترسل نص الحقل أيضًا.

```ts
"update:modelValue": [value: string];
```

## Slots

`start` و`end` (بدون بيانات) يظهران داخل الحقل قبل الإدخال وبعده، للأيقونات أو الأزرار.

```ts
start?(): unknown;
end?(): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

مثل VTextField في Vuetify على كل المزودات: `class` و`style` و`id` و`inert` و`dir` و`data-*` وكل المستمعات تصل إلى جذر الحقل (`.wakeb-text-field`)، وباقي السمات (`name` و`autocomplete` و`aria-*` و`maxlength` و`inputmode`) تصل إلى الإدخال الأصلي مع مستمعي focus وblur.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab / Shift+Tab` | الدخول إلى الحقل المفعل أو مغادرته. |
| `Native editing keys` | تحرير النص؛ readonly يمنع التعديل. |

## الوصول وحدود السلوك

العنوان عنصر `<label for>` حقيقي، فيحصل الحقل على اسم مقروء. تظهر رسائل التحقق بعد أول إدخال أو مغادرة للحقل، داخل عنصر role=alert، وتُربط بالحقل عبر aria-describedby مع aria-invalid=true. القاعدة التي ترجع false تجعل الحقل غير صالح دون رسالة. رسائل errorMessages تظهر دون انتظار الإدخال، وتُعرض أول رسالة فقط. density: على Vuetify تُمرَّر إلى density في VTextField (56 و48 و40 بكسل)؛ على PrimeVue تُرسم compact بحجم InputText الصغير وباقي القيم بالحجم العادي؛ على shadcn-vue تُرسم compact بارتفاع 2rem وباقي القيم بـ2.25rem. على Vuetify: يُرسم بـVTextField (بإطار أو ممتلئ) مع التحقق الخاص به، فيُسجَّل أيضًا في VForm المحيط. على PrimeVue: يُرسم بـInputText (بإطار أو ممتلئ) مع عنوان Wakeb ورسالته، ولا يُسجَّل في أي form. على shadcn-vue: تنسيق Input من shadcn-vue على إدخال أصلي مع عنوان Wakeb ورسالته. العنوان العائم والعدّاد وزر المسح ونص البادئة واللاحقة والإدخال متعدد الأسطر ليست جزءًا من العقد.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
