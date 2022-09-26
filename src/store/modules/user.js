// 想要只在vuex里面修改state的值, 而不是在外面也能修改, 那么开启严格模式 use strict
import { loginAPI } from '@/api/login'
import { getUserInfoAPI, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    // name: '1111' // 持久化: 做个优化,只持久化token(写在store的index.js中)
    userInfo: {}
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
    },
    REMOVE_USERINFO(state) {
      state.userInfo = {} // 清空userInfo
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      // 发送请求 双重解构
      const data = await loginAPI(loginData) // 在响应拦截器已经解构了,这里不需要
      // console.log(data) // token
      commit('SET_TOKEN', data)
    },
    async getUserInfo({ commit }) {
      // 接口请求
      const data = await getUserInfoAPI()
      console.log('请求用户信息', data)

      const data2 = await getUserDetailById(data.userId)
      console.log('想拿到用户头像', data2)

      const result = { ...data, ...data2 } // 因为写了两个请求,统一return出去,把两个data解构再展开到一个对象中
      commit('SET_USERINFO', result)

      // 和 data(){ return {} } 类似
      // 深拷贝,如果别的组件调用接口时要改变这个数据,那么最原始请求来的数据不要变
      return JSON.parse(JSON.stringify(result)) // data为复杂数据类型,引用类型的对象
    }
  }
}
