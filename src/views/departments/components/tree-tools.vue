<template>
  <el-row type="flex" justify="space-between" align="middle" style="width: 100%">
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <!-- @command方法是组件自带,即关闭弹窗的函数 -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
              <!-- command是组件自带属性,是dropdown-item 的指令 -->
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    //   父亲传过来的-当前节点的所有数据
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: { // isRoot 来控制 编辑部门 和 删除部门 的 显示 隐藏
      type: Boolean,
      default: true // 默认显示
    }
  },
  methods: {
    handleCommand(type) { // 参数是dropdown-item 的指令
      if (type === 'add') {
        this.$emit('addDept')

        this.$emit('addDept', this.treeNode) // 把treeNode传给父index,再父给另一个儿子add-dept
      } else if (type === 'edit') { // 编辑部门
      // 点击编辑部门, 弹窗显示, 回显数据
        this.$emit('editDept', this.treeNode) // 让父亲index改
      } else {
        // del
        this.$confirm('您确定删除该部门的数据吗？', '删除提示', {
          // cancelButtonText: '取消',  // 默认就有的,写不写都行
          // confirmButtonText: '确定',
          type: 'warning'
        }).then(async(res) => {
          // 如果点击了确定就会进入then
          return delDepartments(this.treeNode.id) // 返回promise对象
        }).then(() => {
          //  如果删除成功了  就会进入这里
          this.$emit('refreshDepts') // 触发自定义事件,让父组件刷新页面(调用接口重新渲染)
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style>

</style>
