<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WVerticalSteps

خطوات عرض بأيقونات وعناوين قابلة للاستبدال وعقد بيانات بسيط.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ComponentPlayground initial="vertical-steps" />

## الاستخدام

```vue
<script setup lang="ts">
import { WVerticalSteps } from 'wakeb-components'
</script>

<template>
  <WVerticalSteps :steps="[{ title: 'Review', is_active: true, time: '09:00', date: '2026-10-28' }, { title: 'Ship' }]" label="Release steps" />
</template>
```

## أمثلة

### مكتمل وقيد الانتظار

حدد الخطوة النشطة من بيانات التطبيق.

```vue
<script setup lang="ts">
import { WVerticalSteps } from 'wakeb-components'
</script>

<template>
  <WVerticalSteps :steps="[{ title: 'Review', is_active: true }, { title: 'Publish', is_active: false }]" label="Approval process" />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `steps` | `readonly VerticalStep[]` | `[]` | عناصر title/time/date/is_active. راجع نماذج البيانات. |
| `label` | `string` | `"Steps"` | اسم القائمة لقارئ الشاشة؛ ترجمه داخل المشروع. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

`indicator` يستبدل العلامة بالكامل، و`icon` محتواها الافتراضي. `title` و`timeIcon` و`dateIcon`: كل منها يستقبل `{ step, index }`. الأيقونات الافتراضية رموز نصية ولا تحتاج خط أيقونات.

```ts
indicator(props: { step: VerticalStep; index: number }): unknown;
icon(props: { step: VerticalStep; index: number }): unknown;
title(props: { step: VerticalStep; index: number }): unknown;
timeIcon(props: { step: VerticalStep; index: number }): unknown;
dateIcon(props: { step: VerticalStep; index: number }): unknown;
```

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-steps-accent` | `#087f8c` |
| `--wakeb-steps-surface` | `#f9fafb` |
| `--wakeb-steps-text` | `currentColor` |
| `--wakeb-steps-active-text` | `#fff` |
| `--wakeb-steps-muted` | `#667085` |

## وجهة السمات

العنصر الجذري `div.steps` الذي يحمل `role="list"` على كل المزودين. قيمة `role` ملك لـWakeb وتغلب على سمات المستخدم؛ سمِّ القائمة عبر `label`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

يستخدم أدوار list/listitem. is_active حالة اكتمال مرئية، وليس تنقلًا تفاعليًا أو aria-current. المشروع يمرر التاريخ والوقت بعد التنسيق والترجمة. النص آمن من تفسير HTML. المفاتيح موضعية ولا توجد حالة اختيار داخلية. الاتجاهات منطقية ولا يحتاج framework للـutilities. نحافظ على تخطيط الصف الأفقي؛ اختبر النص الطويل في عرض المشروع المتاح. يرسم PrimeVue الـmarkup والـCSS نفسيهما من Wakeb كما في Vuetify (لا يُستخدم Stepper من PrimeVue لأنه معالج تفاعلي)، فيتطابق الـDOM وبيانات الـslots على المزودين. في shadcn-vue يُرسم markup القائمة نفسه من Wakeb؛ ولا يُستخدم Stepper من shadcn-vue لأنه معالج تفاعلي.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
