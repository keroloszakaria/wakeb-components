<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WTooltipBtn

زر أيقونة بنص Tooltip مترجم من المشروع وخصائص زر HTML.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<IdentityPlayground initial="tooltip-btn" />

## الاستخدام

```vue
<script setup lang="ts">
import { WTooltipBtn } from 'wakeb-components'
</script>

<template>
  <WTooltipBtn text="Save changes" icon="$complete" btn-icon aria-label="Save changes" @click="() => {}" />
</template>
```

## أمثلة

### محتوى زر مخصص

استعمل icon slot واحتفظ باسم واضح لقارئ الشاشة.

```vue
<script setup lang="ts">
import { WTooltipBtn } from 'wakeb-components'
</script>

<template>
  <WTooltipBtn text="More information" aria-label="More information"><template #icon><span>Info</span></template></WTooltipBtn>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `icon` | `SharedIcon` | `undefined` | اسم أيقونة أو بيانات مسار SVG أو مكوّن (المزودات > الأيقونات)؛ ويمكن استبدالها بـslot. |
| `text` | `string` | `""` | نص Tooltip مترجم مسبقًا؛ القيمة الفارغة تلغيه. |
| `ariaLabel` | `string \| null` | `undefined` | اسم مقروء صريح للزر؛ البديل text. |
| `btnIcon` | `boolean` | `false` | تفعيل شكل زر الأيقونة الدائري (icon في VBtn على Vuetify، ودائرة بقطر 48px على PrimeVue). |
| `variant` | `WakebVariant \| WakebDeprecatedVariant` | `"ghost"` | النمط القابل للنقل: soft أو solid أو outline أو ghost. الأسماء القديمة (text وflat وelevated وtonal وoutlined وplain) ما زالت تعمل مع تحذير في وضع التطوير. |
| `location` | `"top" \| "bottom" \| "start" \| "end"` | `"bottom"` | موضع Tooltip. |
| `openDelay` | `string \| number` | `200` | تأخير فتح Tooltip بالمللي ثانية. |
| `contentClass` | `string` | `"v-app-tooltip-btn__content"` | class على Tooltip overlay. |
| `tooltipStyle` | `CSSProperties` | `undefined` | أنماط على محتوى Tooltip المنقول. |
| `wrapperAttrs` | `Record<string, unknown>` | `undefined` | خصائص span الخارجي؛ الخصائص العادية تستهدف زر HTML الأصلي. |

## الأحداث

لا توجد أحداث مخصصة. أحداث النقر والكيبورد وخصائص الفورم تصل إلى زر HTML الأصلي دون مستمع إضافي على الحاوية.



## Slots

`icon`: يستقبل `{ icon }` ويستبدل الأيقونة الافتراضية. لا يوجد slot افتراضي للنص؛ استخدم WButton للأزرار النصية.

```ts
icon?(props: { icon: SharedIcon | undefined }): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

عنصر `<button>` الأصلي (VBtn في Vuetify، وButton من PrimeVue دون أنماطه في PrimeVue)، وليس الـspan الخارجي؛ استخدم `wrapperAttrs` لذلك الـspan. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab` | التركيز على الإجراءات المفعلة. |
| `Enter / Space` | تفعيل الزر الأصلي الحالي. |
| `Escape` | إغلاق التلميح. |

## الوصول وحدود السلوك

الخصائص والأحداث العادية تصل إلى VBtn مرة واحدة؛ wrapperAttrs للحاوية الخارجية. الافتراضات تحافظ على المظهر الأصلي: النمط ghost ‏(text في Vuetify) وأسفل وتأخير 200ms. مرر text=t(key) من المشروع؛ الحزمة لا تعتمد على i18n ولا تستقبل path. VTooltip يستخدم activator=parent مع التركيز وhover وEscape وaria-describedby. وفر ariaLabel أو نصًا واضحًا للأزرار المصورة. الزر المعطل يحتفظ بسلوكه ولا يصبح هدفًا للـTooltip عبر الكيبورد؛ استخدم عنصر مساعدة منفصلًا عند الحاجة. تُحل أسماء الأيقونات أولًا عبر الخيار icons والأيقونات المدمجة، وبقية الأسماء تحتاج إعداد أيقونات Vuetify؛ slot يدعم SVG مباشرة. خصص Tooltip عبر tooltipStyle بسبب teleport؛ لا يحمل التلميح إلا نطاق theme الخاص بالـplugin وzIndexOverlay، وتتقدم tooltipStyle عليه. التنسيق من Vuetify theme دون متغيرات CSS إضافية خاصة بالحزمة. تحت PrimeVue: الزر هو Button من PrimeVue دون أنماطه، ونوعه type=button افتراضيًا؛ وتتقدم سمات المستخدم مثل type وform وdisabled وaria-label، وتعمل الأحداث الأصلية مرة واحدة. ترسم Wakeb CSS الأنماط الأربعة بلون currentColor (ويستخدم solid المتغيرين --wakeb-ui-primary و--wakeb-ui-on-primary) بأبعاد VBtn: ارتفاع 36px وعرض أدنى 64px، أو دائرة بقطر 48px مع btnIcon؛ ولا تُستخدم severities أو أحجام PrimeVue. يفتح توجيه Tooltip في PrimeVue عند مرور المؤشر وعند التركيز بالكيبورد بعد openDelay، ويُغلق عند فقدان التركيز والنقر وEscape، ويرتبط بالزر عبر aria-describedby بمعرّف من useId. تتبع start وend خيار direction في الـplugin. تنسّق tooltipStyle فقاعة نص التلميح، وتنسّق contentClass جذر التلميح الذي يحمل نطاق theme الخاص بالـplugin وقيمة zIndexOverlay بدلًا من z-index تلميحات PrimeVue؛ ويبقى نمط pt.directives.tooltip.root العام في PrimeVue تحتهما. دون أيقونة لا يُرسم شيء داخل الزر، بينما يرسم Vuetify مكوّن VIcon فارغًا. تحت shadcn-vue: الزر نسخة Wakeb من زر shadcn-vue دون variant أصلي، فترسم أنماط Wakeb الأنواع القابلة للنقل (wakeb-tooltip-btn--*)، وقيمة type الافتراضية button. يفتح Tooltip من reka-ui عند التركيز بلوحة المفاتيح ومرور المؤشر (وتنطبق openDelay على مرور المؤشر)، ويبقى مفتوحًا ما دام المؤشر فوقه، ويُغلق عند فقدان التركيز وبـEscape؛ ويشير aria-describedby إليه ما دام مفتوحًا فقط، فلا تحمله مخرجات الخادم. تنسّق tooltipStyle نص التلميح، ويحمل جذر التلميح نطاق theme وcontentClass وzIndexOverlay.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
