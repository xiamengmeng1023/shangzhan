const app = getApp();
const dataUrl = app.globalData.url;
const picUrl = app.globalData.imgUrl;
const network = require("../../utils/util.js");
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let [that, token, noticeid, url] = [this, wx.getStorageSync('uid'), options.id, dataUrl + "/Api/Notice/getNoticeinfo"]
    let data = {
      token: token,
      // app_id: 'wxde059b418de529cd',
      noticeid: noticeid
    }
    // 通知
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log(res)
        if (res.data.code === 0) {
          let resData = res.data.data
          // resData.addtime = getLocalTime(resData.addtime)
          that.setData({
            notice: resData
          })
          WxParse.wxParse('summary', 'html', that.data.notice.content, that, 1)
          if (resData.read_status == 0) {
            let [statusUrl, data1] = [dataUrl + "/Api/Notice/updateNoticeStatus", {
              token: token,
              notice_id: noticeid
            }]
            network.POST({
              params: data1,
              url: statusUrl,
              success: res => {
                console.log("res", res)
              },
              fail: res => {
                console.log(res)
              }
            })
          }
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})

function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}