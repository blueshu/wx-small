//index.js
//获取应用实例
const app = getApp()
const https = require("../../utils/http.js");
const util = require("../../utils/util.js");
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
        var sTitle = wx.getStorageSync('config').navigationBarTitleText;
        var url = util.getCurrentPageUrlWithArgs();
        return {
            title: sTitle,
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
          commitDisplay: false,
          colorStr: '#000',
          colorKey: 'co1',
          uv: 0,
          cv: 0,
          createTime: '',
          news: [{"content_pic":'../../assets/cotwo.gif'}],
          host: '',
          imgUrls: [
              {url:'../../assets/cotwo.gif',imgId:1}
          ],
          indicatorDots: false,
          autoplay: true,
          interval: 5000,
          duration: 1000
      },
  //事件处理函数
  onLoad: function () {
      var that = this;
      if(app.isLoad){
          that.initPage();
      }
      else {
          app.callb = function () {
            that.initPage();
          }
      }
  },
    initPage: function () {
        this.getCopyright();
        this.getHomePage();
        this.getBannerInfo();
        this.getGolab();
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
    getGolab: function () {
        var gloablSetting = wx.getStorageSync('global');
        this.setData({'colorKey': gloablSetting.globalColorKey});
        this.setData({'colorStr': gloablSetting.globalColor});
        this.setData({'commitDisplay': gloablSetting.isCommit});
    },
    parseDate: function (array) {
        for (var i=0,len = array.length; i<len; i++) {
            array[i].create_time = util.formatTime(new Date(array[i].create_time));
        }
    },
  getBannerInfo: function() {
      var that = this;
      var config = wx.getStorageSync('config'),userId = config.user_id;
      https.https('/api/app/setings/enums/adgroup',{user_id:userId},function (res) {
          var data = JSON.parse(res[0].value_data),
              data = data.imgObj;
          var imgUrls = [],
              count = 1;
          for(var i in data) {
              if(data.hasOwnProperty(i)) {
                  imgUrls.push({
                      url: config.host+''+data[i],
                      imgId: count
                  })
                  count++
              }
          }
          that.setData({'imgUrls':imgUrls});
      })
  },
    getHomePage: function () {
        var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        https.https('/api/app/xneirong/index/',{user_id:userId},function (res) {
            that.parseDate(res.object_list);
            that.setData({'news':res.object_list,host:config.host});
        })
    }
})
