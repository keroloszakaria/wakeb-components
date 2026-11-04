import { defineComponent } from "vue";

/** Renders its default slot only; stands in for optional wrapper primitives such as the tooltip parts. */
export default defineComponent({ name: "WakebPassthrough", setup: (_, { slots }) => () => slots.default?.() });
