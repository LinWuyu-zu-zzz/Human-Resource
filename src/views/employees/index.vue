<template>
  <div class="app-container">
    <!-- 父组件: template标签,用子组件的name属性插槽, v-slot:before 或者 #before -->
    <PageTools>
      <template #before>
        <span>共166条记录</span>
      </template>

      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
        <el-button size="small" type="primary" @click="handleEmployee">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatterFn" />
        <el-table-column label="部门" prop="departmentName" />

        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <!-- 作用域插槽: 展示数据 过滤器 -->
          <template slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>

        <el-table-column label="账户状态" prop="enableState">
          <!-- 作用域插槽: 仅作展示 -->
          <template slot-scope="{row}">
            <el-switch
              v-model="row.enableState"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          <!-- 作用域插槽 row-->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[2,5,10,15,20]"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
        <!--@current-change: 当前页 变化触发,调用函数  -->
        <!--@size-change: 每页条数变化触发,调用函数  -->
      </el-row>
    </el-card>

    <add-employee ref="refEmployee" :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import HireType from '@/api/constant/employees' // 0和1表示正式
import AddEmployee from './components/add-employee.vue'
export default {
  name: 'Employees',
  components: { AddEmployee },
  data() {
    return {
      page: {
        page: 1,
        size: 10
      },
      list: [],
      total: 0,
      loading: false,
      hireType: HireType.hireType,
      dialogVisible: false
    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() { // 渲染页面
      try {
        this.loading = true
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    // row: 当前行的所有数据, 如username,companyId,创建时间,部门名称
    // column: 当前值的配置信息,如布局最小高度,标题
    // cellValue: 当前值 如1
    formatterFn(row, column, cellValue) { // 0和1转换为'正式'或'非正式'
      const obj = this.hireType.find(ele => ele.id === cellValue)
      // console.log(obj.value) // 打印的是'正式'和'非正式'
      return obj ? obj.value : '未知'
    },
    handleEmployee() { // 点击 新增员工 按钮
      // 点击, 出现弹窗
      // 实现弹窗组件的显示和隐藏
      // 注意新增员工的弹窗, 抽成一个组件
      this.dialogVisible = true
    },
    async del(id) {
      try {
        await this.$confirm('确认删除该员工吗', '提示', { type: 'warning' })
        await delEmployee(id)
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
