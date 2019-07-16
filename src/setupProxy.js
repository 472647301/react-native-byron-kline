const proxy = require('http-proxy-middleware')
module.exports = function(app) {
  app.use(
    proxy('/api', {
      target: 'https://wapi.bituan.cc',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  )
}
