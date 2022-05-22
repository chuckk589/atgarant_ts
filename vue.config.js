module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
      symlinks: false,
    },
  },
  transpileDependencies: ['@coreui/utils', '@coreui/vue-pro'],
  devServer: {
    https: true,
    proxy: {
      '^/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '^/files': {
        target: 'http://localhost:3000',
      },
    },
  },
  outputDir: './dist/public',
  publicPath: process.env.NODE_ENV === 'development' ? './' : './',
};
