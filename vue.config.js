module.exports = {
  publicPath: './',
  // outputDir: '../chart',
  productionSourceMap: false,
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'https://tl.tdex.com',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
