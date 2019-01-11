import request from '@/utils/request'

export function getWallet(query) {
  return request({
    url: '/v1/inspector/wallet/pouch',
    method: 'get',
    params: query
  })
}

export function getBalanceList(query) {
  return request({
    url: '/v1/inspector/wallet/list',
    method: 'get',
    params: query
  })
}

export function getCashList(query) {
  return request({
    url: '/v1/inspector/freeze/list',
    method: 'get',
    params: query
  })
}

export function getDepositList(query) {
  return request({
    url: '/v1/inspector/withdraw/list',
    method: 'get',
    params: query
  })
}

export function getCardList(query) {
  return request({
    url: '/v1/inspector/bankcard',
    method: 'get',
    params: query
  })
}

export function removeCard(query) {
  return request({
    url: '/v1/inspector/bankcard/' + query.id,
    method: 'DELETE'
  })
}
export function addCard(query) {
  return request({
    url: '/v1/inspector/bankcard/store',
    method: 'POST',
    data: query
  })
}
export function setDefalt(query) {
  return request({
    url: '/v1/inspector/bankcard/default/' + query.id,
    method: 'POST'
  })
}
export function withdrawOperation(query) {
  return request({
    url: '/v1/inspector/withdraw/operation',
    method: 'POST',
    data: query
  })
}

export function walletDetail(query) {
  return request({
    url: '/v1/inspector/wallet/' + query.id,
    method: 'GET'
  })
}

export function withdrawRecordDetail(query) {
  return request({
    url: '/v1/inspector/withdraw/' + query.id,
    method: 'GET'
  })
}

export function getBankList() {
  return request({
    url: '/v1/config/info',
    method: 'GET'
  })
}

export function sendMa(data) {
  return request({
    url: '/v1/verificationcode/send',
    method: 'GET',
    params: data
  })
}
