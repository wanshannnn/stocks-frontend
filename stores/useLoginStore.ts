import { defineStore } from 'pinia';
import { getCurrentUser } from '@/api/user.ts';
import type { User } from '@/types/user.ts';

export const useLoginStore = defineStore('loginUser', {
    state: () => ({
        loginUser: useCookie<User | null>('loginUser', { default: () => null }),
    }),
    actions: {
        async fetchLoginUser() {
            const res = await getCurrentUser();
            if (res.data.code === 0 && res.data.data) {
                this.loginUser = res.data.data;
            }
        },
        setLoginUser(newLoginUser: User | null) {
            this.loginUser = newLoginUser;
        },
        clearLoginUser() {
            this.loginUser = null;
        },
    },
});
