import request from '@/utils/request'
import qs from 'qs'

export function order(data) {
  return request({
    url: '/v1/inspection',
    method: 'post',
    data: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
// 根据供应商名字查找其他信息
export function getOtherMessage(data) {
  return request({
    url: data.url,
    method: 'get',
    params: data
  })
}
export function getList(data) {
  return request({
    url: '/v1/inspection',
    method: 'get',
    params: {
      searches:data
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
// 获取订单前期数据
export function orderDetail(data) {
  return request({
    url: data.url,
    method: 'get',
    // params:data
  })
}  
// 预付款
export function confirmPay(data) {
    return request({
      url: data.url,
      method: 'get',
      // params:data
    })
  }  
// 付款
export function surePay(data) {
    return request({
      url: data.url,
      method: 'get',
      params:data
    })
  }   
// 获取订单详情
export function getOrderList(data) {
    return request({
      url: data.url,
      method: 'get',
    //   params:data
    })
  }   
  // 获取报告详情（模板）
  export function fetchReport(id) {
    return request({
      url: '/v1/inspector/report/' + id,
      method: 'get'
    })
  }
  //提交报告
  export function storeRow(url, data) {
    return request({
      url: url,
      method: 'post',
      data: data,
      paramsSerializer: function(params) {
        return qs.stringify(params, { indices: true })
      }
    })
  }

  export function updateRow(url, data) {
    return request({
      url: url,
      method: 'put',
      data: data,
      paramsSerializer: function(params) {
        return qs.stringify(params, { indices: true })
      }
    })
  }
