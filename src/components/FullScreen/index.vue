<template>
  <div>
    <!-- 使用的是svg图标,不是icon -->
    <!-- 有人已经对svg标签进行了二次封装 -->
    <!-- className: 类名,传到components-SvgIcon组件中 -->
    <!-- iconClass: 图标名字 -->
    <svg-icon class-name="fullScreen" icon-class="fullscreen" @click="toggleFullScreen" />
    <!-- 以前：
          1.svg图标(ui给的)
          2.进入阿里图标库生成css代码
          3.css代码导入到项目中
          4.通过标签类名的方式使用 -->
    <!-- 现在：svg图标， 再<svg-icon></svg-icon>  -->
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
console.log(ScreenFull)
export default {
  name: 'FullScreen',
  methods: {
    toggleFullScreen() {
      if (!ScreenFull.isEnabled) return this.$message.error('浏览器不支持全屏')
      ScreenFull.toggle() // 包里面的方法
    }
  }
}
</script>

<style scoped>
.fullScreen{
  color: #fff;
  margin-right: 10px;
}

</style>
