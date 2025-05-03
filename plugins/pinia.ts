import { createPinia } from 'pinia';
import ElementPlus, {ID_INJECTION_KEY} from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import piniaPersist from 'pinia-plugin-persistedstate';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide(ID_INJECTION_KEY, {
        prefix: Math.floor(Math.random() * 1000),
        current: 0,
    });

    const app = nuxtApp.vueApp;
    const pinia = createPinia()
    pinia.use(piniaPersist)
    app.use(pinia)
    app.use(ElementPlus)

    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
})