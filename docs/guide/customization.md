# Customization

Use the default rendering first. Props control data and normal presentation.
Slots replace visual content; attributes and listeners reach the existing root
(or the text span for WTruncatedText). See each API page for the full contract.

```vue
<WSegmentedProgress :value="65" aria-label="Storage used: 65 percent">
  <template #default="{ value }"><strong>{{ value }} GB used</strong></template>
</WSegmentedProgress>
```

Namespaced CSS variables keep shared code independent of your design system:

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
<WTruncatedText label="A long label" :length="6"
  :tooltip-style="{ background: '#101828', color: '#fff' }" />
```

The tooltip is teleported; use `tooltipStyle` or `contentClass` for its content.
A CSS variable on the activator alone does not automatically reach a teleported
overlay. Keep Vue reactivity in the application using refs and computed values.
RTL is inherited from the surrounding `dir` attribute; the tooltip uses Vuetify's
locale direction. Register Vuetify with your application's locale configuration.


## Foundation icons and states

WButton and WBadge default to VIcon. Use your host Vuetify icon configuration or supply SVG through slots. WAccordion uses WButton for indicators. The package needs no global SvgIcon, permission service or i18n instance. Name icon-only buttons with aria-label and pass localized toggleLabel text.

--wakeb-button-fallback, --wakeb-badge-fallback and --wakeb-accordion-fallback are reserved for compatibility adapters; leave them undefined in normal use. Aware supplies an invalid CSS-value sentinel so missing legacy tokens retain their original CSS behavior. Use the documented color/size variables for ordinary customization.


## Badge compositions and tooltip buttons

WBadgeStack supports `icon`, `badgeIcon` and `label` slots. Pass already formatted records; keep themed detection icons in the application. Use `menuStyle` on the teleported list and `badgeAttrs` for per-badge attributes/styles. WUserBadge offers avatar, name and actions slots; its initials size uses `--wakeb-user-badge-initials-size`. WTooltipBtn receives translated `text`, native VBtn attrs and an optional SVG icon slot. Use `tooltipStyle` for the teleported tooltip. The [component reference](/components/badge-stack) documents all defaults and limits.


## Navigation

Use WTabs tab-label/tab-icon slots for company icons and trusted content. Set WTree activeKey and expandedKeys from its events; custom action controls belong in actions or must stop their own click propagation. WDropdown accepts a host labelFormatter, colorMap, menuStyle and router-link through item-label. Keep routing, translation instances and application permissions in the host. See [Tabs](/components/tabs), [Tree](/components/tree) and [Dropdown](/components/dropdown) for exact defaults and keyboard contracts.
