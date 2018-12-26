import request from '@/utils/request'
import qs from 'qs'

export function fetchConfig(id) {
  return request({
    url: '/v1/inspector/report/' + id + '/config',
    method: 'get'
  })
}

export function fetchReport(id) {
  return request({
    url: '/v1/inspector/report/' + id,
    method: 'get'
  })
}

export function update(id, data) {
  return request({
    url: '/v1/inspector/report/' + id,
    method: 'put',
    data: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}

export function reportsubmit(id, data) {
  return request({
    url: '/v1/inspector/report/' + id + '/submit',
    method: 'put',
    data: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
