import request from "@/utils/request.ts";

export const getAnalysis = (stockCode: string) => {
    return request({
        url: `/analysis/` + stockCode,
        method: 'get',
    });
}
