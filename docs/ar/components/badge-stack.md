<!-- Generated from docs/reference-data.mjs -->
# WBadgeStack

مجموعة شارات بتخصيص لكل عنصر وأيقونات قابلة للاستبدال وقائمة زيادة اختيارية.

## الاستخدام

```vue
<script setup lang="ts">
import { WBadgeStack } from 'wakeb-components'
</script>
<template>
  <WBadgeStack :items="[{ id: 1, label: 'Administrator' }, { id: 2, label: 'Reviewer' }]" show-overflow-menu overflow-label="More roles" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `items` | `readonly BadgeStackItem[]` | `[]` | عناصر تحمل الاسم ورابط الصورة واللون وتخصيصات الشارة. |
| `max` | `number` | `1` | حد العناصر الظاهرة؛ استخدم عددًا صحيحًا محدودًا لا يقل عن صفر. |
| `truncateLength` | `number` | `12` | طول الاسم الظاهر شامل النقاط؛ أسماء قائمة الزيادة كاملة. |
| `showOverflowMenu` | `boolean` | `false` | تفعيل قائمة Vuetify عند hover أو النقر أو الكيبورد على +N. |
| `badgeType` | `string` | `"transparent"` | نوع WBadge الافتراضي. |
| `badgeVariant` | `BadgeProps["variant"]` | `"default"` | شكل الشارة؛ default يتحول إلى tonal. |
| `badgeBorderRadius` | `string` | `"md"` | نصف القطر الافتراضي. |
| `customBorderRadius` | `string` | `"sm"` | القيمة القديمة تمر كما هي؛ استخدم طول CSS صالحًا في المشاريع الجديدة. |
| `badgePadding` | `string` | `""` | حشو الشارة المخصص. |
| `dotColor` | `string` | `""` | لون النقطة الافتراضي. |
| `badgeClassList` | `ComponentClass` | `""` | classes على كل chip. |
| `isDot` | `boolean` | `false` | إظهار نقطة الحالة افتراضيًا. |
| `iconSize` | `string \| number` | `"xs"` | حجم glyph؛ أبعاد الصور تحددها أنماط المجموعة. |
| `iconPosition` | `"before" \| "after"` | `"before"` | موضع الأيقونة أو الصورة داخل الشارة. |
| `iconVariant` | `"default" \| "circle"` | `"default"` | صورة عادية أو حاوية دائرية. |
| `iconBackgroundOpacity` | `number` | `1` | قوة لون الدائرة، بين صفر وواحد. |
| `customOverflowBorderRadius` | `string` | `"999px"` | نصف قطر +N عندما يفتح قائمة. |
| `overflowLabel` | `string` | `""` | الاسم المقروء لزر القائمة؛ البديل +N. |
| `overflowTag` | `"button" \| "div"` | `"button"` | زر HTML افتراضيًا؛ div لتوافق المشاريع القديمة. |
| `menuStyle` | `CSSProperties` | `undefined` | أنماط ومتغيرات على القائمة المنقولة خارج الحاوية. |
| `badgeAttrs` | `Record<string, unknown>` | `undefined` | خصائص حاوية كل WBadge، حتى صفوف القائمة؛ تجنب استبدال خصائص المحتوى. |

## الأحداث

لا توجد أحداث مخصصة. أحداث الحاوية تتصاعد طبيعيًا؛ حالة القائمة يديرها Vuetify.

## Slots

`icon`: يستقبل `{ item, index, overflow, variant, style }` ويستبدل حاوية الصورة كاملة. `badgeIcon`: للأيقونات غير المصورة. `label`: يستقبل `{ item, text, overflow }`. الفهرس داخل الجزء الظاهر أو المخفي.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-badge-stack-overflow-background` | `#fff` |
| `--wakeb-badge-stack-overflow-color` | `#101828` |
| `--wakeb-badge-stack-menu-surface` | `Vuetify surface` |
| `--wakeb-badge-stack-icon-background` | `#087f8c` |
| `--wakeb-badge-stack-focus` | `#087f8c` |
| `--wakeb-badge-stack-fallback` | `not defined (legacy menu adapter switch)` |

## الوصول وحدود السلوك

الخصائص العادية تستهدف حاوية flex. لا يوجد اعتماد على بيانات العمل أو theme أو registry للأيقونات. متغيرات WBadge متاحة أيضًا. خصص ألوان القائمة عبر menuStyle وbadgeAttrs لأن Vuetify ينقلها خارج الحاوية. الصور زخرفية ولا توجد خدمة لجلبها أو تلوين خاص بنوع الاكتشاف. تخصيص العنصر يحترم false والقيم الفارغة. max يحافظ على Array.slice والحساب القديم؛ الأعداد السالبة والكسرية وغير المحدودة إعدادات غير مدعومة. التقصير بوحدات UTF-16 من Wakeb Utils. القائمة تعرض الأسماء كاملة. customOverflowBorderRadius يخص زر القائمة فقط؛ +N الثابت يستخدم customBorderRadius. قواعد أحجام الزيادة والدائرة القديمة محفوظة. الزر الافتراضي يدعم التركيز وEnter/Space وEscape من Vuetify؛ div القديم لا يضيف tab stop.

## جرّب بنفسك

<IdentityPlayground initial="badge-stack" />
