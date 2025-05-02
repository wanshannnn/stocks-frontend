<script setup lang="ts">
import * as echarts from "echarts";
import { getHistory } from "@/api/stock";
import type {Stock} from "~/types/stock.ts";

// 数据
// 遮罩层
const loading = ref(true);
// 股票代码
const stockCode = ref('');
// 查询开始时间
const startTime = ref();
// 查询结束时间
const endTime = ref();
// 查询参数
const queryParams = {
  stockCode: stockCode.value,
  startTime: startTime.value,
  endTime: endTime.value,
}
// 股票列表
const stocks = ref<Stock[]>([]);
// DOM
const chartContainer = ref<HTMLElement | null>(null);
// ECharts实例
const chart = ref<echarts.ECharts | null>();

//方法
// 查询历史数据
const fetchHistory = async () => {
  loading.value = true;
  const {data: res} = await getHistory(queryParams);
  stocks.value = res.data.data;
  loading.value = false;
};
// 创建 ECharts 实例并渲染图表
const renderChart = () => {
  if (!chartContainer.value)  return;
  if (chart.value) chart.value.dispose();
  chart.value = echarts.init(chartContainer.value);
  // 处理数据
  const dates = stocks.value.map((item: Stock) => item.date);
  const prices = stocks.value.map((item: Stock) => item.price);
  const volumes = stocks.value.map((item: Stock) => item.volume);
  const turnovers = stocks.value.map((item: Stock) => item.turnover);
  // 设置图表配置项
  const option = {
    title: {
      text: "",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["价格", "成交额", "成交量"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dates,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "价格",
        type: "line",
        data: prices,
      },
      {
        name: "成交额",
        type: "line",
        data: volumes,
      },
      {
        name: "成交量",
        type: "line",
        data: turnovers,
      },
    ],
  };
  // 使用刚指定的配置项和数据显示图表
  chart.value.setOption(option);
};

// 监听
watch(stockCode, async (stockCode) => {
  if (stockCode) {
    await fetchHistory();
    if (stocks.value.length === 0) {
      console.error("未获取到数据或数据为空");
    } else {
      renderChart();
    }
  }
});

onMounted(() => {
  fetchHistory();
  renderChart();
});
</script>

<template>
  <el-row>
    <el-col :span="4">
      <p>历史趋势</p>
    </el-col>
    <el-col :span="8">
      <el-input v-model="stockCode" placeholder="请输入股票代码" clearable />
    </el-col>
  </el-row>
  <div class="chart-container" ref="chartContainer" style="height: 400px; margin-top: 20px;" />
</template>

<style scoped>
p {
  margin: 5px;
  font-family: 'Georgia', serif;
  font-size: min(2vw, 20px);
  font-weight: bold;
}

.chart-container {
  padding: 20px;
  margin-top: 20px;
}
</style>
