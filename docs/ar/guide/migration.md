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


## 0.5.0

Tabs وTree وDropdown يحتفظون بمسارات الاستيراد في Aware. Tabs يمرر slots المحتوى ويترك تعديل لون SvgIcon داخل shadow DOM في adapter المشروع فقط. التنسيق والألوان تنتقل إلى متغيرات namespaced مع الحفاظ على سلوك tokens المفقودة. التركيب ومزامنة الأب لا يرسلان updateTab. Tree يحتفظ بالتحكم الخارجي في الفتح والاختيار وخطوط الربط والتعديل وslots. أسماء العناصر تظهر بكل الأعماق؛ slots الفارغة تستخدم بديل Vue مثل الأصل. WTree العام يضيف ARIA وتنقلًا بالكيبورد. Aware يستخدم keyboardNavigation=false للاحتفاظ بالتركيز الحالي. Dropdown يترجم عنوان الزر كاملًا من i18n المشروع ويعرض router-link وSvgIcon عبر slots؛ ألوان Aware وترتيب selectedItem ثم update:modelValue محفوظان.

| المسار | المكون |
| --- | --- |
| components/common/Tabs.vue | WTabs |
| components/common/Tree.vue | WTree |
| components/common/Dropdown.vue | WDropdown |


## 0.6.0

Carousel وExportDropdown وBaseSidebar يحتفظون بمسارات Aware الحالية. Carousel يظل بجذرين ويتجاهل خصائص fragment كما كان؛ hideDelimiters=true القديم يتحول إلى showIndicators=true، والمؤشرات تحتفظ بغياب type القديم. المشاريع الجديدة تستخدم showIndicators بمعناه المباشر ومؤشرات من نوع button. ExportDropdown يترك directive الصلاحيات على زر Aware الفعلي ويحافظ على أسماء SvgIcon والترجمة وقيمة select النصية. الحزمة العامة تختار الصيغة فقط؛ الصلاحيات وتوليد الملف في المشروع. BaseSidebar يترك GenericForm وsearchSchema وemitOnChange وupdateSchema داخل Aware عبر search slot. Tokens التدرج والأنماط العامة القديمة وأزرار وأيقونات الفلترة والترجمة في adapter. مواضع header وcontent وitem وfilter-modal وحالات التحميل والفراغ محفوظة.

| المسار | المكون |
| --- | --- |
| components/common/Carousel.vue | WCarousel |
| components/common/ExportDropdown.vue | WExportDropdown |
| components/common/BaseSidebar.vue | WBaseSidebar |

## النوافذ (0.7.0)

Modal وDrawer يحتفظان بمسارات Aware. يقابل isCloseable/ isLoading/ isDataLoaded خصائص closable/loading/dataLoaded في الحزمة، وcustomAction يقابل عكس showActions. يحافظ Modal على ظهور الرأس القديم وزخرفته وSvgIcon وترجمة الإغلاق؛ Drawer يحافظ على أسماء drawer-panel وتوقيت close من الزر فقط. إعدادات jervis-form تستمر في استخدام adapters؛ AddEditModal وschema والتحقق وخطوات الحفظ والصلاحيات وdrawerTarget غير المستخدم تبقى كما هي. العرض النصي في Drawer يستخدم parseInt كما كان.
