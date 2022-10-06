<template>
  <div class="app-container">
    <!-- tab栏和按钮 -->
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="first">
          <el-row>
            <el-col :gutter="10">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                style="margin-left:10px"
                @click="handleAdd"
              >新增角色</el-button>
            </el-col>
          </el-row>
          <!-- 表格数据 -->
          <el-table v-loading="loading" :data="roleList" style="width:100%">
            <el-table-column
              type="index"
              label="序号"
              width="120"
            />
            <el-table-column
              label="角色名称"
              width="240"
              prop="name"
            />
            <el-table-column
              label="描述"
              prop="description"
            />
            <el-table-column label="操作" width="240">
              <!-- Table组件的插槽  原本是 ="scope",解构成{row} -->
              <!-- @click="editRole(row): 插槽传给editRole,接收到row -->
              <!-- @click="delRole(row.id)"---根据id删除角色,插槽传给delRole()函数 -->
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-row type="flex" justify="end" align="middle" style="height: 60px">
            <!--
            background   添加背景
            current-page 当前的页面, 支持 .sync 修饰符, 点击分页时调用了接口,页面也会随之渲染不同的数据
            page-size    每一页展示的条数
            page-sizes   下拉项每一页显示个数
            total        总共多少条数据,如果一条数据也没用,就不显示分页
            layout       布局,显示分页下拉项的
            current-change 改变当前页码的触发（current-page 值改变的时候触发）
            size-change 改变页面的数据条数的时候 触发（page-size 值改变的时候触发） -->
            <el-pagination
              v-if="total>0"
              layout="prev, pager, next,sizes"
              background
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[5,10,20,50]"
              @current-change="getRoleList"
              @size-change="getRoleList"
            />
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="公司管理" name="second">
          <el-alert
            title="消息提示的文案"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- refleshList: 重新刷新页面,即再调用获取角色接口 -->
    <addRole ref="refRole" :dialog-visible.sync="dialogVisible" @refleshList="getRoleList" />
    <!-- .sync作用: 自动加上一个自定义事件 update:变量名,把参数false拿过来,赋值给dialogVisible-
          在子组件addRole.vue里面的函数handleClose触发 -->
  </div>
</template>

<script>
import { getRoleListAPI, deleteRole, getCompanyInfo } from '@/api/setting'
import addRole from './components/addRole.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Setting',
  components: { addRole },
  data() {
    return {
      activeName: 'first',
      page: {
        page: 1, // 默认显示第一页
        pagesize: 5 // 下拉项每页显示个数
      },
      total: 0,
      roleList: [],
      loading: false,
      dialogVisible: false, // 关闭弹出层/对话框
      companyInfo: {} // 公司信息
    }
  },
  computed: {
    ...mapGetters(['companyId']) // 拿到companyId,要渲染 公司设置功能
  },
  mounted() {
    this.getRoleList() // 开始就调用一下
    this.getCompany()
  },

  methods: {
    async getRoleList() { // 获取角色列表,点击公司设置即会调用
      try {
        this.loading = true
        const { total, rows } = await getRoleListAPI(this.page)
        this.total = total
        this.roleList = rows
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false // 关闭加载中
      }
    },
    // 角色新增按钮
    handleAdd() {
      this.dialogVisible = true
    },
    // 编辑角色功能: 绑定点击, 拿到当前行这条数据, 回显到新增组件上
    editRole(row) {
      console.log(row) // 打印的是对象,有id,这是element组件封装了一个id
      // console.log(this.$refs.refRole) // 拿到的是组件实例VueComponent
      // this.$refs.refRole.formData = row // row直接赋值给 addRole组件的formData
      // 优化:点击编辑按钮删几个字,再取消,那表格里也会跟着删,数据是引用类型的数据,地址一样,深拷贝用JSON.paser(JSON.stringfy(row))也可以
      this.$refs.refRole.formData = { ...row }
      this.dialogVisible = true // 显示弹出层
    },
    // 删除角色
    async delRole(id) {
      // this.$confirm('确认删除该角色吗', '删除提示', {
      //   cancelButtonText: '取消',
      //   confirmButtonText: '确定',
      //   type: 'warning'
      // }).then(success => {
      //   console.log('success')
      // }).catch( cancel=>{
      //   console.log('cancel');
      // })
      // } // 等价于await

      try {
        await this.$confirm('确认删除该角色吗', '删除提示', {
          cancelButtonText: '取消', // 组件封装
          confirmButtonText: '确定',
          type: 'warning'
        })
        await deleteRole(id) // 调用删除接口
        // 优化:每一页删完之后会自动跳到前一页
        if (this.total > 0 && this.roleList.length === 0) {
          this.page.page = this.page.page - 1 // 往前推一页
          this.getRoleList() // 重新刷新页面
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取公司基本信息(用于公司设置功能)
    async getCompany() {
      this.companyInfo = await getCompanyInfo(this.companyId) // mapGetters里面已获取,直接用
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
