<template>
  <div>
    <el-row type="flex" justify="end">

      <el-col :span="4">
        <el-select v-model="currentYear" @change="updateCalendar">
          <el-option
            v-for="item in yearsArr"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>

      <el-col :span="4">
        <el-select v-model="currentMonth" @change="updateCalendar">
          <el-option
            v-for="item in 12"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
    </el-row>

    <el-calendar v-model="currentCalendar">
      <!-- 具名插槽: 名字dateCell  -->
      <!-- 作用域插槽: slot-scope="{date, data} 其中date: 单元格代表的日期-->
      <!-- data可以解构成{ type, isSelected, day}，type 表示该日期的所属月份，可选值有 prev-month，current-month，next-month ;
              isSelected 标明该日期是否被选中；day 是格式化的日期，格式为 yyyy-MM-dd -->
      <template
        slot="dateCell"
        slot-scope="{date}"
      >
        <span>{{ date.getDate() }}</span>
        <span v-if="date.getDay()===6 || date.getDay()===0">休</span>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  data() {
    return {
      currentYear: '',
      currentMonth: new Date().getMonth() + 1,
      yearsArr: [],
      currentCalendar: new Date()
    }
  },
  created() {
    this.initYearArr()
  },
  methods: {
    initYearArr() { // 处理年份数组
      const date = new Date()
      this.currentYear = date.getFullYear() // 得到当前年份
      // Array(11).fill(this.currentYear): Array(数组长度).fill(填充的内容)
      this.yearsArr = Array(11).fill(this.currentYear).map((item, index) => {
        return item - 5 + index
      })
    },
    updateCalendar() {
      this.currentCalendar = this.currentYear + '-' + this.currentMonth
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-calendar { // 去掉边框
  .el-calendar__header{
    display:none;
  }
.el-calendar-table td,.el-calendar-table tr:first-child td{
  border:none;
  }
}

</style>
