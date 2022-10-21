// 全局自定义指令(已全局注册)
import store from '@/store'
export const imgError = {
  // key: value
  // 渲染用户头像图片时,图片有地址但加载不出来,执行以下逻辑
  inserted(el, binding, vnode) {
    // console.log(el) // 图片的那个dom节点
    // console.log(binding) // 当前指令的相关信息,里面有value属性,详见layout文件夹NavBar.vue里面的defaultImg
    // console.log(vnode) // 虚拟dom
    el.onerror = function() {
      el.src = binding.value // 如果图片加载失败,触发onerror方法,把value里面的defaultImg作为默认图片
    }
  }
}

export const isHas = { // 名字isHas,作为指令v-isHas, v-isHas="'假数据里权限名'"
  // 指令所在的元素插入到父节点时触发
  // 按钮权限:
  // 需要校验的按钮权限标识：使用自定义指令
  // 通过在后端返回的拥有的权限数组中查找
  inserted(el, binding) {
    const isHas = store.state.user.userInfo.roles.points.includes(binding.value)
    if (isHas) return
    el.remove()
  },

  // 指令和对应的元素进行绑定,用来操作样式, dom有了,也和指令绑定了但是还没有插入到父节点
  bind() {
    console.log(455)
  }
}
