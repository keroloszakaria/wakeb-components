# الانتقال من Aware

تحافظ أول دفعة على مسارات التطبيق الحالية كـadapters صغيرة:

| المسار الحالي | المكون المشترك |
| --- | --- |
| components/common/TruncatedText.vue | WTruncatedText |
| components/common/SegmentedProgress.vue | WSegmentedProgress |
| components/common/SemiCircleGauge.vue | WSemiCircleGauge |
| `components/common/AvatarStack.vue` | `WAvatarStack` |
| `components/common/Loading.vue` | `WLoading` |
| `components/common/PageSkeleton.vue` | `WPageSkeleton` |
| `components/common/VerticalSteps.vue` | `WVerticalSteps` |

تربط adapters ألوان Aware بمتغيرات الحزمة وتحافظ على props الافتراضية.
لا تحتاج الشاشات الحالية تغيير الاستيراد. تستورد المشاريع الجديدة المكونات
بالاسم من wakeb-components وتختار ألوانها وثيمها.

يظل حصر النسب واختصار النص ورسم المقاسات الصحيحة كما كان. المكون العام
يحمي أيضًا من المقاسات والسمك غير الصالح، ويدمج أحداث المستهلك مع أحداث
Vuetify للوصول بالكيبورد. هذه تحسينات دفاعية موثقة ولا تغير منطق العمل.

تظل الأزرار وbadges والنماذج والجداول وlayouts والصلاحيات والبيانات والثيم
في Aware. تحتاج الدفعة التالية مراجعة مستقلة لاعتمادياتها وواجهتها العامة.


دفعة 0.2 تضيف تحسينات دفاعية: max والتكرار لا يقبلان السالب أو القيم غير المحدودة، وأسماء المستخدمين غير الصالحة تستخدم نصًا بديلًا. أيقونات الخطوات في Aware تبقى SvgIcon عبر slots. ألوان قائمة الصور تُمرر عبر menuStyle لأن Vuetify ينقلها خارج حاوية المكون. لا توجد ترجمة أو store داخل الحزمة.


## 0.3.0

Button وBadge وAccordion أصبحوا adapters أيضًا. SvgIcon يظل في Aware عبر slots، وCSS صغير يربط tokens المشروع بمتغيرات الحزمة مرة واحدة، ويحتفظ بسلوك CSS الأصلي عندما يكون token مفقودًا. مسارات الاستيراد وprops القديمة ثابتة، بما فيها loading وisLoading وform/action وclassList وترتيب الأيقونات. header الافتراضي في adapter يحتفظ بـspan القديم؛ زر العنوان القابل للكيبورد هو افتراضي WAccordion للمشاريع الجديدة. أزرار المؤشر تحصل على أسماء ARIA وحالة الفتح دون تغيير النقر أو المظهر. actions توقف تصاعد النقر، والمحتوى يستخدم v-show.

| المسار | المكون |
| --- | --- |
| components/common/Button.vue | WButton |
| components/common/Badge.vue | WBadge |
| components/common/Accordion.vue | WAccordion |


## 0.4.0

BadgeStack وUserBadge وTooltipBtn أصبحوا adapters. صور الدوائر الظاهرة في المجموعة تظل DetectionTypeIcon الخاص بثيم Aware، وصور القائمة تظل img عادية. حاوية القائمة div القديمة وتقصير الأسماء وتخصيص كل عنصر ونصف القطر والشفافية محفوظة. WBadgeStack العام يوفر زر قائمة HTML افتراضيًا وmenuStyle وbadgeAttrs لتنسيق القائمة المنقولة. UserBadge يحتفظ بصورة 16px والأحرف عبر charAt وترتيب actions وتصاعد الأحداث. TooltipBtn يترجم path من i18n المشروع ويحتفظ بـpath كاسم ARIA القديم، مع تمرير attrs للحاوية والزر كما كان، بما فيه سلوك المستمعين والتصاعد القديم. WTooltipBtn العام يستقبل text مترجمًا ويمرر الأحداث والخصائص للزر مرة واحدة. استخدم العقد العام الأبسط في المشاريع الجديدة.

| المسار | المكون |
| --- | --- |
| components/common/BadgeStack.vue | WBadgeStack |
| components/common/UserBadge.vue | WUserBadge |
| components/common/TooltipBtn.vue | WTooltipBtn |
