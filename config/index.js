// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
// 开发环境时的代理接口路径
var proxyTable = {
  '/wl':{
      // target:'http://localhost:4203',
      // target:'http://101.200.223.46:5568',
      // target:'http://lqbx.lqfast.com:6846',
      target:'https://lqbx.lqfast.com',
      changeOrigin:true,
      pathRewrite:{
          '^/wl':''
      }
  }
}
module.exports = {
  build: {
     env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    //这里改为 ./
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port:8081,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable:proxyTable,
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },
  devServer: {
    historyApiFallbak: true,
    hot: true,
    host: "192.168.1.194",   //填写你自己的IP地址
    port: 8081,   //填写刚刚在dev字段中找到的port端口号
    inline: true,
    progress: true
  }
}
