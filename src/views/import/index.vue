<template>
  <div>
    <UploadExcel :on-success="handleSuccess" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'Import',
  methods: {
    async handleSuccess({ header, results }) { // 中文转为英文,后端需要英文的key-value
      // console.log('aaa', header)
      console.log('bbb', results) // 是数组对象, [{入职日期:43678, 姓名:'张三' },{ },{ }]
      const userRelations = { // 中文一一对应英文,思路: 前端数据VS后端数据 ===>   key1:value = key2:value
        '入职日期': 'timeOfEntry', // 思路:  key1 : key2
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => { // item是一个个对象,中文写的, {入职日期:43678, 姓名:'张三' }
        const userInfo = {}
        Object.keys(item).forEach(key => { // 即数组['入职日期','姓名']去forEach遍历, key为字符串'入职日期','姓名'
          userInfo[userRelations[key]] = item[key] // userInfo添加属性名,再把value值43678赋值给userInfo
          // userRelations[key]即为userRelations对象的value,拿到'timeOfEntry','mobile', 作为userInfo的key属性名
          // item[key]相当于拿到value, item指{入职日期:43678, 姓名:'张三' }, key为字符串'入职日期'
        })
        arr.push(userInfo) // arr就成了数组对象[{},{}]
      })
      await importEmployee(arr) // 调用导入接口
      this.$message.success('批量导入成功')
      this.$router.back() // 返回上一页,不是在/import页面
    }
  }
}
</script>

<style>

</style>
