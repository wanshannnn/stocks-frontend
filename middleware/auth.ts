import {useLoginStore} from "../stores/useLoginStore.ts";

export default defineNuxtRouteMiddleware((to, from) => {
    const loginUserStore = useLoginStore();

    if (to.meta.requiresAuth && !loginUserStore.loginUser) {
        return navigateTo('/user/login');
    }

    return true;
});