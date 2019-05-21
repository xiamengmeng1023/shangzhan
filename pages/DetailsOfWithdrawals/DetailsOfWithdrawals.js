// pages/DetailsOfWithdrawals/DetailsOfWithdrawals.js



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
    getCash: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    let [
      that,
      token,
      id,
      url
    ] = [
      this,
      wx.getStorageSync("uid"),
      options.id,
      dataUrl + "/Api/Member/getCash"
    ]
    let params = {
      // token: token,
      token: 1,
      // app_id: 'wxde059b418de529cd',
      cash_id: id
    }
    network.POST({
      params: params,
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code == 0) {
          let resData = res.data.data
          that.setData({
            getCash: res.data.data
          })
        }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})