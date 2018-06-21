//index.js
//获取应用实例
const https = require("../../utils/http.js");
const util = require("../../utils/util.js");
const app = getApp()
Page({
    onShareAppMessage: function (res) {
        var url = util.getCurrentPageUrlWithArgs();
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title: '评论详情',
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
      focus: false,
      newsId: '',
      commitFlag: false,
      commitList: [],
      commitVal: '',
      defaultVal: '写回应'
  },
  onLoad: function (options) {
        var that = this;
      wx.setNavigationBarTitle({
          title: '评论详情'
      });
      if(app.isLoad) {
          that.data.newsId = options.newsId;
          that.getCommitInfo();
      }
      else {
          app.callb = function () {
              that.data.newsId = options.newsId;
              that.getCommitInfo();
          }
      }
  },
    parseDate: function (array) {
        for (let i=0,len = array.length; i<len; i++) {
            array[i].create_time = util.formatTime(new Date(array[i].create_time));
        }
    },
    keyInput: function (e) {
        this.setData({
            commitVal: e.detail.value
        })
    },
  getCommitInfo: function(isLoad) {
      var that = this;
      var config = wx.getStorageSync('config'),userId = config.user_id;
      const userInfo = wx.getStorageSync('userInfo');
      if(isLoad){
          https.https('/api/app/xneirong/commit/list/',{user_id:userId,content_id: that.data.newsId,openid:userInfo.openid},function (res) {
              var list = res.object_list;
              that.parseDate(list);
              that.setData({'commitList':list,host:config.host});
          },null,null,true);
      }
      else {
          https.https('/api/app/xneirong/commit/list/',{user_id:userId,content_id: that.data.newsId,openid:userInfo.openid},function (res) {
              var list = res.object_list;
              that.parseDate(list);
              that.setData({'commitList':list,host:config.host});
          })
      }
  },
    displayCommit: function (e) {
        var val = e.currentTarget.dataset.id,
            uId = e.currentTarget.dataset.uid,
            userInfo = wx.getStorageSync('userInfo'),
            nUid = userInfo.uId,
            nName = e.currentTarget.dataset.nname;
        if(nUid != uId) {
            this.setData({'defaultVal': '回复'+nName});
            this.parentId = val;
        }
        else {
            this.setData({'defaultVal': '写回应'});
            this.parentId = 0;
        }

        this.setData({'focus': true});

    },
    doAp: function (e) {
        var val = e.currentTarget.dataset.val,
            comId = e.currentTarget.dataset.cid;
        var that = this;
        const userInfo = wx.getStorageSync('userInfo');
        if(val == 0) {
            https.https('/api/app/xneirong/comment/up/',{comment_id:comId,openid:userInfo.openid
            },function (res) {
                wx.showToast({
                    title: '点赞成功'
                });
                that.getCommitInfo(true);
            },'POST','application/x-www-form-urlencoded',true);
        }
        else {
            https.https('/api/app/xneirong/comment/unup/',{comment_id:comId,openid:userInfo.openid
            },function (res) {
                wx.showToast({
                    title: '取消点赞成功'
                });
                that.getCommitInfo(true);
            },'POST','application/x-www-form-urlencoded',true);
        }
    },
    doCommit: function () {
        if(this.data.commitVal) {
            var that = this;
            var par = that.parentId || 0;
            var config = wx.getStorageSync('config'),userId = config.user_id;
            const userInfo = wx.getStorageSync('userInfo');
            https.https('/api/app/xneirong/commit/add/',{user_id:userId,content_id: that.data.newsId,
                message:this.data.commitVal,parent_id:par,openid:userInfo.openid
            },function (res) {
                wx.showToast({
                    title: '评论成功'
                });
                that.setData({'commitVal': '','commitFlag': false});
                that.getCommitInfo();
            },'POST','application/x-www-form-urlencoded')
        }
    }
})
