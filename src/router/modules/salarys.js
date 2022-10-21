import Layout from '@/layout'
export default {
  path: '/salarys',
  component: Layout,
  meta: { id: 'salarys' }, // 前后端约定好,进行路由筛选,不会在其他页面中使用
  children: [
    {
      path: '',
      name: 'salarys',
      component: () => import('@/views/salarys'),
      meta: { title: '工资', icon: 'money' }

    }
  ]
}
