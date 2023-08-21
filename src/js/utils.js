// ajax
// const BASE_URL = 'http://zt.xcar.com.cn/api/data/spring-car'

const BASE_URL = 'http://zt.xcar.com.cn/api/data/spring-car'

export function ajaxCommon(params = {}) {
  return new Promise((resolve, reject) => {
    const obj = Object.assign(
      { type: 'GET', url: BASE_URL, dataType: 'json' },
      params
    )
    $.ajax(obj)
      .done(function (res) {
        if (res.code == 0) {
          resolve(res)
        }
      })
      .fail(function (err) {
        reject(err)
      })
  })
}
