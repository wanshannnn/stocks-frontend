import Mock from 'mockjs';

Mock.mock('/api/indexes', 'get', (options: any) => {
    return {
        code: 0,
        message: '获取指数数据成功',
        data: [
            { name: '上证指数', value: 3200.12, change: 0.56 },
            { name: '深证成指', value: 11000.45, change: -0.23 },
            { name: '创业板指', value: 2500.89, change: 1.12 },
        ],
    }
})
