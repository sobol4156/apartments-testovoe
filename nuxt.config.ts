// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  css: ["~/shared/assets/css/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/shared/assets/css/variables.scss" as *;',
        },
      },
    },
    assetsInclude: ["**/*.woff2", "**/*.woff", "**/*.ttf"],
  },
});
