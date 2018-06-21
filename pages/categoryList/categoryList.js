const https = require("../../utils/http.js");
const app = getApp()
const util = require("../../utils/util.js")
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
      imgUrls: [
          {url:'http://xneirong.com/assets/img-2.png',imgId:1},
          {url:'http://xneirong.com/assets/img-4.png',imgId:3}
      ],
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      likeNews: [],
      hotNews: [],
      displayCount: 4
  },
  onLoad: function () {
      var that = this;
      if(app.isLoad) {
          that.initPage();
      }
      else {
          app.callb = function () {
              that.initPage();
          }
      }
  },
    initPage: function () {
        var title = this.title = util.getTitle();
        wx.setNavigationBarTitle({
            title: title
        });
        this.getCopyright();
        this.getBannerInfo();
        this.getCategoryNews();
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
    getCategoryNews: function () {
        var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        https.https('/api/app/xneirong/content/list/',{user_id:userId,type: 'hot'},function (res) {
            let listH = res.object_list.slice(0,that.data.displayCount);
            that.setData({'hotNews':listH,host:config.host});
        })

        https.https('/api/app/xneirong/content/list/',{user_id:userId,type: 'new'},function (res) {
            let listN = res.object_list.slice(0,that.data.displayCount);
            that.setData({'likeNews':listN,host:config.host});
        })
    },
  getBannerInfo: function() {
        var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        https.https('/api/app/setings/enums/adgroup',{user_id:userId},function (res) {
            var data = JSON.parse(res[0].value_data),
                data = data.imgObj;
            let imgUrls = [],
                count = 1;
            for(let i in data) {
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
    }
})
