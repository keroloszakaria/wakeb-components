<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WCard

سطح بعنوان وعنوان فرعي وصف أزرار اختيارية.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="card" />

## الاستخدام

```vue
<script setup lang="ts">
import { WCard } from 'wakeb-components'
</script>

<template>
  <WCard title="Camera" subtitle="Gate 3" variant="outlined">Online</WCard>
</template>
```

## أمثلة

### إجراءات البطاقة

أضف الإجراءات من خلال slot.

```vue
<script setup lang="ts">
import { WCard, WButton } from 'wakeb-components'
</script>

<template>
  <WCard title="Report" variant="outlined"><p>Ready to review</p><template #actions><WButton title="Review" /></template></WCard>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | عنوان مترجم من المشروع. |
| `subtitle` | `string` | `undefined` | عنوان فرعي مترجم تحت العنوان. |
| `variant` | `"elevated" \| "flat" \| "outlined"` | `"elevated"` | ظل، أو بدون ظل، أو إطار بدون ظل. |
| `padded` | `boolean` | `true` | يضيف مسافات حول الـslot الافتراضي؛ وfalse يجعل المحتوى يصل للحواف (صور وجداول). |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

`default` (بدون بيانات): المحتوى. `title` (بدون بيانات) يستبدل نص العنوان. `actions` (بدون بيانات) صف في الأسفل.

```ts
default?(): unknown;
title?(): unknown;
actions?(): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى جذر البطاقة (`.wakeb-card`) على كل المزودات.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

العنوان نص منسق وليس عنصر heading؛ ضع عنصر heading داخل slot العنوان إذا احتاجه هيكل الصفحة. لا يوجد وضع صورة أو تحميل أو رابط. على Vuetify: يُرسم بـVCard (‏VCardTitle وVCardSubtitle وVCardText وVCardActions) بأشكال elevated وflat وoutlined. على PrimeVue: يُرسم بـCard؛ flat يزيل الظل وoutlined يرسم إطارًا. على shadcn-vue: markup وتنسيق Card من shadcn-vue.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
