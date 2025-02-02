<script setup lang="ts">
import { index } from '~/store';
import {  onMounted } from "vue";
import { getIndexesAPI } from "@/api/indexes.ts";

const History = defineAsyncComponent(() =>
    import('@/components/history.vue')
);
const Latest = defineAsyncComponent(() =>
    import('@/components/latest.vue')
);

const loginUserStore = index();

const username = ref('未登录用户');
onMounted(() => {
  username.value = loginUserStore.loginUser?.username ?? '未登录用户';
});

const today = ref('');
onMounted(() => {
  today.value = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());
});

const indexes = ref({
  SHCOMP: 0,
  SZCOMP: 0,
  ChiNext: 0,
  CSI300: 0
});
onMounted(async () => {
  try {
    const res = await getIndexesAPI();
    if (res.data.code === 0) {
      indexes.value = res.data.data;
    } else {
      console.error('获取指数数据失败');
    }
  } catch (error) {
    console.error('请求指数数据失败', error);
  }
});

</script>

<template>
  <p class="welcome">Welcome, {{ username }}</p>
  <p class="current-date">Today：{{ today }}</p>
  <div class="dashboard-container">
    <!-- 指数 -->
    <el-row>
      <el-col :xs="24" :span="6">
        <div class="index-container">
          <h3>SHCOMP</h3>
          <h4>{{ indexes.SHCOMP }}</h4>
        </div>
      </el-col>
      <el-col :xs="24" :span="6">
        <div class="index-container">
          <h3>SZCOMP</h3>
          <h4>{{ indexes.SZCOMP }}</h4>
        </div>
      </el-col>
      <el-col :xs="24" :span="6">
        <div class="index-container">
          <h3>ChiNext</h3>
          <h4>{{ indexes.ChiNext }}</h4>
        </div>
      </el-col>
      <el-col :xs="24" :span="6">
        <div class="index-container">
          <h3>CSI300</h3>
          <h4>{{ indexes.CSI300 }}</h4>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <!-- 趋势图-->
      <el-col :xs="24" :sm="12" :md="10">
        <div class="history-graph-container">
          <ClientOnly>
            <History/>
          </ClientOnly>
        </div>
      </el-col>
      <!-- 最新数据 -->
      <el-col :xs="24" :sm="12" :md="14">
        <div class="latest-stock-container">
          <ClientOnly>
            <Latest/>
          </ClientOnly>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.welcome {
  margin-left: 20px;
  margin-bottom: -10px;
  font-family: 'Georgia', serif;
  font-size: 30px;
  font-weight: bold;
  color: var(--color-text-primary);
}

.current-date {
  margin-left: 25px;
  font-family: 'Georgia', serif;
  font-size: 15px;
  font-weight: bold;
  color: var(--color-text-primary);
}

h3 {
  margin: 10px;
  text-align: center;
  font-family: 'Georgia', serif;
  font-size: max(1.2vw, 10px);
  font-weight: bold;
  color: var(--color-text-primary);
}

h4 {
  margin: 10px;
  text-align: center;
  font-family: 'Georgia', serif;
  font-size: max(1.2vw, 10px);
  font-weight: bold;
  color: var(--color-text-secondary);
}

.index-container {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-sizing: border-box;
  margin: 20px;
}
@media(max-width: 768px) {
  .index-container {
    margin: 5px;
  }
}

.history-graph-container {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-sizing: border-box;
  padding: 20px;
  margin: 10px;
}
@media(max-width: 768px) {
  .history-graph-container {
    padding: 10px;
    margin: 5px;
  }
}

.latest-stock-container {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-sizing: border-box;
  padding: 20px;
  margin: 10px;
}
@media(max-width: 768px) {
  .latest-stock-container {
    padding: 10px;
    margin: 5px;
  }
}
</style>
