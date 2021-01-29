// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const env = process.env

module.exports = {
  publicPath: env.NODE_ENV === 'production' ? './' : '/',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.resolve('./src'))
      .set('@comp', path.resolve('./src/components'))
      .set('@scss', path.resolve('./src/assets/scss'))
      .set('@img', path.resolve('./src/assets/images'))

    // sass 文件全局提升
    config.module
      .rule('sass-resources')
      .test(/\.(scss|sass)$/)
      .use('sass-resources-loader')
      .loader('sass-resources-loader')
      .options({
        resources: [
          path.resolve(__dirname, 'src/assets/scss/variables.scss'),
          path.resolve(__dirname, 'src/assets/scss/mixins.scss')
        ]
      })
      .end()

    if (env.NODE_ENV === 'production') {
      // 显示包文件分析
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
    }
  }
}
