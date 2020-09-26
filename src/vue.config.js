module.exports = {
    productionSourceMap: false,
    publicPath: './',
    configureWebpack: {
        alias: {
            "@": path.resolve(__dirname, "src")
        },
        externals: {
            'axios': 'axios',
            'nprogress': 'NProgress',
            'better-scroll': 'BScroll',
        },
        plugins: []
    },
}