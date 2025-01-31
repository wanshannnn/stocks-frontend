import { createPinia } from 'pinia';
import '@/assets/base.css'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import piniaPersist from 'pinia-plugin-persistedstate';
import '@/utils/mock';

export default defineNuxtPlugin((nuxtApp) => {
    const app = nuxtApp.vueApp;
    const pinia = createPinia()
    pinia.use(piniaPersist)
    app.use(pinia)
    app.use(ElementPlus)

    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
})