import { createRouter, createWebHistory } from 'vue-router';
import { index } from '~/store';

const constantRoute = [
  {
    path: '/user/login',
    component: () => import('~/pages/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
      hidden: true,
      icon: '',
      requiresAuth: false,
    },
  },
  {
    path: '/user/register',
    component: () => import('~/pages/register/index.vue'),
    name: 'register',
    meta: {
      title: '注册',
      hidden: true,
      icon: '',
      requiresAuth: false,
    },
  },
  {
    path: '/404',
    component: () => import('~/pages/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: '',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    component: () => import('~/pages/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
      icon: '',
      requiresAuth: false,
    },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('~/pages/layout/dashboard/index.vue'),
        name: 'dashboard',
        meta: {
          title: 'Dashboard',
          icon: 'House',
          requiresAuth: false,
        },
      },
      {
        path: '/mystocks',
        component: () => import('~/pages/layout/mystocks/index.vue'),
        name: 'mystocks',
        meta: {
          title: 'MyStocks',
          icon: 'Document',
          requiresAuth: true,
          roles: [0, 1]
        },
      },
      {
        path: '/management',
        component: () => import('~/pages/layout/management/index.vue'),
        name: 'management',
        meta: {
          title: 'Management',
          icon: 'Management',
          requiresAuth: true,
          roles: 1
        },
      },
      {
        path: '/profile',
        component: () => import('~/pages/layout/profile/index.vue'),
        name: 'profile',
        meta: {
          title: 'Profile',
          icon: 'User',
          requiresAuth: true,
          roles: [0, 1]
        },
      },
    ],
  },
];

// 任意路由，用于将任何未匹配到的路径重定向到404页面
const anyRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  name: 'any',
  meta: {
    title: '任意路由',
    hidden: true,
    icon: '',
    requiresAuth: false,
  },
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoute, anyRoute],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }; // 页面滚动至顶部
  },
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const loginUserStore = index();

  if (to.meta.requiresAuth && !loginUserStore.loginUser) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;