function https(url,param,callback,method,headerType,isUnLoading) {
   var realUrl = 'https://xneirong.com'+url;
    method = method || 'GET';
    headerType = headerType || 'application/json';
    if(!isUnLoading) {
        wx.showLoading();
    }
    if(param) {
        wx.request({
            method: method,
            url: realUrl, //仅为示例，并非真实的接口地址
            header: {
                'content-type': headerType // 默认值
            },
            data: param,
            success: function(res) {
                if(res.data.status === 1) {
                    wx.showToast({
                        image: '../../assets/error.png',
                        title: '请求失败，联系管理员',
                        duration: 2000
                    })
                }
                else {
                    callback(res.data.data);
                }
            },
            fail: function () {
                wx.showToast({
                    image: '../../assets/error.png',
                    title: '请求失败，联系管理员',
                    duration: 2000
                })
            },
            complete: function () {
                if(!isUnLoading) {
                    wx.hideLoading()
                }
            }
        })
    }
    else {
        wx.request({
            method: method,
            url: realUrl, //仅为示例，并非真实的接口地址
            header: {
                'content-type': headerType // 默认值
            },
            success: function(res) {
                callback(res.data.data);
            },
            fail: function () {
                wx.showToast({
                    title: '获取首页数据失败',
                    duration: 2000
                })
            },
            complete: function () {
                if(!isUnLoading) {
                    wx.hideLoading()
                }
            }
        })
    }

}

module.exports = {
    https: https
}
