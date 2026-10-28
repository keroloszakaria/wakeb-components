export default [
  {
    "name": "WTruncatedText",
    "slug": "truncated-text",
    "interface": "TruncatedTextProps",
    "summary": [
      "Readable shortened text with a keyboard-accessible Vuetify tooltip.",
      "نص مختصر مع Tooltip من Vuetify يعمل عند التركيز بالكيبورد."
    ],
    "props": [
      [
        "label",
        "string",
        "\"\"",
        "The full label; HTML is escaped.",
        "النص الكامل؛ لا يُفسر كـHTML."
      ],
      [
        "length",
        "number",
        "12",
        "Maximum UTF-16 length including the three-dot suffix.",
        "الطول بوحدات UTF-16 ويشمل النقاط الثلاث."
      ],
      [
        "tooltipLocation",
        "\"top\" | \"bottom\" | \"start\" | \"end\"",
        "\"top\"",
        "Tooltip placement through Vuetify.",
        "موضع Tooltip من خلال Vuetify."
      ],
      [
        "tooltipMaxWidth",
        "string | number",
        "280",
        "Tooltip maximum width.",
        "أقصى عرض للـTooltip."
      ],
      [
        "contentClass",
        "string",
        "\"wakeb-truncated-tooltip\"",
        "Class on the teleported tooltip content.",
        "class على محتوى Tooltip المنقول إلى overlay."
      ],
      [
        "tooltipStyle",
        "CSSProperties",
        "undefined",
        "Inline styles on the actual tooltip content, including its colors.",
        "styles على محتوى Tooltip نفسه، بما فيها الألوان."
      ]
    ],
    "slots": [
      "`default`: `{ text, label, truncated }`. The fallback renders shortened text.",
      "`default`: يستقبل `{ text, label, truncated }`. المحتوى الافتراضي هو النص المختصر."
    ],
    "variables": [
      [
        "--wakeb-text-focus-color",
        "Vuetify primary / #087f5b"
      ]
    ],
    "limits": [
      "The span receives DOM attributes and listeners. Focus/hover handlers are composed with Vuetify. Truncated labels get tabindex=0 and the full aria-label; short labels add no tab stop. Text truncation preserves Wakeb Utils behavior, including limits below 3 and UTF-16 emoji splitting. Tooltip location and delays follow Vuetify.",
      "تصل attributes والأحداث إلى span، وتُدمج أحداث التركيز مع Vuetify. النص المختصر قابل للتركيز وله aria-label كامل؛ النص القصير لا يضيف tab stop. نحافظ على سلوك Wakeb Utils: حد أقل من 3 يرجع النقاط الثلاث، وقد ينقسم emoji بسبب UTF-16. موضع Tooltip وتوقيته يتبعان Vuetify."
    ],
    "example": "<WTruncatedText label=\"A shared foundation for every team\" :length=\"20\" />"
  },
  {
    "name": "WSegmentedProgress",
    "slug": "segmented-progress",
    "interface": "SegmentedProgressProps",
    "summary": [
      "A striped progress display with numeric accessibility semantics.",
      "شريط تقدم مخطط بقيمة وحدود واضحة لقارئات الشاشة."
    ],
    "props": [
      [
        "value",
        "number",
        "0",
        "Percentage, normalized to 0–100; NaN becomes 0.",
        "النسبة؛ تُحصر بين 0 و100 وتصبح NaN صفرًا."
      ],
      [
        "label",
        "string",
        "\"\"",
        "Visible label within the filled segment.",
        "النص الظاهر داخل الجزء الممتلئ."
      ],
      [
        "color",
        "string",
        "var(--wakeb-progress-color, #12b76a)",
        "Any CSS color, including a CSS variable.",
        "أي لون CSS، بما فيه متغير CSS."
      ],
      [
        "ariaLabel",
        "string",
        "\"\"",
        "Accessible name; defaults to label, then the percentage.",
        "اسم لقارئ الشاشة؛ الافتراضي label ثم النسبة."
      ]
    ],
    "slots": [
      "`default`: `{ value, label }`, inside the filled segment.",
      "`default`: يستقبل `{ value, label }` داخل الجزء الممتلئ."
    ],
    "variables": [
      [
        "--wakeb-progress-color",
        "#12b76a"
      ],
      [
        "--wakeb-progress-height",
        "34px"
      ],
      [
        "--wakeb-progress-surface",
        "#fff"
      ],
      [
        "--wakeb-progress-track-background",
        "#f2f4f7"
      ],
      [
        "--wakeb-progress-track-border",
        "#d0d5dd"
      ]
    ],
    "limits": [
      "Uses role=progressbar and aria-valuemin/aria-valuemax/aria-valuenow. A zero value has no fill or visible label, but retains its accessible name. At 100 there is no empty track. Layout follows inherited direction; animations respect reduced motion. The component has no network or state-store side effects.",
      "يستخدم role=progressbar وحدود وقيمة ARIA. عند صفر لا يظهر جزء ممتلئ أو label مرئي، ويظل الاسم متاحًا لقارئ الشاشة. عند 100 يختفي الجزء الفارغ. الاتجاه موروث، والحركة تحترم reduced motion. لا توجد طلبات شبكة أو حالة مخزنة داخله."
    ],
    "example": "<WSegmentedProgress :value=\"65\" label=\"65%\" color=\"#0050ff\" />"
  },
  {
    "name": "WSemiCircleGauge",
    "slug": "semi-circle-gauge",
    "interface": "SemiCircleGaugeProps",
    "summary": [
      "A responsive SVG gauge with isolated gradient IDs and a value slot.",
      "مؤشر SVG نصف دائري، بعرّافات gradients مستقلة وslot للمحتوى."
    ],
    "props": [
      [
        "value",
        "number",
        "0",
        "Percentage normalized to 0–100; NaN becomes 0.",
        "النسبة بين 0 و100؛ تصبح NaN صفرًا."
      ],
      [
        "size",
        "number",
        "154",
        "Positive finite size in pixels; invalid sizes fall back to 154.",
        "حجم موجب ومحدود بالبكسل؛ القيم غير الصالحة ترجع إلى 154."
      ],
      [
        "thickness",
        "number",
        "0",
        "0 means 23.6% of size; positive values are capped at half the size.",
        "الصفر يعني 23.6% من الحجم، ويُحصر السمك الموجب عند نصف الحجم."
      ],
      [
        "label",
        "string",
        "\"\"",
        "Main visual label.",
        "القيمة أو النص الأساسي الظاهر."
      ],
      [
        "subLabel",
        "string",
        "\"\"",
        "Small text above the main label.",
        "نص صغير فوق القيمة الأساسية."
      ],
      [
        "ariaLabel",
        "string",
        "\"\"",
        "Accessible description; defaults to the normalized percentage.",
        "وصف لقارئ الشاشة؛ الافتراضي النسبة بعد الحصر."
      ]
    ],
    "slots": [
      "`default`: `{ value, label, subLabel }`, replacing visual center text.",
      "`default`: يستقبل `{ value, label, subLabel }` بدل النص الداخلي."
    ],
    "variables": [
      [
        "--wakeb-gauge-color",
        "#12b76a"
      ],
      [
        "--wakeb-gauge-highlight",
        "gauge color"
      ],
      [
        "--wakeb-gauge-track-background",
        "#f2f4f7"
      ],
      [
        "--wakeb-gauge-track-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-gauge-needle-color",
        "#fff"
      ],
      [
        "--wakeb-gauge-text-color",
        "currentColor"
      ],
      [
        "--wakeb-gauge-muted-color",
        "#667085"
      ]
    ],
    "limits": [
      "SVG role=img exposes the percentage or ariaLabel; decorative center text is aria-hidden. Vue useId keeps SVG references distinct and stable across SSR requests. RTL mirrors geometry only; text remains readable. Invalid geometry is normalized; animations honor reduced motion. Size is the full gauge width; the arc is half-height.",
      "يقرأ قارئ الشاشة النسبة أو ariaLabel عبر SVG بدور img، ويُخفى النص الزخرفي المكرر عن ARIA. Vue useId يمنع تداخل عرّافات SVG ويدعم SSR. ينعكس الرسم في RTL ولا ينعكس النص. تُصحح الأبعاد غير الصالحة، وتُحترم reduced motion. size هو العرض الكامل، وارتفاع القوس نصفه."
    ],
    "example": "<WSemiCircleGauge :value=\"75\" label=\"75%\" sub-label=\"Quality\" aria-label=\"Quality: 75 percent\" />"
  },
  {
    "name": "WAvatarStack",
    "slug": "avatar-stack",
    "interface": "AvatarStackProps",
    "summary": [
      "Overlapping avatars with nested data fields and an accessible overflow menu.",
      "صور متداخلة، مع حقول بيانات متداخلة وقائمة overflow قابلة للفتح بالكيبورد."
    ],
    "props": [
      [
        "items",
        "readonly unknown[]",
        "[]",
        "Entries; null or malformed entries use fallback labels.",
        "العناصر؛ القيم المفقودة أو غير الصالحة تستخدم النص البديل."
      ],
      [
        "max",
        "number",
        "3",
        "Visible count; finite values are floored and clamped to zero, NaN/infinity use 3.",
        "العدد الظاهر؛ يُقرب لأسفل ويُحصر عند صفر. القيم غير المحدودة تستخدم 3."
      ],
      [
        "size",
        "string | number",
        "32",
        "Vuetify avatar size.",
        "حجم الصورة عبر Vuetify."
      ],
      [
        "avatarColor",
        "string",
        "\"primary\"",
        "Initials and overflow background; image avatars retain primary.",
        "خلفية الحروف والعدد الإضافي؛ الصور تستخدم primary."
      ],
      [
        "showOverflowMenu",
        "boolean",
        "false",
        "Show remaining users in a Vuetify menu.",
        "عرض باقي المستخدمين في قائمة Vuetify."
      ],
      [
        "showTooltip",
        "boolean",
        "true",
        "Enable focus/hover tooltips for visible users.",
        "تفعيل Tooltip بالتركيز أو المرور على المستخدمين الظاهرين."
      ],
      [
        "itemKey",
        "string",
        "\"id\"",
        "Dot path for a string/number key; index fallback.",
        "مسار بالنقاط لمفتاح نصي أو رقمي؛ البديل index."
      ],
      [
        "nameKey",
        "string",
        "\"name\"",
        "Dot path for a display name.",
        "مسار اسم العرض."
      ],
      [
        "avatarKey",
        "string",
        "\"avatar\"",
        "Dot path for the image URL.",
        "مسار رابط الصورة."
      ],
      [
        "unknownLabel",
        "string",
        "\"Unknown user\"",
        "Localize missing names; missing initials render ?.",
        "ترجمة الاسم البديل؛ الحروف المفقودة تظهر ?."
      ],
      [
        "overflowLabel",
        "string",
        "\"\"",
        "Accessible name of overflow; defaults to +count.",
        "الاسم المساعد للعدد الإضافي؛ الافتراضي +count."
      ],
      [
        "menuStyle",
        "CSSProperties",
        "{}",
        "Styles on the teleported menu, including its CSS variables.",
        "styles ومتغيرات CSS على القائمة المنقولة إلى overlay."
      ],
      [
        "tooltipStyle",
        "CSSProperties",
        "{}",
        "Styles on the teleported tooltip content.",
        "styles على محتوى Tooltip المنقول."
      ]
    ],
    "slots": [
      "`avatar`: `{ item, index, label, avatar, initials }`; replaces each visible avatar. `overflow`: `{ count }`; replaces the +count text.",
      "`avatar`: يستقبل `{ item, index, label, avatar, initials }` لاستبدال الصورة. `overflow`: يستقبل `{ count }` لاستبدال نص العدد."
    ],
    "variables": [
      [
        "--wakeb-avatar-border",
        "Vuetify surface / white"
      ],
      [
        "--wakeb-avatar-overlap",
        "-10px"
      ],
      [
        "--wakeb-avatar-focus",
        "Vuetify primary / #087f8c"
      ],
      [
        "--wakeb-avatar-menu-surface",
        "Vuetify surface / white"
      ],
      [
        "--wakeb-avatar-menu-text",
        "Vuetify on-surface / #101828"
      ]
    ],
    "limits": [
      "Visible avatars have full accessible names and gain a tab stop only when tooltips are enabled. Overflow is a real button when the menu is enabled; click, keyboard activation and hover use Vuetify. Without a menu it is a static named image. Duplicate item keys are the caller’s responsibility. Only own-property dot paths are read; names are escaped text. Image paths accept http-prefixed, slash-relative or data URLs; image fetching follows the browser and Vuetify. Fallback initials use the first Unicode code point of two words. No i18n/store instance is needed. Teleported menu variables belong in menuStyle; tooltip styling belongs in tooltipStyle.",
      "للصور اسم مساعد كامل، وتصبح قابلة للتركيز عند تفعيل Tooltip فقط. العدد الإضافي زر فعلي عند تفعيل القائمة ويعمل بالنقر والكيبورد والمرور من خلال Vuetify، وإلا فهو صورة نصية ثابتة. المفاتيح المكررة مسؤولية المستهلك. تُقرأ مسارات الحقول المملوكة للكائن فقط وتُعرض الأسماء كنصوص آمنة. روابط الصور تدعم http والمسار الذي يبدأ بشرطة مائلة وdata؛ التحميل يتبع المتصفح وVuetify. الحروف البديلة من أول Unicode code point لأول كلمتين. لا يحتاج i18n أو store. تخصيص القائمة المنقولة عبر menuStyle والـTooltip عبر tooltipStyle."
    ],
    "example": "<WAvatarStack :items=\"[{ id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Grace Hopper' }]\" :max=\"1\" show-overflow-menu overflow-label=\"More people\" />"
  },
  {
    "name": "WLoading",
    "slug": "loading",
    "interface": "LoadingProps",
    "summary": [
      "A named loading status with a Vuetify circular indicator.",
      "حالة تحميل باسم قابل للترجمة ومؤشر دائري من Vuetify."
    ],
    "props": [
      [
        "size",
        "string | number",
        "50",
        "Vuetify spinner size.",
        "حجم مؤشر Vuetify."
      ],
      [
        "color",
        "string",
        "\"primary\"",
        "Vuetify theme key or CSS color.",
        "لون CSS أو اسم لون في ثيم Vuetify."
      ],
      [
        "label",
        "string",
        "\"Loading\"",
        "Accessible loading status; supply translated text.",
        "اسم حالة التحميل لقارئ الشاشة؛ مرر ترجمة المشروع."
      ]
    ],
    "slots": [
      "`default`: replaces the spinner; the named status container stays.",
      "`default`: يستبدل المؤشر مع الاحتفاظ بحاوية الحالة واسمها."
    ],
    "variables": [],
    "limits": [
      "The root is role=status; the default spinner is decorative and aria-hidden to avoid duplicate announcements. Centering works without utility CSS. The component has no timer, request or loading state of its own; mount/unmount it from the host. Vue/Vuetify owns indicator animation.",
      "الحاوية role=status والمؤشر الافتراضي زخرفي ومخفي عن ARIA لمنع تكرار القراءة. التوسيط يعمل دون utility CSS. لا يوجد مؤقت أو طلب شبكة أو حالة تحميل داخلية؛ المشروع يتحكم في ظهور المكون. حركة المؤشر تتبع Vuetify."
    ],
    "example": "<WLoading label=\"Loading report\" :size=\"50\" />"
  },
  {
    "name": "WPageSkeleton",
    "slug": "page-skeleton",
    "interface": "PageSkeletonProps",
    "summary": [
      "Responsive Vuetify skeleton rows driven by typed descriptors.",
      "صفوف Skeleton متجاوبة من Vuetify بوصف بيانات typed."
    ],
    "props": [
      [
        "config",
        "readonly SkeletonRow[]",
        "required",
        "Row descriptors; empty arrays render an empty status. See Data models.",
        "وصف الصفوف؛ المصفوفة الفارغة تعرض حالة فارغة. راجع نماذج البيانات."
      ],
      [
        "direction",
        "\"row\" | \"column\"",
        "\"column\"",
        "Root flex direction, independent of Tailwind.",
        "اتجاه flex للحاوية دون الاعتماد على Tailwind."
      ],
      [
        "label",
        "string",
        "\"Loading content\"",
        "Accessible status name; localize in the host.",
        "اسم الحالة لقارئ الشاشة؛ ترجمه داخل المشروع."
      ]
    ],
    "slots": [
      "No slots; compose rows with config, header/items, classes and Vuetify grid breakpoints.",
      "لا توجد slots؛ التكوين عبر config وheader/items وclasses ونقاط توقف Vuetify."
    ],
    "variables": [
      [
        "--wakeb-skeleton-surface",
        "#fff"
      ],
      [
        "--wakeb-skeleton-border",
        "#eaecf0"
      ]
    ],
    "limits": [
      "Uses one named role=status and aria-busy=true; skeleton rows are aria-hidden to prevent duplicate announcements. Render this component only while content is loading. Row repeat is floored; missing, nonfinite, zero or negative repeats render one column. cols defaults to 12 when falsy, preserving the app contract; sm/md/lg follow Vuetify. Skeleton type strings are Vuetify types, including its comma/multiplier syntax. No application CSS is required. Current specialized card bone styling targets Vuetify 3 structure.",
      "يستخدم حالة واحدة باسم role=status وaria-busy=true مع إخفاء الصفوف الزخرفية عن ARIA لمنع تكرار القراءة؛ اعرضه أثناء التحميل فقط. repeat يُقرب لأسفل؛ القيم المفقودة وغير المحدودة والصفر والسالب تنتج عمودًا واحدًا. cols الافتراضي 12 للقيم الفارغة وفق العقد السابق، وsm/md/lg تتبع Vuetify. type يدعم صيغة أنواع Skeleton في Vuetify بما فيها الفواصل والتكرار. لا يحتاج CSS خاص بالمشروع. تخصيص عظام card يستهدف بنية Vuetify 3."
    ],
    "example": "<WPageSkeleton :config=\"[{ repeat: 2, cols: 12, md: 6, variant: 'card', items: [{ type: 'text' }, { type: 'paragraph' }] }]\" label=\"Loading report\" />"
  },
  {
    "name": "WVerticalSteps",
    "slug": "vertical-steps",
    "interface": "VerticalStepsProps",
    "summary": [
      "Presentational steps with replaceable icons, title slots and a plain data contract.",
      "خطوات عرض بأيقونات وعناوين قابلة للاستبدال وعقد بيانات بسيط."
    ],
    "props": [
      [
        "steps",
        "readonly VerticalStep[]",
        "[]",
        "title/time/date/is_active descriptors. See Data models.",
        "عناصر title/time/date/is_active. راجع نماذج البيانات."
      ],
      [
        "label",
        "string",
        "\"Steps\"",
        "Accessible list name; localize in the host.",
        "اسم القائمة لقارئ الشاشة؛ ترجمه داخل المشروع."
      ]
    ],
    "slots": [
      "`indicator` replaces the complete marker; `icon` replaces the default marker content. `title`, `timeIcon`, `dateIcon`: each receives `{ step, index }`. Fallback icons are simple text symbols; no icon font is required.",
      "`indicator` يستبدل العلامة بالكامل، و`icon` محتواها الافتراضي. `title` و`timeIcon` و`dateIcon`: كل منها يستقبل `{ step, index }`. الأيقونات الافتراضية رموز نصية ولا تحتاج خط أيقونات."
    ],
    "variables": [
      [
        "--wakeb-steps-accent",
        "#087f8c"
      ],
      [
        "--wakeb-steps-surface",
        "#f9fafb"
      ],
      [
        "--wakeb-steps-text",
        "currentColor"
      ],
      [
        "--wakeb-steps-active-text",
        "#fff"
      ],
      [
        "--wakeb-steps-muted",
        "#667085"
      ]
    ],
    "limits": [
      "Uses list/listitem roles. is_active is a visual completion flag, not interactive navigation or aria-current. The host supplies formatted date/time strings and translations. Text is escaped. Steps use positional keys and do not own selection state. Layout uses logical directions and needs no utility framework. This preserves the horizontal row layout; long content should be tested in the host’s available width.",
      "يستخدم أدوار list/listitem. is_active حالة اكتمال مرئية، وليس تنقلًا تفاعليًا أو aria-current. المشروع يمرر التاريخ والوقت بعد التنسيق والترجمة. النص آمن من تفسير HTML. المفاتيح موضعية ولا توجد حالة اختيار داخلية. الاتجاهات منطقية ولا يحتاج framework للـutilities. نحافظ على تخطيط الصف الأفقي؛ اختبر النص الطويل في عرض المشروع المتاح."
    ],
    "example": "<WVerticalSteps :steps=\"[{ title: 'Review', is_active: true, time: '09:00', date: '2026-10-28' }, { title: 'Ship' }]\" label=\"Release steps\" />"
  },
  {
    "name": "WButton",
    "slug": "button",
    "interface": "ButtonProps",
    "summary": [
      "Vuetify buttons with explicit states, icon slots and semantic style variables.",
      "زر Vuetify بحالات واضحة وslots للأيقونات ومتغيرات ألوان مستقلة."
    ],
    "props": [
      [
        "isTooltip",
        "boolean",
        "false",
        "Icon-only tooltip branch using title as the tooltip text.",
        "فرع زر الأيقونة مع Tooltip نصه title."
      ],
      [
        "location",
        "\"top\" | \"bottom\" | \"start\" | \"end\"",
        "\"top\"",
        "Tooltip placement.",
        "موضع Tooltip."
      ],
      [
        "title",
        "string",
        "\"\"",
        "Escaped button text; an empty title uses the content slot.",
        "نص آمن؛ title الفارغ يستخدم content slot."
      ],
      [
        "classList",
        "ComponentClass",
        "\"\"",
        "Classes on the actual Vuetify button.",
        "classes على الزر الفعلي."
      ],
      [
        "iconPosition",
        "\"start\" | \"end\"",
        "\"start\"",
        "Icon location around a nonempty title.",
        "موضع الأيقونة حول العنوان."
      ],
      [
        "type",
        "string",
        "\"primary\"",
        "primary/secondary/outline/danger/tertiary/link/icon/table-icon/text; custom strings add classes.",
        "الأنواع primary/secondary/outline/danger/tertiary/link/icon/table-icon/text؛ القيم الأخرى تضيف classes فقط."
      ],
      [
        "size",
        "string",
        "\"lg\"",
        "xl/lg/md/sm; custom strings need consumer CSS.",
        "المقاسات xl/lg/md/sm؛ القيم الأخرى تحتاج CSS من المستهلك."
      ],
      [
        "isLoading",
        "boolean",
        "false",
        "Vuetify loading indicator plus the shared loading style.",
        "مؤشر تحميل Vuetify مع تنسيق التحميل العام."
      ],
      [
        "isDropdown",
        "boolean",
        "false",
        "Append the dropdown slot or Vuetify $expand icon.",
        "إضافة dropdown slot أو أيقونة Vuetify $expand."
      ],
      [
        "action",
        "\"button\" | \"submit\" | \"reset\"",
        "\"button\"",
        "Native HTML button type.",
        "نوع زر HTML الفعلي."
      ],
      [
        "disabled",
        "boolean",
        "false",
        "Native disabled state.",
        "حالة تعطيل HTML."
      ],
      [
        "icon",
        "SharedIcon",
        "\"\"",
        "Vuetify icon value, or the value passed to the icon slot.",
        "أيقونة Vuetify أو القيمة الممررة إلى icon slot."
      ],
      [
        "iconSize",
        "string | number",
        "\"sm\"",
        "xs/sm/md/lg/xl map to 16/20/24/32/40px; free uses Vuetify default.",
        "xs/sm/md/lg/xl تعني 16/20/24/32/40px؛ free يستخدم افتراضي Vuetify."
      ],
      [
        "maxIconWidth",
        "string | number",
        "\"100%\"",
        "Maximum icon width; numeric fallback widths use px.",
        "أقصى عرض للأيقونة؛ الرقم يُحول إلى px في العرض الافتراضي."
      ],
      [
        "iconColorType",
        "\"danger\" | \"primary\" | \"success\" | \"warning\" | \"currentColor\"",
        "\"currentColor\"",
        "Semantic icon role, resolved through namespaced CSS variables.",
        "لون دلالي للأيقونة من متغيرات CSS المستقلة."
      ],
      [
        "customIconColor",
        "string",
        "\"\"",
        "Explicit icon color; takes precedence over the role.",
        "لون صريح للأيقونة وله الأولوية."
      ],
      [
        "wrapperAttrs",
        "Record<string, unknown>",
        "{}",
        "Explicit attributes for the outer layout div; normal attrs target the button.",
        "attributes صريحة لحاوية div الخارجية؛ attributes العادية تصل إلى الزر."
      ]
    ],
    "slots": [
      "`icon` and `dropdown`: `{ icon, size, color, maxWidth }`. `content` (or `default` fallback): content when title is empty and isTooltip=false. Tooltip mode renders the icon only. The fallback icon renderer is VIcon; configure the host Vuetify icon set/font or provide slots.",
      "`icon` و`dropdown`: يستقبلان `{ icon, size, color, maxWidth }`. `content` أو `default` كبديل: محتوى عند فراغ title وisTooltip=false. وضع Tooltip يعرض الأيقونة فقط. العرض الافتراضي يستخدم VIcon؛ جهز مجموعة/خط أيقونات Vuetify في المشروع أو استخدم slots."
    ],
    "variables": [
      [
        "--wakeb-button-danger-background",
        "#d92d20"
      ],
      [
        "--wakeb-button-danger-border",
        "transparent"
      ],
      [
        "--wakeb-button-danger-color",
        "#fff"
      ],
      [
        "--wakeb-button-danger-disabled-background",
        "#eaecf0"
      ],
      [
        "--wakeb-button-danger-disabled-border",
        "#eaecf0"
      ],
      [
        "--wakeb-button-danger-disabled-color",
        "#98a2b3"
      ],
      [
        "--wakeb-button-danger-disabled-opacity",
        ".5"
      ],
      [
        "--wakeb-button-danger-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-danger-hover-background",
        "#b42318"
      ],
      [
        "--wakeb-button-danger-hover-border",
        "transparent"
      ],
      [
        "--wakeb-button-danger-loading-background",
        "#d92d20"
      ],
      [
        "--wakeb-button-danger-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-disabled-text",
        "#667085"
      ],
      [
        "--wakeb-button-fallback",
        "not defined (normal per-token defaults)"
      ],
      [
        "--wakeb-button-icon-background",
        "transparent"
      ],
      [
        "--wakeb-button-icon-color",
        "#344054"
      ],
      [
        "--wakeb-button-icon-hover-background",
        "transparent"
      ],
      [
        "--wakeb-button-icon-hover-color",
        "#344054"
      ],
      [
        "--wakeb-button-icon-primary",
        "#087f8c"
      ],
      [
        "--wakeb-button-icon-success",
        "#12b76a"
      ],
      [
        "--wakeb-button-icon-warning",
        "#f79009"
      ],
      [
        "--wakeb-button-link-color",
        "#344054"
      ],
      [
        "--wakeb-button-link-disabled-opacity",
        ".5"
      ],
      [
        "--wakeb-button-link-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-link-hover-color",
        "#344054"
      ],
      [
        "--wakeb-button-link-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-outline-background",
        "transparent"
      ],
      [
        "--wakeb-button-outline-border",
        "transparent"
      ],
      [
        "--wakeb-button-outline-color",
        "#344054"
      ],
      [
        "--wakeb-button-outline-danger-text",
        "#b42318"
      ],
      [
        "--wakeb-button-outline-disabled-background",
        "#eaecf0"
      ],
      [
        "--wakeb-button-outline-disabled-border",
        "#eaecf0"
      ],
      [
        "--wakeb-button-outline-disabled-color",
        "#98a2b3"
      ],
      [
        "--wakeb-button-outline-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-outline-hover-background",
        "transparent"
      ],
      [
        "--wakeb-button-outline-hover-border",
        "transparent"
      ],
      [
        "--wakeb-button-outline-loading-background",
        "transparent"
      ],
      [
        "--wakeb-button-outline-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-primary-background",
        "#087f8c"
      ],
      [
        "--wakeb-button-primary-border",
        "transparent"
      ],
      [
        "--wakeb-button-primary-color",
        "#fff"
      ],
      [
        "--wakeb-button-primary-disabled-background",
        "#eaecf0"
      ],
      [
        "--wakeb-button-primary-disabled-border",
        "#eaecf0"
      ],
      [
        "--wakeb-button-primary-disabled-color",
        "#98a2b3"
      ],
      [
        "--wakeb-button-primary-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-primary-hover-background",
        "#066b75"
      ],
      [
        "--wakeb-button-primary-hover-border",
        "transparent"
      ],
      [
        "--wakeb-button-primary-loading-background",
        "#087f8c"
      ],
      [
        "--wakeb-button-primary-loading-border",
        "transparent"
      ],
      [
        "--wakeb-button-primary-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-radius",
        "12px"
      ],
      [
        "--wakeb-button-secondary-background",
        "#f2f4f7"
      ],
      [
        "--wakeb-button-secondary-border",
        "transparent"
      ],
      [
        "--wakeb-button-secondary-color",
        "#344054"
      ],
      [
        "--wakeb-button-secondary-disabled-background",
        "#eaecf0"
      ],
      [
        "--wakeb-button-secondary-disabled-border",
        "#eaecf0"
      ],
      [
        "--wakeb-button-secondary-disabled-color",
        "#98a2b3"
      ],
      [
        "--wakeb-button-secondary-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-secondary-hover-background",
        "#f2f4f7"
      ],
      [
        "--wakeb-button-secondary-hover-border",
        "transparent"
      ],
      [
        "--wakeb-button-secondary-loading-background",
        "#f2f4f7"
      ],
      [
        "--wakeb-button-secondary-surface",
        "#f2f4f7"
      ],
      [
        "--wakeb-button-secondary-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-secondary-text",
        "#344054"
      ],
      [
        "--wakeb-button-size-lg-font-size",
        "1rem"
      ],
      [
        "--wakeb-button-size-lg-gap",
        "6px"
      ],
      [
        "--wakeb-button-size-lg-padding",
        "10px 16px"
      ],
      [
        "--wakeb-button-size-md-font-size",
        ".875rem"
      ],
      [
        "--wakeb-button-size-md-gap",
        "4px"
      ],
      [
        "--wakeb-button-size-md-padding",
        "10px 14px"
      ],
      [
        "--wakeb-button-size-sm-font-size",
        ".75rem"
      ],
      [
        "--wakeb-button-size-sm-gap",
        "4px"
      ],
      [
        "--wakeb-button-size-sm-padding",
        "8px 12px"
      ],
      [
        "--wakeb-button-size-xl-font-size",
        "1.125rem"
      ],
      [
        "--wakeb-button-size-xl-gap",
        "6px"
      ],
      [
        "--wakeb-button-size-xl-padding",
        "12px 18px"
      ],
      [
        "--wakeb-button-table-icon-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-color",
        "#344054"
      ],
      [
        "--wakeb-button-table-icon-delete-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-delete-border",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-delete-color",
        "#344054"
      ],
      [
        "--wakeb-button-table-icon-edit-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-edit-border",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-edit-color",
        "#344054"
      ],
      [
        "--wakeb-button-table-icon-radius",
        "8px"
      ],
      [
        "--wakeb-button-table-icon-restore-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-restore-border",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-restore-color",
        "#344054"
      ],
      [
        "--wakeb-button-table-icon-unlock-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-unlock-border",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-unlock-color",
        "#344054"
      ],
      [
        "--wakeb-button-table-icon-view-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-view-border",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-view-color",
        "#344054"
      ],
      [
        "--wakeb-button-tertiary-background",
        "transparent"
      ],
      [
        "--wakeb-button-tertiary-border",
        "transparent"
      ],
      [
        "--wakeb-button-tertiary-color",
        "#344054"
      ],
      [
        "--wakeb-button-tertiary-disabled-background",
        "#eaecf0"
      ],
      [
        "--wakeb-button-tertiary-disabled-border",
        "#eaecf0"
      ],
      [
        "--wakeb-button-tertiary-disabled-color",
        "#98a2b3"
      ],
      [
        "--wakeb-button-tertiary-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-tertiary-hover-background",
        "transparent"
      ],
      [
        "--wakeb-button-tertiary-loading-background",
        "transparent"
      ],
      [
        "--wakeb-button-tertiary-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-text-color",
        "#344054"
      ],
      [
        "--wakeb-button-text-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-text-hover-color",
        "#344054"
      ]
    ],
    "limits": [
      "The native element keeps form/type, disabled state and Vuetify aria-busy behavior. Click emits its original MouseEvent once; .stop/.prevent can be used by the host. Native keyboard activation is left to the browser. Icon-only buttons need an aria-label; tooltip buttons use title as a fallback accessible name. Tooltip focus listeners are composed with consumer listeners. Loading blocks ordinary pointer interaction through Vuetify/CSS; direct synthetic event dispatch is not a request-lock mechanism. A native loading attr also reaches VBtn and does not add the isLoading style class. Reduced-motion settings remove shared transitions. The outer div is retained for layout; wrapperAttrs does not redirect native attrs. Unknown variants/sizes are extension classes. The compatibility-only --wakeb-button-fallback switch is reserved for adapters; leave it undefined for normal defaults.",
      "الزر يحتفظ بـform/type والتعطيل وaria-busy من Vuetify. click يمرر MouseEvent الأصلي مرة واحدة ويدعم .stop/.prevent. التفعيل بالكيبورد يتبع المتصفح. زر الأيقونة يحتاج aria-label؛ زر Tooltip يستخدم title كاسم بديل. أحداث التركيز تُدمج مع أحداث Vuetify. التحميل يمنع تفاعل المؤشر العادي عبر Vuetify/CSS، وإرسال حدث صناعي ليس بديلًا لقفل الطلبات. attribute باسم loading يصل أيضًا إلى VBtn دون إضافة class الخاصة بـisLoading. reduced-motion يلغي transitions المشتركة. div الخارجية مخصصة للتخطيط؛ wrapperAttrs لا يغيّر وجهة attributes العادية. الأنواع والمقاسات غير المعروفة classes للتوسعة. متغير --wakeb-button-fallback مخصص للتوافق؛ اتركه غير معرف لاستخدام القيم الافتراضية."
    ],
    "example": "<WButton title=\"Save changes\" action=\"submit\" type=\"primary\" />",
    "playground": "FoundationPlayground",
    "events": [
      "`click(event: MouseEvent)` — original native event, once per activation.",
      "`click(event: MouseEvent)` — الحدث الأصلي مرة واحدة لكل تفعيل."
    ]
  },
  {
    "name": "WBadge",
    "slug": "badge",
    "interface": "BadgeProps",
    "summary": [
      "Semantic chips with independent colors, dot styles and ordered icon/action slots.",
      "شارات بألوان دلالية ونقطة قابلة للتخصيص وترتيب ثابت للأيقونة والـactions."
    ],
    "props": [
      [
        "label",
        "string",
        "\"\"",
        "Escaped fallback content.",
        "النص الافتراضي الآمن."
      ],
      [
        "classList",
        "ComponentClass",
        "\"\"",
        "Classes on the chip.",
        "classes على الشارة."
      ],
      [
        "type",
        "string",
        "\"primary\"",
        "primary/success/danger/warning/info/outline/outline-secondary/transparent/dark/tertiary/success-transparent/danger-transparent; custom classes are allowed.",
        "أنواع primary/success/danger/warning/info/outline/outline-secondary/transparent/dark/tertiary/success-transparent/danger-transparent مع دعم classes مخصصة."
      ],
      [
        "icon",
        "SharedIcon",
        "\"\"",
        "Vuetify icon value or icon-slot value.",
        "أيقونة Vuetify أو قيمة icon slot."
      ],
      [
        "isDot",
        "boolean",
        "false",
        "Show the decorative dot before content.",
        "عرض النقطة الزخرفية قبل المحتوى."
      ],
      [
        "borderRadius",
        "string",
        "\"md\"",
        "sm selects 8px; md/default preserves the 24px chip radius.",
        "sm يختار 8px؛ md والافتراضي يحتفظان بنصف قطر 24px."
      ],
      [
        "customBorderRadius",
        "string",
        "\"\"",
        "Explicit CSS border radius.",
        "قيمة CSS صريحة لنصف القطر."
      ],
      [
        "customPadding",
        "string",
        "\"\"",
        "Explicit padding, auto height and tighter content gap.",
        "padding صريح وارتفاع تلقائي ومسافة محتوى أصغر."
      ],
      [
        "dotColor",
        "string",
        "\"\"",
        "Explicit CSS dot color.",
        "لون CSS صريح للنقطة."
      ],
      [
        "variant",
        "\"default\" | \"flat\" | \"text\" | \"elevated\" | \"tonal\" | \"outlined\" | \"plain\"",
        "\"default\"",
        "default maps to Vuetify tonal.",
        "default يتحول إلى tonal في Vuetify."
      ],
      [
        "iconSize",
        "string | number",
        "\"xs\"",
        "xs/sm/md/lg/xl map to 16/20/24/32/40px.",
        "xs/sm/md/lg/xl تعني 16/20/24/32/40px."
      ],
      [
        "iconPosition",
        "\"before\" | \"after\"",
        "\"before\"",
        "Place icon and actions before or after the content.",
        "موضع الأيقونة والـactions قبل أو بعد المحتوى."
      ],
      [
        "chipAttrs",
        "Record<string, unknown>",
        "{}",
        "Explicit attrs for VChip; normal attrs belong to the wrapper.",
        "attributes صريحة لـVChip؛ العادية تصل للحاوية الخارجية."
      ]
    ],
    "slots": [
      "`default`: replaces label. `icon`: `{ icon, size }`, with VIcon fallback. `actions`: follows the icon. Before order: icon/actions/dot/content. After order: dot/content/icon/actions.",
      "`default`: يستبدل label. `icon`: يستقبل `{ icon, size }` مع VIcon كافتراضي. `actions`: يلي الأيقونة. الترتيب before: أيقونة/actions/نقطة/محتوى؛ after: نقطة/محتوى/أيقونة/actions."
    ],
    "variables": [
      [
        "--wakeb-badge-check-color",
        "#667085"
      ],
      [
        "--wakeb-badge-danger-bg",
        "#fef3f2"
      ],
      [
        "--wakeb-badge-danger-bg-rgb",
        "254, 243, 242"
      ],
      [
        "--wakeb-badge-danger-dot",
        "#f04438"
      ],
      [
        "--wakeb-badge-danger-text",
        "#b42318"
      ],
      [
        "--wakeb-badge-dark-bg",
        "#fff"
      ],
      [
        "--wakeb-badge-dark-text",
        "#667085"
      ],
      [
        "--wakeb-badge-fallback",
        "not defined (normal per-token defaults)"
      ],
      [
        "--wakeb-badge-info-bg",
        "#f0f9ff"
      ],
      [
        "--wakeb-badge-info-dot",
        "#0ba5ec"
      ],
      [
        "--wakeb-badge-info-text",
        "#026aa2"
      ],
      [
        "--wakeb-badge-neutral-bg",
        "#f2f4f7"
      ],
      [
        "--wakeb-badge-neutral-text",
        "#667085"
      ],
      [
        "--wakeb-badge-outline-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-badge-outline-secondary-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-badge-outline-secondary-text",
        "#667085"
      ],
      [
        "--wakeb-badge-primary-bg",
        "#eff8ff"
      ],
      [
        "--wakeb-badge-primary-button-bg",
        "#087f8c"
      ],
      [
        "--wakeb-badge-primary-dot",
        "#2e90fa"
      ],
      [
        "--wakeb-badge-primary-text",
        "#175cd3"
      ],
      [
        "--wakeb-badge-success-bg",
        "#ecfdf3"
      ],
      [
        "--wakeb-badge-success-bg-rgb",
        "236, 253, 243"
      ],
      [
        "--wakeb-badge-success-dot",
        "#12b76a"
      ],
      [
        "--wakeb-badge-success-text",
        "#027a48"
      ],
      [
        "--wakeb-badge-tertiary-bg-rgb",
        "242, 244, 247"
      ],
      [
        "--wakeb-badge-tertiary-text",
        "#667085"
      ],
      [
        "--wakeb-badge-warning-bg",
        "#fffaeb"
      ],
      [
        "--wakeb-badge-warning-dot",
        "#f79009"
      ],
      [
        "--wakeb-badge-warning-text",
        "#b54708"
      ]
    ],
    "limits": [
      "A badge is presentational unless explicit chipAttrs make it interactive. Supply visible status text; color and dot alone are not an accessible label. Native wrapper listeners receive bubbling DOM events; there are no custom emits. Chip styles preserve the extracted outline descendant backgrounds and specialized class hooks. Custom icons belong in the icon slot. Semantic variables customize colors without app tokens. Current-color variables are implementation details; use dotColor or documented semantic tokens. The compatibility-only --wakeb-badge-fallback switch stays undefined in normal use.",
      "الشارة للعرض ما لم تجعلها chipAttrs تفاعلية. قدم نص حالة واضحًا؛ اللون والنقطة وحدهما لا يمثلان اسمًا لقارئ الشاشة. أحداث الحاوية هي أحداث DOM المتصاعدة ولا توجد emits مخصصة. التنسيق يحتفظ بخلفيات descendants للنوع outline وclasses الخاصة. ضع الأيقونات المخصصة في icon slot. الألوان الدلالية مستقلة عن tokens المشروع. متغيرات اللون الحالي داخلية؛ استخدم dotColor أو tokens الموثقة. اترك --wakeb-badge-fallback غير معرف في الاستخدام العادي."
    ],
    "example": "<WBadge label=\"Approved\" type=\"success\" is-dot />",
    "playground": "FoundationPlayground"
  },
  {
    "name": "WAccordion",
    "slug": "accordion",
    "interface": "AccordionProps",
    "summary": [
      "Disclosure panels with preserved content, scoped headers and keyboard-ready default triggers.",
      "لوحات فتح وإغلاق تحتفظ بالمحتوى، مع header slots وزر افتراضي يدعم الكيبورد."
    ],
    "props": [
      [
        "title",
        "string",
        "\"\"",
        "Default title and accessible toggle name.",
        "العنوان الافتراضي واسم زر الفتح."
      ],
      [
        "modelValue",
        "boolean",
        "false",
        "Initial/external open state; internal clicks remain usable without parent updates.",
        "حالة الفتح الابتدائية والخارجية؛ النقر الداخلي يعمل دون تحديث الوالد."
      ],
      [
        "classList",
        "ComponentClass",
        "\"\"",
        "Classes on the accordion root.",
        "classes على الحاوية."
      ],
      [
        "icon",
        "SharedIcon",
        "\"$expand\"",
        "Indicator icon supplied to WButton or toggleIcon.",
        "أيقونة المؤشر لـWButton أو toggleIcon."
      ],
      [
        "noBorder",
        "boolean",
        "false",
        "Remove outer border and radius.",
        "إزالة الحد الخارجي ونصف القطر."
      ],
      [
        "beforeIcon",
        "boolean",
        "false",
        "Show a toggle before the title.",
        "عرض زر فتح قبل العنوان."
      ],
      [
        "afterIcon",
        "boolean",
        "false",
        "Show a toggle after the title.",
        "عرض زر فتح بعد العنوان."
      ],
      [
        "iconColor",
        "string",
        "\"\"",
        "Explicit indicator color.",
        "لون صريح للمؤشر."
      ],
      [
        "iconSize",
        "string | number",
        "\"sm\"",
        "Indicator icon size.",
        "حجم أيقونة المؤشر."
      ],
      [
        "maxIconWidth",
        "string | number",
        "\"100%\"",
        "Indicator maximum width.",
        "أقصى عرض للمؤشر."
      ],
      [
        "headerTitleClassList",
        "ComponentClass",
        "\"\"",
        "Classes on the default title trigger.",
        "classes على زر العنوان الافتراضي."
      ],
      [
        "headerClassList",
        "ComponentClass",
        "\"\"",
        "Classes on the clickable header.",
        "classes على الـheader القابل للنقر."
      ],
      [
        "bodyClassList",
        "ComponentClass",
        "\"\"",
        "Classes on the retained body.",
        "classes على المحتوى المحتفظ به."
      ],
      [
        "transparent",
        "boolean",
        "false",
        "Transparent outer background.",
        "خلفية خارجية شفافة."
      ],
      [
        "toggleLabel",
        "string",
        "\"\"",
        "Localized toggle name; fallback is title, then Toggle section.",
        "اسم مترجم لزر الفتح؛ البديل title ثم Toggle section."
      ],
      [
        "contentId",
        "string",
        "\"\"",
        "Explicit panel ID; otherwise a stable Vue useId-based ID.",
        "معرف صريح للمحتوى؛ وإلا معرف ثابت من Vue useId."
      ]
    ],
    "slots": [
      "`header`: `{ open, toggle, triggerProps }`; bind triggerProps to a native button for keyboard/ARIA behavior. `actions`: `{ open, toggle }`, isolated from header clicks. `default`: `{ open }`, retained with v-show. `toggleIcon`: `{ icon, size, color, maxWidth }`. Indicators inherit the documented WButton CSS variables.",
      "`header`: يستقبل `{ open, toggle, triggerProps }`؛ اربط triggerProps بزر HTML لدعم الكيبورد وARIA. `actions`: يستقبل `{ open, toggle }` مع عزله عن نقر الـheader. `default`: يستقبل `{ open }` ويحتفظ بالمحتوى عبر v-show. `toggleIcon`: يستقبل `{ icon, size, color, maxWidth }`. المؤشرات ترث متغيرات CSS الموثقة لـWButton."
    ],
    "variables": [
      [
        "--wakeb-accordion-background",
        "#fff"
      ],
      [
        "--wakeb-accordion-body-background",
        "#fff"
      ],
      [
        "--wakeb-accordion-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-accordion-fallback",
        "not defined (normal per-token defaults)"
      ],
      [
        "--wakeb-accordion-focus",
        "#087f8c"
      ],
      [
        "--wakeb-accordion-hover-rgb",
        "249, 250, 251"
      ],
      [
        "--wakeb-accordion-radius",
        "12px"
      ],
      [
        "--wakeb-accordion-title",
        "#101828"
      ]
    ],
    "limits": [
      "The default title is a native button with aria-expanded/aria-controls; pointer clicks elsewhere on the header also toggle. Icon toggles stop propagation so one activation emits one update. Actions never toggle the panel. Custom headers must supply their own accessible control via triggerProps; stop unrelated interactive header controls from bubbling. The body uses v-show, retaining nested form state. Parent modelValue changes synchronize local state without echoing an update event; local clicks also work when a parent supplies a constant value. Vue useId is stable per application/SSR request; use unique app.config.idPrefix values for multiple independent Vue apps. Motion respects reduced-motion preferences. Indicator rotation preserves 180deg when closed and 0deg when open. The compatibility --wakeb-accordion-fallback switch is reserved for adapters.",
      "العنوان الافتراضي زر HTML يحمل aria-expanded/aria-controls؛ النقر على باقي الـheader يفتح ويغلق أيضًا. أزرار المؤشرات توقف تصاعد الحدث فكل تفعيل يرسل تحديثًا واحدًا. actions لا يفتح اللوحة. الـheader المخصص يحتاج زرًا قابلًا للوصول عبر triggerProps مع إيقاف تصاعد أحداث التحكم غير المرتبطة. المحتوى يستخدم v-show للاحتفاظ بحالة الفورم. تحديث modelValue الخارجي يزامن الحالة دون إعادة إرسال الحدث، والنقر يعمل حتى مع قيمة ثابتة من الوالد. Vue useId ثابت لكل تطبيق/طلب SSR؛ استخدم app.config.idPrefix مختلفًا للتطبيقات المستقلة المتعددة. الحركة تحترم reduced-motion. دوران المؤشر 180deg عند الإغلاق و0deg عند الفتح كما في العقد المستخرج. --wakeb-accordion-fallback مخصص للتوافق."
    ],
    "example": "<WAccordion title=\"Details\" after-icon :model-value=\"true\"><p>Persistent panel content</p></WAccordion>",
    "playground": "FoundationPlayground",
    "events": [
      "`update:modelValue(value: boolean)` — emitted only by local toggle actions.",
      "`update:modelValue(value: boolean)` — يُرسل عند التفعيل المحلي فقط."
    ]
  }
];
