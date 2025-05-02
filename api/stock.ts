import request from '@/utils/request';

// 查询股票（最新详情数据）
export const getStock = async (query: any) => {
    return request({
        url: `/stock/`,
        method: 'get',
        data: query,
    });
};

// 查询股票列表（最新）
export const getStockList = async (query: any) => {
    return request({
        url: `/stock/list`,
        method: 'get',
        data: query,
    });
};

// 查询股票历史数据
export const getHistory = async (query: any) => {
    return request({
        url: `/stock/history`,
        method: 'get',
        data: query,
    });
};

// 删除股票
export const deleteStock = (stockCode: string) => {
    return request({
        url: `/stock/` + stockCode,
        method: 'delete',
    });
}

// 新增股票
export const addStock = (query: any) => {
    return request({
        url: '/stock/add',
        method: 'post',
        data: query,
    });
}

// 更新股票
export const updateStock = (query: any) => {
    return request({
        url: `/stock/update`,
        method: 'put',
        data: query,
    });
}

// 查询用户持有股票
export const getPossessionStock = async (query: any) => {
    return request({
        url: `/stock/possession/`,
        method: 'get',
        data: query,
     });
};

// 查询用户收藏股票
export const getCollectionStock = async (query: any) => {
    return request({
        url: `/stock/collection`,
        method: 'get',
        data: query,
    });
};

// 查询全球热门股票
export const getGlobalHotStocks = async () => {
    return request({
        url: `/stock/global/hot`,
        method: 'get',
    });
};

// 查询沪深热门股票
export const getAHotStocks = async () => {
    return request({
        url: `/stock/a/hot`,
        method: 'get',
    });
};

// 查询港股热门股票
export const getHKHotStocks = async () => {
    return request({
        url: `/stock/hk/hot`,
        method: 'get',
    });
};

// 查询美股热门股票
export const getUSHotStocks = async () => {
    return request({
        url: `/stock/us/hot`,
        method: 'get',
    });
};
