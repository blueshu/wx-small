//获取应用实例
const https = require("../../utils/http.js")
const WxParse = require('../../wxParse/wxParse.js')
const app = getApp()
Page({
    onShareAppMessage: function (res) {
        var url = util.getCurrentPageUrlWithArgs();
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title: '小程序号',
            path: url,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
  data: {
      avatarUrl: '../../assets/header-icon.png',
      selectFlag: 'like',  //true => like; false => commit
      name: 'sds',
      num: '',
      des: 'dasdasdsada<br/>sdasdasd'
  },
    getWxMsg: function () {
        var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        https.https('/api/app/setings/enums/wechatfeed',{user_id:userId},function (res) {
            var data = JSON.parse(res[0].value_data);
            that.setData({'avatarUrl': config.host+''+data.imgHeader,'name': data.gzName,'num':data.gzNick});
            WxParse.wxParse('desc', 'html', data.gzDes, that, 0);
        })
    },
    doCopy: function (e) {
       console.log(e.currentTarget.dataset.num);
        wx.setClipboardData({
            data: e.currentTarget.dataset.num,
            success: function(res) {
                wx.showToast({
                    title: '复制成功',
                    icon: 'success'
                })
            }
        })
    },
  onLoad: function () {
      this.getWxMsg();
  }
})
