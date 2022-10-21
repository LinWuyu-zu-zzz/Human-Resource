<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="app-breadcrumb">
      江苏传智播客教育科技股份有限公司
      <span class="breadBtn">体验版</span>
    </div>

    <div class="right-menu">
      <!-- 中英文切换组件 -->
      <ToggleLang />

      <!-- 全屏放大组件 -->
      <FullScreen />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-imgError="defaultImg" :src="staffPhoto" class="user-avatar">
          <i class="el-icon-caret-bottom" />
          <span>{{ name }}</span>
        </div>

        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>

          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import defaultImg from '@/assets/common/head.jpg' // 给一个默认图片地址
import FullScreen from '@/components/FullScreen'
import ToggleLang from '@/components/ToggleLang'

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    FullScreen,
    ToggleLang
  },
  data() {
    return {
      defaultImg: defaultImg // 后端返回了图片地址,但无效图片加载不出来时会换成这个图片,而不是裂开
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name', 'staffPhoto'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // 退出: 1.清除token(vuex和缓存里的都要) 2.路由跳转
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
     color: #fff; // currentColor指color:#fff
    fill: currentColor; // 给svg改背景颜色,不能直接写color:#fff,而是fill

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
     .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        position: relative;
        // 开启flex
        display: flex;
        align-items: center;
        color: #fff;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin-right: 8px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 18px;
          font-size: 12px;
        }
      }
    }
  }

  .app-breadcrumb {
  display: inline-block;
  font-size: 18px;
  line-height: 50px;
  margin-left: 10px;
  color: #ffffff;
  cursor: text;
  .breadBtn {
    background: #84a9fe;
    font-size: 14px;
    padding: 0 10px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    margin-left: 15px;
  }
}
}
</style>
