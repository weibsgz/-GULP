import { ajaxCommon } from './utils.js';

ajaxCommon()
  .then(function (res) {
    const { code, data } = res;
    if (code != 0) {
      return false;
    }
   
  })
  .catch(function (err) {
    console.log(err);
  });

  $(function () {
    var title = "竞猜世界波，赢大疆无人机"; // 分享标题
    var desc = "足球先生 FUN肆热爱，专题互动开燥 积分贯穿蓄能 为球队加油"; // 分享描述
    var url = "//zt.xcar.com.cn/x/m/202210/worldcupm/"; // 页面 url
    var imgUrl = "https://img1.xcarimg.com/motonews/25007/25027/34573/20221018163030084062128066700.jpg"; // 分享图
  
    $.ajax({
      type: 'GET',
      url: '//a.xcar.com.cn/jssdk/wxsdk.php?url=' + encodeURIComponent(location.href.split('#')[0]),
      dataType: 'jsonp',
      jsonp: 'callback',
      jsonpCallback: 'flightHandler',
      success: function (json) {
        var c = JSON.parse(json);
        wx.config({
          debug: false,
          appId: c.appId,
          timestamp: c.timestamp,
          nonceStr: c.nonceStr,
          signature: c.signature,
          jsApiList: [
            'onMenuShareTimeline', //分享到朋友圈
            'onMenuShareAppMessage', //分享给朋友
            'hideMenuItems', //批量隐藏微信功能
            'showMenuItems', //批量显示微信功能
          ],
        });
        wx.ready(function () {
          const share_data = {
            title: title, //分享信息的标题
            desc: desc, //分享信息的描述
            link: url, //分享信息的链接
            imgUrl: imgUrl,
          };
          wx.checkJsApi({
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
          });
          wx.onMenuShareTimeline(share_data);
          wx.onMenuShareAppMessage(share_data);
        });
        wx.error(function (res) {
          console.log(res.errMsg);
        });
      },
      error: function () { },
    });
  
    // 登录逻辑
    (function () {
      window.appua = navigator.userAgent;
      window.timestamp = Date.parse(new Date());
      window.json = '';
      window.date = '';
      window.user = '';
      window.helpid = 1;
  
      if (appua.indexOf('appxcar') != -1) {
        //app
        /*修改用户cookie信息*/
        window.changeuser = function (data) {
          if (!data || !data.uid || !data.auth) {
            data = {
              uid: 0,
              uname: '',
              auth: '',
              cookie: '',
            };
            //return false;
          }
          var _cookieoption = {
            expires: 365 * 24 * 60 * 60,
            path: '/',
            domain: '.xcar.com.cn',
          };
          user = {
            uid: +data.uid,
            uname: data.uname,
            auth: data.auth,
          };
  
          window.uid = user.uid;
          window.auth = user.auth;
  
          //  加密
          //  json = ['user_id=' + uid, 'app_id=1', 'timestamp=' + timestamp];
          //  json = json.sort();
          //  json = $.md5(json.join('&') + '8272b17ee5dd781e1c39eea075db9c9e');
          //  json = $.md5('8272b17ee5dd781e1c39eea075db9c9e' + json);
  
          //  初始化
          //  initialization(window.uid);
          //  activityLoginask(window.uid)
  
        };
      } else {
        //  触屏
        // 上线前放开下两行
        // 全局获取uid auth biddersid(场次id)
        window.uid = $.cookie('_discuz_uid');
        window.auth = $.cookie('bbs_auth');
  
        //  上线前注释下两行
        //  window.uid = '17637182';
        //  window.auth = 'Uxi05wMs%2FRcObXFwuZJF4Qs14ySPvEm9NSfcuZTZVyoNi2Kltu4Op4bRKkKhbF9CDDQ';
  
        if (!uid) {
          uid = 0;
        }
        //  加密
        //  json = ['user_id=' + uid, 'app_id=1', 'timestamp=' + timestamp];
        //  json = json.sort();
        //  json = $.md5(json.join('&') + '8272b17ee5dd781e1c39eea075db9c9e');
        //  json = $.md5('8272b17ee5dd781e1c39eea075db9c9e' + json);
  
        //  初始化
        //  fragmentData();
        //  initialization(window.uid);
        //  activityLoginask(window.uid);
      }
  
      xcarjsapi.ready(function () {
        xcarjsapi.requestCookie({}, changeuser);
        xcarjsapi.onLoadSuccess({
          isShareEnable: true,
        });
        xcarjsapi.shareInfo({
          data: {
            title: title,
            message: desc,
            targetUrl: url,
            imageUrl: imgUrl,
          },
        });
      });
      function apiAppevent() {
        /*view事件绑定*/
        xcarjsapi.on("requestShare", function (data) {
          if (data) {
            appToShare(data);
          }
        })
      }
      apiAppevent()
      function appToShare(shareType) {
        var shareObj = {
          content: desc, //分享的内容
          hasContent: true, //目前写死的不知道做什么用的
          imageUrl: imgUrl, //分享图片
          isMiniApp: '',
          linkUrl: link, //分享内容Url
          path: link, //分享路径
          shareType: shareType, //分享类型
          title: title, //分享标题
          userName: title, //分享名称
        };
        //分享数据
        xcarjsapi.requestShare(shareObj);
        setTimeout(function () {
          //分享成功回调逻辑写这里面（为什么写到延时里面 鬼知道）
          shareSuccessCB();
        }, 1000)
      }
      function shareSuccessCB() {
        // 分享成功的回调逻辑
      }
    })();
  });
  