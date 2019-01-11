import request from '@/utils/request'
// 获取抢单列表
export function getReportList(data) {
  return request({
    url: '/v1/inspector/report',
    method: 'get',
    params: data
  })
}
