import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDark: false,
    }),
    actions: {
        toggleTheme() {
            this.isDark = !this.isDark
            if (this.isDark) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        },
        initTheme() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            this.isDark = prefersDark
            if (prefersDark) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        },
    },
})