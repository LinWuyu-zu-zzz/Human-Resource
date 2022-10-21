// 定义自己维护的路由规则(因为layout文件夹slideBar中循环的routes没有动态添加的)
// 仅仅用来显示菜单
import { constantRoutes } from '@/router' // 引入静态路由
export default {
  namespaced: true,
  state: {
    routes: []
  },
  mutations: { // 修改state中的数据
    setRoutes(state, payload) { // 谁调用,谁传参进来(src下permission.js调用了)
      state.routes = [...constantRoutes, ...payload]
    }
  }
}
