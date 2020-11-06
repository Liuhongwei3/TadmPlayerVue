const path = require("path");

// function resolve(dir) {
//   return path.join(__dirname, dir);
// }

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
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
