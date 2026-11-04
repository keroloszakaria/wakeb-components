/* Internal specifiers resolved by wakebComponents(); see src/build/vite.ts. */
declare module "wakeb-components/_internal/selected/services" {
  const services: import("./core/options").WakebProviderServices;
  export default services;
}
declare module "wakeb-components/_internal/selected/*" {
  const renderer: import("vue").Component;
  export default renderer;
}
