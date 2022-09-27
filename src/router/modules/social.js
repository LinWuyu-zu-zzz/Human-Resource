import Layout from '@/layout' // 布局组件
export default {
  path: '/social',
  component: Layout,
  children: [
    {
      path: '',
      name: 'social',
      component: () => import('@/views/social'),
      meta: { title: '社保', icon: 'table' }

    }
  ]
}
