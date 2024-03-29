import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import ELEMENT from 'element-ui'
if (process.env.NODE_ENV === 'development') {
  require('element-ui/lib/theme-chalk/index.css')
}
import './styles/element-variables.scss'
import axios from './utils/request'
import '@/styles/index.scss'
import '@/styles/global.scss'
import App from './App'
import store from './store'
import router from './router'
import './icons'
import './permission'
import * as filters from './filters'

Vue.use(ELEMENT, {
  size: Cookies.get('size') || 'medium'
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
