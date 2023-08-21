//如果没有返回 stream, promise, event emitters, child processes, observables 需要手动调用 cb 标识任务完成
const path = require('path');
const { src, dest, task, series, parallel, watch } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const postCSS = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gulpSass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const sourceMaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const named = require('vinyl-named');
const webpack = require('webpack-stream');
// const fileInclude = require('gulp-file-include'); // html文件导入
const includer = require('gulp-htmlincluder'); // html文件导入
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const del = require('del'); // delete files and folders
const plumber = require('gulp-plumber');
const utils = require('./utils');

const { htmlImportFileVersion } = require('./randomVersion'); // 修改 html中 引入文件的版本号
const buildConf = require('../build.config');

const NODE_ENV = process.env.NODE_ENV || 'production';

let config = utils.resolvePath(buildConf.gulpConf);
let serverConf = Object.assign({}, { port: 8080, host: 'localhost', openBrowser: true, baseDir: '.', index: 'index.html', }, buildConf.serverConf);

try {
  process.chdir(path.resolve(process.cwd(), '../'));
} catch (err) {
  console.error(`process.chdir: ${err}`);
}

// 处理 css
function css(cb) {
  let cssStream = src(config.css.src)
    .pipe(plumber())
    .pipe(sourceMaps.init({ loadMaps: false }))
    .pipe(gulpSass())
    .pipe(postCSS([autoprefixer({ cascade: true, grid: 'autoplace' })]))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }));
  cssStream = config.css.isConcat ? cssStream.pipe(concat('index.min.css')) : cssStream;
  cssStream = cssStream.pipe(sourceMaps.write('./')).pipe(dest(config.css.dest));
  cssStream = NODE_ENV === 'development' ? cssStream.pipe(browserSync.stream()) : cssStream;
  cb();
}

// 处理图片
function image(cb) {
  let imgStream = src(config.image.src).pipe(plumber()).pipe(dest(config.image.dest));
  imgStream = NODE_ENV === 'development' ? imgStream.pipe(browserSync.stream()) : imgStream;
  cb();
}

// 处理js
function js(cb) {
  let webpackConf = require('./webpack.config');
  webpackConf = Object.assign({}, { mode: NODE_ENV }, webpackConf, buildConf.webpackConf);
  let jsStream = src(config.js.src)
    .pipe(plumber())
    // .pipe(babel()) // babel 编译 ES6
    // .pipe(uglify()) // 压缩 js
    .pipe(named()) // 配合 webpack 禁用 chunkHash 命名文件
    .pipe(webpack(webpackConf))
    .pipe(sourceMaps.init())
    .pipe(rename({ suffix: '.min' }));
  jsStream = config.js.isConcat ? jsStream.pipe(concat('bundle.min.js')) : jsStream; // 是否合并文件
  jsStream = jsStream.pipe(sourceMaps.write('./')).pipe(dest(config.js.dest));
  jsStream = NODE_ENV === 'development' ? jsStream.pipe(browserSync.stream()) : jsStream;
  cb();
}

// 处理 html
function html(cb) {
  let dataBuf = [];
  let options = require('./htmlincluder.config'); // gulp-htmlincluder
  options = Object.assign({}, options, buildConf.htmlIncluderConf);
  let htmlStream = src(config.html.src).pipe(plumber()).pipe(includer(options));
  htmlStream = NODE_ENV === 'development' ? htmlStream : htmlStream.pipe(htmlImportFileVersion());
  htmlStream.pipe(dest(config.html.dest));
  htmlStream = NODE_ENV === 'development' ? htmlStream.pipe(browserSync.stream()) : htmlStream;
  cb();
}

// 处理依赖库资源
function libs(cb) {
  let libsStream = src(config.libs.src).pipe(plumber()).pipe(dest(config.libs.dest));
  libsStream = NODE_ENV === 'development' ? libsStream.pipe(browserSync.stream()) : libsStream;
  cb();
}

// 清除文件和目录
async function clean(cb) {
  await del([config.css.dest, config.image.dest, config.js.dest, config.html.dest, config.libs.dest]);
  cb();
}

// 启动服务, 监听文件变化
function server(cb) {
  // let startPath = path.join(html.dest, serverConf.index);
  // options.startPath = os.type().toLowerCase().includes('windows') && startPath.replace(/\\/gi, '/');
  let options = {
    watch: true,
    open: serverConf.openBrowser,
    server: {
      baseDir: serverConf.baseDir,
      index: serverConf.index,
    },
    port: serverConf.port,
    host: serverConf.host,
    startPath: path.join(config.html.dest, serverConf.index).replace(/\\/gi, '/'),
  };

  browserSync.init(options);
  watch(config.html.src).on('change', series(html, browserSync.reload));
  watch(config.css.src, parallel(css));
  watch(config.js.src, parallel(js));
  watch(config.image.src, parallel(image));
  watch(config.libs.src, parallel(libs));
  cb();
}

exports.dev = parallel(server, css, js, image, libs, html);
exports.build = series(clean, parallel(css, js, image, libs, html));
