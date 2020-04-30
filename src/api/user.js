import request from '@/utils/request'
//通过用户名和密码登陆后台
export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}
//通过token和uid获取用户信息
export function getInfo() {
  return request({
    url: '/api/admin/login',
    method: 'get',
  })
}
//退出登陆
export function logout() {
  return request({
    url: '/api/admin/logout'
  })
}
