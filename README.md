## gulp 小型项目构建工具

```bash
  npm start # 启动开发环境
  npm run dev # 启动开发环境
  npm run build # 启动生产环境构建
```

一个用于快速构建小型项目开发生产环境的工具，主要功能包括 sass 编译，ES6 编译及垫片功能（兼容到 IE9），html 页面组件写法，浏览器刷新, 可以自定义源文件目录和编译输出目标目录，编译压缩后的 css 和 js 以\*.min.\* 结尾, 同时自动生成相应的 .map 文件便于调试

### 开发注意事项

- 如需要覆盖 gulp 资源路径, webpack, server, gulp-htmlincluder 配置, 可在 build.config.js 中指定对象中配置, gulp 任务启动时会自动读取此配置项覆盖默认配置

- ~~ES6 以上 API 兼容 IE 9 用法: 需要手动在模块内导入以下包 [babel 7.4.0 版本 @babel/polyfill 包被废弃](https://babeljs.io/docs/en/babel-polyfill) | [Babel 新的提案](https://babeljs.io/docs/en/plugins-list#es2021)~~

  - ~~import "core-js/stable";~~
  - ~~import "regenerator-runtime/runtime";~~

- 依赖库

  - 工具中默认在 -footer.html 中已引入 jquery-1.11.3.min.js 和 template-web.js, 可直接使用

  - 如果需要将依赖库放置在项目内部使用, 可将资源文件放置在 src/libs 目录下, 工具会自动打包到 dist/libs 下, 需要手动在页面 -footer.html 中引入

  - 使用 npm 安装依赖库, 如果想使用 import 导入依赖库但不想被打包进 dist/js/chunk-vendor.min.js 中, 可在 build/webpack.config.js 中 externals 配置忽略项

core-js @babel/runtime @babel/runtime-corejs3 @babel/plugin-transform-runtime @babel/plugin-external-helpers

### 开发流程

1. 执行 npm install 安装项目运行依赖
2. 执行 npm start 或者 npm run dev 命令启动开发环境
3. gulp 读取 build.config.js 中的配置项, 通过 gulpConf 配置项 htmlSrc 和 htmlDest 配置解析出来静态资源的相对路径,详情见下方配置项注释

   - serverConf 为重置本地开发环境服务器配置项
   - webpackConf 为重置 webpack 配置项,
   - htmlIncluderConf 为重置 gulp-htmlincluder 插件配置

   ```html
   // 非合并文件编译压缩后, 如果增加额外资源需要手动在 -link.html 和
   -footer.html中手动引入
   <link href="dist/css/*.min.css" />
   <script src="dist/js/*.min.js"></script>
   ```

   - css 合并后生成 index.min.css
   - js 合并后生成 bundle.min.js

   ```html
   // 合并后文件需要手动在 -link.html 和 -footer.html 中引入
   <link href="dist/css/index.min.css" />
   <script src="dist/js/bundle.min.js"></script>
   ```

4. 开发环境下, gulp 监听 css, images, js, pages, libs 目录中文件的变化, 自动执行相应的编译压缩任务, 同时会通知浏览器刷新页面, gulp 不会主动删除所有配置项 dest 目标目录
5. gulp 集成 webpack 工具,将模块中使用的第三方库抽离生成公共文件 chunk-vendor.min.js, 此文件存放在 js 配置项的 dest 目标目录下

   ```html
   // import 导入第三方依赖库打包编译后文件, 已在 -footer.html 中引入
   <script src="dist/js/chunk-vendor.min.js"></script>
   ```

6. 工具中默认在 -footer.html 中已引入 jquery-1.11.3.min.js 和 template-web.js, 可直接使用

7. gulp-htmlincluder 默认配置在 build/htmlincluder.config.js 文件中, 此配置文件主要用于覆盖 [gulp-htmlincluder](https://github.com/internetErik/gulp-htmlincluder) 的配置项, 一般不需要修改, 详见下方配置项，使用语法详见 docs/htmlincluder/dist/pages/index.html, 主要提供的功能如下:

   - 导入文件

   - 当前文件中的内容插入到目标文件指定位置（类似于插槽）

   - 文件内使用数据

   - 使用判断

   - 使用循环

     - 遍历数组

     - 遍历对象

   - 忽略内容

     - 忽略之外的内容

     - 忽略之内的内容

8. 生产环境下, gulp 首先执行清除任务, 将所有配置项的 dest 目标目录清除后再执行编译构建任务, 默认不会启动文件监听任务

### 待办

- 依赖库 CDN 链接自动导入

### 配置文件说明

#### build.config.js

```javascript
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
   * 编译后路径
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
```

### 目录

- src 源目录
  - images 图片目录
  - css sass 文件目录
  - js js 目录
  - libs 依赖库目录
  - pages 页面目录
- dist 生产环境目录
- docs 文档目录
- build gulp 任务运行配置文件目录
  - webpack.config.js webpack 配置文件
  - htmlincluder.config.js 页面模板配置文件
- .babelrc babel 配置文件
- .browserslistrc 浏览器版本配置文件
- build.config.js 覆盖 build 目录下的配置文件中的配置项
