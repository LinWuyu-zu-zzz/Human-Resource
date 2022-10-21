import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './lang/zh' // 取个名字
import en from './lang/en'
import Cookie from 'js-cookie'

Vue.use(VueI18n) // 全局注册国际化包
// 准备翻译的语言环境信息
export const messages = {
  zh, // 可以简写
  en
}

// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale: Cookie.set('lang') || 'zh', // 把zh/en存到cookie中,名字key自定义为lang,没有就默认成中文zh
  messages // 设置地区信息
})

// 通过 `i18n` 选项创建 Vue 实例
// new Vue({ i18n }).$mount('#app')

export default i18n

