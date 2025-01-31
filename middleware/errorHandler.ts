export default defineNuxtRouteMiddleware((to) => {
    const validPaths = ['/dashboard', '/profile', '/about'];

    if (!validPaths.includes(to.path)) {
        return navigateTo('/404');
    }
});