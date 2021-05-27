import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import "leaflet/dist/leaflet.css"

Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.openLoading = function(target) {
  const loading = this.$loading({           // 声明一个loading对象
    lock: true,                             // 是否锁屏
    text: '加载中',                     // 加载动画的文字
    spinner: 'el-icon-loading',             // 引入的loading图标
    // background: 'rgba(0, 0, 0, 0.3)',       // 背景颜色
    target: target,                    // 需要遮罩的区域
    // body: true,
    // customClass: 'mask'                     // 遮罩层新增类名
  })
  return loading
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

require('./assets/css/base.css')