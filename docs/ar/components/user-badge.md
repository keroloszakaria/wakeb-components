<!-- Generated from docs/reference-data.mjs -->
# WUserBadge

شارة مستخدم بصورة أو أحرف بديلة وslot للإجراءات.

## الاستخدام

```vue
<script setup lang="ts">
import { WUserBadge } from 'wakeb-components'
</script>
<template>
  <WUserBadge :user="{ name: 'Ada Lovelace', avatar: '/avatars/ada.png' }"><template #actions><button type="button">Remove</button></template></WUserBadge>
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `user` | `BadgeUser` | `{}` | بيانات العرض للاسم والصورة؛ الاسم نص آمن. |
| `type` | `string` | `"outline"` | نوع WBadge. |
| `borderRadius` | `string` | `"md"` | نصف قطر الشارة. |
| `icon` | `SharedIcon` | `""` | خاصية الأيقونة القديمة؛ الصورة تستبدل glyph. |
| `iconSize` | `string \| number` | `"xs"` | حجم glyph القديم؛ avatarSize يتحكم في الصورة. |
| `iconPosition` | `"before" \| "after"` | `"before"` | موضع الصورة بالنسبة للمحتوى. |
| `avatarSize` | `string \| number` | `16` | حجم صورة Vuetify. |
| `avatarColor` | `string` | `"primary"` | لون حاوية الأحرف في Vuetify. |

## الأحداث

لا توجد أحداث مخصصة؛ الأحداث العادية تستهدف حاوية الشارة.

## Slots

`avatar`: يستقبل `{ user, avatar, initials, size }`. `default`: يستقبل `{ user }` لاستبدال الاسم فقط. `actions`: بعد الاسم.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-user-badge-initials-size` | `8px` |

## الوصول وحدود السلوك

الخصائص والأحداث تستهدف حاوية WBadge ومتغيراته تخصص الشارة. الصور التي تبدأ بـhttp أو / أو data تعرض عبر VImg؛ الباقي يستخدم الأحرف. لا يوجد بديل تلقائي عند فشل تحميل الصورة، مثل الأصل. الاسم الفارغ أو — يعطي ?؛ المسافات فقط تعطي حرفًا فارغًا. الأحرف تحافظ على charAt(0) بوحدات UTF-16 لأول كلمتين. مرر كائنًا بحقول نصية؛ null غير مدعوم. الصورة زخرفية لأن الاسم بجوارها. الإجراءات تتصاعد طبيعيًا؛ أوقف التصاعد عند الحاجة. حجم الأحرف 8px يعمل دون Tailwind.

## جرّب بنفسك

<IdentityPlayground initial="user-badge" />
