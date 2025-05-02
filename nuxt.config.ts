import path from "node:path";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  pages: true,
  vite: {
    vueJsx: {
      mergeProps: true
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
  },
  css: [
    "@/assets/style/variable.scss",
    "@/assets/style/element-plus.scss",
    "@/assets/style/btn.scss",
  ],
  plugins: [
    { src: '~/plugins/mock.client.ts', mode: 'client' }
  ],
})
