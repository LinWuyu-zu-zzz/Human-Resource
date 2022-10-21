<template>
  <el-dialog
    title="提示"
    :visible="dialogVisible"
    width="30%"
    @close="onClose"
    @open="onOpen"
  >
    <!-- 注:default-checked-keys指 默认勾选的节点的 key 的数组  -->
    <!-- node-key="id" 其中id写死的,即请求来的data数组里面的id属性 -->
    <el-tree
      ref="refTree"
      :default-checked-keys="roleArr"
      node-key="id"
      :data="data"
      show-checkbox
      default-expand-all
      :props="defaultProps"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogVisible',false)">取 消</el-button>
      <el-button type="primary" @click="savePermissions">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { getRolesInfo, setRolesPermission } from '@/api/roles'
import { treeData } from '@/utils'
export default {
  name: 'SetPermission',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    roleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      data: [], // 循环树状结构的所有数据
      defaultProps: { // 用来重命名,组件内部只能识别渲染children,label字段
        // children: 'children',
        label: 'name'
      },
      roleArr: []
    }
  },
  methods: {
    onClose() { // dialogVisible:父index传过来的,和props的,都是同一个
      this.$emit('update:dialogVisible', false)
    },
    async onOpen() {
      const res = await getPermissionList() // 获取所有角色权限
      console.log(res)
      this.data = treeData(res, '0')
      this.getRolesInfo()
    },
    async getRolesInfo() { // 获取当前角色拥有的权限
      const res = await getRolesInfo(this.roleId)
      // console.log(res)
      this.roleArr = res.permIds
    },
    async savePermissions() {
      try {
        const id = this.roleId
        const permIds = this.$refs.refTree.getCheckedKeys()
        // getCheckedKeys()方法是tree组件的方法
        // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
        await setRolesPermission({ id, permIds })
        this.$message.success('分配权限成功')
        this.onClose()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
