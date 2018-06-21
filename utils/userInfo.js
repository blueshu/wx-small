/**
 * Created by Kevin on 2017/9/29.
 */

var UserInfo = function () {
    this.userMes = null;
    this.isFetch = false;
};
UserInfo.prototype = {
    fetch: function () {
        const that = this;
        that.isFetch = true;
        if(that.userMes) {
            return;
        }
        wx.getUserInfo({
            success: res => {
            that.userMes = res.userInfo
            that.isFetch = false
        }
        })
    },
    get: function () {
        return this.userMes;
    },
    getStatus: function () {
        return this.userMes ? true : false;
    }
}

module.exports = {
    userInfo: new UserInfo()
};