<!-- Generated from docs/reference-data.mjs -->
# WVerticalSteps

خطوات عرض بأيقونات وعناوين قابلة للاستبدال وعقد بيانات بسيط.

## الاستخدام

```vue
<script setup lang="ts">
import { WVerticalSteps } from 'wakeb-components'
</script>
<template>
  <WVerticalSteps :steps="[{ title: 'Review', is_active: true, time: '09:00', date: '2026-10-28' }, { title: 'Ship' }]" label="Release steps" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `steps` | `readonly VerticalStep[]` | `[]` | عناصر title/time/date/is_active. راجع نماذج البيانات. |
| `label` | `string` | `"Steps"` | اسم القائمة لقارئ الشاشة؛ ترجمه داخل المشروع. |

## Slots

`indicator` يستبدل العلامة بالكامل، و`icon` محتواها الافتراضي. `title` و`timeIcon` و`dateIcon`: كل منها يستقبل `{ step, index }`. الأيقونات الافتراضية رموز نصية ولا تحتاج خط أيقونات.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-steps-accent` | `#087f8c` |
| `--wakeb-steps-surface` | `#f9fafb` |
| `--wakeb-steps-text` | `currentColor` |
| `--wakeb-steps-active-text` | `#fff` |
| `--wakeb-steps-muted` | `#667085` |

## الوصول وحدود السلوك

يستخدم أدوار list/listitem. is_active حالة اكتمال مرئية، وليس تنقلًا تفاعليًا أو aria-current. المشروع يمرر التاريخ والوقت بعد التنسيق والترجمة. النص آمن من تفسير HTML. المفاتيح موضعية ولا توجد حالة اختيار داخلية. الاتجاهات منطقية ولا يحتاج framework للـutilities. نحافظ على تخطيط الصف الأفقي؛ اختبر النص الطويل في عرض المشروع المتاح.

## جرّب بنفسك

<ComponentPlayground initial="vertical-steps" />
