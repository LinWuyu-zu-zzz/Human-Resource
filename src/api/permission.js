import request from '@/utils/request'
// 获取所有权限列表
export function getPermissionList() {
  return request({
    url: '/sys/permission'
  })
}

// 获取所有权限列表
export function addPermission(data) {
  return request({
    url: '/sys/permission',
    method: 'POST',
    data
  })
}
