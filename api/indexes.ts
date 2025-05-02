import request from "@/utils/request.ts";

// 获取指数数据接口
export const getIndexes = () => {
    return request({
        url: `/indexes`,
        method: 'get',
    })
}