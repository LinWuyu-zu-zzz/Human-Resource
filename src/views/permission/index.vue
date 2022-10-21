<template>
  <div>
    <div class="dashboard-container">
      <div class="app-container">
        <page-tools :show-before="false">
          <template #after>
            <!-- 实参type和pid: 一级type=1, 二级type=2, 一级pid='0' -->
            <el-button type="primary" @click="showAddPermission(1,'0')">添加权限</el-button>
          </template>
        </page-tools>

        <!-- 表格 -->
        <el-table
          ref="refTable"
          border
          :data="tableData"
          style="width: 100%"
          row-key="id"
        >
          <el-table-column label="名称" prop="name">
            <template slot-scope="{row}">
              <div @click="expandName(row)">
                <!-- type为1则是一级,为2则是二级 -->
                <template v-if="row.type===1">
                  <i class="el-icon-folder-opened" />
                  <span>{{ row.name }}</span>
                </template>

                <template v-if="row.type===2">
                  <i style="margin-left:20px;margin-right:10px;" class="el-icon-folder" />
                  <span>{{ row.name }}</span>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <!-- 如果是二级则去掉添加按钮 -->
              <!--  实参type和pid: 一级type=1, 二级type=2, 二级pid为当前点击的id-->
              <el-button v-if="row.type===1" type="text" @click="showAddPermission(2,row.id)">添加</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog title="新增权限" :visible.sync="showDialog" width="50%" @close="onClose">
          <!-- 表单 -->
          <el-form ref="refForm" :model="formData" :rules="rules" label-width="120px">
            <el-form-item label="权限名称" prop="name">
              <el-input v-model="formData.name" style="width:90%" />
            </el-form-item>
            <el-form-item label="权限标识" prop="code">
              <el-input v-model="formData.code" style="width:90%" />
            </el-form-item>
            <el-form-item label="权限描述">
              <el-input v-model="formData.description" style="width:90%" />
            </el-form-item>
            <el-form-item label="开启">
              <!-- el-switch组件默认是布尔值,后端需要0和1,自带属性active-value,可选string/number/boolean-->
              <el-switch
                v-model="formData.enVisible"
                active-color="blue"
                inactive-color="#ccc"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="showDialog = false">取消</el-button>
            <el-button size="small" type="primary" @click="confirmBtn">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission } from '@/api/permission'
import { treeData } from '@/utils'
export default {
  name: 'Permission',

  data() {
    return {
      tableData: [],
      showDialog: false,
      formData: {
        name: '',
        code: '',
        description: '',
        envisible: '',
        type: 0,
        pid: ''
      },
      rules: {
        name: [{ required: true, message: '请填写权限名称', trigger: 'blur' }],
        code: [{ required: true, message: '请填写权限标识', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getPermissionList()
  },

  methods: {
    async getPermissionList() {
      const res = await getPermissionList()
      this.tableData = treeData(res, '0')
    },
    expandName(row) {
      // toggleRowExpansion: 组件自带table的方法,接收两个参数 row, expand(布尔值)
      row.isExpand = !row.isExpand // 给row对象新增一个属性isExpand,控制是否展开
      this.$refs.refTable.toggleRowExpansion(row, row.isExpand)
    },
    showAddPermission(type, pid) { // 接收到实参:类型和pid
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    confirmBtn() {
      this.$refs.refForm.validate(async(valid) => {
        if (!valid) return

        await addPermission(this.formData)
        this.$message.success('添加权限成功')
        this.showDialog = false
        this.getPermissionList()
      })
    },
    onClose() {
      this.$refs.refForm.resetFields() // 重置带有校验规则的表单
      this.formData = { // 重置没有校验的表单
        name: '',
        code: '',
        description: '',
        envisible: '',
        type: 0,
        pid: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table__expand-icon{
  display: none !important; // 把展开的箭头图标隐藏,再换成别的
}
</style>
