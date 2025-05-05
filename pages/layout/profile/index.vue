<script setup lang="ts">
import {useLoginStore} from "~/stores/useLoginStore.ts";
import { getPassageList } from '~/api/passage.ts';
import { navigateTo } from '#app';
import type { Passage } from '@/types/passage.ts';
import { debounce } from 'lodash';

definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
  roles: ['admin', 'user'],
});

// 数据
// 遮罩层
const loading = ref(true);
// 用户信息
const user = useLoginStore().loginUser;
// 动态数据
const activities = ref([
  { timestamp: "2025-01-15 10:00", message: "发表了文章《看19-24年财报》" },
  { timestamp: "2025-01-14 14:30", message: "昨日收益: +200.00" },
  { timestamp: "2025-01-13 09:20", message: "昨日收益：-100.00" },
  { timestamp: "2025-01-12 16:45", message: "昨日收益：+30.00" },
]);
// 有无文章未加载
const noMore = ref(false);
// 文章列表
const passageList = ref<Passage[]>([]);
// 查询文章列表参数
const passageListQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 文章列表容器DOM
const passageContainerRef = ref();

// 方法
// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
}
// 查询文章列表
const fetchPassageList = async () => {
  loading.value = true;
  const {data: res} = await getPassageList(passageListQueryParams);
  passageList.value.push(...res.data.list);
  console.log('passageListQueryParams:', passageListQueryParams, 'passageList:', passageList);
  if (res.data.list.length < passageListQueryParams.pageSize) {
    noMore.value = true;
  }
  passageListQueryParams.pageNum++;
  loading.value = false;
  console.log('noMore: ', noMore.value);
}
// 文章滚动加载
const handleScroll = debounce(() => {
  if (loading.value || noMore.value) return;
  const scrollTop = document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  if (scrollTop + windowHeight >= documentHeight - 10) {
    fetchPassageList();
  }
}, 300)

// 初始化
onMounted(async () => {
  await fetchPassageList();
  window.addEventListener('scroll', handleScroll, { passive: true })
});
// 卸载监听器
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <el-row class="profile-container">
    <!-- 左侧个人信息 -->
    <el-col :xs="24" :span="6" class="personal-container">
      <!-- 用户简介 -->
      <el-card class="user-info-card">
        <el-skeleton v-if="loading" style="--el-skeleton-circle-size: 60px">
          <template #template>
            <el-skeleton-item variant="circle" />
            <el-skeleton :rows="1" animated style="padding: 20px;" />
          </template>
        </el-skeleton>
        <div v-else>
          <el-row>
            <el-col :span="8">
              <el-avatar class="user-avatar" size="large" />
            </el-col>
            <el-col :span="16">
              <p class="profile-title">{{ user?.username }}</p>
              <p class="profile-text">{{ user?.bio }}</p>
            </el-col>
          </el-row>
          <el-row justify="space-between" align="middle">
            <el-col :span="8" class="stat">
              <p class="profile-text">关注</p>
              <p>{{ user?.followerCount || 0 }}</p>
            </el-col>
            <el-col :span="8" class="stat">
              <p class="profile-text">粉丝</p>
              <p>{{ user?.followingCount || 0 }}</p>
            </el-col>
            <el-col :span="8" class="stat">
              <p class="profile-text">文章</p>
              <p>{{ user?.passageCount || 0 }}</p>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <div class="news-card" style="margin-top: 30px">
        <p class="activity" style="font-weight: bold">动态</p>
        <el-skeleton :rows="5" animated v-if="loading" style="padding: 20px;" />
        <el-timeline v-else>
          <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
              placement="bottom">
            <p class="profile-text">{{ activity.message }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-col>

    <!-- 右侧个人动态 -->
    <el-col :xs="24" :span="18" class="passage-container">
      <el-skeleton :rows="5" animated v-if="loading" style="padding: 20px;" />
      <div class="passage-container" @scroll.passive="handleScroll" ref="passageContainerRef" v-else>
        <div v-for="passage in passageList" :key="passage.passageId" class="passage-card" @click="navigateTo(`/layout/passage/${passage.passageId}`)">
          <div class="date">{{ formatDate(passage.createdAt) }}</div>
          <h2 class="title">{{ passage.title }}</h2>
          <p class="preview">{{ passage.preview }}</p>
        </div>
        <div v-if="noMore" class="no-more">没有更多了</div>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.personal-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.personal-news {
  display: flex;
  flex-direction: column;
}

.user-info-card {
  padding: 20px;
}

.profile-title {
  margin: 10px;
  font-family: 'Georgia', serif;
  font-size: 20px;
  font-weight: bold;
  color: var(--color-text-primary);
}

.personal-container, .passage-container {
  padding: 20px;
}

.passage-card {
  background-color: var(--color-background);
  border: 1px, solid, var(--color-gray-light);
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.passage-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.date {
  font-size: 0.8em;
  color: var(--color-gray-dark);
}

.title {
  margin: 12px 0 8px;
  font-size: 1.3em;
  font-weight: bold;
  color: var(--color-text-primary);
}

.preview {
  font-size: 1em;
  color: var(--color-gray-dark);
  line-height: 1.6;
}

.loading,
.no-more {
  text-align: center;
  color: var(--color-gray-dark);
  padding: 12px 0;
}
</style>