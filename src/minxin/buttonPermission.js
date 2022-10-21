// 混入-按钮权限(和之前组件内写法一致)
export default {
  methods: {
    isHasPermission(permissionId) { // 按钮权限: 封装成一个函数,传参,接收编辑/删除/新增按钮的 :disabled 参数
      return !this.$store.state.user.userInfo.roles.points.includes(permissionId)
    }
  }
}

