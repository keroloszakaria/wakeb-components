<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WImage

صورة متجاوبة بنسبة أبعاد وملء cover وتحميل كسول وslot للصورة المؤقتة.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="image" />

## الاستخدام

```vue
<script setup lang="ts">
import { WImage } from 'wakeb-components'
</script>

<template>
  <WImage src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%23087f8c'/%3E%3C/svg%3E" alt="Camera placeholder" aspect-ratio="16/9" cover />
</template>
```

## أمثلة

### محتوى بديل

قدم نصًا بديلًا مفيدًا ومحتوى أثناء التحميل.

```vue
<script setup lang="ts">
import { WImage } from 'wakeb-components'
</script>

<template>
  <WImage src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3C/svg%3E" alt="Camera placeholder" :width="240"><template #placeholder>Loading image</template></WImage>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `src` | `string` | `undefined` | رابط الصورة: http(s) أو نسبي أو blob أو data:image؛ والأنواع الأخرى لا تُعرض. |
| `alt` | `string` | `""` | نص بديل مترجم؛ والقيمة الفارغة تجعل الصورة زخرفية. |
| `width` | `number \| string` | `undefined` | عرض الصندوق؛ الأرقام بالبكسل. |
| `height` | `number \| string` | `undefined` | ارتفاع الصندوق؛ الأرقام بالبكسل. |
| `aspectRatio` | `number \| string` | `undefined` | العرض / الارتفاع كرقم (1.5) أو نسبة (16/9). |
| `cover` | `boolean` | `false` | يملأ الصندوق ويقص (object-fit cover) بدل الاحتواء داخله. |
| `lazy` | `boolean` | `true` | يحمّل عند الاقتراب من الشاشة؛ وfalse يحمّل فورًا. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

`placeholder` (بدون بيانات) يظهر أثناء تحميل الصورة وعند فشلها.

```ts
placeholder?(): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى صندوق الصورة (`.wakeb-image`) وليس إلى عنصر img.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

لا يوجد srcset ولا تدرج ولا معاينة مكبرة. على Vuetify: ‏VImg الذي يسمي الصندوق role=img بالنص البديل ويحمّل كسولًا عبر IntersectionObserver إلا إذا كانت lazy بقيمة false. على PrimeVue وshadcn-vue: ‏markup من Wakeb، صندوق حول img أصلي مع loading=lazy|eager وdecoding=async.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
