import Mock from 'mockjs';

// 查询单篇文章
Mock.mock(/\/api\/passage\/\d+$/, 'get', (options: any) => {
    const match = options.url.match(/\/api\/passage\/(\d+)$/);
    const id = match ? match[1] : Mock.mock('@integer(1, 100)');
    return {
        code: 0,
        message: '获取成功',
        data: {
            passageId: id,
            title: Mock.mock('@ctitle(10, 20)'),
            preview: Mock.mock('@cparagraph(2, 5)'),
            content: Mock.mock('@cparagraph(20, 50)'),
            authorName: Mock.mock('@cname'),
            authorAvatar: Mock.mock('@image(100x100)'),
            createdAt: Mock.mock('@datetime'),
            coverImage: Mock.mock('@image(600x400)'),
            type: Mock.Random.pick(['article', 'news']),
        }
    };
});

// 查询文章列表
Mock.mock(/\/api\/passage\/list$/, 'get', (options: any) => {
    const body = options.body ? JSON.parse(options.body) : {};
    const type = body.type || 'article'
    const pageSize = body.pageSize || 10

    const list = Mock.mock({
        [`list|${pageSize}`]: [
            {
                passageId: '@string("number", 3)',
                title: '@ctitle(10, 20)',
                preview: '@cparagraph(2, 5)',
                content: '@cparagraph(10, 30)',
                authorName: '@cname',
                authorAvatar: '@image(100x100)',
                createdAt: '@datetime',
                coverImage: '@image(600x400)',
                type: type
            }
        ]
    })

    return {
        code: 0,
        message: '获取文章列表成功',
        data: {
            list: list.list,
            total: 30,
        }
    }
})
