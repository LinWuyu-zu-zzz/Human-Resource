// 实现axios的二次封装
import store from '@/store'
import axios from 'axios'
// 引入组件库里面的Message,使用Message消息提示这一功能
import { Message } from 'element-ui'

// 创建axios实例
const serve = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  timeout: 5000
})

// 请求拦截器, request,请求的时候拦截, store全局可用
serve.interceptors.request.use(
  config => {
    // console.log(config) // 打印的是请求回来的所有数据
    if (store.getters.token) { // 如果有token
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器 response 接收两个回调,那么vuex就不需要解构了
serve.interceptors.response.use(
  (response) => {
    // console.log(response) // response是请求后端的data或者说res
    const { message, data, success } = response.data // 解构
    if (success) {
      return data // 如果请求成功success为true,后端返回数据给前端
    }
    // 业务逻辑没有成功
    Message.error(message) // 组件库把错误消息提示出来
    return Promise.reject(new Error(message)) // 如果请求不成功success为false,那么就返回错误数据
  },
  (error) => { // 如果接口有问题,那么进入error的回调
    Message.error(error.message) // 组件库把错误消息提示出来
    return Promise.reject(error)
  })

export default serve
