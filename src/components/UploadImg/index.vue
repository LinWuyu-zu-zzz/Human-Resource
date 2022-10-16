<template>
  <div>
    <!-- 上传图片 -->
    <el-upload
      v-loading="loading"
      class="uploadImg"
      action="#"
      list-type="picture-card"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-change="onChange"
      :http-request="onHttpRequest"
      :before-upload="beforeUpload"
    >
      <!-- list-type: 展示出来的类型 图片卡片 -->
      <!-- on-change: 两次: 本地选择图片时, 远程上传图片时 -->
      <!-- 注: http-request属性: 覆盖默认的上传行为，可以自定义上传的实现 -->
      <!-- 注: before-upload属性:上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。 -->
      <i class="el-icon-plus" />
    </el-upload>

    <!-- 预览-弹窗 -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <img style="width: 100%" :src="previewUrl">
    </el-dialog>
  </div>
</template>

<script>
// SDK : 软件工具开发包,提供很多方法
import COS from 'cos-js-sdk-v5'
const cos = new COS({ // id和key一般运维配置,也不写在这里,发axios请求获取
  SecretId: 'AKIDlR0Qix0sZ4NSL3YrgUD0AJJ4c3LhrshL',
  SecretKey: 'VrfKqSdw77xe9YxP2ZtIzayKi4zqY7Zr'
})

export default {
  name: 'UploadImg',
  props: { // 接收父组件user-info组件传过来的默认图片地址
    defaultUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [ // 上传列表
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      dialogVisible: false,
      previewUrl: '',
      loading: false
    }
  },
  watch: { // 监视父组件传过来的数据,传过来了就push,不能写在craeted中
    defaultUrl() {
      this.fileList.push({
        name: 'default', url: this.defaultUrl
      })
    }
  },
  methods: {
    onPreview(file) {
      this.previewUrl = file.url // 弹窗出现前,把图片先显示出来
      this.dialogVisible = true
    },
    onRemove(file, fileList) {
      // console.log('删除图片')
      this.fileList = fileList // 为了让Vue视图更新
    },
    // onChange触发两次
    // 1.本地选择上传 原来有一个数据 + 选择的数据
    // 2.远程请求上传,成功/失败都会调用 原来有一个数据
    onChange(file, fileList) { // 这个fileList指最新的data里的fileList数据
      // this.fileList.push(file) // 一次性上传两张图片,控制台有两个对象但点进去只剩一个,已删除
      this.fileList = fileList // 为了让Vue视图更新
    },
    beforeUpload(file) { // 上传图片格式和大小(看文档,参数为file)
      const types = ['image/jpeg', 'image/gif', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、PNG 格式!')
        return false // 停止上传
      }

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片过大, 不能超过1M')
        return false
      }
    },
    onHttpRequest({ file }) { // 远程上传到腾讯云
      this.loading = true
      cos.putObject({
        Bucket: 'linwuyu-77-1314348577', // 存储桶名称
        Region: 'ap-shanghai', // 存储桶所在地域
        Key: file.name, // 上传文件的名称
        Body: file, // 上传文件对象
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => { // 注意改为箭头函数,不然this指向cos实例
        // error: 请求发生错误时返回的对象，包括网络错误和业务错误。如果请求成功则为空
        // data: 	请求成功时返回的对象，如果请求发生错误，则为空
        // console.log(data)
        if (err) return this.$message.error('上传图片失败')
        this.loading = false

        // 上传成功后的逻辑在各自引用时写,不写在这里,把上传成功的信息传给父组件
        // 注意:data里面的Location是图片的地址,要加上 https:// (放在地址栏可自动补全)
        this.$emit('on-success', { imgUrl: 'https://' + data.Location })
      })
    }
  }

}
</script>

<style scoped lang="scss">
.uploadImg{ // 优化,只能上传一张图片
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
