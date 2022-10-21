import Layout from '@/layout'
export default {
  path: '/setting',
  component: Layout,
  meta: { id: 'settings' }, // 前后端约定好,进行路由筛选,不会在其他页面中使用
  children: [
    {
      path: '',
      name: 'setting',
      component: () => import('@/views/setting'),
      meta: { title: '公司设置', icon: 'setting' }

    }
  ]
}
