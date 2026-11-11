<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WAvatar

صورة شخص واحد: صورة فعلية أو الحروف الأولى على لون.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="avatar" />

## الاستخدام

```vue
<script setup lang="ts">
import { WAvatar } from 'wakeb-components'
</script>

<template>
  <WAvatar name="Grace Hopper" size="32" />
</template>
```

## أمثلة

### محتوى مخصص

استبدل الحروف الأولى من خلال default slot.

```vue
<script setup lang="ts">
import { WAvatar } from 'wakeb-components'
</script>

<template>
  <WAvatar name="Engineering" :size="40">ENG</WAvatar>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `image` | `string` | `undefined` | رابط الصورة (http(s) أو نسبي أو blob أو data:image). |
| `name` | `string` | `undefined` | اسم الشخص: الاسم المساعد ومصدر الحروف الأولى (أول حرف من أول كلمتين). |
| `size` | `number \| string` | `40` | الحجم بالبكسل، أو x-small وsmall وdefault وlarge وx-large (‏24–56px). |
| `color` | `WakebColor` | `"primary"` | الخلفية خلف الحروف: intent من Wakeb أو لون CSS. |
| `rounded` | `boolean` | `true` | دائرة؛ وfalse يعطي مربعًا بحواف دائرية. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

`default` (بدون بيانات) يستبدل الحروف عندما لا توجد صورة.

```ts
default?(): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى جذر الصورة الرمزية.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

مع name تكون الصورة role=img باسم الشخص وتُخفى الصورة والحروف عن التقنيات المساعدة؛ وبدونه تكون aria-hidden. لون الحروف أبيض فوق اللون. على Vuetify: ‏VAvatar مع VImg. على PrimeVue: ‏Avatar بحجم وألوان من Wakeb. على shadcn-vue: ‏Avatar من reka-ui بتنسيق shadcn-vue؛ وتظهر الحروف حتى تُحمّل الصورة وعند فشلها.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
