# التخصيص

ابدأ بالعرض الافتراضي. props للبيانات وخيارات العرض، وslots لتبديل المحتوى.
تصل attributes والأحداث إلى العنصر الأساسي، أو span في WTruncatedText.
راجع صفحة كل مكون للعقد الكامل.

```vue
<WSegmentedProgress :value="65" aria-label="المساحة المستخدمة 65 بالمائة">
  <template #default="{ value }"><strong>{{ value }} GB</strong></template>
</WSegmentedProgress>
```

متغيرات CSS ذات prefix مستقل تفصل الحزمة عن ثيم المشروع:

```css
.project-gauge {
  --wakeb-gauge-color: #0050ff;
  --wakeb-gauge-highlight: #7f56d9;
  --wakeb-gauge-track-background: #eaecf0;
  --wakeb-gauge-text-color: #101828;
}
```

```vue
<WSemiCircleGauge class="project-gauge" :value="70" label="70%" />
<WTruncatedText label="نص طويل للعرض" :length="6"
  :tooltip-style="{ background: '#101828', color: '#fff' }" />
```

محتوى Tooltip يُنقل إلى overlay؛ استخدم tooltipStyle أو contentClass لتخصيصه.
متغير CSS على activator لا يصل تلقائيًا إلى العنصر المنقول. استخدم refs
وcomputed في التطبيق للحفاظ على التفاعل. يُورث RTL من dir، بينما Tooltip
يتبع اتجاه locale في Vuetify؛ احتفظ بإعداد اللغة الموجود في تطبيقك.
