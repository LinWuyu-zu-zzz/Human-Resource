'use strict'
// vue-cli的配置文件写在这里,即vue.config.js
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CompressionPlugin = require('compression-webpack-plugin') // cv gzip压缩用

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port
// console.log(process.env)

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: true,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 跨域, 请求代理
    proxy: {
      // 当我们的本地的请求 有/api的时候，就会代理我们的请求地址向另外一个服务器发出请求
      // 这里的api 表示如果我们的请求地址有/api的时候,就出触发代理机制
      '/api': {
        // target: 'http://ihrm-java.itheima.net/', // 跨域请求的地址,我们要代理的地址
        target: 'http://ihrm.itheima.net/', // 换了一下,上面那个崩了
        changeOrigin: true // 只有这个值为true的情况下 才表示开启跨域
        // pathRewrite: { '^/api': '' }
        // 重定向:如果接口的url没有固定统一的前缀,就需要重定向,定向为空,以防自己加上多余的/api前缀
      }
    }
    // before: require('./mock/mock-server.js') // 模拟代码,暂时不用
  },

  // 对webpack进行自定义配置, 以对象的方式进行配置
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name, // html页面的title标题
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 排除 elementUI xlsx  和 vue
    // 判断:是生产模式才忽略包,开发模式不忽略
    externals: process.env.NODE_ENV === 'production'
      ? { // key 指要忽略的包名 只能是js文件,css不行
        'echarts': 'echarts',
        'element-ui': 'ELEMENT',
        'vue': 'Vue',
        'xlsx': 'XLSX',
        'cos-js-sdk-v5': 'COS'
      } : {}

  },

  // 对webpack进行自定义配置, 以链式调用的方式进行配置
  chainWebpack(config) {
    // const imagesRule = config.module.rule('images')
    // imagesRule
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({
    //     bypassOnDebug: true
    //   })
    //   .end()

    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 复制粘贴,gzip压缩用的
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin').use(
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.(js|css)(\?.*)?$/i, // 用['js', 'css']有个缺点就是map文件也会压缩,这时候压缩就没多大意义,用正则会更好一点
          threshold: 10240, // 单位bytes, 大于10k才会考虑压缩
          minRatio: 0.8 // 默认压缩率, 压缩结果能低于百分之八十才会进行压缩
          // deleteOriginalAssets: true //是否删除源文件(不推荐删除, 容易出现chunk报错问题)
        })
      )
    }

    // 预加载一些页面,不影响首屏加载速度,移动端建议关闭delete
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => { // runtime配合最后一行一起,为了把生成的runtime代码生成到行内
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: { // 方案一
                  name: 'chunk-libs', // 如果有重复的代码,提取的名字
                  test: /[\\/]node_modules[\\/]/, // 匹配node_modules
                  priority: 10,
                  chunks: 'initial' // 自己有一个私有化的提取方式initcial,提取两次都放在name文件内
                },
                elementUI: { // 方案二
                  name: 'chunk-elementUI', // 如果有重复的代码,提取的名字
                  priority: 20, // 只匹配element-ui,即两个方案有冲突选择这个方案
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 匹配node_modules里面的element-ui
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  最小提取次数
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // 运行时代码: 即异步加载的文件, 可以让主模块app不变不加载,但是会生产一个js,多发一次请求
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
