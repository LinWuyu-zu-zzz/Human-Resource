<template>
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button :loading="loading" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>

    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>

<script>
// 此文件已全局注册,后面直接用,不用注册
// UploadExcel 思路整理
// 1.核心： 利用文件上传控件（input type="file"）上传文件的能力
// 2.布局的时候 隐藏 input
// 3.点击上传 实际 点击的是 input
// 4.利用input 的change事件 拿到上传的文件，然后再进行上传 或者是 读取数据的操作
// 5.出于 上传文件之前 可能需要对文件校验的场景  提供 beforeUpload 字段，可以让使用者自由定义校验规则。

// 6.利用 XLSX 插件读取 xlsx 文件里的数据， 拿到数据， 对数据进行整合  通过回调函数抛出去
// 7.把整合的数据抛出去
// 8.这个组件给父组件 提供了两个参数 beforeUpload 上传前的校验 onSuccess 上传成功 拿到数据之后 可以通过这个回调把数据给父组件
import * as XLSX from 'xlsx'

export default {
  name: 'UploadExcel',
  props: { // 父组件传进来的,可以传进来就可以用
    beforeUpload: Function, // eslint-disable-line
    // beforeUpload: 可以自定义文件校验规则

    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      // 数据整合，整合成功之后 通过毁掉函数 onSuccess 传递出去
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },

    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },

    handleUpload() {
      // 实际上点击的 input, 模拟点击
      this.$refs['excel-upload-input'].click()
    },

    handleClick(e) {
      const files = e.target.files
      // files 一个文件夹中所有 File 对象的集合。
      // File 对象  提供对文件所有属性的访问
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },

    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      // beforeUpload 上传之前的检测函数
      // 如果父组件没有传进来了beforeUpload检测函数, 不存在
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      // 父组件传进来了beforeUpload检测函数, 存在
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },

    readerData(rawFile) { // 传文件对象,读取文件的内容
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        // reader 可以读取文件的内容
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' }) // XLSX插件有员工read方法
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          // header ['手机号', '姓名', '入职日期', '转正日期', '工号']
          // excel 表头
          const results = XLSX.utils.sheet_to_json(worksheet)
          // [{入职日期: 43678, 姓名: "高大山", 工号: 20089, 手机号: 13041131879, 转正日期: 43678}]
          // excel 数据
          this.generateData({ header, results }) // 数据整合

          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },

    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
   margin-top: 100px;
   .excel-upload-input{
       display: none;
        z-index: -9999;
     }
   .btn-upload , .drop{
      border: 1px dashed #bbb;
      width: 350px;
      height: 160px;
      text-align: center;
      line-height: 160px;
   }
   .drop{
       line-height: 80px;
       color: #bbb;
      i {
        font-size: 60px;
        display: block;
      }
   }
}
</style>
