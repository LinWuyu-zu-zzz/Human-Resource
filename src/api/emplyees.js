// 封装新增部门负责人
import request from '@/utils/request'
export const getEmployeeSimple = () => {
  return request({
    url: '/sys/user/simple'
  })
}
