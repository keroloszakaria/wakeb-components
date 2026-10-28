# Extraction roadmap

Thirteen display/action/disclosure components are extracted, with Aware paths retained as adapters. Reviewing the remaining common components identified the following contracts to separate before moving them.

| Group | Components | Prerequisite |
| --- | --- | --- |
| Navigation and lists | Tabs, Tree, Dropdown, Carousel, ExportDropdown, BaseSidebar | Specify selection, events, keyboard behavior and slots; preserve Carousel's inverted legacy hideDelimiters meaning in its adapter |
| Overlays | Modal, Drawer, AddEditModal | Separate header artwork, Button, save/loading logic and translations; verify focus, Escape and scroll locking |
| Tables and forms | Table, CardView, Card, GenericForm, AdvancedFiltersModal, CheckboxFilterDropdown, PageTabsFilter, ActiveToggleBadge | Separate schemas, permissions, enums/actions and jervis-form; reusable UI receives data and emits events |
| Dates and files | Calendar, DatePicker, DateTimeField, CurrentDataTime, FilePreview | Specify locale/timezone/format contracts and datepicker peers; isolate the clock timer lifecycle |
| Domain integrations | PlateCard, PlatePreview, Map, StreamingHandle, MediaMtxPlayer, RealtimeStreamManager, Kanban | Keep in map, streaming or board/domain integration packages with explicit peers |
| App services | ThemeToggle, ExpandableStatsCards, HandControlOverlay, HandControlToggle, VoiceControlToggle | Separate storage/theme, themed StatisticsCard resolution, camera/microphone services and feature state from presentation |
| Local composition | Suspenser | Already uses shared loading through the adapter; no additional public API is necessary now |

The Button/Badge/Accordion foundation is extracted in 0.3.0. Their compositions BadgeStack, UserBadge and TooltipBtn are extracted in 0.4.0. The next review covers lists and overlays. Each batch needs packed-consumer checks, Aware compatibility checks and documented props/events/slots before release.
