import DefaultTheme from "vitepress/theme";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "./style.css";
import ComponentPlayground from "../components/ComponentPlayground.vue";
export default { extends: DefaultTheme, enhanceApp({ app }) { app.use(createVuetify({ ssr: true })); app.component("ComponentPlayground", ComponentPlayground); } };
