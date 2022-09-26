// 实现axios的二次封装
import axios from 'axios'
// 引入组件库里面的Message,使用Message消息提示这一功能
import { Message } from 'element-ui'

// 创建axios实例
const serve = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  timeout: 5000
})

// 响应拦截器 接收两个回调,那么vuex就不需要解构了
serve.interceptors.response.use(
  (response) => {
    console.log(response) // response是请求后端的data或者说res
    const { message, data, success } = response.data // 解构
    if (success) {
      return data // 如果请求成功success为true,后端返回数据给前端
    }
    // 业务逻辑没有成功
    Message.error(message) // 组件库把错误消息提示出来
    return Promise.reject(new Error(message)) // 如果请求不成功success为false,那么就返回错误数据
  },
  (error) => { // 接口有问题,那么进入error的回调
    Message.error(error.message)
    return Promise.reject(error)
  })

export default serve
