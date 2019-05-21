const app = getApp();
const dataUrl = app.globalData.url;
const network = require("../../utils/util.js");
const picUrl = app.globalData.imgUrl;
const iconUrl = app.globalData.iconUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    picUrl: picUrl,
    dynamic: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let [that, token, dynamicUrl] = [this, wx.getStorageSync('uid'), dataUrl + "/Api/Home/getDynamic", ]
    let data = {
      token: token
      // 先获取假数据
      // token: 1642,
      // app_id: 'wxde059b418de529cd'
    }
    network.POST({
      params: data,
      url: dynamicUrl,
      success: res => {
        console.log("dynamic", data)

        console.log("dynamic", res)
        if (res.data.code === 0) {
          let resData = res.data.data
          for (let i = 0, len = resData.length; i < len; i++) {
            resData[i].icon = picUrl + resData[i].icon
            resData[i].user_icon = picUrl + resData[i].user_icon
            // resData[i].addtime = format(resData[i].addtime)
          }
          that.setData({
            dynamic: resData
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})