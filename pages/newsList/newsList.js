const https = require("../../utils/http.js");
const app = getApp()
Page({
    onShareAppMessage: function (res) {
        var url = util.getCurrentPageUrlWithArgs();
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title: '新闻列表',
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
      keyWords: '',
      news: []
  },
  //事件处理函数
  onLoad: function (options) {

      this.setData({'keyWords':options.key});
      this.getCategoryNews();
  },
    getCategoryNews: function () {
        var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        https.https('/api/app/xneirong/content/list/',{user_id:userId,title__icontains: that.data.keyWords},function (res) {
            that.setData({'news':res.object_list,host:config.host});
        })
    }
})
