import Vue from "vue";

import VueLazyLoad from "vue-lazyload";

import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";

import "./element";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./filters";

Vue.use(VueLazyLoad, {
  preLoad: 1.2,
  attempt: 6,
  error: require("@/assets/404.jpg"),
});

Vue.use(Viewer, {
  defaultOptions: { zIndex: 9999, title: false, movable: false },
});

Vue.prototype.$bus = new Vue();

Vue.config.devtools = true;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
