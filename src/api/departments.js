import request from '@/utils/request'
/**
 * 获取组织架构数据
 **/
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 新增部门时,点击确定提交.
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
