import services from "wakeb-components/_internal/selected/services";
import { createWakebComponents, type WakebComponentsOptions } from "../src";

/** The provider this Vitest project was compiled for, read from the selected build graph. */
export const framework = services.framework as "vuetify" | "primevue";
/** A fresh Wakeb plugin per mount, installed after the host provider so it is reused. */
export const wakeb = (options: Partial<WakebComponentsOptions> = {}) =>
  createWakebComponents({ framework, ...options } as WakebComponentsOptions);
