import router from '@/router'
import store from '@/store'
import { asyncRouters } from '@/router'
// token 存在 说明 处于登录状态
// 判断是否处于登录页面，是的话 跳首页 否则 直接留在当前页（直接放行 next()）
// token 不存在 说明 不处于登录状态
// 判断一下 是否处于白名单 是的话 直接留在 当前页 否则 跳转到登录页
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  // console.log(to)// 要去的路由 to.path: '/login
  // console.log(from) // 从哪个路由去
  // console.log(store) // 能拿到token,并且store文件夹里的getters.js也有

  if (store.getters.token) { // 能拿到token
    // 统一在这里调用接口,并判断一下,如果没有用户id-userId,切换侧边栏的不同页面,就不调用(小优化)
    if (!store.getters.userId) {
      const roles = await store.dispatch('user/getUserInfo') // 从store-user.js抽离出来
      // 动态路由的筛选
      console.log(asyncRouters) // 所有的动态路由asyncRouters,从router-index导出
      console.log(roles) // 后端返回的角色所拥有的角色
      const filterRouters = asyncRouters.filter(item => {
        return roles.menus.includes(item.meta.id)
      })
      console.log('筛选后的路由', filterRouters)

      //  404页面必须放最后面,...展开,加后面即可 !!!
      router.addRoutes([...filterRouters], { path: '*', redirect: '/404', hidden: true })
      store.commit('permission/setRoutes', filterRouters) // 实参传给vuex-permission.js
      next(to.path) // 动态添加的路由规则,必须加, 因为我们是先访问后添加路由的,这时还没有路由,进不去,再调用一下路由
    }

    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else { // 没有登录
    if (whiteList.indexOf(to.path) > -1) { // 如果要去的路径包含在白名单里,就放行,没必要登录
      next()
    } else {
      next('/login')
    }
  }
})
