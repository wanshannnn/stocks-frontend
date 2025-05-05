<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { getStock, getStockList } from "@/api/stock.ts";
import type {Stock} from "~/types/stock.ts";

// 数据
// 遮罩层
const loading = ref(true);
// 股票详情
const stock = ref<Stock>();
// 股票列表
const stockList = ref<Stock[]>([]);
// 数据量
const total = ref(0);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  stockCode: '',
  stockName: '',
});
// 分页组件
const paginationLayout = ref('total, prev, pager, next, jumper');

// 方法
// 根据涨跌返回样式
const getChangeClass = (change: string) => {
  if (parseFloat(change) > 0) return 'rise';
  if (parseFloat(change) < 0) return 'fall';
  return 'neutral';
};
// 查询股票详情
const fetchStock = async () => {
  loading.value = true;
  const {data: res} = await getStock(queryParams);
  stock.value = res.data;
  loading.value = false;
}
// 查询股票列表
const fetchStockList = async () => {
  loading.value = true;
  const {data: res} = await getStockList(queryParams);
  stockList.value = res.data.data;
  total.value = res.data.total;
  loading.value = false;
};
// 搜索
const handleSearch = () => {
    queryParams.pageNum = 1;
    fetchStock();
};
// 分页切换
const handlePageChange = (val: number) => {
  queryParams.pageNum = val;
  fetchStockList();
};
// 监听屏幕大小变化
const updatePaginationLayout = () => {
  if (window.innerWidth <= 768) {
    paginationLayout.value = 'prev, pager, next'; // 小屏幕只显示上一页、页码和下一页
  } else {
    paginationLayout.value = 'total, prev, pager, next, jumper'; // 大屏幕显示完整分页
  }
};

onMounted(() => {
  fetchStockList();
  updatePaginationLayout();
  window.addEventListener('resize', updatePaginationLayout);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePaginationLayout);
});
</script>

<template>
  <el-row class="search-container" align="middle">
    <el-col :span="2">
      <p>最新行情</p>
    </el-col>
    <el-col :span="8">
      <el-input
          v-model="queryParams.stockName"
          placeholder="请输入股票名称"
          clearable
          @input="handleSearch"
          class="search-input"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="24">
      <el-card class="latest-stock-card" :loading="loading" shadow="never">
        <el-skeleton :rows="5" animated v-if="loading" style="padding: 20px;" />
        <el-table :data="stockList" style="width: 100%" v-else>
          <el-table-column label="序号" type="index" width="60"
                           :index="(index: number) => (queryParams.pageNum - 1) * queryParams.pageSize + index + 1"/>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="代码" prop="code" />
          <el-table-column label="最新价" prop="price" />
          <el-table-column label="成交量" prop="volume" />
          <el-table-column label="成交额" prop="turnover" />
          <el-table-column label="涨跌幅">
            <template #default="scope">
              <span :class="getChangeClass(scope.row.exchange)">
                {{ Number(scope.row.exchange).toFixed(2) + '%' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="振幅" prop="amplitude">
            <template #default="scope">
              <span>{{ Number(scope.row.amplitude).toFixed(2) + '%' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最高" prop="highest" />
          <el-table-column label="最低" prop="lowest" />
          <el-table-column label="更新时间" prop="date" />
        </el-table>
        <el-pagination
            v-if="total > 0"
            class="pagination"
            :current-page="queryParams.pageNum"
            :page-size="queryParams.pageSize"
            :total="total"
            :layout="paginationLayout"
            @current-change="handlePageChange"
        />
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-pagination {
  margin-top: 20px;
  text-align: center;
  justify-content: center;
}

p {
  margin: 5px;
  font-size: min(2vw, 20px);
  font-weight: bold;
  color: var(--color-text-primary);
}

.latest-stock-card {
  margin-top: 20px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
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