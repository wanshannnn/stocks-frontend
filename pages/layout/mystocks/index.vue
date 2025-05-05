<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus';
import type { Stock } from '@/types/stock.ts';
import { getCollectionStock, getPossessionStock } from '@/api/stock.ts';
import {useLoginStore} from "~/stores/useLoginStore.ts";

definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
  roles: ['admin', 'user'],
});

// 数据
// 遮罩层
const loading = ref(true);
// 选中标签页
const activeName = ref('collection');
// 股票列表
const stockList = ref<Stock[]>([]);
// 用户id
const userId = ref('');
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userId: userId.value,
});
// 数据量
const total = ref(0);
// 分页组件
const paginationLayout = ref('total, prev, pager, next, jumper');

// 方法
// 根据涨跌返回样式
const getChangeClass = (change: string) => {
  if (parseFloat(change) > 0) return 'rise';
  if (parseFloat(change) < 0) return 'fall';
  return 'neutral';
};
// 获取股票列表
const fetchStockList = async () => {
  loading.value = true;
  let res;
  if (activeName.value === 'collection') {
    ({data: res} = await getCollectionStock(queryParams));
  } else {
    ({data: res} = await getPossessionStock(queryParams));
  }
  stockList.value = res.data.data || [];
  total.value = res.data.total || 0;
  loading.value = false;
};
// 切换标签页
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
  stockList.value = []
  fetchStockList();
}
// 分页切换
const handlePageChange = (val: number) => {
  queryParams.pageNum = val;
  fetchStockList();
};

onMounted(() => {
  userId.value = useLoginStore().loginUser!.userId;
  fetchStockList();
})
</script>

<template>
  <div class="mystocks-container">
    <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
    >
      <el-tab-pane label="收藏" name="collection"></el-tab-pane>
      <el-tab-pane label="持有" name="hold"></el-tab-pane>
    </el-tabs>

    <el-row>
      <el-col :span="24">
        <el-card class="stock-card" :loading="loading" shadow="never">
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
  </div>
</template>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 20px;
  text-align: center;
  justify-content: center;
}

.stock-card {
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