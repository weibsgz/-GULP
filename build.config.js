// gulp 资源路径配置
exports.gulpConf = {
  // cssConcat: false, // 是否合并 css 为一个文件, 默认 false
  // jsConcat: false, // 是否合并 js 为一个文件, 默认 false
  /**
   * 静态资源根据此路径解析出静态资源的相对路径
   * 源码路径
   * eg: htmlSrc: '',  页面路径: src/, 静态资源: src/css, src/images, src/js, src/libs
   * eg: htmlSrc: 'source',  页面路径: source/, 静态资源: source/css, source/images, source/js, source/libs
   * eg: htmlSrc: 'source/pages', 页面路径: source/pages/, 静态资源: source/css, source/images, source/js, source/libs
   * eg: htmlSrc: 'source/other/foo', 页面路径: source/other/foo/, 静态资源: source/other/css, source/other/images, source/other/js, source/other/libs
   * 打包编译后路径
   * eg: htmlDest: '',  输出目录：页面路径: dist/index.html, 静态资源: dist/css, dist/images, dist/js, dist/libs
   * eg: htmlDest: 'bundle', 输出目录：页面路径: bundle/index.html, 静态资源: bundle/css, bundle/images, bundle/js, bundle/libs
   * eg: htmlDest: 'bundle/pages', 输出目录：页面路径: bundle/pages/index.html, 静态资源: bundle/css, bundle/images, bundle/js, bundle/libs
   * eg: htmlDest: 'bundle/other/foo', 输出目录：页面路径: bundle/other/foo/index.html, 静态资源: bundle/other/css, bundle/other/images, bundle/other/js, bundle/other/libs
   */
  htmlSrc: 'src/pages', // 页面资源源路径, 其他静态资源将此路径解析出根路径
  htmlDest: '', // 页面资源目标路径，其他静态资源根据此路径解析出目标根路径
};
// 开发环境配置
exports.serverConf = {
  // port: 8080,
  // host: 'localhost',
  // openBrowser: true,
  // baseDir: '.',
  index: 'index.html',
};
// webpack 配置
exports.webpackConf = {};
// gulp-htmlincluder 配置
exports.htmlIncluderConf = {};
