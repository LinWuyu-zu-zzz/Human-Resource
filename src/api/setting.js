import request from '@/utils/request'

// 读取角色列表数据(公司设置模块)
export function getRoleListAPI(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 新增角色接口
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

// 编辑更新角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * 获取公司信息
 * **/
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
