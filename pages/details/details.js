//logs.js
const https = require("../../utils/http.js")
const WxParse = require('../../wxParse/wxParse.js')
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
        sexVal: '男',
      email: '',
      phone: '',
      dateValue: '',
      campaignVal: {},
      bind_type: null,
      colorKey: 'co18',
      colorStr: '#DDD',
      commitDisplay: false,
      inputFlag: false,
      id: '',
      title: '-',
      name: '-',
      createTime: '-',
      commitNum: '0',
      likeFlag: false,
      likeNum: '0',
      commitVal: '',
      cont: ' <div>一、别惹绵羊</div>小时候见识比较少，不会去争论张飞和关于谁的武力高但小伙伴们对周边的动物会做品评。比如鸡和鸭谁更能打呀，这个问题就能争论一小时。因为鸡的嘴尖，鸭的嘴扁的看是鸡胜过鸭。但是鸭子体型大，力量强未必打不过鸡。在考虑到鸭子善水战这一因素谁胜谁负真的很难预料。我们曾把一只公鸡和一直公鸭关到一起，想让他们打一架呀，但它们各说鸟语，鸡同鸭讲，就是不打架，遂作罢其实争论的最激烈的是山羊和绵羊谁更能打。',
      imageSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAABXCAMAAABGFileAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTBDMEVCNDE1RUJDMTFFNzkwQTlBMkU1NkEzMzY4QTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTBDMEVCNDI1RUJDMTFFNzkwQTlBMkU1NkEzMzY4QTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MEMwRUIzRjVFQkMxMUU3OTBBOUEyRTU2QTMzNjhBNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MEMwRUI0MDVFQkMxMUU3OTBBOUEyRTU2QTMzNjhBNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtLAFl4AAAMAUExURQJvMIhYM2yRsbaysOK3k930/smUbezRu0w6KNbq9LB1TDQlFfLz9Nu1mPn5+urp5eTCq+zLq2xWTMyjhunk18SbhLKZhPLUuur8/lRDM/Py6tbDp5F6YZeFbOvNsouIj+zSwub7/uD2/9rSxuX9/4aty+XKs+P6/tKrindpUce4prCAWfP7/WOWb+O/mgJdJreZecm0l01wlOnNwophO+HGsSsdDdbKx+jNuHpYO8enldRnaWdFKrDV66eHYuC8otChemg2FtOul9m9tPz8/Mvr+pt1XD1bgbimnVc2HIVoSNzX1fTZxPLdyePApaeTe+mTi0ArF+js8RiLT3RGKfHWw/zizN3Csebiz9y6ofn6/Ny+qc6GR1NMUeLd1uXJvbynifDMtePGuv7+/vn8/ryIY8itpAVMHjkyLdrk62VLM5loRAw1FNLGiujFrGdTPPDu5UcyHallNn5dR6h8Zn5xbOT3/vX29/r5897RurnWxMa6sJDHqvjaxOjFo+LZw5VoWKaKdMjHxs/d54RjWGU+I5iAWYNyVePZm5ElIHFAHeTdyvrOpcTCv9nLbuLVv7yJfvLWyvTyydvLstrOve7o2y1XMk2DVUMmD9K1rNbx/ezIqO3ay6mmlbySa1UuFfr73NTKsR0VB/r8+XlMM83Brf39++z2/PbysdO5ru7Zx5xySfv+/9C8oejHs7ixnOK9sNbKvtOzoduvjMS5hezw9NLHtPv8/vT489/v+dq2oeTy9CV0P1AnDff28OT7/3hRLayPa+bHrm9gRaieip7F3t7Et/z6+tHEvc/j7++so/TKv+Dy/H98gu+zqOqjmd3Uy2BVLcChfvfczL/i9Sc0STsdB+D2+/7+/e3Tx6Wgovz+++Ti4Nu5q8zRyYlGIv39/fbXwIqgec6vpfS/suD3/tru+OT0/ObCtCs+HpmSlXKyjaGqpSAbEcBwNSInGlxdb29iZ/Dw74tlDppSK7vH0cnT249vSu7Pr0FvQ/f3+Pv7/Lm5vFo+JP///////1kg4/YAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAUoElEQVR42qSZC1wTZ9bGExESCIRLQAg3ESygoAkFIqEpAqYsAwiNcpEggkQuBgpE0ED9BKwGWtguWKQGsUYD6iqiKFUKNRjAeqlaubQRK9RQC1621JVlP2hist95B+zabq/7PUxmIPzyn5PnPefM+84Q/vWbEmzy9j626Ng2XIuO2XlvEvz2hwi//m/9Jrs54Jxc4fXgwbHfZP8aV+9th7PGfgTu6Lhx48GDB9uOeev/K+5Ju21jrq7b0PYC9kFHx8c3OsbHO250dDw4dvIPc0/aubri1LFtz8Gwdx03vuH64MGNjgc3gAzoNfw/xBUA1dAQwGMQ8thsyLC7YWw8jmwwvoFHuybS4EuDXYLfzdV7jyEsAs9yx+AAobsaGxsjbMeNBx3jHZtXhBtsTbZa+Oyc/vdxT24zdEWxut6YPSD62Bj8ajxuvPmcN9U+37ruo2PPHi98Fvnl0+TkcPO6xt/D9Z5FueLWzsZtiB+MrxlvFncV1+7dnrogteXA8PB7b//V+n+rPux2cnL7Ta7eznC/4f79r33++auvfv75a/txKG628bVdpvrS1KtU8Yrwxwv/vmTdodSK6UP5Cx4vXHjz5rv8X+dyX/3kpZdemjdv3ssvv/ynl+fNe+mTVxF8zNBj/Nquzfp1l/r63I4//vLxwqfJH+QbPHv3yukvF84D7tPH4l/jnpv3J1wvIwEV9CrE/dq44bjxtWsfD53ZHrizcOHTmxBi8rdHtn77beO3XyTfXPjlwqdPt07+MndyHhLAPvkEx72GLNkPu/H91/bv2m/+3vDOst0FecnJ9OTkrVUxyfQsg11ffJGc/DTZaquVVf4vcfngKngKuP37xwzHxjzGPEAXPS6OGY7vHzfe/9XhQxlsIZ1Mz5qY+GL7h/3kJ0+y3niW/AX5i6wsqwjh46M/zxW4Go7dNhyb0xz04mLYDI3HPcZfM3zr3apD4VZZyclZyTdL/6IUkp9kTej+Urrw71lZWXSr04fWaX+Oq1+E5ynAFl9cPKeL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'
  },
  onLoad: function (options) {
        var gloablSetting = wx.getStorageSync('global');

      wx.setNavigationBarTitle({
          title: '文章详情'
      });
        var that = this;
      that.setData({'commitDisplay': gloablSetting.isCommit});
      that.setData({'colorKey': gloablSetting.globalColorKey});
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
        this.openId = wx.getStorageSync('userInfo').openid;
        this.setData({'id': options.id});
        this.getDetails();
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
    getSelfMes: function () {
      var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        https.https('/api/app/setings/enums/wechatfeed/',{user_id:userId},function (res) {
            var data = JSON.parse(res[0].value_data);
            that.setData({'imageSrc': config.host+''+data.imgHeader,'name': data.gzName});
        })
    },
    doCommit: function () {
        if(this.data.commitVal) {
            var that = this;
            var config = wx.getStorageSync('config'),userId = config.user_id;
            const userInfo = wx.getStorageSync('userInfo');
            https.https('/api/app/xneirong/commit/add/',{
                openid:that.openId,user_id:userId,content_id: that.data.id,
                message:this.data.commitVal,parent_id: 0
            },function (res) {
                wx.showToast({
                    title: '评论成功'
                });
                wx.navigateTo({
                    url: '/pages/commitList/commitList?newsId='+that.data.id
                })
                //that.setData({'commitVal': '','inputFlag': false});
                //that.getDetails();
            },'POST','application/x-www-form-urlencoded')
        }
    },
    showErrorMessage: function (msg) {
        wx.showToast({
            title: msg,
            image: '../../assets/error.png'
        })
    },
    checkInput: function (e) {
        var sId = e.target.dataset.id,
            sVal = e.detail.value,
            campain = this.data.campaign.form_field,
            filedsObj = this.data.filedsObj,
            selectCampain = {};
        for(var i = 0,len = campain.length; i < len; i ++) {
            if(sId == campain[i].id) {
                selectCampain = campain[i];
                break;
            }
        }
        if(sVal) {
            if(selectCampain.type === 'tel' && !/^1[3|4|5|8][0-9]\d{4,8}$/.test(sVal)) {
                this.showErrorMessage('请输入正确的手机号码');
                this.setData({'phone': ''});
            }
            if(selectCampain.type === 'email' && !/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(sVal)) {
                this.showErrorMessage('请输入正确的邮箱');
                this.setData({'email': ''});
            }
        }
        else {
            this.showErrorMessage(selectCampain.name+'不能为空');
        }
    },
    getSexValue: function (e) {
        this.setData({
            sexVal: e.detail.value
        })
    },
    bindDateChange: function (e) {
        this.setData({
            dateValue: e.detail.value
        })
    },
    saveCampain: function (e) {
        var oVal = e.detail.value,
            sexVal = this.data.sexVal,
            sId = this.data.campaign.id,
            postMessage = [],
            form_field = this.data.campaign.form_field,

            len = form_field.length;
        for(var i = 0; i < len; i++) {
            var obj = form_field[i];
            if(obj.name === '性别') {
                postMessage.push({'campaign_id': sId,'form_enums_id': obj.id,'value': sexVal});
            }
            else if(!oVal[obj.name]) {
                this.showErrorMessage(obj.name+'不能为空');
                break;
            }
            else {
                postMessage.push({'campaign_id': sId,'form_enums_id': obj.id,'value': oVal[obj.name]});
            }
        }
        if(len === postMessage.length) {
            https.https('/api/app/campaign/result/save/?openid='+this.openId,JSON.stringify(postMessage),function () {
                setTimeout(function () {
                    wx.showToast({
                        title: '提交成功'
                    });
                },200);
            },'POST','application/x-www-form-urlencoded')
        }
    },
    dolike: function () {
        var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        var likeFlag = this.data.likeFlag;
        if(likeFlag){
            https.https('/api/app/xneirong/content/unlike/',{user_id:userId,content_id: that.data.id,openid:that.openId},function (res) {
            },'POST','application/x-www-form-urlencoded',true)
        }
        else {
            https.https('/api/app/xneirong/content/like/',{user_id:userId,content_id: that.data.id,openid:that.openId},function (res) {
            },'POST','application/x-www-form-urlencoded',true)
        }
        that.setData({
            likeFlag: !likeFlag
        })
    },
    getDetails: function () {
        var that = this;
        var config = wx.getStorageSync('config'),userId = config.user_id;
        https.https('/api/app/xneirong/content/detail/',{user_id:userId,content_id: that.data.id,openid:that.openId},function (res) {
            var isLike = res.is_like == 0 ? false : true;
            WxParse.wxParse('article', 'html', res.content, that, 0);
            that.title = res.title;

            //res.bind_type = 'campaign';
            if(res.bind_type === 'goods'){
                that.setData({
                    title: res.title,
                    commitNum: res.commit_num,
                    likeNum: res.like_num,
                    likeFlag: isLike,
                    show_pic: res.show_pic == 1,
                    content_pic: config.host+''+res.content_pic,
                    bind_type: res.bind_type,
                    goods: res.goods
                })
            }
            else if(res.bind_type === 'campaign') {
                that.setData({
                    title: res.title,
                    commitNum: res.commit_num,
                    likeNum: res.like_num,
                    likeFlag: isLike,
                    show_pic: res.show_pic == 1,
                    content_pic: config.host+''+res.content_pic,
                    bind_type: res.bind_type,
                    campaign: res.campaign
                })
            }
            else {
                that.setData({
                    title: res.title,
                    commitNum: res.commit_num,
                    likeNum: res.like_num,
                    likeFlag: isLike,
                    show_pic: res.show_pic == 1,
                    content_pic: config.host+''+res.content_pic
                })
            }
        })
    }
})
