import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import i18n from '@/i18n' // 多语言切换

import '@/icons' // icon
import '@/permission' // permission control
import Print from 'vue-print-nb' // 打印功能

import components from '@/components' // 引入公共组件里的index.js
Vue.use(components) // 全局注册公共组件,共25条记录/导入导出
Vue.use(Print) // 打印功能

// import { imgError } from '@/directive' // 按需注册: 不太好,麻烦
// Vue.directive('imgError', imgError) // 指令名称, 指令执行的逻辑
import * as directive from '@/directive' // 全局注册:import * as 变量,得到的是一个对象{ 变量1：对象1，变量2： 对象2 ... }
Object.keys(directive).forEach(key => { // Object.keys: 获取所有keys,即自定义名字
  Vue.directive(key, directive[key]) // 即key,value 遍历所有自定义事件名字,统一注册
})

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router, // key value一致,简写
  store,
  i18n,
  render: h => h(App)
})
