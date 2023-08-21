module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
        /* @babel/plugin-transform-runtime 无法对某些实例方法(includes, assign...)进行垫片处理, 需要手动引入 polyfill
        require.ensure 以及 AMD 采用异步式调用,在 IE 浏览器中报错  Promise not defined,
        webpack生成的 new Promise 相关代码, 超出了 babel-runtime 的控制范围，只有 polyfill 全局的 Promise 才能解决此问题
        */
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // async, initial 表示哪些 chunk 进行优化
      name: 'chunk-vendor',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/, //打包第三方库
          priority: 10, // 优先级
        },
      },
    },
  },
  externals: {
    // jquery: 'jQuery',
  },
};
