# Introduction

Wakeb Components provides seven focused primitives: truncated text, segmented progress, a semicircle gauge, avatar stacks, a loading indicator, page skeletons and vertical steps. Application colors, icons and translations stay in consumer adapters.

Vue 3.5 and Vuetify 3.13.2+ are peers. Import components by name from `wakeb-components`.
No registry plugin, route, store or auto-import convention is needed.

This first release deliberately excludes forms, tables, business badges, permission
rules, data fetching and application layouts. They need their own contracts before
extraction. A reusable component receives data and presentation choices; the
application owns business behavior.
