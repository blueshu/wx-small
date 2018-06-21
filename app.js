//app.js
const https = require("/utils/http.js");
App({
    isLoad: false,
    callLogin: function () {
        var that = this;
        if(that.index === 3) {
            var isOpenId = false,
                isGolabl = false;
            const code = wx.getStorageSync('code');
            const userId = wx.getStorageSync('config').user_id,
                userInfo = wx.getStorageSync('userInfo'),
                avatarUrl = userInfo.avatarUrl,
                nickName = userInfo.nickName,
                callBack = function () {
                    if(that.callb && isGolabl && isOpenId){
                        that.isLoad = true;
                        that.callb();
                    }
                };
            https.https('/api/app/setings/enums/globalsettings/',{user_id:userId},function (res) {
                if(res && res[0] && res[0].value_data) {
                    var data = JSON.parse(res[0].value_data);
                    wx.setStorageSync('global', data);
                }
                isGolabl = true;
                callBack();
            });
            https.https('/api/wechat/user/',{user_id:userId,js_code:code,nickname:nickName,headimgurl:avatarUrl},function (res) {
                var s = wx.getStorageSync('userInfo');
                s.openid = res.openid;
                s.uId = res.id;
                wx.setStorageSync('userInfo', s);
                isOpenId = true;
                callBack();
            },'POST','application/x-www-form-urlencoded')
        }
    },
    index: 0,
    onLaunch: function () {
    // 登录
        wx.removeStorageSync('userType');
      const that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.setStorageSync('code',res.code);
            that.index++;
            that.callLogin();
      }
    })
      //获取三方平台的数据
          wx.getExtConfig({
              success: res => {
                  wx.setStorageSync('config',res.extConfig);
                  that.index++;
                  that.callLogin();
              }
        })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              wx.setStorageSync('userInfo',res.userInfo);
                that.index++;
                that.callLogin();
            }
          })
        }
        else {
              wx.authorize({
                  scope: 'scope.userInfo',
                  success() {
                      wx.getUserInfo({
                          success: res => {
                              wx.setStorageSync('userInfo',res.userInfo);
                      that.index++;
                                that.callLogin();
                          }
                      })
                  }
              })
        }
      }
    })
  },
    copyright: null,
    hasFetchCopyright: false,
    getCopyRight: function (callback) {
        var that = this;
        var userId = wx.getStorageSync('config').user_id;
        https.https('/api/app/minapp/copyright/detail/',{user_id:userId},function (res) {
            that.hasFetchCopyright = true;
            if(res && res.copyright) {
                that.copyright = res.copyright;
                if(callback) {
                    callback();
                }
            }
        });
    }
})