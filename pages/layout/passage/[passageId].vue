<script setup lang="ts">
import type { Passage } from '@/types/passage.ts'
import { getPassage } from '~/api/passage.ts';

// 数据
// 遮罩层
const loading = ref(true);
// 文章内容
const passage = ref<Passage>();

// 方法
// 格式化日期
const formatDate = (date?: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}
// 获取文章
const fetchPassage = async (passageId: string) => {
  loading.value = true;
  const {data: res} = await getPassage(passageId);
  passage.value = res.data;
  loading.value = false;
}

onMounted(async () => {
  const route = useRoute();
  const passageId = route.params.passageId as string;
  await fetchPassage(passageId);
})
</script>

<template>
  <!-- 文章列表 -->
  <div class="passage-container">
    <h2 class="title">{{ passage?.title }}</h2>
      <div class="header">
        <img :src="passage?.authorAvatar" alt="头像" class="avatar" />
        <div class="info">
          <div class="author">{{ passage?.authorName }}</div>
          <div class="date">{{ formatDate(passage?.createdAt) }}</div>
        </div>
      </div>

      <p class="content">{{ passage?.content }}</p>
    </div>
</template>

<style scoped lang="scss">
.passage-container {
  max-width: 800px;
  margin: 40px auto;
  color: var(--color-primary);
}

.title {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 16px;
  object-fit: cover;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
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

.content {
  line-height: 1.8;
  font-size: 1.1em;
  color: var(--color-text-primary);
  white-space: pre-line;
}
</style>
