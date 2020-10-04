import Vue from 'vue';
import VueLazyLoad from 'vue-lazyload';
import ElementUI from 'element-ui';

import App from './App.vue';
import router from './router';
import store from './store';
import './filters';

Vue.use(ElementUI);
Vue.prototype.$message = ElementUI.Message;
Vue.prototype.$notify = ElementUI.Notification;

Vue.use(VueLazyLoad, {
    preLoad: 1.3,
    attempt: 6,
    error: require('@/assets/404.jpg')
});

Vue.prototype.$bus = new Vue();

Vue.config.devtools = true;

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')