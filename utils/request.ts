import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useLoginStore } from '@/stores/useLoginStore.ts'

const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,});

// 定义请求拦截器
instance.interceptors.request.use(
    (config) => {
        const token = useLoginStore().loginUser?.token;
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// 定义响应拦截器
instance.interceptors.response.use(
    (response) => {
        console.log(response);
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            useLoginStore().clearLoginUser();
            ElMessage.error('用户身份已过期');
            navigateTo('/');
        }
        return Promise.reject(error);
    }
)

export default instance
