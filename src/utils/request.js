// 实现axios的二次封装
import axios from 'axios'

// 创建axios实例
const serve = axios.create({
  baseURL: 'process.env.VUE_APP_BASE_API', // 基准地址
  timeout: 5000
})

export default serve
