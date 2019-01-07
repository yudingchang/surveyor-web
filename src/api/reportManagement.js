import request from '@/utils/request'
import qs from 'qs'
// 获取报告管理列表信息
export function getReportManagement(data) {
  return request({
    url: '/v1/report',
    method: 'get',
    params: data
  })
}

// 报告详情页面

export function getReportSelf(id) {
  return request({
    url: '/v1/inspector/report/' + id,
    method: 'get',
    // params: data
  })
}

// 报告提交
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

