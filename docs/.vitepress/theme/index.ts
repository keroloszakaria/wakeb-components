import DefaultTheme from "vitepress/theme";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "./style.css";
import ComponentPlayground from "../components/ComponentPlayground.vue";
import FoundationPlayground from "../components/FoundationPlayground.vue";
import IdentityPlayground from "../components/IdentityPlayground.vue";
import NavigationPlayground from "../components/NavigationPlayground.vue";
export default { extends: DefaultTheme, enhanceApp({ app }) { app.use(createVuetify({ ssr: true })); app.component("ComponentPlayground", ComponentPlayground); app.component("FoundationPlayground", FoundationPlayground); app.component("IdentityPlayground", IdentityPlayground); app.component("NavigationPlayground", NavigationPlayground); } };
