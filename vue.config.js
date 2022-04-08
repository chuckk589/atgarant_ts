module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
      symlinks: false
    }
  },
  transpileDependencies: [
    '@coreui/utils',
    '@coreui/vue-pro',
  ],
  // use this option for production linking
  // publicPath: process.env.NODE_ENV === 'production' ? '/vue/demo/3.1.0' : '/'
  devServer: {
    proxy: {
      '^/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '^/files': {
        target: 'http://localhost:3000'
      }
    }
  },
  outputDir: "./dist",
  publicPath: '/dist'
}