const path = require("path");

// function resolve(dir) {
//   return path.join(__dirname, dir);
// }

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/p_kugou": {
        target: "https://www.kugou.com",
        changeOrigin: true,
        pathRewrite: {
          "^/p_kugou": "",
        },
      },
      "/m_kugou": {
        target: "http://m.kugou.com",
        changeOrigin: true,
        pathRewrite: {
          "^/m_kugou": "",
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      // 配置别名
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    externals: {
      axios: "axios",
      nprogress: "NProgress",
      // "better-scroll": "BScroll",
      "vue-lazyload": "VueLazyload",
    },
  },
};
