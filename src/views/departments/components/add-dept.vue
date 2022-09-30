<template>
  <!-- 新增部门的弹层 -->
  <el-dialog title="新增部门" :visible.sync="dialogVisible" @close="handleColse">
    <!-- visible是组件自带的属性, 并且支持.sync修饰符 -->
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select style="width:80%" placeholder="请选择">
          <el-option v-model="formData.manager" label="username11" value="username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
export default {
  name: 'AddDepts',
  props: { // 父传给子
    dialogVisible: { // 通过属性控制弹出框显示隐藏
      type: Boolean,
      default: false
    },
    // 先拿到所有同级部门的数据,一个个比较过去,
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 校验: 部门编码code在整个模块中都不允许重复
    const codeCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // console.log(depts)
      const isRepeat = depts.some(ele => ele.code === value)
      isRepeat ? callback(new Error(`模块下已存在${value}编码`)) : callback()
    }

    const nameCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      const deptsTJ = depts.filter(item => item.pid === this.treeNode.id)

      const isRepeat = deptsTJ.some(item => item.name === value)
      isRepeat ? callback(new Error(`模块下已存在${value}名称`)) : callback()
      callback()
    }

    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称1-50个字符', trigger: 'blur' },
          { validator: nameCheck, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码1-50个字符', trigger: 'blur' },
          { validator: codeCheck, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门管理者必填' } // 默认是值发生改变时触发
        ],
        introduce: [
          { required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 300, message: '部门名称1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleColse() { // 子到父index,用 .sync, 在关闭弹窗的时候 触发update:dialogVisible事件
      this.$emit('update:dialogVisible', false) // 参数false传给父index.vue

      this.$refs.addDeptForm.resetFields() // 清空表单,表单dom身上的方法
    }
  }
}
</script>

<style>

</style>
