import 'core-js'
import Vue from 'vue'
import CoreuiVue from '@coreui/vue-pro/src'

import App from './App'
import router from './router/index'
import { iconsSet as icons } from './assets/icons/icons.js'
const axios = require('axios')
import store from './store'

Vue.use(CoreuiVue)
Vue.prototype.$http = axios
Vue.prototype.$http.interceptors.response.use(
  function (response) { return response },
  function (error) {
    if (error.response.status == 401 && error.response.config.url !== "/auth/login") {
      router.push('login');
    }
    return Promise.reject(error);
  });
Vue.prototype.$http.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`
  return config;
});
Vue.prototype.$log = console.log.bind(console)

new Vue({
  el: '#app',
  router,
  store,
  //CIcon component documentation: https://coreui.io/vue/docs/components/icon
  icons,
  template: '<App/>',
  components: {
    App
  },
})
