<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WRow

صف في شبكة Wakeb ذات الاثني عشر عمودًا؛ ضع داخله عناصر WCol.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="row" />

## الاستخدام

```vue
<script setup lang="ts">
import { WRow, WCol } from 'wakeb-components'
</script>

<template>
  <WRow dense align="center">
  <WCol cols="12" md="6">Start</WCol>
  <WCol cols="12" md="6">End</WCol>
</WRow>
</template>
```

## أمثلة

### صف مضغوط

استخدم خصائص شبكة Wakeb لتباعد متوافق.

```vue
<script setup lang="ts">
import { WRow, WCol } from 'wakeb-components'
</script>

<template>
  <WRow dense justify="center"><WCol cols="12" md="6">Centered column</WCol></WRow>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `dense` | `boolean` | `false` | مسافات 4px بدل 12px. |
| `noGutters` | `boolean` | `false` | بدون مسافات؛ وتتقدم على dense. |
| `align` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | `undefined` | محاذاة الأعمدة على المحور العرضي (align-items). |
| `justify` | `"start" \| "center" \| "end" \| "space-between" \| "space-around" \| "space-evenly"` | `undefined` | توزيع الأعمدة على المحور الرئيسي (justify-content)؛ start وend يتبعان الاتجاه. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

`default` (بدون بيانات): أعمدة WCol.

```ts
default?(): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى عنصر الصف (`.wakeb-grid-row`) على كل المزودات.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

الشبكة markup من Wakeb على كل المزودات، فلا تغيّرها إعدادات نقاط التوقف أو الشبكة في المزود. الصف حاوية flex تلتف بهامش سالب يساوي padding العمود (12px، أو 4px مع dense). القيم غير المعروفة في align أو justify تُتجاهل مع WAKEB_UNKNOWN_VALUE. لا توجد خاصية tag ولا نقاط توقف xl/xxl ولا محاذاة لكل نقطة توقف.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
