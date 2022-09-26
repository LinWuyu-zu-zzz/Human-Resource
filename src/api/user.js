import request from '@/utils/request'

export function login(data) {

}

export function getUserInfoAPI() {
  return request({
    url: 'sys/profile',
    method: 'POST' // 接口里不需要参数
  })
}

export const getUserDetailById = (id) => {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
