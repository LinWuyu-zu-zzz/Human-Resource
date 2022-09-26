// 想要只在vuex里面修改state的值, 而不是在外面也能修改, 那么开启严格模式 use strict
import { loginAPI } from '@/api/login'
export default {
  namespaced: true,
  state: {
    token: null,
    name: '1111' // 持久化: 做个优化,只持久化token(写在store的index.js中)
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    }
  },
  actions: {
    async loginAction({ commit }, loginData) { //
      // 发送请求 双重解构
      const data = await loginAPI(loginData) // 在响应拦截器已经解构了,这里不需要
      // console.log(data) // token
      commit('SET_TOKEN', data)
    }
  }
}
