import request from '@/utils/request'

const login = (data: object) =>
  request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })

const getInfo = (token: string) =>
  request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })

const logout = () =>
  request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })

export { login, getInfo, logout }
