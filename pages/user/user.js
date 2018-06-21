//获取应用实例
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
                    if(Math.abs(rect.top) > (diffTop+50)) {
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
      avatarUrl: '../../assets/pcco.gif',
      orders: [],
      selectFlag: 'like'  //true => like; false => commit
  },
  //事件处理函数
    chooseCategory: function (e) {
      var val = e.currentTarget.dataset.val;
        this.setData({'selectFlag':val});
        if(val == 'like'){
            this.getLikeNews();
        }
        else if(val == 'commit'){
            this.getCommitNews();
        }
        else {
            this.getShopList();
        }
    },
    getCommitNews: function () {
        var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        const userInfo = wx.getStorageSync('userInfo');
        https.https('/api/app/xneirong/user/commit/',{user_id:userId,openid:userInfo.openid},function (res) {
            that.setData({'commits':res.object_list,host:config.host});
        })
    },
    getShopList: function () {
        var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        const userInfo = wx.getStorageSync('userInfo');
        https.https('/api/app/xneirong/order/list/',{user_id:userId,openid:userInfo.openid},function (res) {
            that.setData({'orders':res.object_list,host:config.host});
        })
    },
    getLikeNews: function () {
      var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        const userInfo = wx.getStorageSync('userInfo');
        https.https('/api/app/xneirong/user/like/',{user_id:userId,openid:userInfo.openid},function (res) {
            that.setData({'news':res.object_list,host:config.host});
        })
    },
    initPage: function () {
        const userInfo = wx.getStorageSync('userInfo'),
            avatarUrl = userInfo.avatarUrl,
            nickName = userInfo.nickName;
        var title = this.title = util.getTitle();
        wx.setNavigationBarTitle({
            title: title
        });
        this.openId = userInfo.openid;
        this.getCopyright()
        this.setData({'avatarUrl': avatarUrl, nickName: nickName});
        if(this.data.selectFlag === 'shop') {
            this.getShopList()
        }
        else {
            this.getLikeNews()
        }
        wx.removeStorageSync('userType')
    },
    renderCopyright: function () {
        this.setData({'copyright': app.copyright});
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
  onLoad: function () {
        var that = this;
      var gloablSetting = wx.getStorageSync('global');
      that.setData({'colorStr': gloablSetting.globalColor});
      if(wx.getStorageSync('userType') === 'goods'){
          this.setData({'selectFlag':'shop'});
      }
      if(app.isLoad) {
          that.initPage();
      }
      else {
            app.callb = function () {
                that.initPage();
            }
      }
  },
    goPay: function (e) {
        var obj = e.currentTarget.dataset.val;
        https.https('/api/app/wechatpay/create_order/',{
            user_id : obj.user_id,
            openid: this.openId,
            price: obj.price,
            type: 'goods',
            parent_id: obj.id,
            next_url: 'pages/user/user'
        },function (res) {
            wx.requestPayment({
                'timeStamp': res.timeStamp,
                'nonceStr': res.nonceStr,
                'package': res.package,
                'signType': res.signType,
                'paySign': res.paySign,
                'success':function(res){
                    wx.navigateTo({
                        url: '/pages/user/user?type=goods'
                    })
                },
                'fail':function(res){
                }
            })
        },'POST','application/x-www-form-urlencoded');
    }
})
