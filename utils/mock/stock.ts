import Mock from 'mockjs';

const generateStockData = (code: string = '') => ({
    code: code || Mock.mock('@string("number", 6)'),
    name: Mock.mock('@ctitle(3, 5)'),
    price: Mock.mock('@float(10, 1000, 0, 2)'),
    volume: Mock.mock('@integer(1000, 10000)'),
    exchange: Mock.mock('@float(-30, 30, 0, 2)'),
    turnover: Mock.mock('@integer(1000, 10000)'),
    amplitude: Mock.mock('@float(0, 30, 0, 2)'),
    highest: Mock.mock('@integer(1000, 10000)'),
    lowest: Mock.mock('@integer(1000, 10000)'),
    date: new Date().toLocaleDateString('zh-CN'),
});

const generateHistory = () => ({
    price: Mock.mock('@float(10, 1000, 0, 2)'),
    volume: Mock.mock('@integer(1000, 10000)'),
    exchange: Mock.mock('@float(-30, 30, 0, 2)'),
    turnover: Mock.mock('@integer(1000, 10000)'),
    amplitude: Mock.mock('@float(0, 30, 0, 2)'),
    highest: Mock.mock('@integer(1000, 10000)'),
    lowest: Mock.mock('@integer(1000, 10000)'),
    date: Mock.mock('@datetime'),
})

// 查询股票（最新详情数据）
Mock.mock(/\/api\/stock\/\d+$/, 'get', (options: any) => {
    const id = options.url.match(/\/api\/stock\/(\d+)$/)?.[1];
    return {
        code: 0,
        message: '获取成功',
        data: generateStockData(id),
    };
});

// 查询股票列表（最新）
Mock.mock('/api/stock/list', 'get', (options: any) => {
    const urlParams = new URLSearchParams(options.url.split('?')[1]);
    const pageNum = parseInt(urlParams.get('pageNum') || '1');
    const pageSize = parseInt(urlParams.get('pageSize') || '10');
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const allData = Array.from({ length: 200 }, () => generateStockData());
    const data = allData.slice(startIndex, endIndex);

    return {
        code: 0,
        message: '获取股票列表成功',
        data: {
            data,
            total: allData.length,
        }
    };
});

// 查询股票历史数据
Mock.mock('/api/stock/history', 'get', (options: any) => {
    const code = Mock.mock('@string("number", 6)');
    const name = '模拟证券';
    const allData = Array.from({ length: 200 }, () => ({
        code,
        name,
        ...generateHistory(),
    }));

    return {
        code: 0,
        message: '获取成功',
        data: {
            data: allData,
            total: allData.length,
        }
    };
});

// 持有股票
Mock.mock(/\/stock\/possession/, 'get', (options: any) => {
    const allData = Array.from({ length: 8 }, () => generateStockData());
    return {
        code: 0,
        message: '获取用户持有股票成功',
        data: {
            data: allData,
            total: allData.length,
        }
    }
})

// 收藏股票 mock 接口
Mock.mock(/\/stock\/collection/, 'get', (options: any) => {
    const allData = Array.from({ length: 8 }, () => generateStockData());
    return {
        code: 0,
        message: '获取用户收藏股票成功',
        data: {
            data: allData,
            total: allData.length,
        }
    }
})

// 最热股票
function generateHotStocks(region: string) {
    return Mock.mock({
        [`${region}`]: Array.from({ length: 10 }).map(() => ({
            name: Mock.mock('@cword(2,4)'),
            code: Mock.mock('@string("number", 6)'),
            change: Mock.mock('@float(-5, 5, 2, 2)'+ '%') // -5%~+5%之间波动
        }))
    })
}

// mock全球
Mock.mock('/api/stock/global/hot', 'get', () => {
    return {
        code: 0,
        msg: '获取成功',
        data: generateHotStocks('global').global
    }
})

// mock沪深
Mock.mock('/api/stock/a/hot', 'get', () => {
    return {
        code: 0,
        msg: '获取成功',
        data: generateHotStocks('a').a
    }
})

// mock港股
Mock.mock('/api/stock/hk/hot', 'get', () => {
    return {
        code: 0,
        msg: '获取成功',
        data: generateHotStocks('hk').hk
    }
})

// mock美股
Mock.mock('/api/stock/us/hot', 'get', () => {
    return {
        code: 0,
        msg: '获取成功',
        data: generateHotStocks('us').us
    }
})
