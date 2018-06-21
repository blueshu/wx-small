//获取应用实例
const https = require("../../utils/http.js");
const util = require("../../utils/util.js")
const app = getApp()
Page({
    onPageScroll: function () {
        var that = this;
        if(this.data.copyright) {
            var query = wx.createSelectorQuery()
            var callBack = function () {
                var pageHeight = that.winHeight;
                query.select('.main-area').boundingClientRect(function(rect){
                    var diffTop = rect.height - pageHeight;
                    if(diffTop < 0 ) {diffTop = 0;}
                    if(rect.top <0 && Math.abs(rect.top) > (diffTop+50)) {
                        that.setData({isPullDown: true});
                    }
                    else {
                        that.setData({isPullDown: false});
                    }
                }).exec()
            };
            if(this.winHeight) {
                callBack();
            }
            else {
                wx.getSystemInfo({
                    success: function (res) {
                        that.winHeight = res.windowHeight;
                        callBack();
                    }
                })
            }

        }
    },
    onShareAppMessage: function (res) {
        var that = this;
        var url = util.getCurrentPageUrlWithArgs();
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title: that.title,
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
      copyright: null,
      isPullDown: false,
      colorStr: '#DDD',
      searchList: [],
      selectFlag: 'like',  //true => like; false => commit
      keyValue: ''
  },
  //事件处理函数
    getSearchInfo: function() {
        var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        https.https('/api/app/setings/enums/search',{user_id:userId},function (res) {
            that.setData({'searchList':res});
        })
    },
    keyInput: function (e) {
        this.setData({
            keyValue: e.detail.value
        })
    },
    doSearch: function () {
        if(this.data.keyValue) {
            wx.navigateTo({
                url: '/pages/newsList/newsList?key='+this.data.keyValue
            })
        }
    },
    searchThis: function (e) {
        var val = e.currentTarget.dataset.val;
        wx.navigateTo({
            url: '/pages/newsList/newsList?key='+val
        })
    },
    initPage: function () {
        var title = this.title = util.getTitle();
        wx.setNavigationBarTitle({
            title: title
        })
        this.getCopyright()
        this.getSearchInfo()
    },
    getCopyright: function () {
        if(!app.hasFetchCopyright) {
            var that = this;
            app.getCopyRight(function () {
                that.renderCopyright();
            });
        }
        else if(app.copyright) {
            this.renderCopyright();
        }
    },
    renderCopyright: function () {
        this.setData({'copyright': app.copyright});
    },
  onLoad: function () {
      var gloablSetting = wx.getStorageSync('global');
      var that = this;
      that.setData({'colorStr': gloablSetting.globalColor});
        if(app.isLoad){
            that.initPage();
        }
        else {
            app.callb = function () {
                that.initPage();
            }
        }
  }
})
