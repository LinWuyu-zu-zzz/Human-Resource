<template>
  <div>
    <!-- 把type和show-before传给子组件PageTools -->
    <PageTools type="success" :show-before="false">
      <!-- 父组件: template标签,用子组件的name属性插槽, v-slot:before 或者 #before -->
      <template #before>
        <span>共25条记录</span>
      </template>

      <template #after>
        <el-button size="small" type="warning">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
      </template>
    </PageTools>
  </div>
</template>

<script>
import PageTools from '@/components/PageTools'
export default {
  name: 'Employees',
  components: { PageTools },
  data() {
    return {

    }
  },

  mounted() {

  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
