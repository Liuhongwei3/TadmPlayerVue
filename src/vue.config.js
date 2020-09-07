module.exports = {
    productionSourceMap: false,
    publicPath: './',
    configureWebpack: {
        alias: {
            "@": path.resolve(__dirname, "src")
        },
        externals: {
            // 'vue': 'Vue',
            // 'vuex': 'Vuex',
            // 'vue-router': 'VueRouter',
            // 'axios': 'axios',
            // 'nprogress': 'NProgress',
            // 'vue-lazy-load': 'VueLazyLoad',
            // 'better-scroll': 'BScroll',
            // 'element-ui': 'ELEMENT'
        },
        plugins: []
    },
}