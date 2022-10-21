<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <svg-icon class-name="changeLanguage" icon-class="language" />
    </span>
    <!-- 给两个语言包分别加了个name属性,v-for可以循环对象,item是value -->
    <el-dropdown-menu slot="dropdown" @click="changeLang">
      <el-dropdown-item v-for="(value,key) in messages" :key="key" :disabled="lang===key" @click.native="changeLang(key)">{{ value.name }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { messages } from '@/i18n'
import Cookie from 'js-cookie'
export default {
  name: 'ToggleLang',
  data() {
    return {
      messages,
      lang: Cookie.get('lang') || 'zh' // 存到cookie中的zh/en,用于禁用状态
    }
  },
  methods: {
    changeLang(lang) {
      // console.log(this) // this上找$i18n上的locale
      this.$i18n.locale = lang // 切换语言, lang接收形参 zh/en
      Cookie.set('lang', lang) // 持久化,把zh/en存到cookie中,名字key自定义为lang
      this.lang = lang // 用于禁用状态
      this.$router.go(0) // 强制更新(element组件内部切换中英文,再强制刷新)
    }
  }
}
</script>

<style scoped lang="scss">
.changeLanguage{
  font-size: 24px;
  color: #fff;
  margin-right: 5px;
}
</style>
