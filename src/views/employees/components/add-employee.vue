<template>
  <!-- visible: 自带的属性,控制显示和隐藏 -->
  <el-dialog title="新增员工" :visible="dialogVisible" @close="handleClose">
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <!-- 用封装好的转换正式和非正式的js文件,循环, id: 1对应value: '正式' -->
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree
          v-show="showTree"
          v-loading="loading"
          :data="treeData"
          default-expand-all
          :props="{ label: 'name' }"
          style="width:80%"
          @node-click="selectNode"
        />
        <!-- props属性: 原本tree组件循环的treeData数据必须用label,通过props可以改成name-->
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button type="primary" size="small" @click="confirmBtn">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import employeesState from '@/api/constant/employees' // 引入常量,聘用形式正式和非正式
import { getDepartments } from '@/api/departments'
import { treeData } from '@/utils'
import { addEmployee } from '@/api/employees'

// 实现改该弹窗的显示和隐藏
export default {
  name: 'AddEmployee',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '', // 姓名
        mobile: '', // 手机
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'change' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }], // 下拉框,值改变时触发
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      hireType: employeesState.hireType, // 聘用形式
      treeData: [],
      showTree: false,
      loading: false
    }
  },
  methods: {
    handleClose() { // 关闭弹窗的逻辑
      this.$refs.addEmployee.resetFields() // 重置表单
      this.formData = { // 清空数据
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.showTree = false // 取消/叉号关掉时也关掉树状结构
      this.$emit('update:dialogVisible', false) // 关掉弹窗,传值给父
    },
    async getDepartments() { // 弹窗里面部门input框的列表
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments() // 获取部门列表,之前组织架构写过的
      this.treeData = treeData(depts, '') // 封装在utils里面,获取树状结构的子节点的函数,根节点pid为''
      this.loading = false
    },
    selectNode(node) { // 组件自带的方法 @node-click, 接收三个参数,node为点击的这个节点的所有信息
      this.formData.departmentName = node.name // 节点的信息赋值给表单框上,把值显示到input框中
      this.showTree = false // 点击了部门之后就关掉树状结构
    },
    async confirmBtn() { // 点击确定,提交表单
      try {
        await this.$refs.addEmployee.validate() // 表单校验通过之后,再调用接口
        await addEmployee(this.formData) // 新增员工接口
        this.handleClose() // 关弹窗
        this.$parent.getEmployeeList() // 刷新渲染列表,调用接口
        this.$message.success('新增成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
