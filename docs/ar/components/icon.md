<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WIcon

أيقونة واحدة من محلل أيقونات Wakeb، زخرفية أو باسم مساعد.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="icon" />

## الاستخدام

```vue
<script setup lang="ts">
import { WIcon } from 'wakeb-components'
</script>

<template>
  <WIcon icon="$close" size="16" label="Close" />
</template>
```

## أمثلة

### أيقونة زخرفية

اترك label فارغًا للأيقونة الزخرفية بجانب نص ظاهر.

```vue
<script setup lang="ts">
import { WIcon } from 'wakeb-components'
</script>

<template>
  <span><WIcon icon="$complete" size="16" /> Complete</span>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `icon` | `SharedIcon` | `required` | اسم أيقونة (الخيار icons ثم أيقونات Wakeb المدمجة ثم مجموعة المزود)، أو بيانات مسار SVG، أو مكوّن Vue. |
| `size` | `number \| string` | `24` | حجم الأيقونة؛ الأرقام بالبكسل. |
| `color` | `WakebColor` | `undefined` | لون الأيقونة: intent من Wakeb أو لون CSS. بدون قيمة يرث لون النص. |
| `label` | `string` | `undefined` | الاسم المساعد؛ وتصبح الأيقونة role=img. بدون قيمة تكون aria-hidden. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

لا يوجد.



## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى جذر الأيقونة (عنصر VIcon على Vuetify، وspan على باقي المزودات).

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

على Vuetify: ‏VIcon؛ والأسماء التي لا يعرفها محلل Wakeb تذهب إلى مجموعة أيقونات Vuetify في المشروع (مثل أسماء mdi- مع خط MDI). على PrimeVue وshadcn-vue: عارض Wakeb؛ وتعمل أسماء PrimeIcons على PrimeVue، والاسم غير المعروف يرسم صندوق Wakeb البديل مع WAKEB_ICON_UNRESOLVED. الأيقونة ليست زرًا؛ ضعها داخل WButton للأوامر.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
