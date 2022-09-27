// 写所有自定义指令
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
