//logs.js
const https = require("../../utils/http.js")
const util = require("../../utils/util.js")
const app = getApp()

Page({
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
      colorStr: '#DDD',
      goodsDetails: {},
      email: '',
      comments: '',
      val: '',
      containObj: {}
  },
  onLoad: function (options) {
      var gloablSetting = wx.getStorageSync('global');
      wx.setNavigationBarTitle({
          title: '文章详情'
      });
        var that = this;
      that.setData({'colorStr': gloablSetting.globalColor});
      if(app.isLoad) {
          that.initPage(options);
      }
      else {
          app.callb = function () {
              that.initPage(options);
          }
      }
  },
    initPage: function (options) {
        this.num = options.num;
        this.specificationId = options.specificationId;
        this.openId = wx.getStorageSync('userInfo').openid;
        this.setData({'id': options.newsId,'price':options.price});
        this.getDetails();
    },
    getDetails: function () {
        var that = this,
            sId = this.data.id,
            containObj = {},
            config = wx.getStorageSync('config');
        https.https('/api/app/xneirong/goods/detail/',{id:sId, openid:that.openId},function (res) {
            that.setData({
                'goodsDetails': res,
                'content_pic': config.host+''+res.content.content_pic
            });
            wx.chooseAddress({
                success: function (res) {
                    containObj = {
                        name: res.userName,
                        province: res.provinceName,
                        cityName: res.cityName,
                        detailInfo: res.detailInfo,
                        telNumber: res.telNumber,
                        postalCode: res.postalCode,
                        countyName: res.countyName
                    };
                    that.setData({
                        'containObj': containObj
                    });
                }
            })
        });
    },
    getCommitInput: function (e) {
        this.setData({'val': e.detail.value});
    },
    checkEmailInput: function (e) {
        var sVal = e.detail.value;
        if(!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(sVal)) {
            this.showErrorMessage('请输入正确的邮箱');
            this.setData({'email': ''});
        }
        else {
            this.setData({'email': sVal});
        }
    },
    shopBuy: function () {
        var sVal = this.data.email,
            containObj = this.data.containObj;
        if(!containObj || !containObj.name) {
            this.showErrorMessage('请选择收货地址');
        }
        else if(!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(sVal)) {
            this.showErrorMessage('请输入正确的邮箱');
            this.setData({'email': ''});
        }
        else {
            var orderAddress = {
                name: containObj.name,
                mobile: containObj.telNumber,
                province: containObj.province,
                city: containObj.cityName,
                area: containObj.countyName,
                address: containObj.detailInfo,
                zipcode: containObj.postalCode,
                is_default: 1,
                email: sVal
            },
                config = wx.getStorageSync('config'),
                userId = config.user_id,
                that = this;
            var postMsg = {
                user_id :userId,
                openid:that.openId,
                goods_id: that.data.id,
                goods_specification_id: that.specificationId,
                num: that.num,
                address: JSON.stringify(orderAddress)
            };
            if(that.data.val) {
                 postMsg = {
                    user_id :userId,
                    openid: that.openId,
                    goods_id: that.data.id,
                    goods_specification_id: that.specificationId,
                    num: that.num,
                    order_comment: that.data.val,
                    address: JSON.stringify(orderAddress)
                };
            }
            https.https('/api/app/xneirong/order/create/',postMsg,function (res) {
                var price = res.price,
                    parent_id = res.id;
                wx.showModal({
                    title: '支付',
                    content: '提交成功，去支付',
                    success: function(res) {
                        if (res.confirm) {
                            https.https('/api/app/wechatpay/create_order/',{
                                user_id :userId,
                                openid:that.openId,
                                price: price,
                                type: 'goods',
                                parent_id: parent_id,
                                next_url: 'pages/user/user'
                            },function (res) {
                                wx.requestPayment({
                                 'timeStamp': res.timeStamp,
                                 'nonceStr': res.nonceStr,
                                 'package': res.package,
                                 'signType': res.signType,
                                 'paySign': res.paySign,
                                 'success':function(res){
                                     wx.setStorageSync('userType','goods');
                                     wx.switchTab({
                                         url: '/pages/user/user'
                                     })
                                 },
                                 'fail':function(res){
                                 }
                                 })
                            },'POST','application/x-www-form-urlencoded');
                        } else if (res.cancel) {
                        }
                    }
                })
            },'POST','application/x-www-form-urlencoded');
        }
    },
    doPay: function () {
        var that = this;
        https.https('/api/app/wechatpay/create_order/',{
            price: '',
            type: 'goods',
            parent_id: '',
            next_url: ''
        },function (res) {

        },'POST');
    },
    showErrorMessage: function (msg) {
        wx.showToast({
            title: msg,
            image: '../../assets/error.png'
        })
    },
    chooseAddress:function () {
        var containObj = {},
            that = this;
        wx.chooseAddress({
            success: function (res) {
                containObj = {
                    name: res.userName,
                    province: res.provinceName,
                    cityName: res.cityName,
                    detailInfo: res.detailInfo,
                    telNumber: res.telNumber,
                    postalCode: res.postalCode,
                    countyName: res.countyName
                };
                that.setData({
                    'containObj': containObj
                });
            }
        })
    }
})
