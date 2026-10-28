# Introduction

Wakeb Components starts with three focused display primitives: text truncation,
segmented progress and a semicircle gauge. They preserve the useful interaction
patterns extracted from Aware, while application-specific colors live in adapters.

Vue 3.5 and Vuetify 3 are peers. Import components by name from `wakeb-components`.
No registry plugin, route, store or auto-import convention is needed.

This first release deliberately excludes forms, tables, business badges, permission
rules, data fetching and application layouts. They need their own contracts before
extraction. A reusable component receives data and presentation choices; the
application owns business behavior.
