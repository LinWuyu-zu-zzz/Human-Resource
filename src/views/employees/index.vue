<template>
  <div class="app-container">
    <!-- 父组件: template标签,用子组件的name属性插槽, v-slot:before 或者 #before -->
    <PageTools>
      <template #before>
        <span>共166条记录</span>
      </template>

      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button :disabled="isHasPermission('employees-export')" size="small" type="danger" @click="exportExcel">导出</el-button>
        <el-button size="small" type="primary" @click="handleEmployee">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <!-- 加一个头像列,会显示url,要显示头像图片,用作用域插槽 -->
        <el-table-column label="头像" prop="staffPhoto">
          <template slot-scope="{ row }">
            <img
              style="
            border-radius: 50%;
            width: 70px;
            height: 70px;
            "
              :src="row.staffPhoto"
              @click="showCode(row.staffPhoto)"
            >
          </template>
        </el-table-column>
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
            <!-- store-user.js中的假数据没有 'employees-look' ,所以没有这个权限,即禁用-->
            <!-- 用自定义指令,直接删除按钮,如调岗按钮 -->
            <el-button :disabled="isHasPermission('employees-look')" type="text" size="small" @click="goDetail(row)">查看</el-button>
            <el-button :disabled="isHasPermission('employees-zhuanzheng')" type="text" size="small">转正</el-button>
            <el-button v-isHas="'employees-tiaogang'" type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="showSetRole(row)">角色</el-button>
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

    <!-- 新增员工-弹窗(右上角) -->
    <add-employee ref="refEmployee" :dialog-visible.sync="dialogVisible" />

    <!-- 点击头像,显示二维码 -->
    <!-- el-dialog组件: 自带懒加载,弹窗里面的东西显示的时候才创建 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <canvas ref="canvas" />
    </el-dialog>

    <!-- 点击角色-显示弹窗 -->
    <!-- 思想: 从大到小, 给角色分配权限,再给员工分配角色, 员工--角色--权限    -->
    <!-- 点击角色按钮,能拿到row这一行的数据,把用户id传给子组件 -->
    <assign-role :user-id="userId" :dialog-visible-set-role.sync="dialogVisibleSetRole" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import HireType from '@/api/constant/employees' // 0和1表示正式
import AddEmployee from './components/add-employee.vue'
import QRCode from 'qrcode'
import AssignRole from './components/assign-role.vue'
import mixinPermission from '@/minxin/buttonPermission'

export default {
  name: 'Employees',
  components: { AddEmployee, AssignRole },
  mixins: [mixinPermission],
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
      dialogVisible: false,
      showCodeDialog: false,
      dialogVisibleSetRole: false,
      userId: ''
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
    },
    async exportExcel() { // 导出Excel
      const { export_json_to_excel } = await import('@/vendor/Export2Excel.js') // 文件懒加载 import当作函数
      const { rows } = await getEmployeeList({ page: 1, size: this.total }) // 导出Excel的内容是所有列表数据
      const mapKeyPath = { // 中英文转换, 后端需要英文的key数据
        '入职日期': 'timeOfEntry',
        '姓名': 'username',
        '工号': 'workNumber',
        '手机号': 'mobile',
        '转正日期': 'correctionTime',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      const header = Object.keys(mapKeyPath)
      const data = rows.map(item => { // item指arr每一项对象
        return header.map(h => { // h指header每一项 '姓名', '手机号'
          if (h === '聘用形式') { // 判断聘用形式 正式和非正式
            const find = this.hireType.find(ele => ele.id === item[mapKeyPath[h]]) // 如果常量js中hireType的id===聘用形式的数字1或0
            return find ? find.value : '未知'
          }

          return item[mapKeyPath[h]] // 不能写成 . 的形式,只能obj[key],不能解析成变量
        // mapKeyPath[h] h指'入职日期', 根据key拿到英文的timeOfEntry
        // item[ mapKeyPath[h] ]  去arr中根据key拿到value "2018-11-02"
        })
      })

      export_json_to_excel({ // 函数:直接调用
        header, // 导出数据的表头
        data, // 具体数据,二维数组,每个数组是一个完整的信息,有姓名/手机号/工号/部门等
        filename: '人资员工列表', // 导出文件名
        autoWidth: true, // 单元格是否要自适应宽度
        bookType: 'xlsx' // 导出文件类型
      })
    },
    goDetail(row) {
      console.log(row)
      this.$router.push('/employees/detail/' + row.id)
    },
    showCode(url) { // 接收到图片地址 row.staffPhoto传过来的
      if (!url) return this.$message.error('暂无头像')
      this.showCodeDialog = true
      // Vue核心: 数组驱动,组件系统
      // 数据更新是异步的,想要立即获得视图,用$nextTick( ()=>{} )
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, url)
      })
    },
    showSetRole(row) {
      this.userId = row.id
      this.dialogVisibleSetRole = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
