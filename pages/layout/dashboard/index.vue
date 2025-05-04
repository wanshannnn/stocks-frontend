<script setup lang="ts">
import { useLoginStore } from '@/stores/useLoginStore.ts';
import { getIndexes } from '@/api/indexes.ts';
import { getPassageList } from '~/api/passage.ts';
import { getGlobalHotStocks, getAHotStocks, getHKHotStocks, getUSHotStocks } from '~/api/stock.ts';
import { navigateTo } from '#app';
import type { Passage } from '@/types/passage.ts'
import type { Indexes } from '~/types/indexes.ts';
import type { HotStock } from '~/types/hotStock.ts';
import { debounce } from 'lodash';

// 数据
// 遮罩层
const loading = ref(true);
// 用户名
const username = ref('未登录');
// 日期
const today = ref('');
// 指数数据
const indexes = ref<Indexes[]>([]);
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
// 热股榜市场选项
const marketOptions = {
  global: '全球',
  a: '沪深',
  hk: '港股',
  us: '美股'
}
// 热股榜选中市场
const currentMarket = ref<'global' | 'a' | 'hk' | 'us'>('global')
// 最热股票列表
const hotStockList = ref<HotStock[]>([]);

// 方法
// 查询指数
const fetchIndexes = async () => {
  loading.value = true;
  const {data: res} = await getIndexes();
  indexes.value = res.data;
  loading.value = false;
}
// 根据涨跌返回样式
const getChangeClass = (change: string) => {
  if (parseFloat(change) > 0) return 'rise';
  if (parseFloat(change) < 0) return 'fall';
  return 'neutral';
};
// 返回箭头符号
const getArrow = (change: string) => {
  if (parseFloat(change) > 0) return '▲';
  if (parseFloat(change) < 0) return '▼';
  return '';
};
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
// 切换市场
const switchMarket = (market: 'global' | 'a' | 'hk' | 'us') => {
  currentMarket.value = market;
  switch (market) {
    case 'global':
      fetchGlobalHotStocks();
      break;
    case 'a':
      fetchAHotStocks();
      break;
    case 'hk':
      fetchHKHotStocks();
      break;
    case 'us':
      fetchUSHotStocks();
      break;
    default:
      break;
  }
}
// 查询全球最热股票
const fetchGlobalHotStocks = async () => {
  loading.value = true;
  const {data: res} = await getGlobalHotStocks();
  hotStockList.value = res.data;
  loading.value = false;
}
// 查询沪深最热股票
const fetchAHotStocks = async () => {
  loading.value = true;
  const {data: res} = await getAHotStocks();
  hotStockList.value = res.data;
  loading.value = false;
}
// 查询港股最热股票
const fetchHKHotStocks = async () => {
  loading.value = true;
  const {data: res} = await getHKHotStocks();
  hotStockList.value = res.data;
  loading.value = false;
}
// 查询美股最热股票
const fetchUSHotStocks = async () => {
  loading.value = true;
  const {data: res} = await getUSHotStocks();
  hotStockList.value = res.data;
  loading.value = false;
}

// 初始化
onMounted(async () => {
  username.value = useLoginStore().loginUser?.username ?? '未登录';
  today.value = new Intl.DateTimeFormat('ch-SH', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());
  await fetchIndexes();
  await fetchPassageList();
  await fetchGlobalHotStocks();
  window.addEventListener('scroll', handleScroll, { passive: true })
});
// 卸载监听器
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <p class="welcome">Welcome, {{ username }}</p>
  <p class="current-date">今日：{{ today }}</p>

  <div class="dashboard-container">
    <el-row>
      <el-col :span="18" class="left-container">
        <!-- 股票指数 -->
        <el-row class="index-container" gutter="20">
          <el-col :xs="24" :sm="8" v-for="(index, key) in indexes" :key="key">
            <div class="index-item">
              <div class="index-value" :class="getChangeClass(index.change)" style="font-weight: bold">
                {{ index.value }}
                <span class="arrow">{{ getArrow(index.change) }}</span>
              </div>
              <div class="index-name">{{ index.name }}
                <span :class="getChangeClass(index.change)">{{ index.change }}%</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 文章列表 -->
        <div class="passage-container" @scroll.passive="handleScroll" ref="passageContainerRef">
          <div class="passage-container-header">
            <span class="look-more" @click="navigateTo('/layout/passage')">查看更多话题</span>
            <hr class="divider" />
          </div>
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

      <el-col :xs="24" :span="6" class="right-container">
        <!-- 热股榜标题 -->
        <div class="hot-stock-container">
          <span style="font-size: 1em; font-weight: bold">热股榜</span>
          <span class="look-more" @click="navigateTo('/layout/market')">查看更多</span>
        </div>
        <hr class="divider" />

        <!-- 热股切换按钮 -->
        <div class="hot-stock-buttons">
          <button
              v-for="(marketName, marketKey) in marketOptions"
              :key="marketKey"
              :class="currentMarket === marketKey ? 'primary-btn' : 'gray-btn'"
              style="width: 25%; height: 2em"
              @click="switchMarket(marketKey)"
          >
            {{ marketName }}
          </button>
        </div>

        <!-- 热股列表 -->
        <div class="hot-stock-list">
          <div v-for="(stock, index) in hotStockList" :key="stock.code" class="hot-stock-item">
            <span class="stock-index">{{ index + 1 }}.</span>
            <span class="stock-name" @click="navigateTo(`/layout/market/${stock.code}`)">{{ stock.name }}</span>
            <span class="stock-change" :class="getChangeClass(stock.change)">{{ stock.change }}</span>
          </div>
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

.passage-container-header {
  margin: 20px;
}

.index-item, .passage-card {
  background-color: var(--color-background);
  border: 1px, solid, var(--color-gray-light);
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.index-item:hover, .passage-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.index-name {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
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

  .hot-stock-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .hot-stock-buttons {
    padding: 10px;
    justify-content: space-between;
  }

  .hot-stock-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .hot-stock-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 14px;
  }

  .stock-index {
    width: 20px;
    text-align: right;
    color: var(--color-gray-dark);
  }

  .stock-name {
    flex: 1; /* 股票名称占最大宽度 */
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .stock-name:hover {
    color: var(--color-hover);
  }

  .stock-change {
    width: 60px;
    text-align: right;
  }
}

.look-more {
  color: var(--color-gray-dark);
  font-size: 0.8em;
  cursor: pointer;
}

.rise {
  color: var(--color-error);
}

.fall {
  color: var(--color-success);
}

.neutral {
  color: var(--color-gray-dark);
}

@media(max-width: 768px) {
  .index-item {
    margin: 5px;
  }

  .right-container {
    display: none;
  }
}
</style>