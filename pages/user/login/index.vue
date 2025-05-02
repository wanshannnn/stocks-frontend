<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useLoginStore } from '@/stores/useLoginStore.ts';
import { userLogin } from '~/api/user.ts';
import { navigateTo } from "#app";

definePageMeta({
  layout: false,
});

let loginForm = reactive({
  account: "",
  password: "",
});

const loginRef = ref();

const rules = {
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9]{1,20}$/, message: "账号必须是1-20个字符长度的数字或英文字母", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15个字符长度的非空字符', trigger: 'blur'}
  ]
}

const login = async () => {
  console.log('loginRef:', loginRef.value);
  const valid = await loginRef.value.validate();
  if (valid) {
    const { data: res } = await userLogin(loginForm);
    console.log(res);
    if (res.code === 0 && res.data) {
      useLoginStore().setLoginUser(res.data);
      ElMessage.success("登陆成功");
      await navigateTo('/');
    }
  } else {
    ElMessage.error("登陆失败")
    return false;
  }
}
</script>

<template>
  <div class="login_container">
    <el-row>
      <!-- xs用于响应式布局，在小屏幕下取消左侧留空-->
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登陆表单 -->
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginRef">
          <h1>登陆</h1>
          <el-form-item prop="account">
            <el-input placeholder="请输入账号" :prefix-icon="User" v-model="loginForm.account"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码" :prefix-icon="Lock" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item class="login_and_register">
            <el-button class="login_btn" type="primary" @click="login">登陆</el-button>
            <el-button type="info" @click="navigateTo('/user/register')">注册</el-button>
            <el-link class="router" type="info" @click="navigateTo('/layout/dashboard')">跳过登陆</el-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 禁止页面滚动 */
}

.login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  top: 10vh;
  height: 100vh;
  background: url('assets/images/login_background_pc.png') no-repeat;
  background-size: cover;  /* 背景图保持比例并填充整个屏幕 */
  background-position: center center;  /* 背景图居中 */

  /* 用 Flexbox 来确保表单居中 */
  .login_form {
    background-color: rgba(255, 255, 255, 0.8);  /* 半透明背景 */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
    width: 30vw;
    height: 40vh;
    box-sizing: border-box;
  }

  .login_form h1 {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .el-form-item {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;

    .el-input {
      width: 100%;
    }

    .login_and_register {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .el-button {
      height: 40px;
      font-size: 16px;
      border-radius: 4px;
      padding: 10px;
      margin-top: 20px;
      text-align: center;
      flex: 1;
      margin: 5px;
    }
  }
}

/* 手机端样式：使用不同的背景图，并调整布局 */
@media (max-width: 768px) {
  .login_container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;  /* 确保容器填充整个屏幕 */
    background: url('assets/images/login_background_mobile.png') no-repeat;
    background-size: cover;  /* 背景图保持比例并填充整个屏幕 */
    background-position: center center; /* 背景图居中 */

    .login_form {
      width: 80vw;  /* 更大的宽度 */
      height: auto;  /* 高度自适应 */
      padding: 20px;
    }

    .login_form h1 {
      font-size: 20px;  /* 调整标题字体大小 */
    }

    /* 按钮设置 */
    .login_and_register {
      flex-direction: column;  /* 在小屏幕上垂直排列 */
      justify-content: center;
      width: 100%;
    }

    .login_btn, .el-button {
      width: 100%;  /* 确保按钮宽度为100% */
      margin: 5px 0;  /* 按钮之间的垂直间距 */
    }
  }
}

</style>
