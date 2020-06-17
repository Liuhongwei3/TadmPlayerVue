/*
 * https://liuhongwei3.github.io Inc.
 * Name: main.js
 * Date: 2020/1/30 上午9:46
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
import VueTouch from 'vue-touch'

// import './back'

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  attempt: 6,
  error: './assets/404.jpg'
});

// const VueTouch = require('vue-touch');
Vue.use(VueTouch, {
  name: 'v-touch'
});

Vue.prototype.$bus = new Vue();

Vue.config.devtools = true;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

Vue.filter('roundW',function (value) {
  if (value < 10000) {
    return value
  } else if (value > 1000 && value < 10000) {
    return Math.round(value / 1000) + ' K+'
  } else if (value > 10000 && value < 1000000) {
    return Math.round(value / 10000) + ' W+'
  } else {
    return Math.round(value / 1000000) + ' MW+'
  }
});
