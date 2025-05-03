<script setup lang="ts">
import {navigateTo} from '#app';
import { getPassageList } from '~/api/passage.ts';
import type { Passage } from '@/types/passage.ts'
import type { TabsPaneContext } from 'element-plus'
import { debounce } from 'lodash';

// 数据
// 遮罩层
const loading = ref(true);
// 有无文章未加载
const noMore = ref(false);
// 文章列表
const passageList = ref<Passage[]>([]);
// 最热文章
const hotPassageList = ref<Passage[]>([]);
// 文章列表容器DOM
const passageContainerRef = ref();
// 选中标签页
const activeName = ref('article')
// 查询文章列表参数
const passageListQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  type: activeName.value,
});

// 方法
// 切换标签页
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
  passageList.value = []
  fetchPassageList();
}
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
  <div class="passage-container">
    <el-row>
      <!-- 文章列表 -->
      <el-col :span="18" class="left-container">
        <el-tabs
            v-model="activeName"
            type="card"
            class="demo-tabs"
            @tab-click="handleClick"
        >
          <el-tab-pane label="讨论" name="article"></el-tab-pane>
          <el-tab-pane label="资讯" name="news"></el-tab-pane>
        </el-tabs>
        <div class="passage-container" @scroll.passive="handleScroll" ref="passageContainerRef">
          <div v-for="passage in passageList" :key="passage.passageId" class="passage-card" @click="navigateTo(`/layout/passage/${passage.passageId}`)">
            <div class="header">
              <img :src="passage.authorAvatar" alt="头像" class="avatar" />
              <div class="info">
                <div class="author">{{ passage.authorName }}</div>
                <div class="date">{{ formatDate(passage.createdAt) }}</div>
              </div>
            </div>
            <h2 class="title">{{ passage.title }}</h2>
            <p class="preview">{{ passage.preview }}</p>
          </div>
          <div v-if="loading" class="loading">加载中...</div>
          <div v-if="noMore" class="no-more">没有更多了</div>
        </div>
      </el-col>

      <!-- 热门文章 -->
      <el-col :xs="24" :span="6" class="right-container">
        <div class="hot-passage-container">
          <span style="font-size: 1.5em; font-weight: bold">热门文章</span>
        </div>
        <hr class="divider" />
        <div class="hot-passage-list">
          <div v-for="(passage, index) in passageList" :key="passage.passageId" class="hot-passage-item">
            <span class="passage-index">{{ index + 1 }}.</span>
            <span class="passage-title"
                  @click="navigateTo(`/layout/passage/${passage.passageId}`)">
              {{ passage.title }}
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
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

.header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.author {
  font-weight: bold;
  font-size: 1em;
  color: var(--color-text-primary);
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

.right-container {
  padding: 20px;

  .hot-passage-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .hot-passage-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .hot-passage-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 14px;
  }

  .passage-index {
    width: 20px;
    text-align: right;
    color: var(--color-gray-dark);
  }

  .passage-title {
    flex: 1;
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .passage-title:hover {
    color: var(--color-hover);
  }
}

@media(max-width: 768px) {
  .right-container {
    display: none;
  }
}
</style>