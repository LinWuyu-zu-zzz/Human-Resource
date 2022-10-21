import Layout from '@/layout' // 布局组件
export default {
  path: '/social',
  component: Layout,
  meta: { id: 'social_securitys' }, // 前后端约定好,进行路由筛选,不会在其他页面中使用
  children: [
    {
      path: '',
      name: 'social',
      component: () => import('@/views/social'),
      meta: { title: '社保', icon: 'people' }

    }
  ]
}
