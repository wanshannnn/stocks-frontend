export interface Stock {
    code: string;       // 股票代码（六位）
    name: string;       // 股票名称
    price: string;      // 当前价格
    exchange: string;   // 涨跌幅（百分比）
    turnover: string;   // 成交额
    volume: string;     // 成交量
    amplitude: string;  // 振幅（百分比）
    highest: string;    // 最高价
    lowest: string;     // 最低价
    date: string;       // 日期
}
