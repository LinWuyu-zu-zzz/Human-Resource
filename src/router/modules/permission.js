import Layout from '@/layout'
export default {
  path: '/permission',
  component: Layout,
  meta: { id: 'permissions' }, // 前后端约定好,进行路由筛选,不会在其他页面中使用
  children: [
    {
      path: '',
      name: 'permission',
      component: () => import('@/views/permission'),
      meta: { title: '权限管理', icon: 'lock' }

    }
  ]
}
