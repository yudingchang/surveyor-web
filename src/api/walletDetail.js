import request from '@/utils/request'

export function tableDate(query) {
  return request({
    url: '/v1/payment/money',
    method: 'get',
    params: query
  })
}

export function tradeTypeDetail(query){
  return request({
    url: '/v1/payment/money',
    method: 'get',
    params: query
  })
}
