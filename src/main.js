import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import '@/styles/cssrest.scss' // global css

import App from './App'

import router from './router'
import store from './store'
// import qs from 'qs'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data
import EleMultiCascader from 'ele-multi-cascader'
import pusher from 'vue-pusher'

Vue.use(pusher, {
  api_key: '1add4044f09c27600208',
  options: {
    cluster: 'ap3',
    forceTLS: true
  }
})
Vue.use(EleMultiCascader)
import * as filters from './filters' // global filters

import VueLodash from 'vue-lodash'
Vue.use(VueLodash, { name: '_' })
Vue.use(require('vue-moment'))

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
