<script setup lang="ts">
import {ElMessage, ElMessageBox} from "element-plus";

definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
  roles: ['admin'],
});

import { getUserList, getUser, addUser, deleteUser, updateUser } from '@/api/user';
import type { User } from "@/types/user";

// 数据
// 遮罩层
const loading = ref(true);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 用户列表
const userList = ref<User[]>([]);
// 数据量
const total = ref(0);
// 用户
const user = ref<User>();
// 显示弹窗
const dialogVisible = ref(false);
// 弹窗标题
const title = ref('');
// 表单
const form = reactive({
  userId: '',
  username: '',
  account: '',
  status: '',
});
// 表单引用
const formRef = ref();
// 校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^.{1,20}$/, message: '用户名不能超过20位字符长度', trigger: 'blur' }
  ],
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,20}$/, message: '账号必须是1-20位字符长度的大小写字母或数字', trigger: 'blur' }
  ],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
};
// 分页组件
const paginationLayout = ref('total, prev, pager, next, jumper');

// 方法
// 获取用户
const fetchUser = async (userId: string) => {
  loading.value = true;
  const {data: res} = await getUser(userId);
  user.value = res.data;
  loading.value = false;
}
// 获取用户列表
const fetchUserList = async () => {
  loading.value = true;
  const {data: res} = await getUserList(queryParams);
  userList.value = res.data.data;
  total.value = res.data.total;
  loading.value = false;
}
// 分页切换
const handlePageChange = (val: number) => {
  queryParams.pageNum = val;
  fetchUserList();
};
// 取消表单
const cancelForm = () => {
  ElMessage.info('取消操作');
  dialogVisible.value = false;
};
// 重置表单
const resetForm = () => {
  form.username = '';
  form.account = '';
  form.status = '';
  title.value = '';
};
// 提交表单
const submitForm = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (form.userId) {
        updateUser(form);
        dialogVisible.value = false;
        fetchUserList();
        ElMessage.success('修改成功');
      } else {
        addUser(form);
        dialogVisible.value = false;
        fetchUserList();
        ElMessage.success('添加成功');
      }
    }
  });
};
// 监听屏幕大小变化
const updatePaginationLayout = () => {
  if (window.innerWidth <= 768) {
    paginationLayout.value = 'prev, pager, next'; // 小屏幕只显示上一页、页码和下一页
  } else {
    paginationLayout.value = 'total, prev, pager, next, jumper'; // 大屏幕显示完整分页
  }
};
// 添加按钮操作
const handleAdd = async () => {
  resetForm();
  title.value = '添加用户';
  dialogVisible.value = true;
};
// 编辑按钮操作
const handleUpdate = async (userId: string) => {
  resetForm();
  await fetchUser(userId);
  form.userId = userId;
  form.account = user.value!.account;
  form.username = user.value!.username;
  form.status = user.value!.status;
  title.value = '编辑用户';
  dialogVisible.value = true;
};
// 删除用户
const handleDelete = async (userId: string) => {
  ElMessageBox.confirm('此操作将永久删除用户, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    cancelButtonClass: 'cancel-button',
    type: 'warning',
  })
  .then(async () => {
    await deleteUser(userId);
    await fetchUserList();
    ElMessage.success('删除成功');
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '取消操作',
    })
  })
};

onMounted(() => {
  fetchUserList();
  updatePaginationLayout();
  window.addEventListener('resize', updatePaginationLayout);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePaginationLayout);
});
</script>


<template>
  <div class="user-manage-container">
    <!-- 添加用户 -->
    <el-button type="primary" @click="handleAdd">添加用户</el-button>

    <!-- 分页展示用户信息 -->
    <el-table class="user-table" :data="userList" style="width: 100%; table-layout: fixed;">
      <el-table-column label="序号" type="index" width="60" align="center"
                       :index="(index: number) => (queryParams.pageNum - 1) * queryParams.pageSize + index + 1"/>
      <el-table-column label="ID" prop="userId" min-width="80"  :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="用户名" prop="username" min-width="120"  align="center"/>
      <el-table-column label="账号" prop="account" min-width="120"  align="center"/>
      <el-table-column label="状态" prop="status" min-width="100"  align="center">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">{{ row.status ? '正常' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleUpdate(row.userId)" >编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.userId)" >删除</el-button>
        </template>
      </el-table-column>
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

    <!-- 添加与编辑用户对话框 -->
    <ClientOnly>
      <el-dialog v-model="dialogVisible" :title="title" width="500">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
          <el-form-item prop="username" label="用户名" :label-width="80">
            <el-input v-model="form.username" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="account" label="账号" :label-width="80">
            <el-input v-model="form.account" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="status" label="状态" :label-width="80">
            <el-select v-model="form.status" placeholder="请选择状态">
              <el-option label="正常" :value="true"></el-option>
              <el-option label="停用" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="cancelForm" type="info">取消</el-button>
            <el-button @click="submitForm" type="primary">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.user-manage-container {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-sizing: border-box;
  padding: 20px;
  margin: 20px;
}

.user-table {
  margin-top: 20px;
  width: 100%;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
  justify-content: center;
}
</style>