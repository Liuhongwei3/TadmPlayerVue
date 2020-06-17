/*
 * https://liuhongwei3.github.io Inc.
 * Name: vue.config.js
 * Date: 2020/2/1 上午11:14
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

const webpack = require('webpack');

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  configureWebpack: {
    externals: {
      // vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      axios: 'axios',
      nprogress: 'NProgress',
      'vue-lazy-load': 'VueLazyLoad',
      'better-scroll': 'BScroll',
    },
    plugins: []
  },
}
