import request from '@/utils/request'
// 获取抢单列表
export function grabSheet(data) {
  return request({
    url: '/v1/inspector/service/publication',
    method: 'get',
    params: data
  })
}
// 抢单
export function confirmgrabSheet(data) {
  return request({
    url: data.url,
    method: 'post',
    data
  })
}
// 订单列表
export function orderList(data) {
  return request({
    url: '/v1/inspector/service',
    method: 'get',
    params: data
  })
}
// 订单详情
export function orderDetail(data) {
  return request({
    url: data.url,
    method: 'get'
  })
}
// 重置密码
export function resetPassword(data) {
  return request({
    url: '/v1/inspector/forgotpassword',
    method: 'post',
    data
  })
}
// 忘记密码发送验证码
export function forgetSendMa(data) {
  return request({
    url: '/v1/forgotpassword/verification',
    method: 'get',
    params: data
  })
}
// 用户登录
export function userLogin(data) {
  return request({
    url: '/v1/login',
    method: 'post',
    data
  })
}
// 邮箱注册发送验证码
export function sendma(data) {
  console.log(data)
  return request({
    url: '/v1/register/verification',
    method: 'get',
    params: { ...data }
  })
}
// 用户注册
export function userRegister(data) {
  // const data = {
  //   // username,
  //   // password
  // }
  return request({
    url: '/v1/inspector',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/v1/user',
    method: 'get'
  })
}

