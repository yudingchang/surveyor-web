import request from '@/utils/request'
import qs from 'qs'

export function fetchList(url, query) {
  return request({
    url: 'v1/location/list/all_country',
    method: 'get',
    params: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}

export function fetchCounty(query) {
  return request({
    url: 'v1/location/list/country_pcd',
    method: 'get',
    params: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
export function getConfigInfo(query) {
  return request({
    url: 'v1/config/info',
    method: 'get',
    params: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
// 保存个人信息
export function savaPersonalCertificate(query) {
  return request({
    url: 'v1/inspector/certificate_info/save',
    method: 'post',
    data: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}

// 保存验货信息
export function savaExamineGoods(query) {
  return request({
    url: 'v1/inspector/serve/save',
    method: 'post',
    data: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}

// 保存工作经验
export function saveExperience(query) {
  return request({
    url: 'v1/inspector/work',
    method: 'post',
    data: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
// 保存教育经历
export function saveEducation(query) {
  return request({
    url: 'v1/inspector/education',
    method: 'post',
    data: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
// 保存技术能力
export function saveTechnicalCompetence(query) {
  return request({
    url: 'v1/inspector/skills',
    method: 'post',
    data: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
// 保存行业线
export function savemultiCascaderIndustrys(query) {
  return request({
    url: 'v1/inspector/industry',
    method: 'post',
    data: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
// 保存培训经历
export function savetrainingExperience(query) {
  return request({
    url: 'v1/inspector/training',
    method: 'post',
    data: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
// 提交所有信息
export function saveAllMessage(query) {
  return request({
    url: 'v1/inspector/save',
    method: 'post',
    data: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
