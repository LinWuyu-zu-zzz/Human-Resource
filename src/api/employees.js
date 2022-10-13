// 封装新增部门负责人
import request from '@/utils/request'
export const getEmployeeSimple = () => {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工的列表数据
 * ***/
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/** **
 *  新增员工的接口
 * **/
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/**
 * 删除员工接口
 * ****/

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/** *
 *  封装批量导入员工的接口
 * ***/
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
// ---------------------------------------------------------
/** *
 *  获取员工基本信息
 * ***/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/** *
 *
 * 保存员工的基本信息/上半部分点击按钮也是这个接口
 * **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/** *
 *  读取用户详情的基础信息,下半部分-基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

// 保存员工基本信息-下半部分点击按钮
export function saveEmployeesInfo(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'PUT',
    data
  })
}
// --------------------------------------------------------------
/** *
 *  获取岗位详情的信息
 * **/
export function getEmployeesJobInfo(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/** *
 *  保存岗位详情的信息
 * **/
export function saveEmployeesJobInfo(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'PUT',
    data
  })
}
