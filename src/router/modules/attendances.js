import Layout from '@/layout'
export default {
  path: '/attendances',
  component: Layout,
  meta: { id: 'attendances' }, // 前后端约定好,进行路由筛选,不会在其他页面中使用
  children: [
    {
      path: '',
      name: 'attendances',
      component: () => import('@/views/attendances'),
      meta: { title: '考勤', icon: 'skill' }

    }
  ]
}
