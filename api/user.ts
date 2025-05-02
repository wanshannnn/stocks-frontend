import request from '@/utils/request';

// 获取当前用户信息
export const getCurrentUser = () => {
    return request({
        url: '/user/userInfo',
        method: "get"
    })
}

// 登录
export const userLogin = (query: any) => {
    return request({
        url: '/user/login',
        method: 'post',
        data: query
    })
}

// 注册
export const userRegister = (query: any) => {
    return request({
        url: '/user/register',
        method: 'post',
        data: query
    })
}

// 修改密码
export const fixPwd = (query: any) => {
    return request({
        url: '/user/fixpwd',
        method: 'put',
        data: query
    })
}

// 添加用户
export const addUser = (query: any) => {
    return request({
        url: '/user',
        method: 'post',
        data: query
    })
}

// 分页查询用户列表
export const getUserList = (query: any) => {
    return request({
        url: `/user/list`,
        method: 'get',
        data: query
    });
};

// 查询用户
export const getUser = (userId: string) => {
    return request({
        url: `/user/` + userId,
        method: 'get'
    })
}

// 修改用户
export const updateUser= (query: any) => {
    return request({
        url: '/user',
        method: 'put',
        data: query
    })
}

// 删除用户
export const deleteUser = (userId: string) => {
    return request({
        url: `/user/` + userId,
        method: 'delete'
    })
}
