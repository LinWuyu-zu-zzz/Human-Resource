// 实现axios的二次封装
import store from '@/store'
import axios from 'axios'
// 引入组件库里面的Message,使用Message消息提示这一功能
import { Message } from 'element-ui'
import router from '@/router'

const TimeOut = 3600 // 单位是秒, 一个小时

// 封装时间差函数(当前时间-登录时间)
function isCheckTimeOut() {
  const currentTime = Date.now() // 当前时间,即发请求调用接口时的时间
  const timeStamp = (currentTime - store.getters.tokenTime) / 1000
  return timeStamp > TimeOut // 时间差, 大于为true,超时; 为false,没有超时
}

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
      // 判断token超时的逻辑!! 超时了清除token并退出
      if (isCheckTimeOut()) {
        store.dispatch('user/logout')
        router.push('/login') // js文件不能用this,所以引入router进行跳转
        return Promise.reject(new Error('token已超时')) // 这个错误会进入到响应拦截器的error里面
      }

      config.headers.Authorization = `Bearer ${store.getters.token}` // 请求头
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截,数据统一处理 response 接收两个回调,那么vuex就不需要解构了
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
    // 如果有人手动改了token,把报错的401改为'token已超时'
    if (error.response && error.response.status === 401) {
      store.dispatch('user/logout')
      router.push('/login') // js文件不能用this,所以引入router进行跳转
      Message.error('token已超时')
    } else {
      Message.error(error.message) // 组件库把错误消息提示出来
    }

    return Promise.reject(error)
  })

export default serve
