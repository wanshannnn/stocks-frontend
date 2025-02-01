<script setup lang="ts">
defineProps<{ error: { statusCode: number } }>();

const goHome = () => {
  navigateTo('/');
};
</script>

<template>
  <div class="error-container">
    <h1 v-if="error?.statusCode === 404">页面不存在</h1>
    <h1 v-else>应用发生错误异常</h1>
    <el-button type="info" @click="goHome">返回首页</el-button>
  </div>
</template>

<style lang="scss" scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 80vh;
}
</style>