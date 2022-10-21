import Layout from '@/layout'
export default {
  path: '/departments',
  component: Layout,
  meta: { id: 'departments' }, // 前后端约定好,进行路由筛选,不会在其他页面中使用
  children: [
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments'),
      meta: { title: '组织架构', icon: 'tree' }

    }
  ]
}
