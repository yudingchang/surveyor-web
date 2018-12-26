import request from '@/utils/request'

export function getPersonalAuthentication(data) {
  return request({
    url: '/v1/inspector/certificate_info',
    method: 'get',
    params: data
  })
}

export function tradeTypeDetail(query) {
  return request({
    url: '/v1/payment/money',
    method: 'get',
    params: query
  })
}
