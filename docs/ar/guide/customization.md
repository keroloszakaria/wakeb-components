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


## أيقونات وحالات الأساس

WButton وWBadge يستخدمان VIcon كافتراضي؛ استخدم إعداد أيقونات Vuetify في المشروع أو مرر SVG عبر slots. WAccordion يستخدم WButton لمؤشراته. لا تحتاج الحزمة إلى SvgIcon عالمي أو صلاحيات أو i18n. لاسم زر أيقونة مرر aria-label، ومرر toggleLabel مترجمًا للـAccordion.

متغيرات --wakeb-button-fallback و--wakeb-badge-fallback و--wakeb-accordion-fallback محجوزة لطبقات التوافق؛ اتركها غير معرفة في الاستخدام العادي. تستخدم طبقة Aware sentinel غير صالح كقيمة CSS حتى تحتفظ القيم القديمة المفقودة بسلوك CSS الأصلي. خصص المظهر العادي بمتغيرات الألوان والمقاسات الموثقة.
