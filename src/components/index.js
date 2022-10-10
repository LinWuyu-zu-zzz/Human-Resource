// 封装components文件夹内公共组件步骤:
// 引入要注册的组件
// 把组件用数组收集起来
// Vue.use( plugin ), 在main.js里
// plugin是对象: 要有install属性,作为key, value是函数, 第一个参数是Vue
// plugin是函数: 它会被作为 install 方法, 第一个参数是Vue

// import PageTools from './PageTools/index.vue'
// const components = [PageTools]

// export default {  // 方法一: 导出对象, 不想引入Vue, 用install 传入的参数Vue
//   install: function(Vue) {
//     components.forEach(ele => {}
//   注意:  也可以放入自定义指令的代码(原在main.js中)
// }

// 实现组件自动注册
import * as filters from '@/filters'
// console.log(Object.keys(filters)) // 拿到所有过滤器的key,是一个数组

const fn = require.context('./', true, /\.vue$/)
// console.log(fn.keys()) // 拿到当路径,如./PageTools/index.vue
// console.log(fn('./PageTools/index.vue')) // 根据路径拿到模块,即组件对象

// 一次性导入所有的模块
const components = fn.keys().map(ele => {
  return fn(ele) // 拿到所有的路径 如 ./PageTools/index.vue
})

export default (Vue) => { // 方法二: 导出一个箭头函数
  components.forEach(ele => {
    // console.log(ele)
    Vue.component(ele.default.name, ele.default) // Vue.component('组件名字', 组件对象)
  })

  Object.keys(filters).forEach(key => { // [formatTime,formatTime...] 过滤器每一个函数名
    Vue.filter(key, filters[key]) // Vue.filter('过滤器名称', 过滤器对象)
  })
}
