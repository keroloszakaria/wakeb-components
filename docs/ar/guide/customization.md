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


## مجموعات الشارات وأزرار المساعدة

WBadgeStack يوفر slots للأيقونة والصورة والاسم. مرر بيانات جاهزة للعرض واترك أيقونات الاكتشاف الخاصة بالمشروع داخله. menuStyle يخصص القائمة المنقولة وbadgeAttrs يخصص حاوية كل شارة. WUserBadge يوفر slots للصورة والاسم والإجراءات وحجم الأحرف عبر --wakeb-user-badge-initials-size. WTooltipBtn يستقبل text مترجمًا وخصائص VBtn وslot اختياريًا لـSVG. tooltipStyle يخصص Tooltip المنقول. راجع [المرجع](/ar/components/badge-stack) لكل الافتراضات والحدود.


## التنقل

استخدم tab-label وtab-icon لأيقونات المشروع ومحتوى التبويبات. حدّث activeKey وexpandedKeys في WTree من الأحداث، وضع الإجراءات في actions أو أوقف تصاعد نقرها. WDropdown يقبل labelFormatter وcolorMap وmenuStyle وrouter-link عبر item-label. التوجيه والترجمة والصلاحيات تظل في المشروع. راجع [Tabs](/ar/components/tabs) و[Tree](/ar/components/tree) و[Dropdown](/ar/components/dropdown) لكل العقود والافتراضات.


## الشرائح والتصدير والحاويات الجانبية

ضع WCarousel داخل أب position:relative وتحكم في التشغيل عبر cycle مع إيقاف ظاهر. استخدم slots للمحتوى والسابق والتالي. صيغ WExportDropdown بيانات typed والحدث select يترك توليد الملف للمشروع؛ الصلاحيات على activator slot. search في WBaseSidebar يربط أي فورم عبر search(payload)، وcontent يستبدل البحث والقائمة. متغيرات CSS تخصص التدرج والألوان والمؤشرات. راجع [Carousel](/ar/components/carousel) و[ExportDropdown](/ar/components/export-dropdown) و[BaseSidebar](/ar/components/base-sidebar).
