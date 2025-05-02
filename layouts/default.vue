<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { fixPwd } from '@/api/user.ts';
import { useLoginStore } from '@/stores/useLoginStore.ts';
import { useThemeStore } from '@/stores/useThemeStore.ts';
import { storeToRefs } from 'pinia';
import { navigateTo } from '#app';

// 数据
// 亮/暗模式
const { isDark } = storeToRefs(useThemeStore());
// 用户名
const username = computed(() => useLoginStore().loginUser?.username ?? '未登录');
// 显示修改密码对话框
const dialogFormVisible = ref(false);
// 修改密码表单DOM
const pwdRef = ref();
// 修改密码表单
const form = reactive({
  oldPwd: '',
  newPwd: '',
  rePwd: '',
})
// 侧边栏展开/折叠
const isCollapse = ref(false);
// 侧边栏路径
const activeAside = computed(() => useRoute().path);
// 侧边栏内容
const menuList = [
  {
    title: ' 首页',
    path: '/layout/dashboard',
    icon: 'House',
  },
  {
    title: '最新行情',
    path: '/layout/market',
    icon: 'TrendCharts',
  },
  {
    title: '最新资讯',
    path: '/layout/passage',
    icon: 'Document',
  },
  {
    title: '走势分析',
    path: '/layout/analysis',
    icon: 'DataAnalysis',
  },
  {
    title: '我的股票',
    path: '/layout/mystocks',
    icon: 'Ticket',
  },
  {
    title: '用户管理',
    path: '/layout/management',
    icon: 'Management',
  },
  {
    title: '个人中心',
    path: '/layout/profile',
    icon: 'User',
  },
];

// 方法
// 切换亮暗
const toggle = () => useThemeStore().toggleTheme();
// 校验两次输入密码是否相同
const samePwd = (rules: any, value: any, callback: any) => {
  if (value !== form.newPwd) {
    callback(new Error('两次输入的密码不一致!'));
  } else {
    callback();
  }
}
// 校验规则
const rules = {
  oldPwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '原密码必须是6-15位字符长度的非空字符', trigger: 'blur' }
  ],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '新密码必须是6-15位字符长度的非空字符', trigger: 'blur' }
  ],
  rePwd: [
    { required: true, message: '请再次确认新密码', trigger: 'blur' },
    { validator: samePwd, trigger: 'blur' }
  ]
}
// 监听
const handleResize = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    isCollapse.value = true;
  } else {
    isCollapse.value = false;
  }
};
// 关闭修改密码对话框
const cancelForm = () => {
  ElMessage({
    type: 'info',
    message: '已取消修改',
  })
  dialogFormVisible.value = false;
}
// 修改密码
const fixPassword = async () => {
  const valid = await pwdRef.value.validate();
  if (valid) {
    const submitForm = {
      oldPwd: form.oldPwd,
      newPwd: form.newPwd,
    }
    console.log('要提交的表单信息');
    console.log(submitForm);
    const { data: res } = await fixPwd(submitForm);
    console.log('res:', res);
    if (res.code === 0) return ElMessage({
      type: 'success',
      message: '修改成功',
    })
    dialogFormVisible.value = false;
    useLoginStore().clearLoginUser();
    await navigateTo('/user/login');
  } else {
    return ElMessage({
      type: 'error',
      message: '修改失败',
    })
  }
}
// 登出
const quitFn = () => {
  ElMessageBox.confirm(
    '请确认退出登录',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
  .then(() => {
    useLoginStore().clearLoginUser();
    ElMessage({
      type: 'success',
      message: '退出成功',
    })
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消退出',
    })
  })
}

// 监听窗口大小变化
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});
// 移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="home-container">
    <el-container>
      <!-- 侧边栏 -->
      <!-- isCollapse 用于判断侧边栏是否展开 -->
      <!-- getActiveAside 用于动态返回当前路由的路径，从而确定哪个菜单项应该被高亮显示 -->
      <!-- unique-opened router 用于点击侧边栏时进行路径跳转 -->
      <el-menu :default-active="activeAside"
               :width="isCollapse ? '60px' : '200px'" :collapse="isCollapse"
               unique-opened router>
        <template v-for="item in menuList" :key="item.path">
          <el-menu-item :index="item.path">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span v-if="!isCollapse">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>

      <el-container class="header-container">
        <!-- 顶部栏 -->
        <el-header>
          <!-- 控制侧边栏是否展开 -->
          <el-icon class="icon" v-if="isCollapse">
            <Expand @click.stop="isCollapse = !isCollapse" />
          </el-icon>
          <el-icon class="icon" v-else>
            <Fold @click.stop="isCollapse = !isCollapse" />
          </el-icon>
          <!-- 用户名组件 -->
          <client-only>
          <div class="header-container-item">
            <el-dropdown>
              <button class="pan-btn primary-btn"  style="width: 100px; height: 36px; display: flex; align-items: center; justify-content: center; margin: 5px">
                {{ username }}
              </button>
              <template #dropdown>
                <el-dropdown-menu v-if="useLoginStore().loginUser">
                  <el-dropdown-item @click="dialogFormVisible = true">修改密码</el-dropdown-item>
                  <el-dropdown-item @click="quitFn">退出登陆</el-dropdown-item>
                </el-dropdown-menu>
                <el-dropdown-menu v-else>
                  <el-dropdown-item @click="navigateTo('/user/login')">去登陆</el-dropdown-item>
                  <el-dropdown-item @click="navigateTo('/user/register')">去注册</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          </client-only>
          <!-- 亮暗切换 -->
          <div class="header-container-item">
            <button @click="toggle" class="pan-btn primary-btn"  style="width: 100px; height: 36px; display: flex; align-items: center; justify-content: center; margin: 5px">
              <span v-if="isDark">🌙 暗色</span>
              <span v-else>☀️ 亮色</span>
            </button>
          </div>
          <!-- Github -->
          <div class="header-container-item">
            <a href="https://github.com/wanshannnn" style="float: right; margin-top: -8px">
              <img
                  src="../assets/icons/github.svg"
                  alt="Github"
                  style="width: 36px; height: 36px; transform: translate(0px, 12px);"
                  class="github-icon"
              />
            </a>
          </div>
        </el-header>

        <!-- 主体部分 -->
        <el-main class="main-container" >
          <NuxtPage />
        </el-main>
      </el-container>
    </el-container>


    <!-- 修改密码对话框 -->
    <client-only>
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500">
      <el-form :model="form" :rules="rules" ref="pwdRef">
        <el-form-item prop="oldPwd" label="原密码" width='80px'>
          <el-input v-model="form.oldPwd" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码" width='80px'>
          <el-input v-model="form.newPwd" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="rePwd" label="确认密码" width='80px'>
          <el-input v-model="form.rePwd" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelForm" class="cancel-button">取消</el-button>
          <el-button type="primary" @click="fixPassword">确定</el-button>
        </div>
      </template>
    </el-dialog>
    </client-only>
  </div>
</template>

<style lang="scss" scoped>
.home-container {
  height: 100vh;
  background-color: var(--color-surface);
  display: flex;
}

.el-header {
  background-color: var(--color-surface);
  line-height: 60px;
}

@media (max-width: 768px) {
  .el-dropdown, .el-dropdown .el-button {
    display: none;
  }
}

.header-container-item {
  float: right;
  margin: 10px;
}

@media (max-width: 768px) {
  .header-container-item {
    display: none;
  }
}

.el-menu {
  padding: 60px 0 0 0;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border-right: 1px solid var(--color-border);
}

.el-menu-item {
  padding-right: 30px;
  color: var(--color-text-primary);
  font-size: 12px;
  display: flex;
  justify-content: left;
  height: 48px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: var(--color-hover-light);
    color: var(--color-primary);
  }
}

.el-menu-item.is-active {
  background-color: var(--color-hover);
  color: var(--color-text-light);
  font-weight: bold;
  border-left: 4px solid var(--color-primary);
}
</style>
