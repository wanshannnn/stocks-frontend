import type { GetAnalysisListAPIResponse } from "@/types/analysis.ts";
import request from "@/utils/request.ts";

/**
 * 获取股票分析数据
 * @param id
 */
export const getStockAnalysisByIdAPI = (id: number) => {
    return request<GetAnalysisListAPIResponse>({
        url: `/analysis/id/${id}`,
        method: 'get',
    });
}