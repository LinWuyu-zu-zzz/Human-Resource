// 封装所有登录页面的接口
// 引入axios(导入的js文件只有写了一个封装,所以可以随便叫request)
import request from '@/utils/request'
export function loginAPI(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
