// pages/customer_service/customer_service.js

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
    isMaskShow: true
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
  // 自定义方法
  ml_clickCall() {
    // console.log(this.data.isMaskShow)
    if (this.data.isMaskShow) {
      this.setData({
        isMaskShow: false
      })
    } else {
      this.setData({
        isMaskShow: true
      })
    }
  },
  ml_closeMask() {
    if (this.data.isMaskShow) {
      this.setData({
        isMaskShow: false
      })
    } else {
      this.setData({
        isMaskShow: true
      })
    }
  },
  //拨打电话
  callTap: function () {
    // console.log('cardDetails.phone', cardDetails.phone);
    wx.makePhoneCall({
      phoneNumber: "021-400-8888"
    })
  },
})