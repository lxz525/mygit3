import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入ElementUi
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//1.引入axios
import axios from 'axios';
Vue.config.productionTip = false
//2.设置后台访问路径
axios.defaults.baseURL = "http://localhost:8081"
Vue.config.productionTip = false
//使用ElementUi
Vue.use(ElementUI)
//3.挂载axios
Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
