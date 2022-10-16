import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    },
    {
      path: '/employees/detail/:id', // 查看-用户详情信息/岗位信息
      component: () => import('@/views/employees/components/detail'),
      hidden: true // 不用专门的页面显示,隐藏
    },
    {
      path: '/employees/print/:id', // 打印页面
      component: () => import('@/views/employees/components/print'),
      hidden: true
    }
  ]
}
