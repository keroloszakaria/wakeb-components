<!-- Generated from docs/reference-data.mjs -->
# WAvatarStack

صور متداخلة، مع حقول بيانات متداخلة وقائمة overflow قابلة للفتح بالكيبورد.

## الاستخدام

```vue
<script setup lang="ts">
import { WAvatarStack } from 'wakeb-components'
</script>
<template>
  <WAvatarStack :items="[{ id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Grace Hopper' }]" :max="1" show-overflow-menu overflow-label="More people" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `items` | `readonly unknown[]` | `[]` | العناصر؛ القيم المفقودة أو غير الصالحة تستخدم النص البديل. |
| `max` | `number` | `3` | العدد الظاهر؛ يُقرب لأسفل ويُحصر عند صفر. القيم غير المحدودة تستخدم 3. |
| `size` | `string \| number` | `32` | حجم الصورة عبر Vuetify. |
| `avatarColor` | `string` | `"primary"` | خلفية الحروف والعدد الإضافي؛ الصور تستخدم primary. |
| `showOverflowMenu` | `boolean` | `false` | عرض باقي المستخدمين في قائمة Vuetify. |
| `showTooltip` | `boolean` | `true` | تفعيل Tooltip بالتركيز أو المرور على المستخدمين الظاهرين. |
| `itemKey` | `string` | `"id"` | مسار بالنقاط لمفتاح نصي أو رقمي؛ البديل index. |
| `nameKey` | `string` | `"name"` | مسار اسم العرض. |
| `avatarKey` | `string` | `"avatar"` | مسار رابط الصورة. |
| `unknownLabel` | `string` | `"Unknown user"` | ترجمة الاسم البديل؛ الحروف المفقودة تظهر ?. |
| `overflowLabel` | `string` | `""` | الاسم المساعد للعدد الإضافي؛ الافتراضي +count. |
| `menuStyle` | `CSSProperties` | `{}` | styles ومتغيرات CSS على القائمة المنقولة إلى overlay. |
| `tooltipStyle` | `CSSProperties` | `{}` | styles على محتوى Tooltip المنقول. |

## Slots

`avatar`: يستقبل `{ item, index, label, avatar, initials }` لاستبدال الصورة. `overflow`: يستقبل `{ count }` لاستبدال نص العدد.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-avatar-border` | `Vuetify surface / white` |
| `--wakeb-avatar-overlap` | `-10px` |
| `--wakeb-avatar-focus` | `Vuetify primary / #087f8c` |
| `--wakeb-avatar-menu-surface` | `Vuetify surface / white` |
| `--wakeb-avatar-menu-text` | `Vuetify on-surface / #101828` |

## الوصول وحدود السلوك

للصور اسم مساعد كامل، وتصبح قابلة للتركيز عند تفعيل Tooltip فقط. العدد الإضافي زر فعلي عند تفعيل القائمة ويعمل بالنقر والكيبورد والمرور من خلال Vuetify، وإلا فهو صورة نصية ثابتة. المفاتيح المكررة مسؤولية المستهلك. تُقرأ مسارات الحقول المملوكة للكائن فقط وتُعرض الأسماء كنصوص آمنة. روابط الصور تدعم http والمسار الذي يبدأ بشرطة مائلة وdata؛ التحميل يتبع المتصفح وVuetify. الحروف البديلة من أول Unicode code point لأول كلمتين. لا يحتاج i18n أو store. تخصيص القائمة المنقولة عبر menuStyle والـTooltip عبر tooltipStyle.

## جرّب بنفسك

<ComponentPlayground initial="avatar-stack" />
