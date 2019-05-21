// pages/bind_end/bind_end.js
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
    picUrl: picUrl,
    iconUrl: iconUrl,
    status: "",
    info: {},
    card_id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('options', options);
    let info = JSON.parse(options.info)
    // console.log(info)
    let [that, token, bindUid, url] = [this, wx.getStorageSync("uid"), info.bindUid, dataUrl + "/Api/Member/getCompany"]
    that.setData({
      card_id: options.card_id
    })
    let data = {
      token: token,
      bind_uid: bindUid
    }
    network.POST({
      params: data,
      url: url,
      success: res => {
        console.log("res", res)
        if (res.data.code === 0) {
          let [resData] = [res.data.data]
          // status 0-未绑定 1-已绑定 2-绑定审核中, 3审核失败',
          that.setData({
            info: resData,
            status: info.Isbind
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  goReBind() {
    let that = this
    wx.navigateTo({
      url: `/pages/bind_company/bind_company?card_id=${that.data.card_id}`
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