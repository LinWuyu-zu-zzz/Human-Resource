<template>
  <!-- 新增角色的弹窗 Dialog组件 -->
  <el-dialog
    :title="title"
    width="50%"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <!-- before-close属性是组件自带的: 点击×号关闭-->
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="formData"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{required: true, message:'角色名称必填'}]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <!-- 新增角色 的取消确定按钮 -->
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="submit">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from '@/api/setting'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  computed: {
    title() { // 优化:点新增标题显示新增,点编辑显示编辑
      return this.formData.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    // 关闭弹出层逻辑(取消按钮和叉号两个)
    handleClose() {
      // 触发父组件 .sync
      this.$emit('update:dialogVisible', false)
      this.$refs.roleDialogForm.resetFields() // 重置表单,Form组件自带的方法resetFields()
      this.formData = { name: '', description: '' } // 点编辑再取消,再点新增角色,还会有数据,要清空编辑特有的id
    },
    async submit() {
      try {
        await this.$refs.roleDialogForm.validate() // 校验整个表单,Form组件自带的方法
        this.loading = true
        // 调用接口: formData.id是否存在,判断是处于新增接口还是编辑接口
        this.formData.id ? await updateRole(this.formData) : await addRole(this.formData)
        this.$message.success(this.formData.id ? '编辑角色成功' : '新增角色成功') // Message组件自带$message
        this.$emit('refleshList') // 新增完之后重新刷新,即再调用获取角色的接口,让父亲改
        this.handleClose() // 新增完关闭弹出层Dialog并重置表单
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
