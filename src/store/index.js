import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters' // 用于派生数据,计算属性
import app from './modules/app' // app模块
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView' // tabs标签页

// 下载并引入持久化插件
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// 挂载在全局
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    tagsView
  },
  getters,
  plugins: [createPersistedState({ // 调用createPersistedState函数
    // 指定模块
    paths: ['user.token', 'user.tokenTime'] // 持久化,做个优化,只持久化token,而不是整个state里的数据
  })]
})

export default store // 在main.js中引入
