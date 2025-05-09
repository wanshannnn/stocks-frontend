<script setup lang="ts">
import { userRegister } from '~/api/user.ts';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { navigateTo } from "#app";

definePageMeta({
  layout: false,
});

const form = ref({
  username: '',
  account: '',
  password: '',
  repassword: '',
})

const registerRef = ref();

// 注册表单的校验规则
const samePwd = (rule: any, value: any, callback: any) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入的密码不一致!'));
  } else {
    callback();
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^.{1,20}$/, message: '用户名不能超过20位字符长度', trigger: 'blur' }
  ],
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,20}$/, message: '账号必须是1-20位字符长度的大小写字母或数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位字符长度的非空字符', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: samePwd, trigger: 'blur' }
  ]
}

const registerFn = async () => {
  const valid = await registerRef.value.validate()
  if (valid) {
    console.log('注册的表单ref:  ', registerRef)
    console.log('form.value:  ', form.value)
    const { data: res } = await userRegister(form.value)
    console.log(res);
    if (res.code !== 0) {
      console.log('注册失败！');
      return false;
    }
    ElMessage.success('注册成功!');
    await navigateTo('/user/login', { replace: true });
  } else {
    return false;
  }
}
</script>

<template>
  <div class="page_container">
    <!-- 背景动画 -->
    <div class="rain">
      <span style="--i:64;"></span>
      <span style="--i:33;"></span>
      <span style="--i:21;"></span>
      <span style="--i:95;"></span>
      <span style="--i:42;"></span>
      <span style="--i:17;"></span>
      <span style="--i:88;"></span>
      <span style="--i:50;"></span>
      <span style="--i:10;"></span>
      <span style="--i:77;"></span>
      <span style="--i:3;"></span>
      <span style="--i:29;"></span>
      <span style="--i:72;"></span>
      <span style="--i:5;"></span>
      <span style="--i:90;"></span>
      <span style="--i:49;"></span>
      <span style="--i:14;"></span>
      <span style="--i:61;"></span>
      <span style="--i:38;"></span>
      <span style="--i:81;"></span>
      <span style="--i:64;"></span>
      <span style="--i:33;"></span>
      <span style="--i:21;"></span>
      <span style="--i:95;"></span>
      <span style="--i:42;"></span>
      <span style="--i:17;"></span>
      <span style="--i:88;"></span>
      <span style="--i:50;"></span>
      <span style="--i:10;"></span>
      <span style="--i:77;"></span>
      <span style="--i:3;"></span>
      <span style="--i:29;"></span>
      <span style="--i:72;"></span>
      <span style="--i:5;"></span>
      <span style="--i:90;"></span>
      <span style="--i:49;"></span>
      <span style="--i:14;"></span>
      <span style="--i:61;"></span>
      <span style="--i:38;"></span>
      <span style="--i:81;"></span>
      <span style="--i:21;"></span>
      <span style="--i:95;"></span>
      <span style="--i:42;"></span>
      <span style="--i:17;"></span>
      <span style="--i:88;"></span>
      <span style="--i:50;"></span>
      <span style="--i:10;"></span>
      <span style="--i:77;"></span>
      <span style="--i:3;"></span>
      <span style="--i:29;"></span>
      <span style="--i:14;"></span>
      <span style="--i:61;"></span>
    </div>
    <div class="register_container">
      <div class="title_container">注 册</div>
      <el-form :model="form" label-width="0px" :rules="rules" ref="registerRef">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="account">
          <el-input placeholder="请输入账户" v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input type="password" placeholder="请再次确认密码" v-model="form.repassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="register_btn" @click="registerFn">注册</el-button>
          <el-link class="router" type="info" @click="navigateTo('/user/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.page_container {
  width: 100%;
  height: 100vh;
  background-size: cover;
  overflow: hidden;
}

.page_container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  /* 黑色半透明 */
  z-index: 1;
  /* 确保伪元素在背景图之上 */
}

.rain {
  position: relative;
  display: flex;
}

.rain span {
  position: relative;
  width: 20px;
  height: 20px;
  background-color: #eee;
  margin: 0 4px;
  border-radius: 50%;
  box-shadow: 0 0 10px 5px rgba(238, 238, 238, 0.5),
    /* 微调颜色和透明度 */
  0 0 30px 15px rgba(238, 238, 238, 0.3),
    /* 模糊半径和扩散范围 */
  0 0 50px 30px rgba(221, 221, 221, 0.2);
  animation: animate 15s linear infinite;
  animation-duration: calc(200s / var(--i));
}

.rain span:nth-child(even) {
  background: var(--color-primary-light);
  /* 橙色调 */
  box-shadow: var(--color-secondary-light),
  /* 颜色和透明度 */
  0 0 30px 15px rgba(106, 90, 205, 0.3),
  0 0 50px 30px rgba(72, 61, 139, 0.1);
}


@keyframes animate {
  0% {
    transform: translateY(100vh) scale(0);
  }

  100% {
    transform: translateY(-10vh) scale(1);
  }
}

.register_container {
  z-index: 10;
  width: min(400px, 80%);
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 0 30px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  box-shadow: #dddddd 0 0 100px;

  .title_container {
    height: 60px;
    line-height: 60px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: var(--color-primary-light);
    margin-bottom: 20px;
  }

  .register_btn {
    width: 100%;
  }

  .router {
    text-align: left;
  }

  .el-link {
    margin-top: 20px;
  }
}
</style>
