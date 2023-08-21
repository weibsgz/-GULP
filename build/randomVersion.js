const { Transform } = require('stream');

/**
 * @member dateFormat 日期时间格式化
 * @param {Number|String|Object} paramDate 日期时间
 * @param {Object} param1 格式化参数配置
 * @param {Number} param1.type 格式化类型, 0 默认全部, 1 只日期部分, 2 只时间部分
 * @param {Boolean} param1.isShowSeparator 是否保留分隔符, 默认 true
 * @param {String} param1.dateSeparator 日期部分分隔符, 默认 -
 * @param {String} param1.timeSeparator 时间部分分隔符, 默认 :
 * @returns
 */
function dateFormat(paramDate, { type = 0, isShowSeparator = true, dateSeparator = '-', timeSeparator = ':' } = {}) {
  let _date = null;
  if (Object.prototype.toString.call(paramDate) == '[object Date]') {
    _date = paramDate;
  } else if (/^\d{1,}$/.test(paramDate)) {
    _date = new Date(paramDate);
  } else {
    _date = new Date();
  }
  const year = _date.getFullYear();
  const month = _date.getMonth() + 1;
  const date = _date.getDate();

  const hour = _date.getHours();
  const min = _date.getMinutes();
  const second = _date.getSeconds();

  function gtNine(val) {
    return val > 9 ? val : `0${val}`;
  }
  let result = `${year}${dateSeparator}${gtNine(month)}${dateSeparator}${gtNine(date)} ${gtNine(hour)}${timeSeparator}${gtNine(
    min
  )}${timeSeparator}${gtNine(second)}`;

  const dateRegExp = new RegExp(dateSeparator, 'gmi');
  const timeRegExp = new RegExp(timeSeparator, 'gmi');

  let [dateRes, timeRes] = result.split(' ');

  switch (type) {
    case 1:
      return isShowSeparator ? dateRes : dateRes.replace(dateRegExp, '');
    case 2:
      return isShowSeparator ? timeRes : timeRes.replace(timeRegExp, '');
    default:
      return isShowSeparator ? result : `${dateRes.replace(dateRegExp, '')}${timeRes.replace(timeRegExp, '')}`;
  }
}

// 修改 html 中引入文件的版本号
exports.htmlImportFileVersion = function () {
  let date = Date.now();
  // 正则表达式拆分成下面 (<(?:\blink\b|\bscript\b|img).*?(?:\bsrc\b|\bhref\b)=.*?\.(?:css|js|png|jpg|jpeg|bmp|gif|webp))(\?[^<>"']*)?(.*?\/?>)
  let tagsReg = '\\blink\\b|\\bscript\\b|img';
  let attrsReg = '\\bsrc\\b|\\bhref\\b';
  let extsReg = 'css|js|png|jpg|jpeg|bmp|gif|webp';
  let reg = new RegExp('(<(?:' + tagsReg + ').*?(?:' + attrsReg + ')=.*?\\.(?:' + extsReg + '))(\\?[^<>\\"\\\']*)?(.*?\\/?>)', 'gmi');

  return new Transform({
    objectMode: true,
    transform: function (chunk, enc, cb) {
      if (chunk.isNull()) {
        return cb(null, chunk);
      }

      if (chunk.isBuffer()) {
        let result = chunk.contents.toString();
        console.log(dateFormat(date));
        result = result.replace(reg, function ($f, $1, $2, $3) {
          // console.log($f, $1, $2, $3);
          // 没有匹配到 ? 参数
          if (!$2) {
            return `${$1}?v=${dateFormat(date, { isShowSeparator: false })}${$3}`;
          }
          // ? 参数中包含 v 参数
          var result = $2.match(/((v=)([^&]*))/gim);
          if (Array.isArray(result)) {
            $2 = $2.replace(/((v=)([^&]*))/gim, `$2${dateFormat(date, { isShowSeparator: false })}`); // 替换 v 参数
            return `${$1}${$2}${$3}`;
          }
          // 有 ? 但没有 v 参数, 可能有其他参数
          var arr = $2.split('?');
          return `${$1}${arr[0]}?v=${dateFormat(date, { isShowSeparator: false })}${arr[1] != '' ? `&${arr[1]}` : ''}${$3}`;
        });

        chunk.contents = Buffer.from(result);
      }
      if (chunk.isStream()) {
        return cb();
      }

      cb(null, chunk);
    },
  });
};
