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
  },
  {
    "name": "WBadgeStack",
    "slug": "badge-stack",
    "interface": "BadgeStackProps",
    "summary": [
      "Badges with per-item styling, image slots and an optional overflow menu.",
      "مجموعة شارات بتخصيص لكل عنصر وأيقونات قابلة للاستبدال وقائمة زيادة اختيارية."
    ],
    "props": [
      [
        "items",
        "readonly BadgeStackItem[]",
        "[]",
        "Records with label, image URL, color and per-badge overrides.",
        "عناصر تحمل الاسم ورابط الصورة واللون وتخصيصات الشارة."
      ],
      [
        "max",
        "number",
        "1",
        "Visible item slice limit; use a finite nonnegative integer.",
        "حد العناصر الظاهرة؛ استخدم عددًا صحيحًا محدودًا لا يقل عن صفر."
      ],
      [
        "truncateLength",
        "number",
        "12",
        "Visible label length including the three-dot suffix. Overflow labels stay full.",
        "طول الاسم الظاهر شامل النقاط؛ أسماء قائمة الزيادة كاملة."
      ],
      [
        "showOverflowMenu",
        "boolean",
        "false",
        "Enable a real hover/click/keyboard Vuetify menu on +N.",
        "تفعيل قائمة Vuetify عند hover أو النقر أو الكيبورد على +N."
      ],
      [
        "badgeType",
        "string",
        "\"transparent\"",
        "Default WBadge semantic type.",
        "نوع WBadge الافتراضي."
      ],
      [
        "badgeVariant",
        "BadgeProps[\"variant\"]",
        "\"default\"",
        "Default chip variant; default maps to tonal.",
        "شكل الشارة؛ default يتحول إلى tonal."
      ],
      [
        "badgeBorderRadius",
        "string",
        "\"md\"",
        "Default preset radius.",
        "نصف القطر الافتراضي."
      ],
      [
        "customBorderRadius",
        "string",
        "\"sm\"",
        "Legacy custom radius passed verbatim; use a CSS length for new code.",
        "القيمة القديمة تمر كما هي؛ استخدم طول CSS صالحًا في المشاريع الجديدة."
      ],
      [
        "badgePadding",
        "string",
        "\"\"",
        "Default custom chip padding.",
        "حشو الشارة المخصص."
      ],
      [
        "dotColor",
        "string",
        "\"\"",
        "Default dot color.",
        "لون النقطة الافتراضي."
      ],
      [
        "badgeClassList",
        "ComponentClass",
        "\"\"",
        "Classes applied to each chip.",
        "classes على كل chip."
      ],
      [
        "isDot",
        "boolean",
        "false",
        "Default status dot visibility.",
        "إظهار نقطة الحالة افتراضيًا."
      ],
      [
        "iconSize",
        "string | number",
        "\"xs\"",
        "Default badge glyph size; image dimensions use the stack stylesheet.",
        "حجم glyph؛ أبعاد الصور تحددها أنماط المجموعة."
      ],
      [
        "iconPosition",
        "\"before\" | \"after\"",
        "\"before\"",
        "Image/glyph placement in each badge.",
        "موضع الأيقونة أو الصورة داخل الشارة."
      ],
      [
        "iconVariant",
        "\"default\" | \"circle\"",
        "\"default\"",
        "Flat images or a circular image wrapper.",
        "صورة عادية أو حاوية دائرية."
      ],
      [
        "iconBackgroundOpacity",
        "number",
        "1",
        "Circle background mix, clamped to 0–1.",
        "قوة لون الدائرة، بين صفر وواحد."
      ],
      [
        "customOverflowBorderRadius",
        "string",
        "\"999px\"",
        "Custom radius of +N when it opens a menu.",
        "نصف قطر +N عندما يفتح قائمة."
      ],
      [
        "overflowLabel",
        "string",
        "\"\"",
        "Accessible menu button name; fallback +N.",
        "الاسم المقروء لزر القائمة؛ البديل +N."
      ],
      [
        "overflowTag",
        "\"button\" | \"div\"",
        "\"button\"",
        "Native button by default; div is reserved for legacy adapters.",
        "زر HTML افتراضيًا؛ div لتوافق المشاريع القديمة."
      ],
      [
        "menuStyle",
        "CSSProperties",
        "undefined",
        "Styles/variables placed directly on the teleported list.",
        "أنماط ومتغيرات على القائمة المنقولة خارج الحاوية."
      ],
      [
        "badgeAttrs",
        "Record<string, unknown>",
        "undefined",
        "Wrapper attributes on every WBadge, including teleported rows. Avoid overriding its content props.",
        "خصائص حاوية كل WBadge، حتى صفوف القائمة؛ تجنب استبدال خصائص المحتوى."
      ]
    ],
    "slots": [
      "`icon`: `{ item, index, overflow, variant, style }`, replacing the complete image wrapper. `badgeIcon`: `{ item, icon, size }` for glyph-only rows. `label`: `{ item, text, overflow }`. Index is local to the visible/overflow slice.",
      "`icon`: يستقبل `{ item, index, overflow, variant, style }` ويستبدل حاوية الصورة كاملة. `badgeIcon`: للأيقونات غير المصورة. `label`: يستقبل `{ item, text, overflow }`. الفهرس داخل الجزء الظاهر أو المخفي."
    ],
    "variables": [
      [
        "--wakeb-badge-stack-overflow-background",
        "#fff"
      ],
      [
        "--wakeb-badge-stack-overflow-color",
        "#101828"
      ],
      [
        "--wakeb-badge-stack-menu-surface",
        "Vuetify surface"
      ],
      [
        "--wakeb-badge-stack-icon-background",
        "#087f8c"
      ],
      [
        "--wakeb-badge-stack-focus",
        "#087f8c"
      ],
      [
        "--wakeb-badge-stack-fallback",
        "not defined (legacy menu adapter switch)"
      ]
    ],
    "limits": [
      "Ordinary attrs target the flex wrapper. No business/theme/icon registry is imported. WBadge variables also apply. Set menu colors through menuStyle and badgeAttrs styles/classes because Vuetify teleports the list outside the stack. Image URLs render as decorative img elements; no fetch proxy or detection tint is built in. Nullish per-item overrides preserve false/empty values. max keeps Array.slice and count arithmetic for compatibility; negative, fractional or nonfinite values are unsupported configurations. Visible labels use Wakeb Utils UTF-16 truncation; the menu shows full labels. Only the menu overflow uses customOverflowBorderRadius; the static +N uses customBorderRadius. The inherited 58px overflow selector and the legacy circle sizing rules are retained; replace through CSS as needed. Native menu button supports focus, Enter/Space and Escape via Vuetify. The legacy div tag does not provide a native tab stop.",
      "الخصائص العادية تستهدف حاوية flex. لا يوجد اعتماد على بيانات العمل أو theme أو registry للأيقونات. متغيرات WBadge متاحة أيضًا. خصص ألوان القائمة عبر menuStyle وbadgeAttrs لأن Vuetify ينقلها خارج الحاوية. الصور زخرفية ولا توجد خدمة لجلبها أو تلوين خاص بنوع الاكتشاف. تخصيص العنصر يحترم false والقيم الفارغة. max يحافظ على Array.slice والحساب القديم؛ الأعداد السالبة والكسرية وغير المحدودة إعدادات غير مدعومة. التقصير بوحدات UTF-16 من Wakeb Utils. القائمة تعرض الأسماء كاملة. customOverflowBorderRadius يخص زر القائمة فقط؛ +N الثابت يستخدم customBorderRadius. قواعد أحجام الزيادة والدائرة القديمة محفوظة. الزر الافتراضي يدعم التركيز وEnter/Space وEscape من Vuetify؛ div القديم لا يضيف tab stop."
    ],
    "example": "<WBadgeStack :items=\"[{ id: 1, label: 'Administrator' }, { id: 2, label: 'Reviewer' }]\" show-overflow-menu overflow-label=\"More roles\" />",
    "playground": "IdentityPlayground",
    "events": [
      "No custom events. Native wrapper listeners bubble normally; menu state belongs to Vuetify.",
      "لا توجد أحداث مخصصة. أحداث الحاوية تتصاعد طبيعيًا؛ حالة القائمة يديرها Vuetify."
    ]
  },
  {
    "name": "WUserBadge",
    "slug": "user-badge",
    "interface": "UserBadgeProps",
    "summary": [
      "A compact user badge with avatar/initials and an actions slot.",
      "شارة مستخدم بصورة أو أحرف بديلة وslot للإجراءات."
    ],
    "props": [
      [
        "user",
        "BadgeUser",
        "{}",
        "Presentational name/avatar record; data is escaped text.",
        "بيانات العرض للاسم والصورة؛ الاسم نص آمن."
      ],
      [
        "type",
        "string",
        "\"outline\"",
        "WBadge semantic type.",
        "نوع WBadge."
      ],
      [
        "borderRadius",
        "string",
        "\"md\"",
        "Badge radius preset.",
        "نصف قطر الشارة."
      ],
      [
        "icon",
        "SharedIcon",
        "\"\"",
        "Legacy WBadge icon prop; avatar slot replaces the glyph.",
        "خاصية الأيقونة القديمة؛ الصورة تستبدل glyph."
      ],
      [
        "iconSize",
        "string | number",
        "\"xs\"",
        "Legacy WBadge glyph size; avatarSize controls the actual avatar.",
        "حجم glyph القديم؛ avatarSize يتحكم في الصورة."
      ],
      [
        "iconPosition",
        "\"before\" | \"after\"",
        "\"before\"",
        "Avatar position relative to content.",
        "موضع الصورة بالنسبة للمحتوى."
      ],
      [
        "avatarSize",
        "string | number",
        "16",
        "Vuetify avatar size.",
        "حجم صورة Vuetify."
      ],
      [
        "avatarColor",
        "string",
        "\"primary\"",
        "Vuetify initials avatar color.",
        "لون حاوية الأحرف في Vuetify."
      ]
    ],
    "slots": [
      "`avatar`: `{ user, avatar, initials, size }`. `default`: `{ user }`, replacing the name only. `actions`: `{ user }`, rendered after the name.",
      "`avatar`: يستقبل `{ user, avatar, initials, size }`. `default`: يستقبل `{ user }` لاستبدال الاسم فقط. `actions`: بعد الاسم."
    ],
    "variables": [
      [
        "--wakeb-user-badge-initials-size",
        "8px"
      ]
    ],
    "limits": [
      "Ordinary attrs/listeners target the WBadge wrapper. WBadge variables control the chip. HTTP-prefixed, root-relative and data URLs use VImg; other values use initials. There is no network-error initials fallback, matching the original component. Missing/empty name or an em dash uses ?, whitespace-only uses an empty initial; initials preserve charAt(0) UTF-16 behavior and use the first two words. Supply a user object with string fields; null is not supported. Avatars are decorative because the adjacent name identifies the user. Actions bubble naturally; stop propagation in the action if its parent has a click handler. No Tailwind dependency is required for the 8px initials.",
      "الخصائص والأحداث تستهدف حاوية WBadge ومتغيراته تخصص الشارة. الصور التي تبدأ بـhttp أو / أو data تعرض عبر VImg؛ الباقي يستخدم الأحرف. لا يوجد بديل تلقائي عند فشل تحميل الصورة، مثل الأصل. الاسم الفارغ أو — يعطي ?؛ المسافات فقط تعطي حرفًا فارغًا. الأحرف تحافظ على charAt(0) بوحدات UTF-16 لأول كلمتين. مرر كائنًا بحقول نصية؛ null غير مدعوم. الصورة زخرفية لأن الاسم بجوارها. الإجراءات تتصاعد طبيعيًا؛ أوقف التصاعد عند الحاجة. حجم الأحرف 8px يعمل دون Tailwind."
    ],
    "example": "<WUserBadge :user=\"{ name: 'Ada Lovelace', avatar: '/avatars/ada.png' }\"><template #actions><button type=\"button\">Remove</button></template></WUserBadge>",
    "playground": "IdentityPlayground",
    "events": [
      "No custom events. Native listeners target the outer badge wrapper.",
      "لا توجد أحداث مخصصة؛ الأحداث العادية تستهدف حاوية الشارة."
    ]
  },
  {
    "name": "WTooltipBtn",
    "slug": "tooltip-btn",
    "interface": "TooltipBtnProps",
    "summary": [
      "An icon button with host-translated tooltip text and native button attributes.",
      "زر أيقونة بنص Tooltip مترجم من المشروع وخصائص زر HTML."
    ],
    "props": [
      [
        "icon",
        "SharedIcon",
        "undefined",
        "Vuetify icon; replace with the icon slot for custom SVGs.",
        "أيقونة Vuetify؛ استخدم slot للأيقونات المخصصة."
      ],
      [
        "text",
        "string",
        "\"\"",
        "Already translated tooltip text; empty disables the tooltip.",
        "نص Tooltip مترجم مسبقًا؛ القيمة الفارغة تلغيه."
      ],
      [
        "ariaLabel",
        "string | null",
        "undefined",
        "Explicit accessible button name; fallback text.",
        "اسم مقروء صريح للزر؛ البديل text."
      ],
      [
        "btnIcon",
        "boolean",
        "false",
        "Enable the native Vuetify icon-button layout.",
        "تفعيل شكل زر الأيقونة في Vuetify."
      ],
      [
        "variant",
        "\"text\" | \"flat\" | \"elevated\" | \"tonal\" | \"outlined\" | \"plain\"",
        "\"text\"",
        "Vuetify button variant.",
        "شكل زر Vuetify."
      ],
      [
        "location",
        "\"top\" | \"bottom\" | \"start\" | \"end\"",
        "\"bottom\"",
        "Tooltip placement.",
        "موضع Tooltip."
      ],
      [
        "openDelay",
        "string | number",
        "200",
        "Tooltip opening delay in milliseconds.",
        "تأخير فتح Tooltip بالمللي ثانية."
      ],
      [
        "contentClass",
        "string",
        "\"v-app-tooltip-btn__content\"",
        "Class on the tooltip overlay.",
        "class على Tooltip overlay."
      ],
      [
        "tooltipStyle",
        "CSSProperties",
        "undefined",
        "Styles directly on the teleported tooltip content.",
        "أنماط على محتوى Tooltip المنقول."
      ],
      [
        "wrapperAttrs",
        "Record<string, unknown>",
        "undefined",
        "Explicit attributes for the layout span; ordinary attrs target VBtn.",
        "خصائص span الخارجي؛ الخصائص العادية تستهدف VBtn."
      ]
    ],
    "slots": [
      "`icon`: `{ icon }`, replacing VIcon. There is no default content slot; use WButton for text actions.",
      "`icon`: يستقبل `{ icon }` ويستبدل VIcon. لا يوجد slot افتراضي للنص؛ استخدم WButton للأزرار النصية."
    ],
    "variables": [],
    "limits": [
      "VBtn receives ordinary attrs and native listeners once; use wrapperAttrs for the outer span. Defaults match the original text variant, bottom placement and 200ms opening delay. Pass text=t(key) from the host; the package has no i18n dependency or path prop. VTooltip uses activator=parent, preserving Vuetify focus, hover, Escape and aria-describedby. Provide ariaLabel or meaningful text for icon-only controls. Disabled native buttons retain their disabled behavior and do not offer a keyboard tooltip target; use a deliberate separate help element if needed. VIcon requires your Vuetify icon configuration; the icon slot can supply an inline SVG. Tooltip styles belong in tooltipStyle, not inherited variables, because of teleport. VBtn styling uses your existing Vuetify theme; there are no additional package-specific CSS variables.",
      "الخصائص والأحداث العادية تصل إلى VBtn مرة واحدة؛ wrapperAttrs للحاوية الخارجية. الافتراضات مطابقة للأصل: text وأسفل وتأخير 200ms. مرر text=t(key) من المشروع؛ الحزمة لا تعتمد على i18n ولا تستقبل path. VTooltip يستخدم activator=parent مع التركيز وhover وEscape وaria-describedby. وفر ariaLabel أو نصًا واضحًا للأزرار المصورة. الزر المعطل يحتفظ بسلوكه ولا يصبح هدفًا للـTooltip عبر الكيبورد؛ استخدم عنصر مساعدة منفصلًا عند الحاجة. VIcon يحتاج إعداد أيقونات Vuetify؛ slot يدعم SVG مباشرة. خصص Tooltip عبر tooltipStyle بسبب teleport. التنسيق من Vuetify theme دون متغيرات CSS إضافية خاصة بالحزمة."
    ],
    "example": "<WTooltipBtn text=\"Save changes\" icon=\"$complete\" btn-icon aria-label=\"Save changes\" @click=\"() => {}\" />",
    "playground": "IdentityPlayground",
    "events": [
      "No custom events. Native click/keyboard/form attrs are forwarded to VBtn without an extra wrapper listener.",
      "لا توجد أحداث مخصصة. أحداث النقر والكيبورد وخصائص الفورم تصل إلى VBtn دون مستمع إضافي على الحاوية."
    ]
  },
  {
    "name": "WTabs",
    "slug": "tabs",
    "interface": "TabsProps",
    "summary": [
      "Styled tab rails and lazy Vuetify panels with explicit selection events.",
      "شريط تبويبات ولوحات Vuetify مع أحداث اختيار واضحة."
    ],
    "props": [
      [
        "styleType",
        "\"outlined\" | \"filled\" | \"none\" | \"minimal\"",
        "\"outlined\"",
        "Visual rail preset.",
        "شكل شريط التبويبات."
      ],
      [
        "isVertical",
        "boolean",
        "false",
        "Vertical rail layout.",
        "شريط تبويبات رأسي."
      ],
      [
        "tabs",
        "readonly TabItem[]",
        "[] (required)",
        "Tab records with labels, slot keys and optional content.",
        "بيانات التبويبات: الاسم ومفتاح slot والمحتوى الاختياري."
      ],
      [
        "selectedTab",
        "NavigationKey | null",
        "\"\"",
        "External selected value; empty switcher means no highlight.",
        "قيمة الاختيار الخارجية؛ القيمة الفارغة في switcher تلغي التحديد."
      ],
      [
        "isSwitcherOnly",
        "boolean",
        "false",
        "Render only the rail, without panels.",
        "عرض الشريط فقط دون المحتوى."
      ],
      [
        "valueKey",
        "string",
        "\"slot\"",
        "Record property used for values and named content slots.",
        "الحقل المستخدم لقيمة التبويب واسم slot للمحتوى."
      ],
      [
        "iconOnly",
        "boolean",
        "false",
        "Hide default labels while retaining icon and notification; the label becomes its aria-label.",
        "إخفاء الاسم الظاهر مع بقاء الأيقونة والعداد؛ الاسم يصبح aria-label."
      ],
      [
        "tabHeight",
        "string | number | null",
        "null",
        "Numeric pixel height; numeric strings are accepted.",
        "الارتفاع بالبكسل؛ يقبل رقمًا أو نصًا رقميًا."
      ],
      [
        "iconSize",
        "string | number",
        "\"sm\"",
        "Icon size token or pixels.",
        "حجم الأيقونة كاسم أو بكسل."
      ],
      [
        "classList",
        "ComponentClass",
        "\"\"",
        "Extra classes on the outer layout.",
        "classes إضافية على الحاوية."
      ],
      [
        "contentGap",
        "string | number | null",
        "null",
        "Numeric pixel gap; default 32px.",
        "المسافة بالبكسل؛ الافتراضي 32px."
      ],
      [
        "ariaLabel",
        "string",
        "\"Tabs\"",
        "Accessible tablist name.",
        "اسم شريط التبويبات لقارئ الشاشة."
      ]
    ],
    "slots": [
      "`header`, `actions`; `tab-label`: `{ tabItem, index }` replaces the default label/HTML; `tab-icon`: `{ tabItem, index, size }`; content slots use each record valueKey. Header/actions/tab-label/tab-icon are reserved names.",
      "`header` و`actions`؛ `tab-label`: يستقبل `{ tabItem, index }` ويستبدل الاسم وHTML؛ `tab-icon`: يستقبل `{ tabItem, index, size }`. أسماء محتوى التبويبات من valueKey؛ الأسماء السابقة محجوزة."
    ],
    "variables": [
      [
        "--wakeb-tabs-item-height",
        "44px"
      ],
      [
        "--wakeb-tabs-filled-tab-radius",
        "10px"
      ],
      [
        "--wakeb-tabs-filled-item-active-bg",
        "#e6f2f3"
      ],
      [
        "--wakeb-tabs-filled-item-active-color",
        "#087f8c"
      ],
      [
        "--wakeb-tabs-item-active-color",
        "#087f8c"
      ],
      [
        "--wakeb-tabs-item-active-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-tabs-item-color",
        "#344054"
      ],
      [
        "--wakeb-tabs-input-bg",
        "#fff"
      ],
      [
        "--wakeb-tabs-input-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-tabs-input-label",
        "#344054"
      ],
      [
        "--wakeb-tabs-minimal-tab-gap",
        "4px"
      ],
      [
        "--wakeb-tabs-minimal-tab-padding",
        "4px"
      ],
      [
        "--wakeb-tabs-minimal-tab-bg",
        "#f2f4f7"
      ],
      [
        "--wakeb-tabs-minimal-tab-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-tabs-minimal-tab-radius",
        "12px"
      ],
      [
        "--wakeb-tabs-minimal-item-radius",
        "8px"
      ],
      [
        "--wakeb-tabs-minimal-item-color",
        "#667085"
      ],
      [
        "--wakeb-tabs-minimal-item-active-color",
        "#101828"
      ],
      [
        "--wakeb-tabs-minimal-item-active-radius",
        "8px"
      ],
      [
        "--wakeb-tabs-section-color",
        "#667085"
      ],
      [
        "--wakeb-tabs-section-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-tabs-content-gap",
        "32px"
      ],
      [
        "--wakeb-tabs-fallback",
        "undefined (legacy adapter switch)"
      ]
    ],
    "events": [
      "`updateTab(value: NavigationKey | undefined)` for accepted local changes only; no mount or parent-sync echo.",
      "`updateTab(value: NavigationKey | undefined)` للتغيير المحلي فقط؛ لا يُرسل عند التركيب أو مزامنة الأب."
    ],
    "limits": [
      "Ordinary attrs target the layout root. Vue/Vuetify are peers; no Tailwind is needed. Numeric height/gap props append px; do not pass CSS units. Section labels and headers remain inside the rail. VTabs provides tablist roles, focus and arrow navigation; panels are lazily mounted by VTabsWindow, retaining mounted Vue state. Empty selectedTab in switcher mode deliberately clears highlight. selectedTab/isSwitcherOnly are synchronized; the items array itself does not reset selection in application code, leaving group changes to Vuetify. Zero notification/content uses the original truthy check. customHTML is inserted verbatim with v-html and must be trusted or sanitized by the host; function context is {value,isSelected}. Prefer tab-label for untrusted data. Icons use VIcon or tab-icon slots and currentColor; no shadow DOM icon patch runs in the package. Icon-only tabs use the record label as aria-label. Supply a meaningful label, including when replacing label content.",
      "الخصائص على الحاوية. Vue وVuetify هما peers ولا تحتاج Tailwind. الارتفاع والمسافة يضيفان px؛ لا تمرر وحدات CSS. عناوين الأقسام والـheader داخل الشريط. Vuetify يوفر tablist والتركيز والأسهم؛ اللوحات تُركب عند الحاجة وتحتفظ بحالة Vue بعد التركيب. selectedTab الفارغ في switcher يلغي التحديد. المزامنة تخص selectedTab وisSwitcherOnly؛ تغيير قائمة العناصر يترك سلوك المجموعة لـVuetify. الصفر في content أو notification يتبع فحص truthy القديم. customHTML يدخل كما هو عبر v-html ويجب أن يكون موثوقًا أو منقّى من المشروع؛ سياق الدالة {value,isSelected}. استخدم tab-label للبيانات غير الموثوقة. الأيقونات عبر VIcon أو slot دون تعديل shadow DOM داخل الحزمة. التبويب المصور فقط يستخدم label كاسم ARIA؛ وفر اسمًا واضحًا حتى مع المحتوى المخصص."
    ],
    "example": "<WTabs :tabs=\"[{ slot: 'overview', label: 'Overview' }, { slot: 'details', label: 'Details' }]\"><template #overview>Overview panel</template><template #details>Details panel</template></WTabs>",
    "playground": "NavigationPlayground"
  },
  {
    "name": "WTree",
    "slug": "tree",
    "interface": "TreeProps",
    "summary": [
      "A controlled recursive tree with connector lines, composable rows and keyboard navigation.",
      "شجرة متداخلة يتحكم فيها المشروع مع خطوط الربط وslots وتنقل بالكيبورد."
    ],
    "props": [
      [
        "nodes",
        "readonly TreeNode[]",
        "[]",
        "Acyclic presentational records with unique primitive keys.",
        "بيانات عرض دون مراجع دائرية ومفاتيح نصية أو رقمية فريدة."
      ],
      [
        "itemKey",
        "string",
        "\"id\"",
        "Key field.",
        "حقل المفتاح."
      ],
      [
        "itemLabel",
        "string",
        "\"name\"",
        "Visible/accessibility name field.",
        "حقل الاسم الظاهر والمقروء."
      ],
      [
        "itemDescription",
        "string",
        "\"description\"",
        "Optional description field.",
        "حقل الوصف الاختياري."
      ],
      [
        "childrenKey",
        "string",
        "\"children\"",
        "Child array field.",
        "حقل قائمة الأبناء."
      ],
      [
        "level",
        "number",
        "0",
        "Starting depth, mainly for recursive composition.",
        "عمق البداية؛ يستخدم في التركيب المتداخل."
      ],
      [
        "isRoot",
        "boolean",
        "true",
        "Root tree vs nested group; internal recursion sets false.",
        "شجرة رئيسية أو مجموعة داخلية؛ التداخل الداخلي يمرر false."
      ],
      [
        "expandedKeys",
        "readonly NavigationKey[]",
        "[]",
        "Controlled expanded branches; update in the host on toggle.",
        "الفروع المفتوحة؛ حدّثها في المشروع عند toggle."
      ],
      [
        "activeKey",
        "NavigationKey | null",
        "null",
        "Controlled selected node key.",
        "مفتاح العنصر المختار من المشروع."
      ],
      [
        "activePath",
        "readonly NavigationKey[]",
        "[]",
        "Explicit path for nested/nonroot groups; root resolves from activeKey.",
        "مسار المجموعات الداخلية؛ الجذر يستنتجه من activeKey."
      ],
      [
        "rtl",
        "boolean",
        "false",
        "RTL connectors and reversed expand/collapse arrow keys.",
        "اتجاه RTL مع عكس أسهم الفتح والإغلاق."
      ],
      [
        "editingNodeId",
        "NavigationKey | null",
        "null",
        "Inline-edit class hook; numeric/string IDs compare compatibly.",
        "class لحالة التعديل؛ المقارنة تدعم الرقم وتمثيله النصي."
      ],
      [
        "keyboardNavigation",
        "boolean",
        "true",
        "ARIA tree and roving keyboard navigation; false preserves legacy list behavior.",
        "شجرة ARIA وتنقل بالكيبورد؛ false يحتفظ بسلوك القائمة القديم."
      ],
      [
        "ariaLabel",
        "string",
        "\"Tree\"",
        "Accessible root name.",
        "اسم الشجرة المقروء."
      ],
      [
        "toggleLabel",
        "string",
        "\"Toggle branch\"",
        "Accessible name for the default branch toggle.",
        "اسم زر فتح الفرع الافتراضي."
      ]
    ],
    "slots": [
      "`node`: `{node,level,expanded}`; `actions`: `{node,level}`; `toggle-leading` and `toggle-trailing`: `{node,level,expanded,hasChildren,toggle}`. Slots propagate to every level. Actions stop click bubbling; custom leading toggles must stop their own click.",
      "`node`: يستقبل `{node,level,expanded}`؛ `actions`: يستقبل `{node,level}`؛ `toggle-leading` و`toggle-trailing`: يستقبلان `{node,level,expanded,hasChildren,toggle}`. جميعها تنتقل لكل المستويات. actions توقف تصاعد النقر؛ أوقف تصاعد زر leading المخصص عند الحاجة."
    ],
    "variables": [
      [
        "--wakeb-tree-input-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-tree-primary",
        "#087f8c"
      ],
      [
        "--wakeb-tree-hover-bg",
        "#f2f4f7"
      ],
      [
        "--wakeb-tree-active-text",
        "#fff"
      ],
      [
        "--wakeb-tree-paragraph-primary",
        "#101828"
      ],
      [
        "--wakeb-tree-paragraph-tertiary",
        "#667085"
      ],
      [
        "--wakeb-tree-toggle-color",
        "#667085"
      ],
      [
        "--wakeb-tree-focus",
        "#087f8c"
      ],
      [
        "--wakeb-tree-fallback",
        "undefined (legacy adapter switch)"
      ]
    ],
    "events": [
      "`node-click(node: TreeNode)` requests selection; `toggle(node: TreeNode)` requests expansion. Update activeKey/expandedKeys in the host; the tree never mutates records.",
      "`node-click(node: TreeNode)` لطلب الاختيار، و`toggle(node: TreeNode)` لطلب الفتح. حدّث activeKey وexpandedKeys في المشروع؛ الشجرة لا تعدل البيانات."
    ],
    "limits": [
      "Root attrs target ul. Data must be acyclic with globally unique string/number keys; only loaded children are considered. Field keys are direct properties, not dotted paths. activeKey uses strict identity; editingNodeId also supports string equivalence. Root computes active ancestors; nonroot groups use activePath. Collapsing unmounts descendant DOM through v-if and transition, so keep editable drafts in host state. Arrow Up/Down traverse visible nodes; Home/End move to bounds; expand/collapse arrows reverse in RTL; Enter/Space request selection. Expansion remains controlled. Nested controls keep their own keys. There is one roving tab target per tree; disappearing rows reset it to a visible key. No typeahead, virtualization, drag/drop, checkbox selection or remote loading is built in. Default labels propagate to every level. Empty named slots use Vue fallback content, including branch toggles. Motion respects reduced-motion preferences.",
      "الخصائص تستهدف ul. البيانات دون دورات وبمفاتيح نصية أو رقمية فريدة في الشجرة، والأبناء المحمّلون فقط هم المعروضون. مفاتيح الحقول مباشرة دون dotted paths. activeKey يقارن بدقة وeditingNodeId يدعم تمثيل المفتاح النصي. الجذر يستنتج مسار العنصر؛ المجموعة الداخلية تستخدم activePath. الإغلاق يزيل DOM الأبناء عبر v-if؛ احفظ مسودات التعديل في حالة المشروع. أعلى/أسفل للتنقل وHome/End للحدود وأسهم الفروع تنعكس في RTL وEnter/Space لطلب الاختيار. الفتح يظل بتحكم الأب. عناصر التحكم الداخلية تحتفظ بمفاتيحها. يوجد هدف Tab واحد لكل شجرة ويتغير عند اختفاء العنصر. لا يوجد typeahead أو virtualization أو سحب أو checkboxes أو تحميل بعيد. الأسماء الافتراضية تظهر بكل المستويات؛ slots الفارغة تستخدم بديل Vue، بما فيها أزرار الفروع. الحركة تحترم reduced-motion."
    ],
    "example": "<WTree :nodes=\"[{ id: 1, name: 'Team', children: [{ id: 2, name: 'Member' }] }]\" :expanded-keys=\"[1]\" aria-label=\"Teams\" />",
    "playground": "NavigationPlayground"
  },
  {
    "name": "WDropdown",
    "slug": "dropdown",
    "interface": "DropdownProps",
    "summary": [
      "A selection/action menu with native button integration and host-owned labels, colors and links.",
      "قائمة اختيار وإجراءات بزر فعلي وترجمة وألوان وروابط من المشروع."
    ],
    "props": [
      [
        "menuItems",
        "readonly DropdownItem[]",
        "[]",
        "Option records; original objects are emitted.",
        "عناصر القائمة؛ الحدث يرجع نفس الكائن."
      ],
      [
        "title",
        "string",
        "undefined",
        "Activator title before formatting.",
        "عنوان الزر قبل التنسيق."
      ],
      [
        "icon",
        "SharedIcon",
        "\"\"",
        "Explicit leading activator icon.",
        "أيقونة صريحة في زر القائمة."
      ],
      [
        "iconColor",
        "string",
        "\"\"",
        "Activator semantic color override.",
        "لون دلالي صريح للزر."
      ],
      [
        "showSelected",
        "boolean",
        "false",
        "Show selection label; takes precedence over showBoth.",
        "عرض اسم الاختيار؛ له أولوية على showBoth."
      ],
      [
        "showBoth",
        "boolean",
        "false",
        "Format title: selected label as one string.",
        "تنسيق العنوان والاختيار كنص واحد."
      ],
      [
        "iconPosition",
        "\"start\" | \"end\"",
        "undefined",
        "Activator icon placement; fallback start.",
        "موضع أيقونة الزر؛ البديل start."
      ],
      [
        "type",
        "string",
        "undefined",
        "WButton visual type; fallback primary.",
        "نوع WButton؛ البديل primary."
      ],
      [
        "classList",
        "ComponentClass",
        "\"\"",
        "Classes on the activator button.",
        "classes على زر القائمة."
      ],
      [
        "size",
        "string",
        "\"lg\"",
        "Activator size.",
        "حجم زر القائمة."
      ],
      [
        "isLinks",
        "boolean",
        "false",
        "Native anchors for href/string to; router links belong in item-label.",
        "روابط عادية لـhref أو to النصي؛ router-link داخل item-label."
      ],
      [
        "isLoading",
        "boolean",
        "false",
        "Disable activator/menu and show button loading.",
        "تعطيل القائمة والزر مع إظهار التحميل."
      ],
      [
        "disabled",
        "boolean",
        "false",
        "Disable menu and activator.",
        "تعطيل القائمة والزر."
      ],
      [
        "showChevron",
        "boolean",
        "true",
        "Append a chevron when a leading icon exists.",
        "إضافة سهم عند وجود أيقونة رئيسية."
      ],
      [
        "modelValue",
        "NavigationKey | null",
        "undefined",
        "External selection; zero is valid, null retains prior selection.",
        "الاختيار الخارجي؛ صفر صالح وnull يحتفظ بالاختيار السابق."
      ],
      [
        "expandIcon",
        "SharedIcon",
        "\"$expand\"",
        "Collapsed fallback icon.",
        "أيقونة القائمة المغلقة."
      ],
      [
        "collapseIcon",
        "SharedIcon",
        "\"$collapse\"",
        "Open fallback icon.",
        "أيقونة القائمة المفتوحة."
      ],
      [
        "labelFormatter",
        "(label: string | undefined) => string",
        "label => label ?? \"\"",
        "Host formatter/translator for activator and items.",
        "دالة التنسيق أو الترجمة من المشروع للزر والعناصر."
      ],
      [
        "colorMap",
        "Record<string, string>",
        "undefined",
        "Override semantic success/danger/warning/primary/info colors.",
        "استبدال الألوان الدلالية success وdanger وwarning وprimary وinfo."
      ],
      [
        "menuStyle",
        "CSSProperties",
        "undefined",
        "Styles/variables directly on the teleported list.",
        "أنماط ومتغيرات على القائمة المنقولة خارج الحاوية."
      ]
    ],
    "slots": [
      "`activator`: `{props,isActive,buttonProps}`; bind both props and buttonProps to your button. `item-icon`: `{item,color}`; `item-label`: `{item,text}` for router-link or custom labels.",
      "`activator`: يستقبل `{props,isActive,buttonProps}`؛ اربط props وbuttonProps بزرّك. `item-icon`: يستقبل `{item,color}`؛ `item-label`: يستقبل `{item,text}` للروابط أو الأسماء المخصصة."
    ],
    "variables": [
      [
        "--wakeb-dropdown-color-success",
        "#12b76a"
      ],
      [
        "--wakeb-dropdown-color-danger",
        "#f04438"
      ],
      [
        "--wakeb-dropdown-color-warning",
        "#f79009"
      ],
      [
        "--wakeb-dropdown-color-primary",
        "#087f8c"
      ],
      [
        "--wakeb-dropdown-color-info",
        "#2e90fa"
      ],
      [
        "--wakeb-dropdown-activator-color",
        "computed inline from selected color"
      ]
    ],
    "events": [
      "`selectedItem(item: DropdownItem)` then `update:modelValue(value: NavigationKey)` on an enabled option click, once each; selection updates afterwards.",
      "`selectedItem(item: DropdownItem)` ثم `update:modelValue(value: NavigationKey)` عند نقر عنصر متاح، مرة لكل حدث؛ تتحدث الحالة بعدهما."
    ],
    "limits": [
      "Attrs target the outer div. VMenu/VList own click-away, Escape and keyboard movement; the WButton activator uses action=button. No i18n/router instance is imported. Format title: label through labelFormatter as one string, matching the legacy composite-label contract. modelValue synchronization runs when the value changes, not when menuItems changes; null keeps the last selection. Initial showSelected falls back to title or the first label without marking it active. Value matching is strict, with label matching as fallback; zero is supported. Raw CSS colors work on option icons/text; activator text accepts semantic keys and var()/hex values, preserving the old contract. Semantic WButton icon colors have their own WButton variables. Bind colors to menuStyle or colorMap for teleported lists. Native links use href/string to; route objects require an item-label slot. Clicking a row emits selection; navigation belongs to the nested link. Disabled/loading suppress normal menu interaction.",
      "الخصائص على div الخارجي. Vuetify يدير النقر الخارجي وEscape والكيبورد وزر WButton من نوع button. لا يوجد اعتماد على i18n أو router. عنوان showBoth يمر إلى labelFormatter كنص واحد مثل الأصل. مزامنة modelValue تعمل عند تغير القيمة لا عند تغير menuItems؛ null يحتفظ بالاختيار. showSelected الأولي يختار عنوانًا أو أول اسم دون تمييز عنصر active. القيم تقارن بدقة مع بديل مقارنة الاسم، والصفر مدعوم. ألوان CSS الخام تعمل للعناصر؛ نص الزر يقبل المفاتيح الدلالية وvar() وhex مثل القديم. ألوان أيقونة WButton لها متغيراته المستقلة. menuStyle وcolorMap يخصصان القائمة المنقولة. href أو to النصي رابط عادي؛ كائنات router تحتاج slot. نقر الصف يرسل الاختيار والتنقل مسؤولية الرابط الداخلي. التعطيل والتحميل يمنعان تفاعل القائمة الطبيعي."
    ],
    "example": "<WDropdown title=\"Status\" :menu-items=\"[{ label: 'Pending', value: 0 }, { label: 'Approved', value: 1 }]\" show-selected />",
    "playground": "NavigationPlayground"
  },
  {
    "name": "WCarousel",
    "slug": "carousel",
    "interface": "CarouselProps",
    "summary": [
      "A Vuetify carousel with scoped slides, host-owned playback and accessible custom indicators.",
      "عرض شرائح من Vuetify بمحتوى مخصص وتحكم في التشغيل ومؤشرات قابلة للوصول."
    ],
    "props": [
      [
        "slides",
        "readonly unknown[]",
        "[]",
        "Records passed unchanged to the slide slot.",
        "عناصر تمر كما هي إلى slot الشريحة."
      ],
      [
        "modelValue",
        "number",
        "undefined",
        "Optional external index; local selection starts at zero.",
        "فهرس خارجي اختياري؛ الاختيار المحلي يبدأ من صفر."
      ],
      [
        "interval",
        "number",
        "5000",
        "Vuetify autoplay delay in milliseconds.",
        "الفاصل الزمني للتشغيل التلقائي بالمللي ثانية."
      ],
      [
        "cycle",
        "boolean",
        "true",
        "Enable Vuetify cycling; offer a visible pause control when autoplay is used.",
        "تشغيل التنقل التلقائي؛ وفر تحكمًا ظاهرًا للإيقاف عند استخدامه."
      ],
      [
        "showArrows",
        "boolean | \"hover\"",
        "false",
        "Native previous/next controls.",
        "أزرار السابق والتالي الأصلية."
      ],
      [
        "showIndicators",
        "boolean",
        "false",
        "Show custom clickable indicators; this name has normal positive semantics.",
        "إظهار مؤشرات قابلة للنقر؛ الاسم بمعناه المباشر."
      ],
      [
        "height",
        "string | number",
        "\"100%\"",
        "Native carousel height.",
        "ارتفاع Carousel."
      ],
      [
        "ariaLabel",
        "string",
        "\"Carousel\"",
        "Accessible carousel region name.",
        "اسم عرض الشرائح المقروء."
      ],
      [
        "indicatorLabel",
        "(index: number) => string",
        "index => 'Go to slide ' + (index + 1)",
        "Host-localized indicator names; index is zero-based.",
        "دالة تسمية المؤشرات من المشروع؛ الفهرس يبدأ من صفر."
      ],
      [
        "indicatorAttrs",
        "Record<string, unknown>",
        "undefined",
        "Extra DOM attrs/style on each indicator; may override its native type.",
        "خصائص وأنماط كل مؤشر؛ يمكنها استبدال type الخاص بالزر."
      ],
      [
        "keyboardIndicators",
        "boolean",
        "true",
        "Enable enhanced indicator arrow/Home/End keys and focus styling; false keeps native button behavior.",
        "تفعيل مفاتيح الأسهم وHome/End وتنسيق التركيز؛ false يحتفظ بسلوك الزر الطبيعي."
      ]
    ],
    "slots": [
      "`slide`: `{slide,index}`; `prev`/`next`: `{props}` from Vuetify; bind those props to your native arrow controls.",
      "`slide`: يستقبل `{slide,index}`؛ `prev` و`next`: يستقبلان `{props}` من Vuetify؛ اربطها بأزرار التنقل."
    ],
    "variables": [
      [
        "--wakeb-carousel-indicator-bg",
        "#98a2b3"
      ],
      [
        "--wakeb-carousel-indicator-active-bg",
        "#087f8c"
      ],
      [
        "--wakeb-carousel-focus",
        "#087f8c"
      ],
      [
        "--wakeb-carousel-fallback",
        "undefined (legacy adapter switch)"
      ]
    ],
    "events": [
      "`update:modelValue(index: number)` once for an actual local index change; syncing the same valid parent value is silent.",
      "`update:modelValue(index: number)` مرة عند تغيير الفهرس محليًا؛ مزامنة قيمة الأب الصالحة لا تكرر الحدث."
    ],
    "limits": [
      "The component keeps two root nodes, without a layout wrapper. Put it in a positioned parent because custom indicators are absolutely positioned 2rem above its bottom. Ordinary attrs target VCarousel. Native delimiters stay hidden; showIndicators controls the custom dots. Custom indicators are type=button, have accessible names/current state, and support Arrow Left/Right (reversed in RTL), Home/End and normal Enter/Space. Arrow slots retain Vuetify keyboard behavior. Slides render through Vuetify lazy items. Use finite indices in range and positive intervals. Autoplay uses Vuetify scheduling; it does not automatically pause on pointer hover or keyboard focus. The demo starts paused and exposes a cycle control. Use cycle=false for static/reduced-motion experiences; the indicator animation respects reduced motion, while slide transitions are Vuetify attrs. Labels and URLs/content come from the host. Aware keeps the original inverted hideDelimiters=true meaning through its adapter and retains the legacy missing indicator type. Aware disables the enhanced indicator keys/focus styling to retain its original behavior.",
      "المكوّن يحتفظ بجذرين دون حاوية إضافية. ضعه داخل أب position:relative لأن المؤشرات موضوعة absolute على بعد 2rem من أسفله. الخصائص العادية تستهدف VCarousel. مؤشرات Vuetify الأصلية مخفية، وshowIndicators يتحكم في المؤشرات المخصصة. المؤشرات العامة type=button ولها أسماء وحالة حالية وتدعم اليمين واليسار مع عكس RTL وHome/End وEnter/Space. أزرار السابق والتالي تحتفظ بسلوك Vuetify. الشرائح تُركب عند الحاجة. استخدم فهارس محدودة ضمن النطاق وفواصل زمنية موجبة. التشغيل التلقائي من Vuetify ولا يتوقف تلقائيًا عند hover أو التركيز؛ المثال يبدأ متوقفًا ويوفر تحكمًا في cycle. استخدم cycle=false للتجارب الثابتة أو قليلة الحركة؛ حركة المؤشرات تحترم reduced-motion وانتقالات الشرائح من خصائص Vuetify. المحتوى من المشروع. Aware يحتفظ بعكس معنى hideDelimiters=true وبسلوك type القديم للمؤشرات. Aware يعطل مفاتيح المؤشرات وتنسيق التركيز الإضافيين للاحتفاظ بالسلوك الأصلي."
    ],
    "example": "<div style=\"position:relative;height:240px\"><WCarousel :slides=\"['First', 'Second']\" :cycle=\"false\" show-indicators><template #slide=\"{slide}\">{{slide}}</template></WCarousel></div>",
    "playground": "CompositionPlayground"
  },
  {
    "name": "WExportDropdown",
    "slug": "export-dropdown",
    "interface": "ExportDropdownProps",
    "summary": [
      "An export-format picker that emits intent while the host owns permissions and file generation.",
      "قائمة صيغ تصدير ترسل الاختيار؛ المشروع يملك الصلاحيات وتوليد الملفات."
    ],
    "props": [
      [
        "isLoading",
        "boolean",
        "false",
        "Disable menu/activator while a host export is in progress.",
        "تعطيل القائمة والزر أثناء التصدير في المشروع."
      ],
      [
        "disabled",
        "boolean",
        "false",
        "Disable the menu and button.",
        "تعطيل القائمة والزر."
      ],
      [
        "title",
        "string",
        "\"Download\"",
        "Already translated button text.",
        "نص الزر مترجم مسبقًا."
      ],
      [
        "formats",
        "readonly ExportFormat[]",
        "PDF / XLSX",
        "Configurable labels, string values and optional icons/disabled flags.",
        "الأسماء والقيم النصية وأيقونات وحالات التعطيل الاختيارية."
      ],
      [
        "menuStyle",
        "CSSProperties",
        "undefined",
        "Direct styles on the teleported list.",
        "أنماط على القائمة المنقولة خارج الحاوية."
      ]
    ],
    "slots": [
      "`activator`: `{props,buttonProps}`. Bind menu props and button props, and attach your host permission directive there. `format-icon` / `format-label`: `{format,index}`.",
      "`activator`: يستقبل `{props,buttonProps}`؛ اربط خصائص القائمة والزر وضع directive صلاحيات المشروع هنا. `format-icon` و`format-label`: يستقبلان `{format,index}`."
    ],
    "variables": [
      [
        "--wakeb-export-button-height",
        "44px"
      ]
    ],
    "events": [
      "`select(value: string)` once for an enabled format. No file is generated or downloaded by the component.",
      "`select(value: string)` مرة لاختيار صيغة متاحة. المكوّن لا يولد ملفًا ولا ينزله."
    ],
    "limits": [
      "The root is VMenu, preserving its attrs/teleport contract. Default formats are PDF/pdf and Excel/xlsx with English labels; supply localized records. Inline SVG fallbacks need no icon font; optional format.icon uses the host Vuetify icon configuration. Loading disables the public default activator and menu; custom activators receive buttonProps and may preserve their existing loading contract. Permission checks, export state, network requests, MIME handling and download services stay in the host. Use the activator slot for directives; the package has no permission prop or auth dependency. menuStyle targets the actual teleported list. VMenu/VList provide outside-click, Escape and keyboard behavior. The default native action is button, and its default height is 44px.",
      "الجذر VMenu ويحتفظ بعقد الخصائص وteleport. الافتراضي PDF/pdf وExcel/xlsx بأسماء إنجليزية؛ مرر بيانات مترجمة. أيقونات SVG الافتراضية لا تحتاج خط أيقونات؛ format.icon الاختيارية تستخدم إعداد Vuetify للمشروع. التحميل يعطل الزر العام والقائمة؛ الـactivator المخصص يمكنه الحفاظ على سلوكه القديم. الصلاحيات وحالة التصدير والشبكة وتوليد الملف والتنزيل في المشروع. استخدم activator للصلاحيات؛ الحزمة لا تستقبل permission ولا تعتمد على auth. menuStyle يستهدف القائمة المنقولة. Vuetify يدير النقر الخارجي وEscape والكيبورد. نوع الزر button وارتفاعه الافتراضي 44px."
    ],
    "example": "<WExportDropdown title=\"Download report\" @select=\"format => console.log(format)\" />",
    "playground": "CompositionPlayground"
  },
  {
    "name": "WBaseSidebar",
    "slug": "base-sidebar",
    "interface": "BaseSidebarProps",
    "summary": [
      "A gradient sidebar shell with search/content slots, filter actions and loading/empty/list states.",
      "حاوية جانبية بخلفية متدرجة وslots للبحث والمحتوى وأزرار الفلترة وحالات القائمة."
    ],
    "props": [
      [
        "title",
        "string",
        "required",
        "Already translated heading.",
        "العنوان مترجم مسبقًا."
      ],
      [
        "loading",
        "boolean",
        "false",
        "Loading state takes precedence over empty/items.",
        "التحميل له أولوية على القائمة والحالة الفارغة."
      ],
      [
        "items",
        "readonly SidebarItem[]",
        "[]",
        "Presentational item records.",
        "عناصر العرض."
      ],
      [
        "skeletonType",
        "string",
        "\"list-item-two-line, list-item-two-line, list-item-two-line\"",
        "Vuetify skeleton type.",
        "نوع Skeleton في Vuetify."
      ],
      [
        "hasFilter",
        "boolean",
        "true",
        "Render default filter controls.",
        "إظهار أزرار الفلترة الافتراضية."
      ],
      [
        "isFiltered",
        "boolean",
        "false",
        "Render the default cancel control.",
        "إظهار زر إلغاء الفلتر."
      ],
      [
        "skeletonWidth",
        "string | number",
        "\"360px\"",
        "Vuetify skeleton width.",
        "عرض Skeleton."
      ],
      [
        "itemKey",
        "string",
        "\"id\"",
        "Direct key field, falling back to row index.",
        "حقل المفتاح المباشر؛ البديل فهرس الصف."
      ],
      [
        "filterLabel",
        "string",
        "\"Filter\"",
        "Default filter button text.",
        "نص زر الفلتر."
      ],
      [
        "cancelLabel",
        "string",
        "\"Cancel\"",
        "Default cancel button text.",
        "نص زر الإلغاء."
      ],
      [
        "emptyLabel",
        "string",
        "\"No data\"",
        "Already translated empty-state text.",
        "نص الحالة الفارغة مترجم مسبقًا."
      ]
    ],
    "slots": [
      "`header-actions`: `{isFiltered,filterClick,filterCancel}`; `content` / `search`: `{search(payload)}`; `item`: `{item,index}`; `loading`: `{type,width}`; `empty`: `{label}`; `filter-modal`: no props. The content slot replaces search and the list entirely.",
      "`header-actions`: يستقبل `{isFiltered,filterClick,filterCancel}`؛ `content` و`search`: يستقبلان `{search(payload)}`؛ `item`: يستقبل `{item,index}`؛ `loading`: يستقبل `{type,width}`؛ `empty`: يستقبل `{label}`؛ `filter-modal`: دون خصائص. content يستبدل البحث والقائمة بالكامل."
    ],
    "variables": [
      [
        "--wakeb-sidebar-outer-bg",
        "120deg conic gradient"
      ],
      [
        "--wakeb-sidebar-inner-bg",
        "240deg linear gradient"
      ],
      [
        "--wakeb-sidebar-body",
        "#fff"
      ],
      [
        "--wakeb-sidebar-body-rgb",
        "255,255,255"
      ],
      [
        "--wakeb-sidebar-title",
        "#fff"
      ],
      [
        "--wakeb-sidebar-empty-color",
        "#667085"
      ],
      [
        "--wakeb-sidebar-fallback",
        "undefined (legacy adapter switch)"
      ]
    ],
    "events": [
      "`search(payload: unknown)` only when a search/content slot calls its search callback; `filterClick()` and `filterCancel()` for controls. No records or schemas are mutated.",
      "`search(payload: unknown)` عندما يستدعي slot البحث دالة search؛ و`filterClick()` و`filterCancel()` للأزرار. لا تتغير العناصر أو schemas داخل المكوّن."
    ],
    "limits": [
      "Attrs target the outer div. The package owns no form/schema, store, translations or filter modal. Supply a native input or your form library through search and call search(payload). Aware retains GenericForm and updateSchema in its adapter. Without a search slot, the public component renders no search control. The header remains while content is replaced. Loading wins over empty/list. The default list keeps min-height 400px and max-height 60dvh, with a 340px minimum shell width; override root min-width for narrower responsive layouts. The bottom 72px fade is decorative and does not intercept pointers. Use namespaced CSS variables for gradients/body/title colors and loading/empty slots for custom states. Legacy global card-gradient/sidebar rules remain in Aware only; package styles are scoped. List item identity uses a direct field or index, and slots own item interactions.",
      "الخصائص على div الخارجي. الحزمة لا تملك form أو schema أو store أو ترجمة أو نافذة فلتر. وفر input أو مكتبة الفورم في search واستدعِ search(payload). Aware يحتفظ بـGenericForm وupdateSchema في adapter. دون search لا يظهر بحث افتراضي. يبقى الـheader عند استبدال المحتوى. التحميل له أولوية على الحالة الفارغة والقائمة. القائمة تحتفظ بحد أدنى 400px وأقصى 60dvh والحاوية بحد أدنى 340px؛ استبدل min-width للتصميم الأضيق. التلاشي السفلي 72px زخرفي ولا يمنع النقر. خصص الألوان عبر CSS والتحميل والحالة الفارغة عبر slots. أنماط card-gradient العامة القديمة تبقى في Aware فقط، وأنماط الحزمة scoped. هوية العنصر من حقل مباشر أو الفهرس وslot يملك التفاعل معه."
    ],
    "example": "<WBaseSidebar title=\"People\" :items=\"[{id:1,name:'Ada'}]\" :has-filter=\"false\"><template #item=\"{item}\">{{item.name}}</template></WBaseSidebar>",
    "playground": "CompositionPlayground"
  }
];
