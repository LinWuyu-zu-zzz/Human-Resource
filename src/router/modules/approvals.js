// 抽取出来单独的模块 一级路由
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
import Layout from '@/layout'
export default {
  path: '/approvals',
  component: Layout, // 布局组件
  meta: { id: 'approvals' }, // 前后端约定好,进行路由筛选,不会在其他页面中使用
  children: [ // 布局组件的子组件
    {
      path: '', // 表示该路由为当前二级路由的默认路由,会自动把上面的path匹配好
      name: 'approvals',
      component: () => import('@/views/approvals/index'),
      meta: { title: '审批', icon: 'tree-table' }
      // meta属性的里面的属性 随意定义 但是这里为什么要用title呢，因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
    }
  ]
}
