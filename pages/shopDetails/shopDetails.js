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
      chooseFlag: false, //是否显示规格显示框
      selectId: 0,
      choosePrice: null,
      number: 1,
      colorKey: 'co18',
      colorStr: '#DDD',
      goodsDetails: {},
      minPrice: 0,
      maxPrice: 0,
      id: ''
  },
    onLoad: function (options) {
        var gloablSetting = wx.getStorageSync('global');

      wx.setNavigationBarTitle({
          title: '商品详情'
      });
        var that = this;
      that.setData({'colorStr': gloablSetting.globalColor});
      if(app.isLoad) {
          that.initPage(options.id);
      }
      else {
          app.callb = function () {
              that.initPage(options.id);
          }
      }
  },
    initPage: function (sId) {
        this.openId = wx.getStorageSync('userInfo').openid;
        this.setData({'id': sId});
        this.getDetails();
        this.getCopyright();
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
    keyInput: function (e) {
        if(e.detail.value.length > 0 && !this.data.inputFlag) {
            this.setData({
                inputFlag: true
            })
        }
        else if(e.detail.value.length == 0 ){
            this.setData({
                inputFlag: false
            })
        }
        this.setData({
            commitVal: e.detail.value
        })
    },
    doChoose: function (e) {
        var sId = e.currentTarget.dataset.id,
            choosePrice = 0,
            specification_list = this.data.goodsDetails.specification_list,
            len = specification_list.length;
        for(var i = 0; i < len; i++) {
            if(sId === specification_list[i].id) {
                choosePrice = specification_list[i].price;
                break;
            }
        }
        this.setData({
            choosePrice: choosePrice,
            selectId: e.currentTarget.dataset.id
        });
    },
    doBuy: function () {
        var oData = this.data,
            number = oData.number,
            price = oData.choosePrice,
            selectId = oData.selectId;
        if(price && number > 0 && this.data.chooseFlag) {
            wx.redirectTo({
                url: '/pages/order/order?newsId='+oData.id+'&price='+(price*number)+'&specificationId='+selectId+'&num='+number
            })
        }
        this.setData({
            chooseFlag: true
        })
    },
    hideBuyChoose: function () {
        if(this.data.chooseFlag) {
            this.setData({
                chooseFlag: false
            })
        }
    },
    addNumber: function () {
        var num = this.data.number + 1;
        this.setData({
            number: num
        })
    },
    deleteNumber: function () {
        var num = this.data.number;
        if(num >= 1) {
            this.setData({
                number: num - 1
            })
        }
    },
    getDetails: function () {
        var that = this,
            sId = this.data.id;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        https.https('/api/app/xneirong/goods/detail/',{id:sId, openid:that.openId},function (res) {
            //that.setData({'goodsDetails': res});
            var minPrice = 0,
                maxPrice = 0;
                //selectId = res.specification_list[0].id;
            for(var i = 0,len = res.specification_list.length; i < len; i++) {
                var specification = res.specification_list[i],
                    price = specification.price;
                if(i === 0) {
                    minPrice = price;
                    maxPrice = price;
                }
                else {
                    if(price < minPrice) {
                        minPrice = price;
                    }
                    else if(price > maxPrice) {
                        maxPrice = price;
                    }
                }

            }
            if(res.specification_list.length === 1){
                that.setData({
                    'choosePrice': minPrice,
                    'goodsDetails': res,
                    'minPrice': minPrice,
                    'maxPrice': maxPrice,
                    'content_pic': config.host+''+res.content.content_pic
                });
            }
            else {
                that.setData({
                    'goodsDetails': res,
                    'minPrice': minPrice,
                    'maxPrice': maxPrice,
                    'content_pic': config.host+''+res.content.content_pic
                });
            }
        });
    }
})
