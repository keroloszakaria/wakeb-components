// Minimal consumer used to prove per-component tree shaking against browser.js.
import { createApp, h } from 'vue'
import { WButton } from 'wakeb-components'
import 'wakeb-components/style.css'
import wakeb from './plugins/wakeb-components.js'

createApp({ render: () => h(WButton, { title: 'Only button' }) }).use(wakeb).mount('#app')
