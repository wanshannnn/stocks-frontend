import Mock from 'mockjs';

// 模拟获取当前用户信息
Mock.mock('/api/user/userInfo', 'get', (options: any) => {
    return {
        code: 0,
        message: '获取当前用户信息成功',
        data: {
            userId: '7c85a8d4-bb50-4e13-a365-d6e9f3b4cc5b',
            roles: 'admin',
            token: 'abcdef123456',
            createTime: '2025-01-01T12:00:00Z',
            username: 'admin',
            account: 'admin',
            status: '1',
            bio: '一个业余爱好者',
            followerCount: 0,
            followingCount: 0,
            passageCount: 1,
            collection: ['000001', '000002', '000003'],
            possession: ['000001', '000002', '000003', '000004', '000005'],
        },
    }
})

// 模拟登录接口
Mock.mock('/api/user/login', 'post', (options: any) => {
    const { account, password } = JSON.parse(options.body);
    if (account === 'admin' && password === '123456') {
        return {
            code: 0,
            message: '登录成功',
            data: {
                userId: '7c85a8d4-bb50-4e13-a365-d6e9f3b4cc5b',
                roles: 'admin',
                token: 'abcdef123456',
                createTime: '2025-01-01T12:00:00Z',
                username: 'admin',
                account: 'admin',
                status: '1',
                bio: '一个业余爱好者',
                followerCount: 0,
                followingCount: 0,
                passageCount: 1,
                collection: ['000001', '000002', '000003'],
                possession: ['000001', '000002', '000003', '000004', '000005'],
            },
        };
    } else {
        return {
            code: 500,
            message: '账号或密码错误',
        };
    }
});

// 模拟注册接口
Mock.mock('/api/user/register', 'post', (options: any) => {
    return {
        code: 0,
        message: '注册成功',
        data: {
            userId: Mock.Random.guid(),
        },
    };
});

// 模拟修改密码接口
Mock.mock('/api/user/fixpwd', 'put', (options: any) => {
    const { oldPassword, newPassword } = JSON.parse(options.body);
    if (oldPassword === '123456') {
        return {
            code: 0,
            message: '密码修改成功',
        };
    }
    return {
        code: 500,
        message: '密码修改失败，旧密码不正确',
    };
});

// 模拟分页展示用户数据
const userPageListMockAPI = Mock.mock({
    'data|200': [
        {
            userId: '@guid()',
            username: '@cname',
            account: '@integer(0, 1000)',
            roles: ['user'],
            token: '@guid()',
            status: '@integer(0, 1)',
            createTime: '@date("yyyy-MM-dd")',
            bio: '@cparagraph(1, 2)',
            followerCount: '@integer(0, 1000)',
            followingCount: '@integer(0, 1000)',
            passageCount: '@integer(0, 100)',
            collection: ['000001', '000002', '000003'],
            possession: ['000001', '000002', '000003', '000004', '000005']
        }
    ]
});
Mock.mock('/api/user/list', 'get', (options: any) => {
    const urlParams = new URLSearchParams(options.url.split('?')[1]);
    const pageNum = parseInt(urlParams.get('pageNum') || '1');
    const pageSize = parseInt(urlParams.get('pageSize') || '10');
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = userPageListMockAPI.data.slice(startIndex, endIndex);
    return {
        code: 0,
        data: {
            data,
            total: userPageListMockAPI.data.length,
        },
    };
});

// 模拟添加用户信息
Mock.mock('/api/user', 'post', (options: any) => {
    return {
        code: 0,
        message: '添加成功',
        data: { userId: Mock.Random.guid() }
    };
});

// 模拟更新用户信息
Mock.mock('/api/user', 'put', (options: any) => {
    return {
        code: 0,
        message: '更新成功',
    };
});

// 模拟删除用户信息
Mock.mock(/\/api\/user\/[\w-]+$/, 'delete', (options: any) => {
    const id = options.url.match(/\/api\/user\/(\d+)$/)?.[1];
    return {
        code: 0,
        message: `用户删除成功 (userId: ${id})`,
    };
});

// 模拟查询用户信息
Mock.mock(/\/api\/user\/[\w-]+$/, 'get', (options: any) => {
    const id = options.url.match(/\/api\/user\/(\d+)$/)?.[1];
    return {
        code: 0,
        message: '查询用户信息成功',
        data: {
            userId: '7c85a8d4-bb50-4e13-a365-d6e9f3b4cc5b',
            roles: 'admin',
            token: 'abcdef123456',
            createTime: '2025-01-01T12:00:00Z',
            username: '张小花',
            account: 'zhangxiaohua',
            status: '1',
            bio: '一个业余爱好者',
            followerCount: 0,
            followingCount: 0,
            passageCount: 1,
            collection: ['000001', '000002', '000003'],
            possession: ['000001', '000002', '000003', '000004', '000005'],
        },
    }
})
