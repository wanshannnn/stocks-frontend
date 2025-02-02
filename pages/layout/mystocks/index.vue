<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
  roles: [0, 1],
});

const allStocks = defineAsyncComponent(() =>
    import('@/components/allStocks.vue')
);
const holdStocks = defineAsyncComponent(() =>
    import('@/components/holdStocks.vue')
);
</script>

<template>
  <div class="mystocks-container">
    <el-row>
      <el-col :xs="24" :sm="11" :md="11" class="stock-container">
        <ClientOnly>
          <allStocks/>
        </ClientOnly>
      </el-col>
      <el-col :xs="24" :sm="11" :md="11" class="stock-container">
        <ClientOnly>
          <holdStocks/>
        </ClientOnly>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.stock-container {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-sizing: border-box;
  padding: 20px;
  margin: 10px;
}
</style>