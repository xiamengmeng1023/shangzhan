// pages/find/find.js

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
  // 自定义
  ml_toFindSearch() {
    wx.navigateTo({
      url: '/pages/find_search/find_search'
      // url: '/pages/soso/soso'

    })
  },
  goToFriendDynamics() {
    wx.navigateTo({
      url: '/pages/friend_dynamics/friend_dynamics'
    })
  },
  goToEntDy() {
    wx.navigateTo({
      url: '/pages/enterprise_dynamics/enterprise_dynamics'
    })
  },

})