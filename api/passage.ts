import request from '@/utils/request';

// 查询股票（最新详情数据）
export const getPassage = async (passageId: string) => {
    return request({
        url: `/passage/` + passageId,
        method: 'get',
    });
};

// 查询股票列表（最新）
export const getPassageList = async (query: any) => {
    return request({
        url: `/passage/list`,
        method: 'get',
        data: query,
    });
};