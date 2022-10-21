import request from '@/utils/request'

export function login(data) {

}

// 请求用户基本资料
export function getUserInfoAPI() {
  return request({
    url: '/sys/profile',
    method: 'POST' // 接口里不需要参数
  })
}

// 获取员工基本信息(如拿到用户头像,点击角色按钮根据id拿到员工拥有的角色)
export const getUserDetailById = (id) => {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
