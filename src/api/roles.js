
import request from '@/utils/request'
/**
 * 获取所有角色列表
 * ***/
export function getRoles() {
  return request({
    url: '/sys/role'
  })
}

/** *
 * 给用户分配角色(原本写在user.js中)
 * ***/
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}

/**
 * 根据id获取角色详情(拿到权限)
 * ***/
export function getRolesInfo(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 给角色分配权限
export function setRolesPermission(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
