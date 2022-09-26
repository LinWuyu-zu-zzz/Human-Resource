<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      class="login-form"
      auto-complete="on"
      label-position="left"
      :model="loginForm"
      :rules="rules"
    >
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>

      <!-- 手机输入框和字体图标 (使用icon) -->
      <el-form-item prop="mobile">
        <span
          class="svg-container el-icon-user-solid"
        />
        <el-input v-model="loginForm.mobile" placeholder="请输入手机号码" />
      </el-form-item>

      <!-- 密码输入框,字体图标,小眼睛图片 (使用svg图片) -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>

        <el-input ref="pwd" v-model="loginForm.password" :type="passwordType" />

        <span class="svg-container" @click="showPwd">
          <svg-icon :icon-class="passwordType==='password'?'eye':'eye-open'" />
        </span>
      </el-form-item>

      <el-button class="loginBtn" :loading="loading" @click="login">登录</el-button>
      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>

    </el-form>
  </div>
  <!-- 环境变量的作用
  1. 正常公司中 有几个环境 4 开发 dev 测试 test 预发 uat 线上 pro
  2. 在项目里如何配置这几个环境  通过 .env 配置 base api
  开发环境的接口前缀 /api
  线上环境的接口前缀 /prod-api
   -->
</template>

<script>
/* 正常公司中有几个环境?  1.开发环境dev  2.测试环境test  3.预发uat  4.线上prod
   在项目里如何配置这几个环境?  - 通过 .env配置 baseURL (base api
     - 开发环境的接口前缀: /api
     - 线上环境的接口前缀: /prod-api */

import { validMobile } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    const phoneValid = (rule, value, callback) => {
      if (!validMobile(value)) { // utiles文件夹里封装的validMobile函数
        callback(new Error('手机号码格式不正确')) // 如果没成功
      } else {
        callback()
      }
    }

    return {
      // 步骤: 1.绑定type  2.小眼睛三元表达式  3.小眼睛click修改type属性是否是password,聚焦
      // 4.绑定input框的值v-model='AA.aa'
      passwordType: 'password', // 让input框先默认password
      loginForm: {
        mobile: '13800000002', // 后端格式是这样
        password: '123456'
      },
      rules: { // 规则是对象,每一条规则是一个数组
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          {
            validator: phoneValid, trigger: 'blur' // phoneValid:指data里面const phoneValid函数
          }
        ],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { min: 6, max: 16, message: '密码格式不正确', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    showPwd() {
      // 点击小眼睛,切换 eye 和 eye-open, 即type属性是否改password
      this.passwordType === 'password' ? this.passwordType = '' : this.passwordType = 'password'
      this.$nextTick(() => {
        this.$refs.pwd.focus() // DOM更新是异步的,$nextTick()把任务推向微任务/异步任务,不然拿不到input
      })
    },
    async login() {
      try {
        await this.$refs.loginForm.validate() // 整个表单校验,点击登录按钮,发送请求之前的加载中
        this.loading = true
        // 发送请求 模块名
        await this.$store.dispatch('user/loginAction', this.loginForm)
        this.$router.push('/') // 跳转路由
      } finally {
        this.loading = false // 把加载中属性复原,不转了
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
/* 在修改element ui 组件的样式的时候 style 不许加scoped */

$bg:#d4e3ff;
$light_gray:#68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  /* 如需要在样式表中使用@别名的时候，需要在@前面加上一个~符号，否则不识别 */
  background-image: url('~@/assets/common/login.jpg'); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill { // 自动填充时的样式
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
  }
  .el-form-item__error {
    color: #fff
  }
  .loginBtn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
  width:100%;
  margin-bottom:30px;
  border:none;
  color:#fff
}
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
