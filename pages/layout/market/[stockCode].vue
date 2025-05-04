<script setup lang="ts">
import type { Stock } from '@/types/stock.ts'
import { getStock } from '~/api/stock.ts';

// 数据
// 遮罩层
const loading = ref(true);
// 股票内容
const stock = ref<Stock>();

// 方法
// 获取股票
// 根据涨跌返回样式
const getChangeClass = (change: string) => {
  if (parseFloat(change) > 0) return 'rise';
  if (parseFloat(change) < 0) return 'fall';
  return 'neutral';
};
const fetchStock = async (stockCode: string) => {
  loading.value = true;
  const {data: res} = await getStock(stockCode);
  stock.value = res.data;
  loading.value = false;
}

onMounted(async () => {
  const route = useRoute();
  const stockCode = route.params.stockCode as string;
  await fetchStock(stockCode);
})
</script>

<template>
  <div class="stock-container">
    <el-row class="stock-detail" v-if="stock">
      <el-col :span="4">
        <p>{{ stock.name }} <span class="code">({{ stock.code }})</span></p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="4" :xs="24" class="info" v-if="stock">
        <el-card>
          <div class="info-item">
            <span class="label">当前价格：</span>
            <span class="value">{{ Number(stock.price).toFixed(2) }} 元</span>
          </div>
          <div class="info-item">
            <span class="label">涨跌幅：</span>
            <span :class="getChangeClass(stock.exchange)">{{ stock.exchange }}%</span>
          </div>
          <div class="info-item">
            <span class="label">成交量：</span>
            <span class="value">{{ stock.volume }} 手</span>
          </div>
          <div class="info-item">
            <span class="label">成交额：</span>
            <span class="value">{{ stock.turnover }} 万元</span>
          </div>
          <div class="info-item">
            <span class="label">振幅：</span>
            <span class="value">{{ stock.amplitude }}%</span>
          </div>
          <div class="info-item">
            <span class="label">最高价：</span>
            <span class="value">{{ Number(stock.highest) / 100 }}</span>
          </div>
          <div class="info-item">
            <span class="label">最低价：</span>
            <span class="value">{{ Number(stock.lowest) / 100 }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<style scoped lang="scss">
.stock-container {
  padding: 1rem;
}

p {
  margin: 5px 5px 10px 5px;
  font-size: min(2vw, 20px);
  font-weight: bold;
  color: var(--color-text-primary);
}


.code {
  font-size: 16px;
  color: var(--color-gray-dark);
}

.info {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  margin: 4px 0;
}

.label {
  display: inline-block;
  width: 80px;
  flex-shrink: 0;
  color: var(--color-gray-dark);
}

.value {
  flex: 1;
  color: var(--color-text-primary);
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
</style>
