const path = require('path');

function joinPath(...args) {
  let flag = args.every((item) => typeof item === 'string');
  if (!flag) throw new TypeError('rest param is must be string...');
  return path.join(...args).replace(/\\/gi, '/');
}

function isString(arg) {
  return typeof arg === 'string';
}

// 打包资源文规则
exports.resolvePath = function (config) {
  let conf = {};
  let cssConcat = config.hasOwnProperty('cssConcat') ? config.cssConcat : false;
  let jsConcat = config.hasOwnProperty('jsConcat') ? config.jsConcat : false;
  let isValidHtmlSrc = config.hasOwnProperty('htmlSrc') && isString(config.htmlSrc) && config.htmlSrc.trim() !== '';
  let isValidHtmlDest = config.hasOwnProperty('htmlDest') && isString(config.htmlDest) && config.htmlDest.trim() !== '';

  let baseSrc = isValidHtmlSrc
    ? path.dirname(config.htmlSrc) !== '.'
      ? path.dirname(config.htmlSrc)
      : config.htmlSrc
    : 'src';

  let baseDest = isValidHtmlDest ? config.htmlDest : 'dist';

  // let baseDest = isValidHtmlDest
  //   ? path.dirname(config.htmlDest) !== '.'
  //     ? path.dirname(config.htmlDest)
  //     : config.htmlDest
  //   : 'dist';

  conf.css = {
    src: [`${joinPath(baseSrc, 'css', '**/*')}`, `!${joinPath(baseSrc, 'css', '**/*{.map,.min}*')}`],
    dest: `${joinPath(baseDest, 'css')}`,
    isConcat: cssConcat,
  };
  conf.js = {
    src: [`${joinPath(baseSrc, 'js', '**/*.js')}`, `!${joinPath(baseSrc, 'js', '**/*{.map,.min}*')}`],
    dest: `${joinPath(baseDest, 'js')}`,
    isConcat: jsConcat,
  };
  conf.image = {
    src: [`${joinPath(baseSrc, 'images', '**/*')}`],
    dest: `${joinPath(baseDest, 'images')}`,
  };
  conf.libs = {
    src: [`${joinPath(baseSrc, 'libs', '**/*')}`],
    dest: `${joinPath(baseDest, 'libs')}`,
  };
  conf.html = {
    src: [`${joinPath(isValidHtmlSrc ? config.htmlSrc : `${baseSrc}/pages`, '**/*.htm{l,}')}`],
    dest: `${joinPath(isValidHtmlDest ? config.htmlDest : `${baseDest}/`)}`,
  };
  return conf;
}