// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "node:path";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    vue: {
      customElement: true
    },
    vueJsx: {
      mergeProps: true
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/base.css";`
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
  },
})
