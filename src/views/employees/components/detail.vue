<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane lazy label="登录账户设置" name="first">

            <!-- 放置表单 -->
            <el-form ref="form" v-loading="loading" :model="accountInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="accountInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password">
                <el-input v-model="accountInfo.password" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateEmployees">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane lazy label="个人详情" name="second">
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane lazy label="岗位信息" name="third">
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
import UserInfo from './user-info.vue'
import JobInfo from './job-info.vue'
import Cookie from 'js-cookie' // js-cookie包更方便操作cookie,原生处理较复杂
export default {
  name: 'Detail',
  components: { UserInfo, JobInfo },
  data() {
    return {
      activeName: Cookie.get('activeName') || 'first',
      accountInfo: {},
      rules: {
        username: [ // 对应el-form-item的prop
          { required: true, message: '请输入员工名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少6位', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() { // params传参,this.$route.params拿到参数
      const res = await getUserDetailById(this.$route.params.id)
      this.accountInfo = res
    },
    // async await有什么缺点: 错误必须用try-catch进行捕获
    async updateEmployees() { // 点击更新员工信息
      try {
        this.loading = true
        await this.$refs.form.validate() // 里面接收一个回调,两个参数,不写返回promise,看文档
        await saveUserDetailById(this.accountInfo)
        this.$message.success('更新成功')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    tabClick() { // tab 被选中时触发,把activeName存到Cookie中
      Cookie.set('activeName', this.activeName)
    }
  }
}
</script>

<style>

</style>
