<template>
  <!-- 点击×号会报错,因为 :visible.sync,即修改了dialogVisibleSetRole,但是这是父组件index传过来的,不能修改props-->
  <!-- 解决方法: 去掉 .sync 同时加上组件自带的 close事件 -->
  <!-- open: Dialog 打开时的回调            close: Dialog关闭时的回调 -->
  <el-dialog title="分配角色" :visible="dialogVisibleSetRole" @close="onClose" @open="onOpen">
    <el-checkbox-group v-model="checkList" v-loading="loading">
      <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">
        {{ item.name }}
        <!-- 相当于插槽 -->
      </el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="$emit('update:dialogVisibleSetRole',false)">取 消</el-button>
      <el-button size="small" type="primary" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRoles, assignRoles } from '@/api/roles'
import { getUserDetailById } from '@/api/user'
export default {
  name: 'AssignRole',
  props: {
    dialogVisibleSetRole: {
      type: Boolean,
      required: true
    },
    userId: { // 接收父组件row.id传来的用户id
      type: String,
      required: true
    }
  },
  data() {
    return {
      // vue工具中需要记录id,去发送请求
      checkList: [], // 复选框选定了那个,就在数组中写哪个
      roles: [], // 角色列表
      loading: false
    }
  },
  methods: {
    onClose() {
      this.$emit('update:dialogVisibleSetRole', false)
    },
    async onOpen() {
      try {
        this.loading = true
        const { rows } = await getRoles()
        this.roles = rows
        this.getEmployeesRoles()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async getEmployeesRoles() { // 定义一个函数,拿到
      const res = await getUserDetailById(this.userId)
      this.checkList = res.roleIds || [] // 注意后端返回的可能是null
    },
    async onConfirm() { // 点击确定,分配角色
      try {
        this.loading = true
        if (!this.checkList.length) return this.$message.error('请勾选必要的角色')
        await assignRoles({ id: this.userId, roleIds: this.checkList })
        this.$message.success('分配角色成功')
        this.onClose()
      } catch (error) {
        console.log(error)
        this.$message.error('分配角色失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
