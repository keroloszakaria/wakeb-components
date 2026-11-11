<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WCol

عمود في شبكة Wakeb ذات الاثني عشر عمودًا بعرض متجاوب.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="col" />

## الاستخدام

```vue
<script setup lang="ts">
import { WRow, WCol } from 'wakeb-components'
</script>

<template>
  <WRow>
  <WCol cols="12" sm="6" lg="4">Card</WCol>
</WRow>
</template>
```

## أمثلة

### عرض حسب الشاشة

تستخدم الأعمدة شبكة من 12 وحدة وحدودًا ثابتة.

```vue
<script setup lang="ts">
import { WRow, WCol } from 'wakeb-components'
</script>

<template>
  <WRow><WCol cols="12" sm="6" lg="4">A</WCol><WCol cols="12" sm="6" lg="8">B</WCol></WRow>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `cols` | `string \| number \| boolean` | `undefined` | العرض من الصفر فما فوق: عرض من 1 إلى 12، أو 'auto' (عرض المحتوى) أو true (يتمدد). بدون قيمة يتمدد ليتقاسم الصف، مثل VCol. |
| `sm` | `string \| number \| boolean` | `undefined` | العرض من 600px: عرض من 1 إلى 12، أو 'auto' (عرض المحتوى) أو true (يتمدد). |
| `md` | `string \| number \| boolean` | `undefined` | العرض من 960px: عرض من 1 إلى 12، أو 'auto' (عرض المحتوى) أو true (يتمدد). |
| `lg` | `string \| number \| boolean` | `undefined` | العرض من 1280px: عرض من 1 إلى 12، أو 'auto' (عرض المحتوى) أو true (يتمدد). |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

`default` (بدون بيانات): محتوى العمود.

```ts
default?(): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى عنصر العمود (`.wakeb-grid-col`) على كل المزودات.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

نقاط التوقف ثابتة على sm ‏600px وmd ‏960px وlg ‏1280px، وهي قيم Vuetify 3 الافتراضية، على كل المزودات. الأعمدة بحجم border-box وpadding ‏12px (أو 4px أو 0 حسب الصف). القيمة false أو النص الفارغ لا يضيفان شيئًا؛ والقيم غير الصالحة الأخرى تُتجاهل مع WAKEB_UNKNOWN_VALUE (وcols غير الصالحة تتمدد). لا توجد خصائص offset أو order أو xl.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
