// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const env = process.env

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: env.NODE_ENV === 'production' ? './' : '/',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('@comp', resolve('./src/components'))
      .set('@scss', resolve('./src/assets/scss'))
      .set('@img', resolve('./src/assets/images'))

    // sass 文件全局提升
    config.module
      .rule('sass-resources')
      .test(/\.(scss|sass)$/)
      .use('sass-resources-loader')
      .loader('sass-resources-loader')
      .options({
        resources: [
          resolve('src/assets/scss/variables.scss'),
          resolve('src/assets/scss/mixins.scss')
        ]
      })
      .end()

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

    if (env.NODE_ENV === 'production') {
      // 显示包文件分析
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
    }
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    before: require('./mock/mock-server.js')
  }
}
