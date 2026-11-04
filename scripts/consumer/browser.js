import { createApp } from 'vue'
import 'wakeb-components/style.css'
import wakeb from './plugins/wakeb-components.js'
import { render } from './app.js'

createApp({ render: render(wakeb.capabilities.components) }).use(wakeb).mount('#app')
